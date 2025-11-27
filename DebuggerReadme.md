# 🖤 DEBUGGER README - The Secret Arts of Game Manipulation 🖤
## Medieval Trading Game - Debug Console Documentation

**Version:** 0.7
**Last Updated:** 2025-11-27
**Access:** Unlocked via "Super Hacker" achievement OR backtick key (`)

---

> *"Every developer needs a backdoor. This is yours."* - Unity AI Lab

---

## TABLE OF CONTENTS

1. [Unlocking the Debug Console](#unlocking-the-debug-console)
2. [Opening the Console](#opening-the-console)
3. [Command Reference](#command-reference)
4. [Gold & Economy Commands](#gold--economy-commands)
5. [Travel & Location Commands](#travel--location-commands)
6. [Time & Weather Commands](#time--weather-commands)
7. [Achievement Commands](#achievement-commands)
8. [Quest Commands](#quest-commands)
9. [Item & Inventory Commands](#item--inventory-commands)
10. [NPC & Encounter Commands](#npc--encounter-commands)
11. [Player Stats Commands](#player-stats-commands)
12. [System Commands](#system-commands)
13. [Easter Eggs](#easter-eggs)

---

## UNLOCKING THE DEBUG CONSOLE

The debug console is hidden by default. There are two ways to unlock it:

### Method 1: Achievement Unlock (Legitimate)
Earn the **"Super Hacker"** ULTRA achievement by unlocking ALL other achievements (including the 11 hidden ones). This is the intended way to access debug mode.

### Method 2: Direct Access (Developer Mode)
Press the **backtick key (`)** at any time to open the debug console directly. This bypasses the achievement requirement.

---

## OPENING THE CONSOLE

Once unlocked, you can open the debug console by:

