const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const fsSync = require('fs');
const { compileWasm, compileFile } = require('./wasm_tests_common');
const { execFileSync } = require('child_process');

function evaluateExpression(expr) {
    let index = 0;

    function peek() {
        return expr[index] || '';
    }

    function consume() {
        return expr[index++] || '';
    }

    function skipWhitespace() {
        while (/\s/.test(peek())) {
            consume();
        }
    }

    function parseHexNumber() {
        let value = 0n;
        let sawDigit = false;
        while (/[0-9a-fA-F]/.test(peek())) {
            sawDigit = true;
            const ch = consume();
            const digit = parseInt(ch, 16);
            value = value * 16n + BigInt(digit);
        }
        if (!sawDigit) {
            throw new Error('Expected hex digit at position ' + index + ' in expression: ' + expr);
        }
        return value;
    }

    function parsePrimary() {
        skipWhitespace();
        const ch = peek();
        if (ch === '(') {
            consume(); // '('
            const value = parseComparison();
            skipWhitespace();
            if (consume() !== ')') {
                throw new Error('Expected ) at position ' + index + ' in expression: ' + expr);
            }
            return value;
        }
        return parseHexNumber();
    }

    function parseUnary() {
        skipWhitespace();
        let sign = 1n;
        while (peek() === '+' || peek() === '-') {
            const op = consume();
            if (op === '-') {
                sign = -sign;
            }
            skipWhitespace();
        }
        const value = parsePrimary();
        return sign === 1n ? value : -value;
    }

    function parseMulDiv() {
        let left = parseUnary();
        while (true) {
            skipWhitespace();
            const op = peek();
            if (op !== '*' && op !== '/') {
                break;
            }
            consume();
            const right = parseUnary();
            if (op === '*') {
                left = left * right;
            } else {
                if (right === 0n) {
                    throw new Error('Division by zero in expression: ' + expr);
                }
                left = left / right;
            }
        }
        return left;
    }

    function parseAddSub() {
        let left = parseMulDiv();
        while (true) {
            skipWhitespace();
            const op = peek();
            if (op !== '+' && op !== '-') {
                break;
            }
            consume();
            const right = parseMulDiv();
            if (op === '+') {
                left = left + right;
            } else {
                left = left - right;
            }
        }
        return left;
    }

    function parseComparison() {
        let left = parseAddSub();
        while (true) {
            skipWhitespace();
            const op = peek();
            if (op !== '<' && op !== '>') {
                break;
            }
            consume();
            const right = parseAddSub();
            if (op === '<') {
                left = left < right ? 1n : 0n;
            } else {
                left = left > right ? 1n : 0n;
            }
        }
        return left;
    }

    const result = parseComparison();
    skipWhitespace();
    if (index < expr.length) {
        throw new Error('Unexpected characters at position ' + index + ' in expression: ' + expr);
    }
    return result;
}

async function main() {
    const compiledPath = path.join(os.tmpdir(), 'compiled.fif');
    const runnerPath = path.join(os.tmpdir(), 'runner.fif');

    const tests = (await fs.readdir('.')).filter(f => f.endsWith('.fc')).sort();

    const mathChars = '0x123456789abcdefABCDEF()+-*/<>'.split('')

    for (const testFile of tests) {
        const mod = await compileWasm()

        const result = await compileFile(mod, testFile)

        if (result.status !== 'ok') {
            console.error(result);
            throw new Error('Could not compile ' + testFile);
        }

        const fileLines = (await fs.readFile(testFile)).toString('utf-8').split('\n');

        const testCases = [];

        for (const line of fileLines) {
            const parts = line.split('|').map(c => c.trim());

            if (parts.length !== 4 || parts[0] !== 'TESTCASE') continue;

            const processedInputs = [];

            for (const input of parts[2].split(' ')) {
                if (input.includes('x{')) {
                    processedInputs.push(input);
                    continue;
                }

                if (input.length === 0) {
                    continue
                }

                // Normalize the input into a JavaScript arithmetic expression:
                //  - keep only allowed "mathChars" (hex digits and basic operators),
                //  - collapse '//' into '/' to avoid accidental integer-division notation,
                //  - append 'n' to hexadecimal digits that are followed by a non-hex/non-'x'
                //    character or end-of-string so they are treated as BigInt literals.
                // The resulting expression string is then evaluated using a dedicated
                // arithmetic expression evaluator instead of vm.runInNewContext().
                const replacedInput = input.split('').filter(c => mathChars.includes(c)).join('').replaceAll('//', '/').replace(/([0-9a-f])($|[^0-9a-fx])/gmi, '$1n$2')

                processedInputs.push(evaluateExpression(replacedInput).toString());
            }

            testCases.push([parts[1], processedInputs.join(' '), parts[3]]);
        }

        await fs.writeFile(compiledPath, '"Asm.fif" include\n' + JSON.parse('"' + result.fiftCode + '"'));
        await fs.writeFile(runnerPath, `"${compiledPath}" include <s constant code\n${testCases.map(t => `${t[1]} ${t[0]} code 1 runvmx abort"exitcode is not 0" .s cr { drop } depth 1- times`).join('\n')}`)

        const includePath = process.env.FIFT_LIBS || process.env.FIFTPATH;
        const fiftArgs = [];
        if (includePath) {
            fiftArgs.push('-I', includePath);
        }
        fiftArgs.push(runnerPath);
        // Determine which Fift executable to use. Default to 'fift' and only
        // honor an override from the environment if it looks safe.
        let fiftExecutable = 'fift';
        if (process.env.FIFT_EXECUTABLE) {
            const candidate = process.env.FIFT_EXECUTABLE;
            const candidateBasename = path.basename(candidate);
            const isAllowedBare =
                candidate === 'fift' ||
                candidate === 'fift.exe';
            const isAllowedAbsolute =
                path.isAbsolute(candidate) &&
                (candidateBasename === 'fift' || candidateBasename === 'fift.exe');

            if (isAllowedBare) {
                // Use the bare program name; rely on PATH for resolution.
                fiftExecutable = candidate;
            } else if (isAllowedAbsolute) {
                // Only allow absolute paths that point to an existing regular file.
                try {
                    const stat = fsSync.statSync(candidate);
                    if (!stat.isFile()) {
                        throw new Error(`Unsafe FIFT_EXECUTABLE value "${candidate}" rejected; path is not a regular file`);
                    }
                } catch (e) {
                    throw new Error(`Unsafe FIFT_EXECUTABLE value "${candidate}" rejected; cannot stat file: ${e.message}`);
                }
                fiftExecutable = candidate;
            } else {
                throw new Error(
                    `Unsafe FIFT_EXECUTABLE value "${candidate}" rejected; only "fift", ` +
                    `"fift.exe", or an absolute path ending in "fift" or "fift.exe" is allowed`
                );
            }
        }
        const fiftResult = execFileSync(fiftExecutable, fiftArgs, {
            stdio: ['pipe', 'pipe', 'ignore']
        }).toString('utf-8')

        const testResults = fiftResult.split('\n').map(s => s.trim()).filter(s => s.length > 0)

        if (testResults.length !== testCases.length) {
            throw new Error(`Got ${testResults.length} results but there are ${testCases.length} cases`)
        }

        for (let testIndex = 0; testIndex < testResults.length; testIndex++) {
            if (testResults[testIndex] !== testCases[testIndex][2]) {
                throw new Error(`Unequal result ${testResults[testIndex]} and case ${testCases[testIndex][2]}`)
            }
        }

        console.log(testFile, 'ok')
    }
}

main()