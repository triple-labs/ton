# AI Configuration and Private Repository Setup

## Overview

The TON blockchain project uses AI-powered tools for automated code reviews, documentation generation, and other development tasks. This document explains how the AI configuration system works and how to set up and use a private repository for AI configurations.

## Why a Private AI Configuration Repository?

AI configurations, prompts, and agent instructions are stored in a **separate private repository** for several reasons:

1. **Security**: Keeps sensitive prompts and configurations private
2. **Flexibility**: Allows independent updates without affecting main codebase
3. **Access Control**: Fine-grained control over who can modify AI behaviors
4. **Version Control**: Track AI configuration changes separately
5. **Experimentation**: Test new prompts without cluttering main repo

## Current AI Tools

### 1. Codex Code Review

The repository uses OpenAI's Codex for automated code reviews via GitHub Actions.

**Workflow**: `.github/workflows/codex-review.yml`

**Features**:
- Automated security vulnerability detection
- Code quality analysis
- Performance issue identification
- Style and best practice checks

**Trigger**: Pull requests from authorized users

### 2. CodeQL Security Scanning

Advanced security vulnerability detection using GitHub's CodeQL.

**Workflow**: `.github/workflows/codeql.yml`

**Languages Analyzed**:
- C++ (2,011 files)
- Python (33 files)

**Schedule**: Weekly on Sundays at 1:30 AM UTC, plus on all PR and push events

## AI Configuration Files

The main repository contains references and templates:

| File | Purpose |
|------|---------|
| `.github/AI_SETUP.md` | Complete setup guide for private AI repo |
| `.github/QUICK_START_AI.md` | Quick reference for developers |
| `.github/ai-config.yml` | Configuration reference and settings |
| `.github/workflows/ai-review-advanced.yml.example` | Example workflow using private config |

## Setting Up the Private Repository

### Quick Start

1. Create private repository `triple-labs/ton-ai-config`
2. Add Personal Access Token as `AI_CONFIG_REPO_TOKEN` secret
3. Follow the setup guide in `.github/AI_SETUP.md`

### Detailed Instructions

See the comprehensive setup guide: [`.github/AI_SETUP.md`](../.github/AI_SETUP.md)

Quick start guide: [`.github/QUICK_START_AI.md`](../.github/QUICK_START_AI.md)

## Using AI Configurations

### In GitHub Actions Workflows

```yaml
steps:
  - name: Checkout AI config
    uses: actions/checkout@v4
    with:
      repository: triple-labs/ton-ai-config
      token: ${{ secrets.AI_CONFIG_REPO_TOKEN }}
      path: .ai-config
  
  - name: Use AI prompt
    run: |
      cat .ai-config/agents/code-review/prompts/security-review.md
```

### Configuration Structure

The private repository should follow this structure:

```
ton-ai-config/
├── agents/
│   ├── code-review/
│   │   ├── config.yml
│   │   └── prompts/
│   │       ├── security-review.md
│   │       ├── performance-review.md
│   │       └── style-review.md
│   ├── documentation/
│   └── code-generation/
├── workflows/
└── configs/
```

## Available Agents

### Code Review Agent

**Status**: ✅ Enabled

**Purpose**: Automated PR reviews focusing on security, performance, and code quality

**Configuration**: See `.github/ai-config.yml`

**Allowed Users**: Defined in `codex-review.yml` workflow

### Documentation Agent

**Status**: ⏸️ Disabled (can be enabled)

**Purpose**: Automated documentation generation and updates

**Configuration**: See `.github/ai-config.yml` to enable

### Code Generation Agent

**Status**: ⏸️ Disabled (can be enabled)

**Purpose**: Automated code scaffolding and generation

**Configuration**: See `.github/ai-config.yml` to enable

### Test Generation Agent

**Status**: ⏸️ Disabled (can be enabled)

**Purpose**: Automated test case generation

**Configuration**: See `.github/ai-config.yml` to enable

## Security Best Practices

### ✅ DO:
- Store prompts and templates in private repo
- Use GitHub Secrets for API keys
- Version control all AI configurations
- Review AI outputs before accepting
- Rotate access tokens regularly

### ❌ DON'T:
- Commit API keys or secrets
- Store credentials in configuration files
- Share access tokens publicly
- Trust AI outputs blindly
- Disable security checks

## Secrets Required

The following secrets must be configured in the main repository:

| Secret Name | Purpose | Scope |
|-------------|---------|-------|
| `OPENAI_API_KEY` | OpenAI API access for Codex | Repository |
| `AI_CONFIG_REPO_TOKEN` | Access to private AI config repo | Repository |

To add secrets:
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the secret name and value

## Monitoring and Maintenance

### Regular Tasks

- **Weekly**: Review AI-generated code reviews
- **Monthly**: Update prompts based on feedback
- **Quarterly**: Rotate access tokens
- **Annually**: Audit repository access

### Cost Tracking

AI API usage should be monitored to stay within budget:
- Monthly budget: $1,000 USD (configurable)
- Alert threshold: 80%
- See `ai-config.yml` for configuration

## Troubleshooting

### Common Issues

**"Repository not found"**
- Verify `AI_CONFIG_REPO_TOKEN` is set
- Check token hasn't expired
- Confirm token has access to private repo

**"Permission denied"**
- Ensure token has `repo` scope
- Check repository permissions
- Verify org membership

**Poor AI review quality**
- Update prompts in private repo
- Adjust temperature/token settings
- Consider upgrading AI model

## Advanced Features

### Custom Review Types

Configure specialized reviews for different code types:
- Security review for crypto code
- Performance review for consensus
- Style review for all code

### Integration with Other Tools

AI configurations can integrate with:
- ✅ CodeQL security scanning
- ✅ Dependabot dependency updates
- ⏸️ Custom security scanners (disabled)
- ⏸️ External analysis tools (disabled)

### Feature Flags

Enable/disable features via `ai-config.yml`:
- `advanced_security_scan`
- `auto_vuln_detection`
- `code_suggestions`
- `performance_analysis`

## References

- [Complete Setup Guide](../.github/AI_SETUP.md)
- [Quick Start Guide](../.github/QUICK_START_AI.md)
- [Configuration Reference](../.github/ai-config.yml)
- [Example Workflow](../.github/workflows/ai-review-advanced.yml.example)

## Support

For issues or questions:
- **Setup**: Contact DevOps team
- **AI configuration**: Contact AI/ML team
- **Security**: Contact Security team
- **General**: Open issue in repository

## Future Enhancements

Planned features:
- [ ] Automated merge conflict resolution
- [ ] Intelligent code suggestions
- [ ] Performance bottleneck detection
- [ ] Automated refactoring suggestions
- [ ] Smart test generation

---

**Last Updated**: February 2026  
**Status**: ✅ Active  
**Maintained By**: AI/ML Team