1. **Pressing backtick (`)** - Opens/focuses the command input
2. **Clicking the 🐛 Debooger button** in the panels panel (if visible)
3. **Using keyboard shortcut** - Backtick always works

The console appears as a dark overlay with:
- Command input field at the bottom
- Output log showing previous commands and results
- Auto-scroll to most recent output
- Max 500 entries before cleanup

---

## COMMAND REFERENCE

### Quick Reference Table

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Show all commands | `help` |
| `geecashnow` | Add 1000 gold | `geecashnow` |
| `gold <amount>` | Set gold to amount | `gold 5000` |
| `addgold <amount>` | Add gold | `addgold 500` |
| `teleport <location>` | Instant travel | `teleport capital` |
| `time <hours>` | Advance time | `time 24` |
| `weather <type>` | Change weather | `weather storm` |
| `unlock <achievement>` | Unlock achievement | `unlock first_steps` |
| `quest <action> <id>` | Quest manipulation | `quest complete main_prologue` |
| `spawn <item> <qty>` | Add items | `spawn iron_sword 1` |
| `encounter` | Trigger encounter | `encounter` |
| `heal` | Full heal | `heal` |
| `god` | Toggle god mode | `god` |
| `clear` | Clear console | `clear` |

---

## GOLD & ECONOMY COMMANDS

### geecashnow
The classic cheat code. Adds 1000 gold (respects carry weight).
```
> geecashnow
💰 Added 1000 gold! Total: 1100
```

### gold <amount>
Sets your gold to an exact amount.
```
> gold 10000
💰 Gold set to 10000
```

### addgold <amount>
Adds (or removes with negative) gold from your inventory.
```
> addgold 500
💰 Added 500 gold! Total: 1500

> addgold -200
💰 Removed 200 gold! Total: 1300
```

### bankrupt
Sets gold to -999 (one step from game over).
```
> bankrupt
💀 You're now at -999 gold. One more misstep and it's jail time...
```

### richbitch
Sets gold to 1,000,000 (instant Royal Merchant status).
```
> richbitch
👑 1,000,000 gold! You're basically royalty now.
```

---

## TRAVEL & LOCATION COMMANDS

### teleport <location_id>
Instantly travel to any location without time passing or stamina cost.
```
> teleport capital
🗺️ Teleported to The Royal Capital

> teleport greendale
🗺️ Teleported to Greendale Village
```

**Valid Location IDs:**
- `capital` - The Royal Capital
- `greendale` - Greendale Village
- `ironhaven` - Ironhaven Fortress
- `jade_harbor` - Jade Harbor
- `mistwood` - Mistwood Forest
- `dragons_peak` - Dragon's Peak
- `frozen_north` - Frozen North
- And 20+ more (use `locations` to see all)

### locations
Lists all available location IDs.
```
> locations
📍 Available locations:
  - capital (The Royal Capital)
  - greendale (Greendale Village)
  - ironhaven (Ironhaven Fortress)
  ...
```

### unlock_gates
Unlocks all gatehouses without paying fees.
```
> unlock_gates
🚪 All gatehouses unlocked! Travel freely, you magnificent bastard.
```

### explore_all
Marks all locations as discovered on the map.
```
> explore_all
🗺️ All locations revealed! The map holds no more secrets.
```

---

## TIME & WEATHER COMMANDS

### time <hours>
Advances game time by specified hours.
```
> time 24
⏰ Advanced time by 24 hours. It's now Day 2, 08:00

> time 168
⏰ Advanced time by 168 hours. It's now Day 8, 08:00
```

### settime <hour>
Sets the current hour (0-23).
```
> settime 12
⏰ Time set to 12:00 (Noon)

> settime 0
⏰ Time set to 00:00 (Midnight)
```

### weather <type>
Changes the current weather immediately.
```
> weather storm
🌧️ Weather changed to: Thunderstorm

> weather clear
☀️ Weather changed to: Clear Skies

> weather snow
❄️ Weather changed to: Heavy Snow
```

**Valid Weather Types:**
- `clear` - Clear skies
- `cloudy` - Overcast
- `rain` - Light rain
- `storm` - Thunderstorm
- `snow` - Snowfall
- `blizzard` - Heavy blizzard
- `fog` - Dense fog

### season <name>
Changes the current season (affects weather probabilities).
```
> season winter
❄️ Season changed to Winter

> season summer
☀️ Season changed to Summer
```

---

## ACHIEVEMENT COMMANDS

### unlock <achievement_id>
Unlocks a specific achievement.
```
> unlock first_steps
🏆 Unlocked: First Steps - Begin your trading journey
```

### unlock_all
Unlocks ALL achievements (including hidden ones).
```
> unlock_all
🏆 All 72 achievements unlocked! You absolute legend.
```

### reset_achievements
Resets all achievement progress (cannot be undone!).
```
> reset_achievements
⚠️ All achievements reset. Starting fresh...
```

### achievements
Lists all achievements and their status.
```
> achievements
🏆 Achievements: 45/72 unlocked
  [x] First Steps
  [x] Pocket Change
  [ ] Road Warrior
  ...
```

---

## QUEST COMMANDS

### quest list
Shows all quests and their status.
```
> quest list
📜 Active Quests:
  - main_prologue: A New Beginning (In Progress)
  - greendale_herbs: Herb Gathering (Ready to Complete)

📜 Completed Quests:
  - tutorial_welcome: Welcome to the Game
```

### quest start <quest_id>
Starts a specific quest.
```
> quest start main_prologue
📜 Quest started: A New Beginning
```

### quest complete <quest_id>
Instantly completes a quest (grants rewards).
```
> quest complete greendale_herbs
📜 Quest completed: Herb Gathering
💰 Reward: 150 gold, 50 XP
```

### quest fail <quest_id>
Marks a quest as failed.
```
> quest fail main_shadow_key
📜 Quest failed: The Shadow Key
```

### quest reset
Resets ALL quest progress (dangerous!).
```
> quest reset
⚠️ All quest progress reset!
```

---

## ITEM & INVENTORY COMMANDS

### spawn <item_id> [quantity]
Adds items to your inventory.
```
> spawn iron_sword 1
📦 Added 1x Iron Sword to inventory

> spawn bread 50
📦 Added 50x Bread to inventory

> spawn gold_bar 10
📦 Added 10x Gold Bar to inventory
```

### items
Lists all valid item IDs.
```
> items
📦 Available items (177 total):
  Resources: wood, stone, iron_ore, copper_ore, coal...
  Food: bread, meat, cheese, fish, vegetables...
  Weapons: iron_sword, steel_sword, bow, crossbow...
  ...
```

### clear_inventory
Removes ALL items from inventory (keeps gold).
```
> clear_inventory
📦 Inventory cleared! Hope you didn't need that stuff.
```

### fill_inventory
Fills inventory with one of each item type.
```
> fill_inventory
📦 Inventory filled with sample items!
```

---

## NPC & ENCOUNTER COMMANDS

### encounter
Triggers a random encounter immediately.
```
> encounter
🎭 Random encounter triggered!
  Type: Wandering Merchant
  Name: Marcus the Trader
```

### trader
Spawns a random trader encounter.
```
> trader
🎭 Spawned trader encounter: Elena the Peddler
```

### spawn_npc <type>
Spawns a specific NPC type at current location.
```
> spawn_npc merchant
👤 Spawned: Merchant NPC

> spawn_npc bandit
👤 Spawned: Bandit NPC (hostile)
```

**Valid NPC Types:**
- `merchant`, `blacksmith`, `innkeeper`, `guard`
- `bandit`, `thief`, `traveler`, `pilgrim`
- `noble`, `peasant`, `courier`, `smuggler`

---

## PLAYER STATS COMMANDS

### heal
Fully restores health, hunger, thirst, and energy.
```
> heal
💚 Fully healed! Health, hunger, thirst, energy all maxed.
```

### god
Toggles god mode (invincibility, infinite stamina).
```
> god
⚡ God mode ENABLED - You are immortal!

> god
⚡ God mode DISABLED - Back to being mortal.
```

### stats
Shows current player stats.
```
> stats
📊 Player Stats:
  Health: 85/100
  Hunger: 60/100
  Thirst: 45/100
  Energy: 70/100
  Gold: 1,500
  Carry Weight: 45/100
```

### setstats <stat> <value>
Sets a specific stat value.
```
> setstats health 100
💚 Health set to 100

> setstats strength 10
💪 Strength set to 10
```

### level <amount>
Adds experience/levels.
```
> level 5
⬆️ Added 5 levels! Now level 6.
```

---

## SYSTEM COMMANDS

### help
Shows all available commands.
```
> help
📋 Debug Commands:
  geecashnow - Add 1000 gold
  gold <amount> - Set gold
  ...
```

### clear
Clears the debug console output.
```
> clear
(Console cleared)
```

### save
Forces an immediate save.
```
> save
💾 Game saved!
```

### load
Opens the load game dialog.
```
> load
💾 Opening load dialog...
```

### reset
Resets the ENTIRE game to fresh state (DANGEROUS!).
```
> reset
⚠️ Are you sure? Type 'reset confirm' to proceed.

> reset confirm
💀 Game reset to initial state.
```

### fps
Shows current FPS and performance stats.
```
> fps
📊 FPS: 60 | Memory: 45MB | Listeners: 234
```

### reload
Reloads the page (same as F5).
```
> reload
🔄 Reloading...
```

---

## EASTER EGGS

### Secret Commands

These hidden commands exist for the truly dedicated:

| Command | Effect |
|---------|--------|
| `iddqd` | Classic DOOM god mode reference |
| `idkfa` | Classic DOOM all weapons reference |
| `konami` | ↑↑↓↓←→←→BA - Something special |
| `matrix` | "There is no spoon" - Visual effect |
| `unity` | Shows a special message from the devs |
| `42` | The answer to everything |
| `xyzzy` | Classic adventure game reference |

### Developer Messages

Type these for fun responses:
- `hello` - Unity says hi
- `bye` - Unity says goodbye
- `love` - Unity appreciates you
- `hate` - Unity is hurt
- `coffee` - Unity needs caffeine

---

## TROUBLESHOOTING

### Console Not Opening?
1. Make sure you're not in a text input field
2. Try clicking somewhere on the game first
3. Press backtick (`) - it's next to the 1 key
4. Check if "Super Hacker" achievement is unlocked

