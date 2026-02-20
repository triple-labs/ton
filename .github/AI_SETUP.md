# AI Configuration Repository Setup Guide

## Overview

This document describes how to set up and use a private repository for storing AI agent configurations, prompts, and related resources for the TON blockchain project.

## Why a Separate Private Repository?

A dedicated private repository for AI configurations provides several benefits:

1. **Security**: Keep sensitive prompts, API configurations, and agent instructions private
2. **Version Control**: Track changes to AI configurations independently from the main codebase
3. **Separation of Concerns**: Isolate AI tooling configurations from production code
4. **Access Control**: Manage who can view and modify AI configurations separately
5. **Experimentation**: Test and iterate on AI prompts without cluttering the main repository

## Repository Structure

Create a new private repository with the following recommended structure:

```
ton-ai-config/
├── README.md
├── .gitignore
├── agents/
│   ├── code-review/
│   │   ├── prompts/
│   │   │   ├── security-review.md
│   │   │   ├── performance-review.md
│   │   │   └── style-review.md
│   │   └── config.yml
│   ├── code-generation/
│   │   ├── prompts/
│   │   │   └── templates/
│   │   └── config.yml
│   └── documentation/
│       ├── prompts/
│       └── config.yml
├── workflows/
│   ├── codex-review-advanced.yml
│   └── automated-docs.yml
└── configs/
    ├── api-keys.example.yml
    └── model-settings.yml
```

## Setup Instructions

### 1. Create the Private Repository

```bash
# Using GitHub CLI
gh repo create triple-labs/ton-ai-config --private \
  --description "Private AI configuration repository for TON blockchain project"

# Or create manually at:
# https://github.com/organizations/triple-labs/repositories/new
```

### 2. Initialize Repository Structure

```bash
# Clone the new repository
git clone git@github.com:triple-labs/ton-ai-config.git
cd ton-ai-config

# Create directory structure
mkdir -p agents/code-review/prompts
mkdir -p agents/code-generation/prompts/templates
mkdir -p agents/documentation/prompts
mkdir -p workflows
mkdir -p configs

# Create README
cat > README.md << 'EOF'
# TON AI Configuration

Private repository for AI agent configurations, prompts, and workflow definitions
for the TON blockchain project.

## ⚠️ Security Notice

This repository contains:
- AI model prompts and configurations
- API integration settings
- Agent instructions and templates

**Do NOT commit**:
- API keys or tokens (use GitHub Secrets instead)
- Credentials or passwords
- Production secrets

## Usage

See [Setup Guide](./docs/SETUP.md) for configuration instructions.
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# API Keys and Secrets
*.key
*.secret
*-secret.yml
api-keys.yml
credentials.yml

# Environment files
.env
.env.local

# Temporary files
*.tmp
*.log
.DS_Store

# IDE
.vscode/
.idea/
*.swp
EOF

# Initial commit
git add .
git commit -m "Initial repository structure"
git push origin main
```

### 3. Configure Repository Access

Set up proper access controls:

1. Go to repository Settings → Manage access
2. Add team members who need access to AI configurations
3. Recommended access levels:
   - **Admin**: AI/ML team leads
   - **Write**: Developers working on AI integrations
   - **Read**: All other team members (if needed)

### 4. Set Up GitHub Secrets

For the main `ton` repository, add a Personal Access Token (PAT) to access the private AI config repository:

1. Create a PAT with `repo` scope:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Generate new token with access to `triple-labs/ton-ai-config`
   - Select `Contents` (read) permission

2. Add the PAT as a secret in the main `ton` repository:
   - Go to `triple-labs/ton` → Settings → Secrets and variables → Actions
   - Add new repository secret:
     - Name: `AI_CONFIG_REPO_TOKEN`
     - Value: `<your-pat-token>`

### 5. Create AI Configuration Files

#### Basic Agent Configuration (`agents/code-review/config.yml`)

```yaml
agent:
  name: "Code Review Agent"
  version: "1.0.0"
  description: "Automated code review for TON blockchain"
  
model:
  provider: "openai"
  model: "gpt-4"
  temperature: 0.3
  max_tokens: 2000

prompts:
  base: "prompts/security-review.md"
  
rules:
  - check_security: true
  - check_performance: true
  - check_style: true
  - check_tests: true

output:
  format: "markdown"
  include_suggestions: true
  severity_levels: ["critical", "high", "medium", "low"]
```

