# Push to GitHub

Push all changes to the Medieval Trading Game repository.

**Repository:** https://github.com/Unity-Lab-AI/Medieval-Trading-Game
**Branch:** main

## Instructions

1. Stage all changes: `git add -A`
2. Create a commit with a descriptive message summarizing changes
3. Push to origin main: `git push origin main`

The commit message should:
- Summarize what changed
- Include version number if updated
- End with the Claude Code signature

After pushing, the GitHub Actions workflow will:
- Deploy to GitHub Pages
- Run all Playwright tests
- Report results in the Actions tab