### Command Not Working?
1. Check spelling (commands are case-insensitive)
2. Make sure you have the right number of arguments
3. Check if the ID exists (use `items`, `locations`, etc.)
4. Some commands require confirmation

### Game Broke After Debug?
1. Try `heal` to restore stats
2. Use `save` then `reload`
3. Worst case: `reset confirm` (loses ALL progress)

---

## NOTES FOR DEVELOPERS

### Adding New Commands

Commands are defined in `src/js/debug/debug-command-system.js`:

```javascript
this.registerCommand('mycommand', 'Description here', (args) => {
    // Command logic
    return '✨ Command executed!';
});
```

### Debug Console Files

| File | Purpose |
|------|---------|
| `debug-system.js` | Console UI and output capture |
| `debug-command-system.js` | Command registration and execution |
| `debug-overlay.js` | Visual overlay components |

### Console Log Capture

All `console.log`, `console.warn`, and `console.error` calls are captured and displayed in the debug console with timestamps.

---

## DISCLAIMER

Using debug commands may:
- Break achievement progression
- Corrupt save files (rare)
- Make the game too easy
- Spoil the intended experience

**Use responsibly!** Or don't. We're not your parents. 🖤

---

*"With great power comes great responsibility... but also the ability to spawn 1000 gold bars."* - Unity AI Lab

---

**Files Referenced:**
- `src/js/debug/debug-system.js`
- `src/js/debug/debug-command-system.js`
- `src/js/core/debug-system.js`

**See Also:**
- [GameplayReadme.md](GameplayReadme.md) - Full game documentation
- [NerdReadme.md](NerdReadme.md) - Developer documentation
- [todo.md](todo.md) - Current development tasks