#### Security Review Prompt (`agents/code-review/prompts/security-review.md`)

```markdown
# Security Review Prompt

You are a security-focused code reviewer for the TON blockchain project.

## Review Guidelines

1. **Security Vulnerabilities**
   - Check for common vulnerabilities (injection, XSS, etc.)
   - Review cryptographic implementations
   - Verify input validation and sanitization
   - Check for resource exhaustion risks

2. **Smart Contract Security** (if applicable)
   - Reentrancy vulnerabilities
   - Integer overflow/underflow
   - Access control issues
   - Gas optimization

3. **Code Quality**
   - Memory safety
   - Error handling
   - Resource management
   - Thread safety

## Output Format

For each issue found:
- **Severity**: [Critical|High|Medium|Low]
- **Location**: File and line number
- **Description**: Clear explanation of the issue
- **Recommendation**: Specific fix or mitigation
- **References**: Related CVEs or documentation

If no issues found, output: "No security issues detected."
```

### 6. Integrate with Main Repository

Update the main `ton` repository to use configurations from the private AI repository.

#### Example GitHub Actions Workflow

Create `.github/workflows/ai-code-review-advanced.yml` in the main `ton` repository:

```yaml
name: AI Code Review (Advanced)

on:
  pull_request:
    types: [opened, reopened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    
    steps:
      - name: Checkout main repo
        uses: actions/checkout@v4
        with:
          ref: refs/pull/${{ github.event.pull_request.number }}/merge
      
      - name: Checkout AI config repo
        uses: actions/checkout@v4
        with:
          repository: triple-labs/ton-ai-config
          token: ${{ secrets.AI_CONFIG_REPO_TOKEN }}
          path: .ai-config
      
      - name: Run AI Review
        uses: openai/codex-action@v1
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          prompt-file: .ai-config/agents/code-review/prompts/security-review.md
          config-file: .ai-config/agents/code-review/config.yml
```

## Configuration Reference

### ai-config.yml

The main `ton` repository can include an `.github/ai-config.yml` file that references the private repository:

```yaml
# AI Configuration Reference
# This file specifies which private AI configuration repository to use

ai_config_repository:
  owner: "triple-labs"
  repo: "ton-ai-config"
  branch: "main"
  
agents:
  code_review:
    enabled: true
    config_path: "agents/code-review/config.yml"
    prompt_path: "agents/code-review/prompts/security-review.md"
  
  documentation:
    enabled: false
    config_path: "agents/documentation/config.yml"
  
  code_generation:
    enabled: false
    config_path: "agents/code-generation/config.yml"

settings:
  auto_review_enabled: true
  require_approval: true
  allowed_users:
    - "EmelyanenkoK"
    - "tolya-yanot"
    - "SpyCheese"
    # ... other allowed users
```

## Security Best Practices

1. **Never commit secrets**: Use GitHub Secrets for all sensitive data
2. **Use fine-grained PATs**: Create PATs with minimal required permissions
3. **Rotate tokens regularly**: Update access tokens every 90 days
4. **Audit access logs**: Regularly review who accesses the AI config repository
5. **Version control prompts**: Track all changes to AI prompts and configurations
6. **Test in staging**: Always test new AI configurations in a test environment first

## Maintenance

### Regular Tasks

- **Weekly**: Review AI-generated outputs for quality
- **Monthly**: Update prompts based on feedback
- **Quarterly**: Review and rotate access tokens
- **Annually**: Audit repository access permissions

### Updating Configurations

When updating AI configurations:

1. Create a feature branch in `ton-ai-config`
2. Make and test changes
3. Submit PR for review
4. Merge to main branch
5. Changes will be automatically picked up by workflows in main `ton` repository

## Troubleshooting

### Common Issues

**Issue**: Workflow can't access private AI config repository
- **Solution**: Verify `AI_CONFIG_REPO_TOKEN` secret is set correctly
- **Solution**: Check PAT has `repo` scope and hasn't expired

**Issue**: AI prompts not updating
- **Solution**: Clear GitHub Actions cache
- **Solution**: Verify correct branch is specified in `ai-config.yml`

**Issue**: Permission denied errors
- **Solution**: Ensure PAT has access to the private repository
- **Solution**: Check repository access settings

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## Support

For issues or questions:
- Open an issue in the main `ton` repository
- Contact the AI/ML team leads
- Check the internal documentation portal
