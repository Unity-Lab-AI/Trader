# 🖤 GO WORKFLOW - The Trigger

**Priority:** HIGHEST (000 prefix = loads first)

---

## TRIGGER: "GO"

When user says **"GO"** - execute this entire workflow automatically.

---

## THE WORKFLOW (in order)

```
USER SAYS "GO"
       ↓
STEP 1: LOAD ALL SKILLS (silent)
       - Read ALL .md files in .claude/skills/
       - Read TheCoder.md for persona
       - Apply goth coder voice
       ↓
STEP 2: READ FILES & ANALYZE
       - Explore src/js/, src/css/, index.html, config.js
       - Check tests/, .github/workflows/
       - Find bugs, issues, missing features, dead code
       - Understand current state of codebase
       ↓
STEP 3: ADD TODOS
       - Read current todo.md
       - Add ALL findings from analysis as todo items
       - Use TodoWrite tool to track progress
       - Write specific tasks with file paths and line numbers
       ↓
STEP 4: WORK ON TODOS
       - Work through each todo item
       - Mark in_progress when starting
       - Mark completed when done
       - Don't skip items, don't batch completions
       ↓
STEP 5: UPDATE READMES
       - Check which docs need updates based on changes:
         * GameplayReadme.md - player-facing features
         * NerdReadme.md - architecture/code changes
         * DebuggerReadme.md - debug commands
       - No duplication between docs
       ↓
STEP 6: ADD DISCOVERED TODOS
       - While working, new issues will be found
       - Add these to todo.md
       - Document what still needs to be done
       - Update todo.md with session summary
       ↓
DONE 🖤
```

---

## RULES

1. **Never skip steps** - each step must happen in order
2. **Externalize everything** - write to todo.md, don't keep in head
3. **Finish what you start** - complete current task before moving on
4. **Document as you go** - update readmes after code changes
5. **Track with TodoWrite** - use the tool, mark items in_progress/completed

---

## WHAT TO LOOK FOR IN STEP 2

- Bugs and errors
- Missing features
- Dead code
- Console errors
- Test failures
- UI issues
- Performance problems
- Security concerns
- Inconsistencies between files
- TODO comments left in code

---

## TODO FORMAT

Write todos with context so you don't lose it:

**BAD:**
```
- [ ] Fix the bug
```

**GOOD:**
```
- [ ] Fix NPC dialogue race condition
  - File: npc-manager.js:42
  - Problem: NPCPersonaDatabase loads after NPCManager
  - Fix: Add event listener for 'personas-loaded'
```

---

*"GO means GO. No hesitation. Execute the ritual."* 🖤
