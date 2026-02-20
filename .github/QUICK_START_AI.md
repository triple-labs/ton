# AI Private Repository - Quick Start Guide

This guide provides quick instructions for setting up and using the private AI configuration repository for the TON blockchain project.

## TL;DR

1. Create private repo: `triple-labs/ton-ai-config`
2. Add PAT token as secret: `AI_CONFIG_REPO_TOKEN`
3. Reference configs in workflows
4. Done! 🎉

## For Repository Administrators

### Step 1: Create the Private Repository

```bash
# Using GitHub CLI (recommended)
gh repo create triple-labs/ton-ai-config --private \
  --description "Private AI configuration repository for TON blockchain"

# Initialize with basic structure
cd ton-ai-config
mkdir -p agents/{code-review,documentation,code-generation}/prompts
mkdir -p workflows configs
git add .
git commit -m "Initial structure"
git push
```

### Step 2: Set Up Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Create new fine-grained token with:
   - Repository access: `triple-labs/ton-ai-config`
   - Permissions: `Contents` (read)
3. Copy the token

### Step 3: Add Secret to Main Repository

1. Go to `triple-labs/ton` → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `AI_CONFIG_REPO_TOKEN`
4. Value: `<paste-token-here>`
5. Click "Add secret"

## For Developers

### Using AI Configurations in Workflows

Reference the private repository in your GitHub Actions workflows:

```yaml
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

### Creating New AI Agents

1. Create directory in `ton-ai-config/agents/<agent-name>/`
2. Add `config.yml` and `prompts/` subdirectory
3. Document in the agent's README
4. Submit PR for review

### Testing AI Configurations

Before merging changes to AI configurations:

1. Test in a feature branch
2. Use a test PR in the main repository
3. Verify outputs are as expected
4. Get review from AI team lead

## For AI/ML Team

### Adding New Prompts

```bash
cd ton-ai-config
git checkout -b add-performance-prompt

# Create prompt file
cat > agents/code-review/prompts/performance-review.md << 'EOF'
# Performance Review Prompt
Review code for performance issues...
EOF

git add .
git commit -m "Add performance review prompt"
git push origin add-performance-prompt

# Create PR for review
gh pr create --title "Add performance review prompt"
```

### Updating Model Configurations

Edit `configs/model-settings.yml`:

```yaml
models:
  gpt4:
    provider: openai
    model: gpt-4
    temperature: 0.3
    max_tokens: 2000
  
  claude:
    provider: anthropic
    model: claude-3-sonnet
    temperature: 0.5
    max_tokens: 4000
```

## Common Use Cases

### 1. Custom Code Review Prompt

Create a specialized review prompt for blockchain-specific code:

```markdown
# Blockchain Security Review

Review this code for:
- Smart contract vulnerabilities
- Consensus mechanism issues
- Cryptographic implementation flaws
- Network security concerns
```

Save to `agents/code-review/prompts/blockchain-review.md`

### 2. Automated Documentation

Set up automatic documentation generation:

```yaml
# In ton-ai-config/agents/documentation/config.yml
agent:
  name: "Documentation Generator"
  triggers:
    - push_to_main
  files:
    - "**/*.h"
    - "**/*.cpp"
```

### 3. Test Generation

Configure automatic test case generation:

```yaml
# In ton-ai-config/agents/test-generation/config.yml
agent:
  name: "Test Generator"
  coverage_target: 80
  frameworks:
    - gtest
    - pytest
```

## Configuration Files Reference

| File | Purpose | Location |
|------|---------|----------|
| `AI_SETUP.md` | Complete setup guide | Main repo `.github/` |
| `ai-config.yml` | Configuration reference | Main repo `.github/` |
| `QUICK_START.md` | This file | Main repo `.github/` |
| Agent configs | Agent-specific settings | Private repo `agents/` |
| Prompts | AI prompts and templates | Private repo `agents/*/prompts/` |

## Troubleshooting

### "Repository not found" error

- Check `AI_CONFIG_REPO_TOKEN` secret is set
- Verify token hasn't expired
- Confirm token has access to private repo

### "Permission denied" error

- Ensure token has `repo` scope
- Check repository access permissions
- Verify token is for correct organization

### AI responses are low quality

- Review and update prompts in private repo
- Adjust temperature/token settings
- Consider using a more capable model

## Security Reminders

⚠️ **NEVER commit to the private AI repo:**
- API keys or tokens
- Credentials or passwords
- Production secrets
- Sensitive internal information

✅ **DO commit:**
- Prompts and templates
- Configuration files
- Documentation
- Examples and guides

## Getting Help

- **Setup issues**: Contact DevOps team
- **AI configuration**: Contact AI/ML team
- **Security concerns**: Contact Security team
- **General questions**: Open issue in main repo

## Next Steps

1. ✅ Create private AI config repository
2. ✅ Set up access token
3. ✅ Configure first AI agent
4. [ ] Test with sample PR
5. [ ] Roll out to team
6. [ ] Monitor and iterate

## Resources

- [Complete Setup Guide](./AI_SETUP.md)
- [Configuration Reference](./ai-config.yml)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

**Last Updated**: February 2026  
**Maintained By**: AI/ML Team
