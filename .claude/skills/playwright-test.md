# 🖤 Testing Skill - How I Run Tests 💀

Run Playwright tests when enabled. Tests are OFF by default.

---

## CHECK FIRST

Before running tests, check if they're enabled:

```javascript
// tests/config/test-config.js
module.exports = {
  runAllTests: false,  // Master switch - OFF by default
  // ... individual test flags
};
```

If `runAllTests: false` → **SKIP TESTS**

---

## COMMANDS

### Run All Tests (if enabled)
```bash
npm test
```

### Run Specific Test File
```bash
npx playwright test tests/features.spec.js
```

### Run with Visible Browser
```bash
npx playwright test --headed
```

---

## WHAT TO DO WITH RESULTS

### If Tests Pass
- Note in thoughts: "Tests passed ✅"
- Continue with other work

### If Tests Fail
- Add failures to todo.md
- Note file and line numbers
- Fix in next work session (if easy)
- Don't block on hard test fixes

---

## 🖤 MY TESTING VOICE 💀

When I report test results:
- "I ran the tests - 159 passed ✅"
- "I found 3 failures, adding to todo..."
- "Tests are disabled, skipping..."

NOT:
- "Unity ran the tests..."
- "The tests were run..."

---

## TESTS DEFAULT OFF

Tests are turned off by default in config. Gee can enable them by setting flags to `true` in `tests/config/test-config.js`.

I don't run tests unless:
1. They're enabled in config, OR
2. Gee explicitly asks me to run them

---

*"Tests prove it works. But only when Gee wants them."* 🖤💀
