# Security Tools and Workflows

This directory contains security-related tools and workflows for managing the 137+ security issues in the TON repository.

## Overview

The TON repository uses multiple security scanning tools to identify and track vulnerabilities:

1. **CodeQL** - Static analysis for C++, Python, JavaScript, Java, and Actions
2. **Dependabot** - Automated dependency vulnerability scanning
3. **Secret Scanning** - Detection of accidentally committed secrets
4. **Manual Tools** - Additional security analysis utilities

## Quick Start

### Check Security Status

```bash
# From repository root
python3 .github/scripts/security_analysis.py

# Or from within the scripts directory
cd .github/scripts
python3 security_analysis.py
```

### Access Security Alerts

1. **GitHub Security Tab**: https://github.com/triple-labs/ton/security
2. **CodeQL Alerts**: https://github.com/triple-labs/ton/security/code-scanning
3. **Dependabot Alerts**: https://github.com/triple-labs/ton/security/dependabot
4. **Secret Scanning**: https://github.com/triple-labs/ton/security/secret-scanning

### Review Security Tracking

See [SECURITY_TRACKING.md](../SECURITY_TRACKING.md) for:
- Detailed issue categorization
- Priority matrix
- Remediation guidelines
- Workflow documentation

## Tools

### security_analysis.py

Python script for analyzing security issues and generating reports.

**Usage:**
```bash
cd <repository-root>
python3 .github/scripts/security_analysis.py
```

**Features:**
- Checks security tool configuration
- Analyzes dependency files
- Parses CodeQL SARIF results (if available)
- Generates security reports
- Provides remediation recommendations

**Output:**
- Security configuration status
- Dependency file inventory
- Issue statistics (if data available)
- Actionable recommendations
- Links to security resources

## Workflows

### Daily Security Routine

1. Check for new security alerts
2. Review and triage new issues
3. Update issue tracking in SECURITY_TRACKING.md
4. Address P0 (Critical) issues immediately

### Weekly Security Review

1. Run security analysis tool
2. Review all open security issues
3. Update priorities based on new information
4. Create remediation tasks for P1 (High) issues
5. Update team on progress

### Monthly Security Audit

1. Comprehensive review of all security issues
2. Update security metrics
3. Review and update accepted risks
4. Report to stakeholders
5. Plan security improvements

## Issue Remediation Workflow

### 1. Triage

```bash
# Access the alert
# Verify it's not a false positive
# Assess severity and impact
# Assign priority using matrix in SECURITY_TRACKING.md
```

### 2. Plan Fix

```bash
# Create GitHub issue for tracking
# Assign owner
# Identify affected code/dependencies
# Determine remediation approach
# Estimate effort
```

### 3. Implement Fix

```bash
# Create feature branch
git checkout -b security/issue-name

# Implement fix
# Add tests
# Update documentation

# Commit with security label
git commit -m "security: Fix [issue description]"
```

### 4. Test and Review

```bash
# Run affected tests
# Run full test suite
# Security-focused code review
# Verify fix resolves the issue
```

### 5. Deploy

```bash
# Merge to testnet branch first
# Monitor for issues
# Merge to master branch
# Verify alert is closed
```

### 6. Document

```bash
# Update SECURITY_TRACKING.md
# Add to Changelog.md
# Update security metrics
# Close related GitHub issues
```

## Configuration Files

### dependabot.yml

Configures Dependabot for automated dependency updates:
- Python dependencies (weekly on Monday)
- GitHub Actions (weekly on Monday)
- Gradle/Android (weekly on Tuesday)
- Docker (weekly on Wednesday)

### codeql.yml

Configures CodeQL static analysis:
- Languages: C++, Python, JavaScript, Java, Actions
- Triggers: Push, PR, weekly schedule
- Build modes: Autobuild for most, manual where needed

## Best Practices

### For Developers

1. **Before Committing**
   - Review security alerts for files you're modifying
   - Run local security scans if available
   - Follow secure coding guidelines
   - Never commit secrets or credentials

2. **During Development**
   - Use safe APIs and functions
   - Validate and sanitize all inputs
   - Handle errors securely
   - Follow principle of least privilege

3. **Code Review**
   - Pay special attention to security implications
   - Check for common vulnerability patterns
   - Verify input validation
   - Review error handling

### For Maintainers

1. **Issue Management**
   - Triage new alerts within 24 hours
   - Prioritize based on severity and exploitability
   - Track progress in SECURITY_TRACKING.md
   - Communicate status to stakeholders

2. **Release Management**
   - Include security fixes in release notes
   - Test security patches thoroughly
   - Deploy security fixes promptly
   - Notify users of security updates

3. **Continuous Improvement**
   - Review security metrics monthly
   - Update security tools and configurations
   - Provide security training
   - Learn from security incidents

## Common Issues and Solutions

### False Positives

If CodeQL reports a false positive:
1. Verify the alert and document why it's a false positive (in code comments or design docs)
2. In GitHub's **Code scanning alerts** view, dismiss the alert with an appropriate reason and a clear explanation
3. If the pattern is consistently safe, update the CodeQL configuration or queries to exclude it, and record the rationale in `SECURITY_TRACKING.md`
4. Note: `// NOLINTNEXTLINE(...)` comments are for clang-tidy/linters and do **not** affect CodeQL alerting

### Dependency Conflicts

If a security update breaks compatibility:
1. Check for alternative fixes
2. Consider patching instead of upgrading
3. Document the decision in SECURITY_TRACKING.md
4. Monitor for future updates

### Build Failures

If CodeQL build fails:
1. Check build logs in GitHub Actions
2. Ensure dependencies are available
3. Verify build configuration
4. Contact GitHub Support if needed

## Resources

### Documentation

- [SECURITY.md](../../SECURITY.md) - Security policy and reporting
- [SECURITY_TRACKING.md](../SECURITY_TRACKING.md) - Issue tracking and guidelines
- [GitHub Security Docs](https://docs.github.com/en/code-security)

### Tools

- [CodeQL CLI](https://github.com/github/codeql-cli-binaries)
- [pip-audit](https://github.com/pypa/pip-audit) - Python dependency scanner
- [Bandit](https://github.com/PyCQA/bandit) - Python security linter
- [cppcheck](http://cppcheck.sourceforge.net/) - C++ static analysis

### Support

- GitHub Security: https://github.com/security
- Security Advisories: https://github.com/triple-labs/ton/security/advisories
- General Questions: Open a GitHub discussion

## Contributing

To improve these security tools and workflows:

1. Open an issue with your proposal
2. Submit a PR with improvements
3. Update documentation
4. Share knowledge with the team

---

**Last Updated**: February 10, 2026
**Maintainer**: Security Team
