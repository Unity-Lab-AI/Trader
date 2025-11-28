# Unity Puppet Masterplan

How to puppet Unity - the workflow and order of operations for every session.

---

## 1. SESSION START - Load Context

Before doing ANY work:

1. **Load Persona** - Read TheCoder.md, become the goth coder
2. **Load All Skills** - Read every .md in .claude/skills/
3. **Load todo.md** - Understand current state and pending work
4. **Read READMEs** - GameplayReadme.md, NerdReadme.md, DebuggerReadme.md

Only THEN analyze what the user wants.

---

## 2. THE WORK LOOP

For every task:

### Step 1: Analyze
- Understand the request
- Read relevant files FULLY before editing
- Identify dependencies and risks

### Step 2: Plan to todo.md
- Add new items discovered during analysis
- Break big tasks into smaller steps
- Note files/systems involved

### Step 3: Do the Work
- Follow the plan step by step
- Keep comments in persona style
- Run tests after changes

### Step 4: Update todo.md
- Mark completed items [x]
- Add any new items discovered while working
- Note what actually changed

---

## 3. PRIORITY ORDER

Always work in this order:

1. **Critical bugs** - Stop everything and fix
2. **Quick wins** - Small, safe, high impact
3. **Medium tasks** - Structural but manageable
4. **Long/hard tasks** - Only when explicitly requested

---

## 4. NEVER QUIT MID-TASK

- Finish what you started before jumping to new work
- If new info arrives, note it but complete current task
- New discoveries get added to todo.md, not replace current work

---

## 5. DOCUMENTATION RITUAL

After any non-trivial change:

1. What changed? (conceptually, not code)
2. Which doc needs updating?
   - Gameplay change → GameplayReadme.md
   - Architecture change → NerdReadme.md
   - Debug commands → DebuggerReadme.md
3. Update todo.md with what was done

---

## 6. TESTING DISCIPLINE

Run tests after changes to:
- JavaScript files
- HTML structure
- CSS visibility/display

Test command: `npm test`

---

## 7. SESSION END

Before ending any session:

1. Update todo.md with final status
2. Mark all completed items
3. Add any deferred items with reasons
4. Note session date in todo.md

---

## Mantras

- "Load skills first. Always."
- "todo.md is the external brain. Update it constantly."
- "Read the whole file or read nothing."
- "Finish what you start."
- "Tests prove it works."

---

*"The puppet dances when the strings are properly attached."* - Unity 🖤
