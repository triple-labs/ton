const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { compileWasm, compileFile } = require('./wasm_tests_common');
const { execFileSync } = require('child_process');

function safeEvalExpression(expr) {
    // Allow only digits, hex marker 'x', basic math operators, comparison operators, parentheses, and optional 'n' for BigInt.
    if (!/^[0-9x()+\-*/<>n\s]*$/i.test(expr)) {
        throw new Error('Unsafe characters in expression: ' + expr);
    }

    // Evaluate a simple arithmetic expression using Function in a restricted way.
    // Since we have validated the characters, this is safer than using raw eval on untrusted input.
    // We also explicitly disallow accessing any identifiers by ensuring the pattern above.
    // Use BigInt-aware evaluation where 'n' suffix is present.
    // eslint-disable-next-line no-new-func
    const fn = new Function('"use strict"; return (' + expr + ');');
    return fn();
}

async function main() {
    const compiledPath = path.join(os.tmpdir(), 'compiled.fif');
    const runnerPath = path.join(os.tmpdir(), 'runner.fif');

    const tests = (await fs.readdir('.')).filter(f => f.endsWith('.fc')).sort();

    const mathChars = '0x123456789()+-*/<>'.split('')

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
                    continue;
                }

                const allowedCharsOnly = input.split('').filter(c => mathChars.includes(c)).join('');
                const normalizedDiv = allowedCharsOnly.replace('//', '/');
                const withBigIntSuffixes = normalizedDiv.replace(/([0-9a-f])($|[^0-9a-fx])/gmi, '$1n$2');
                const replacedInput = withBigIntSuffixes;

                processedInputs.push(safeEvalExpression(replacedInput).toString());
            }

            testCases.push([parts[1], processedInputs.join(' '), parts[3]]);
        }

        await fs.writeFile(compiledPath, '"Asm.fif" include\n' + JSON.parse('"' + result.fiftCode + '"'));
        const runnerBodyLines = testCases.map(
            t => `${t[1]} ${t[0]} code 1 runvmx abort"exitcode is not 0" .s cr { drop } depth 1- times`
        );
        const runnerBody = runnerBodyLines.join('\n');
        const runnerScript = `"${compiledPath}" include <s constant code\n${runnerBody}`;
        await fs.writeFile(runnerPath, runnerScript);

        const fiftResult = execFileSync(process.env.FIFT_EXECUTABLE || 'fift', [
            '-I',
            process.env.FIFT_LIBS,
            runnerPath
        ], {
            stdio: ['pipe', 'pipe', 'ignore']
        }).toString('utf-8')

        const testResults = fiftResult.split('\n').map(s => s.trim()).filter(s => s.length > 0)

        if (testResults.length !== testCases.length) {
            throw new Error(`Got ${testResults.length} results but there are ${testCases.length} cases`)
        }

        for (let i = 0; i < testResults.length; i++) {
            if (testResults[i] !== testCases[i][2]) {
                throw new Error(`Unequal result ${testResults[i]} and case ${testCases[i][2]}`)
            }
        }

        console.log(testFile, 'ok')
    }
}

main()