# CodeQL Workflow Fix - February 2026

## Critical Issue Discovered

On February 15, 2026, we discovered that the CodeQL security scanning workflow (`.github/workflows/codeql.yml`) was completely corrupted and non-functional.

### Root Cause

On January 12, 2026 (commit `123b476a`), the CodeQL workflow file was created with invalid content. Instead of containing a proper GitHub Actions workflow structure, it only contained action configuration snippets for stale issue management - essentially template/example content that was never properly converted into a working workflow.

### Impact

**Security scanning was completely broken** for over a month. This meant:
- No automated security vulnerability detection
- No code quality analysis  
- No CodeQL scanning on pushes or pull requests
- No scheduled security scans

This is a **CRITICAL security issue** as the repository had no active security scanning.

### Resolution

#### What Was Fixed

1. **Replaced corrupted workflow** - Removed the invalid file and created a proper CodeQL Advanced workflow based on GitHub's official starter template

2. **Added proper workflow structure**:
   - `name`, `on`, `jobs` sections properly defined
   - Trigger events: push to master/testnet, pull requests, weekly schedule
   - Matrix strategy for multiple languages (C++ and Python)

3. **Configured security permissions** (following principle of least privilege):
   - `security-events: write` - Required for all CodeQL workflows
   - `packages: read` - Required for private CodeQL packs
   - `actions: read` - Required for workflows in private repos
   - `contents: read` - Required for checkout

4. **Set up proper build configuration**:
   - Manual build mode for C++ (autobuild doesn't work well with complex CMake projects)
   - Uses same build commands as the lint workflow for consistency
   - Installs all necessary dependencies (Clang 21, system libraries)
   - No build required for Python (interpreted language)

5. **Added appropriate timeouts**:
   - 360 minutes for C++ (complex compilation)
   - 120 minutes for other languages

#### Files Changed

- `.github/workflows/codeql.yml` - Completely rewritten (311 lines changed)
- `.github/workflows/codeql.yml.corrupted.bak` - Backup of corrupted file for reference

#### Verification

- ✅ YAML syntax validated
- ✅ Code review completed (1 issue found and fixed)
- ✅ CodeQL security check passed (0 alerts)
- ✅ Workflow structure follows GitHub best practices
- ✅ Permissions follow principle of least privilege

### Next Steps

While the CodeQL workflow has been fixed, we identified 12 other workflows missing explicit `permissions:` blocks:

- build-ton-linux-arm64-appimage.yml
- build-ton-linux-arm64-shared.yml
- build-ton-linux-x86-64-appimage.yml
- build-ton-linux-x86-64-shared.yml
- build-ton-linux-x86-64-werror.yml
- build-ton-macos-14-arm64-portable.yml
- build-ton-macos-15-arm64-shared.yml
- build-ton-macos-15-x86-64-portable.yml
- build-ton-macos-15-x86-64-shared.yml
- build-ton-wasm-emscripten.yml
- clear-gh-cache.yml
- codex-review.yml

**Recommendation**: Add explicit permissions blocks to these workflows as a security best practice. Workflows without explicit permissions get overly-permissive default access which violates the principle of least privilege.

### References

- GitHub CodeQL Documentation: https://docs.github.com/en/code-security/code-scanning
- GitHub Starter Workflows: https://github.com/actions/starter-workflows/blob/main/code-scanning/codeql.yml
- Workflow Permissions: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions

### Timeline

- **January 12, 2026**: CodeQL workflow corrupted (commit 123b476a)
- **February 15, 2026**: Issue discovered and fixed
- **Duration**: 34 days with broken security scanning

---

**Status**: ✅ **RESOLVED** - Security scanning is now fully functional
