# Security Enhancements - February 2026

## Overview

This document summarizes the security enhancements made to the TON repository in February 2026 to improve the overall security posture.

## 1. Workflow Permissions Hardening ✅

**Date**: February 15, 2026  
**Status**: Completed

### Problem
Multiple GitHub Actions workflows lacked explicit permissions declarations, causing them to inherit overly-permissive default access rights. This violates the principle of least privilege.

### Solution
Added explicit `permissions: contents: read` to 10 build/lint workflows:

- ✅ build-ton-linux-arm64-appimage.yml
- ✅ build-ton-linux-arm64-shared.yml
- ✅ build-ton-linux-x86-64-appimage.yml
- ✅ build-ton-linux-x86-64-shared.yml
- ✅ build-ton-linux-x86-64-werror.yml (Lint workflow)
- ✅ build-ton-macos-14-arm64-portable.yml
- ✅ build-ton-macos-15-arm64-shared.yml
- ✅ build-ton-macos-15-x86-64-portable.yml
- ✅ build-ton-macos-15-x86-64-shared.yml
- ✅ build-ton-wasm-emscripten.yml

### Verification
- Verified clear-gh-cache.yml has job-level permissions (`actions: write`)
- Verified codex-review.yml has job-level permissions (`contents: read`, `pull-requests: write`)

### Result
**All 22 workflows now have explicit permissions** (either at workflow-level or job-level), following security best practices.

## 2. Automated Dependency Management ✅

**Date**: February 15, 2026  
**Status**: Completed

### Dependabot Configuration
Created `.github/dependabot.yml` to enable automated security updates:

- **Python dependencies**: Weekly scans via pip ecosystem
- **GitHub Actions**: Weekly updates to action versions
- **Docker**: Weekly updates to base images
- Auto-labeling with "dependencies" and "security" labels

### UV Lock File Automation
Created `.github/workflows/dependabot-uv-lock.yml` to handle Python dependency locking:

- **Problem**: Dependabot's pip ecosystem doesn't auto-update uv.lock files
- **Solution**: Automated workflow that regenerates uv.lock when Dependabot updates pyproject.toml
- **Security**: Uses `pull_request_target` trigger with proper permissions
- **Process**:
  1. Detects Dependabot PRs that modify pyproject.toml
  2. Automatically regenerates uv.lock using `uv lock` (no --upgrade flag)
  3. Commits changes back to the Dependabot PR branch
  4. Adds informative comment on the PR

### Benefits
- Automatic security vulnerability notifications
- Timely dependency updates
- Reduced manual maintenance
- Consistent lockfile management

## 3. CodeQL Security Scanning ✅

**Date**: February 15, 2026  
**Status**: Previously fixed (separate PR)

The CodeQL workflow was restored in a previous fix after being corrupted for 34 days. Current status:

- ✅ C++ code analysis (2,011 files)
- ✅ Python code analysis (33 files)
- ✅ Weekly scheduled scans (Sundays 1:30 AM UTC)
- ✅ Scans on push/PR to master and testnet branches
- ✅ Explicit permissions following least privilege

## Security Best Practices Applied

### 1. Principle of Least Privilege
- All workflows now have minimal required permissions
- No workflows have unnecessary write access
- Job-level permissions where more granular control is needed

### 2. Automated Security Updates
- Dependabot monitors for vulnerabilities
- Automated PR creation for security patches
- Weekly scanning schedule

### 3. Continuous Security Scanning
- CodeQL analyzes all code changes
- Regular scheduled scans for new vulnerabilities
- Multi-language support (C++, Python)

### 4. Supply Chain Security
- Automated dependency updates
- Lockfile integrity (uv.lock synchronized with pyproject.toml)
- GitHub Actions versions pinned and updated

## Security Verification

### Checks Performed
- ✅ No hardcoded secrets found in codebase
- ✅ .gitignore properly excludes sensitive files
- ✅ All workflow YAML syntax validated
- ✅ Permissions follow least privilege principle
- ✅ Security policy exists (SECURITY.md)

### Validation Tools Used
- Python YAML validator
- grep-based secret scanning
- Manual code review
- GitHub Actions best practices

## Next Steps

### Recommended Future Enhancements
1. **Secret Scanning**: Enable GitHub secret scanning (if not already enabled)
2. **Branch Protection**: Ensure master/testnet branches have protection rules
3. **Security Policy**: Expand SECURITY.md with vulnerability reporting process
4. **SBOM**: Consider generating Software Bill of Materials
5. **Container Scanning**: Add Trivy or similar for Docker image scanning

### Monitoring
- Monitor Dependabot PRs and merge security updates promptly
- Review CodeQL alerts and address vulnerabilities
- Keep security documentation updated

## Impact Assessment

### Before
- 10 workflows with overly-permissive default permissions
- No automated dependency security updates
- Manual dependency management with potential for drift

### After
- ✅ All 22 workflows with explicit minimal permissions
- ✅ Automated weekly security scans for dependencies
- ✅ Automated uv.lock synchronization
- ✅ Comprehensive security documentation

## References

- [GitHub Actions Permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://docs.github.com/en/code-security/code-scanning)
- [Security Best Practices](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)

---

**Last Updated**: February 15, 2026  
**Status**: ✅ Security enhancements completed and validated
