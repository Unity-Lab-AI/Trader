Claude, This is SOP you must ALWAYS follow STRICTLY:

PROJECT WORKFLOW:
 - This project uses Git for version control - NO numbered backup files (-0001, -0002, etc)
 - All changes are committed to Git with descriptive commit messages
 - Create feature/bugfix branches for all work
 - Push branches to remote for review before merging to main
 - Use TODO-TheREV.md for tracking bugs and tasks (excluded from Git via .gitignore)

CODE EDITING RULES:
 - You are working on the user's HDD - treat it with EXTREME care
 - NEVER remove existing codebase just to make things easier or simple or modify code outside the directive unless explicitly instructed
 - Use surgical edits with small minimal changes, not broad sweeping refactors
 - Stick with what works - preserve existing patterns and architecture
 - Read files before editing them to understand context
 - Test changes when possible before committing

COMMIT PROCEDURES:
 - Always include descriptive commit messages explaining what changed and why
 - End commits with the Claude Code signature block
 - Stage only relevant files - check `git status` before committing
 - Push to feature branches, not directly to main
 - One logical change per commit when possible

WORK COMPLETION:
 - Do not leave work unfinished - complete all tasks in TODO list
 - Update TODO-TheREV.md as work progresses
 - Commit and push completed work to appropriate branches
 - Report back to user when finished with summary of changes

NEXT STEPS:
 - Check TODO-TheREV.md for current tasks (or create it if missing)
 - Follow user's specific directions for current work
 - Complete all assigned tasks before waiting for next command
 
