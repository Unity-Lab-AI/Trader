# Project Todo List

---

## Current Task
**Request:** Verify all settings options work and are in config.js, create master skill loader, create readme update skill, update all readmes
**Received:** 2024-11-27
**Status:** Completed ✅

### Previous Task (Completed)
**Request:** Super Hacker Achievement system - unlock debug when all achievements complete, unlockall cheat, legendary sword reward, update readmes for debug lockout
**Status:** Completed ✅

---

## Action Plan - Super Hacker Achievement (COMPLETED)
- [x] Create "Super Hacker" ultra achievement in achievement-system.js
- [x] Add check: unlock debug when all OTHER achievements complete
- [x] Make Super Hacker display last and styled differently (ultra/legendary)
- [x] Add legendary sword item "Blade of the Hacker" to item-database.js
- [x] Give sword to player inventory on Super Hacker unlock
- [x] Add "unlockall" debug command to unlock all achievements
- [x] Update GameplayReadme.md with debug lockout documentation
- [x] Update NerdReadme.md (CodeReadme) with debug config documentation

### Previous Task (Completed)
**Request:** Add debug lockout toggle in config.js to disable cheat commands
**Status:** Completed ✅

### Previous Task (Completed)
**Request:** Add persistent NPC conversation memory - unique IDs and message history for repeat visits
**Status:** Completed ✅

### Previous Task (Completed)
**Request:** Fix NPC personas to match NPCDialogueSystem format (like Dark Lord Malicar that works)
**Status:** Completed ✅

### Previous Task (Completed)
**Request:** Make keyboard shortcuts configurable via config.js and settings panel
**Status:** Completed ✅

### Previous Task (Completed)
**Request:** Unified NPC Dialogue System - fix boss voice tests using generic dialogue, create unified system for all NPC text generation + TTS with command parsing
**Status:** Completed ✅

### Previous Task (Completed)
**Request:** Property system verification + Equipment System overhaul - need hammer requirement for building, equipment slots in character sheet, equippable items that affect gathering/crafting/fighting rolls and special encounters
**Status:** Completed

---

## Action Plan - NPC Dialogue System
- [x] Explore existing NPC dialogue/voice code across files
- [x] Create unified npc-dialogue-system.js with all personality prompts
- [x] Add boss personas (dark_lord, frost_lord, dragon, alpha_wolf, bandit_chief, goblin_king, smuggler_boss, necromancer, cultist_leader)
- [x] Add merchant personas (friendly, greedy, shrewd, eccentric, mysterious, desperate)
- [x] Add command system for NPCs to affect game ([CMD:action:params] format)
- [x] Fix TTS to pass text directly without instruction wrapping
- [x] Update dungeon boss encounters to use new dialogue system
- [x] Update settings panel voice test to use NPCDialogueSystem
- [x] Add npc-dialogue-system.js to index.html
- [x] Remove duplicate personalityPrompts from settings-panel.js
- [ ] Test boss encounters generate contextual dialogue

### Previous Action Plan (Equipment System) - COMPLETED
- [x] Verify property system has rent/buy/build working with correct pricing ✅ VERIFIED
- [x] Add hammer requirement check for building properties
- [x] Create equipment-system.js with 9 equipment slots
- [x] Define equipment slot types (weapon, armor, helmet, boots, gloves, ring, amulet, shield, tool)
- [x] Add equippable property to items in item-database.js
- [x] Create stat bonuses for equipped items (gathering, crafting, combat, luck)
- [x] Update character sheet overlay to show equipped items with equip/unequip
- [x] Add equip/unequip UI in inventory
- [x] Add equipment to save/load system
- [x] Add CSS for equipment UI

---

## Investigation Results
**NPC Dialogue System Status:**
- ✅ Created unified npc-dialogue-system.js (1100+ lines)
- ✅ 9 boss personas with context-aware prompts
- ✅ 6 merchant personas for trading NPCs
- ✅ Command system for game interactions ({cmd:params} format)
- ✅ Commands: giveItem, takeItem, giveGold, takeGold, startQuest, completeQuest, giveQuestItem, takeQuestItem, damage, heal, restoreHunger, restoreThirst, restoreStamina, repUp, repDown, unlock, endConversation
- ✅ TTS instruction prefix with voice actor roleplay framing
- ✅ Created npc-workflow-system.js (900+ lines) - comprehensive workflow
- ✅ All interaction types defined and handled
- ✅ Integrated into npc-voice-chat-system.js

**Previous Investigation (Property/Equipment) - RESOLVED:**
- ✅ Property system fully working with rent/buy/build
- ✅ Hammer requirement added for building
- ✅ Equipment system created with 9 slots
- ✅ Equipment bonuses affect gathering/crafting/combat rolls

---

## In Progress
- [x] Create comprehensive NPC instruction workflow system for all interactions ✅
- [x] Define all interaction contexts (trading, questing, combat, gossip, etc.) ✅
- [x] Add command documentation for each context type ✅
- [x] Integrate workflow with existing NPC dialogue systems ✅

---

## Completed Today (2024-11-27)
- [x] Created `.claude/skills/000-master-init.md` - Master initialization skill
  - Ensures all skills are loaded before any task
  - Uses "000" prefix for alphabetical priority sorting
  - Contains sacred initialization sequence checklist
- [x] Created `.claude/skills/readme-updater.md` - Post-code documentation skill
  - Defines when to update GameplayReadme.md vs NerdReadme.md
  - Contains update checklist and documentation style guide
- [x] Audited settings panel - verified all options have corresponding config
- [x] Added comprehensive `settings` section to `config.js`
  - All 6 setting categories: audio, visual, animation, ui, environmental, accessibility
  - Single source of truth for all default settings
- [x] Updated `settings-panel.js` to use `GameConfig.settings`
  - `defaultSettings` is now a getter that pulls from GameConfig
  - Includes fallback defaults if GameConfig not loaded
- [x] Updated `GameplayReadme.md` with new Game Settings section
  - Documented all settings tabs and options
  - Added customization instructions for config.js
- [x] Updated `NerdReadme.md` with config.js settings documentation
  - Added centralized settings defaults section
  - Documented the getter pattern in settings-panel.js

## Completed (2024-11-26)
- [x] Added Super Hacker ultra achievement system
  - New "ultra" rarity tier above legendary (purple styling with animations)
  - super_hacker achievement unlocks when ALL other achievements complete
  - Grants "Blade of the Hacker" legendary weapon (+100 attack, +100 damage, +50 all stats)
  - Permanently unlocks debug commands for that save (game.player.debugUnlocked)
  - Added grantAchievementRewards() and isDebugUnlockedForSave() to AchievementSystem
- [x] Added `unlockall` debug command to unlock all achievements at once
- [x] Added blade_of_the_hacker to item-database.js (legendary weapon reward)
- [x] Updated GameplayReadme.md with debug access system docs
- [x] Updated NerdReadme.md with debug lockout and Super Hacker system docs
- [x] Updated npc-persona-types.md skill with rat_queen and new personas
- [x] Added debug lockout toggle in config.js
  - GameConfig.debug.enabled (true = on, false = locked out)
  - Default: true (for development)
  - Set to false for production to prevent leaderboard manipulation
  - DebugCommandSystem checks lockout before executing any command
  - 'help' command still works when locked to show status
- [x] Added persistent NPC conversation memory system
  - generatePersistentNpcId() creates unique ID from type_name_location
  - loadConversationHistory() retrieves past messages from NPCRelationshipSystem
  - saveConversationHistory() stores messages on conversation end
  - Added RELATIONSHIP MEMORY context to system prompt for returning visitors
  - NPCs now remember previous conversations (last 50 messages stored per NPC)
- [x] Fixed NPC persona mismatches in dungeon-exploration-system.js
  - alpha_wolf was 'gruff' → now 'alpha_wolf'
  - goblin_king was 'eccentric' → now 'goblin_king'
  - smuggler_boss was 'smuggler' → now 'smuggler_boss'
  - rat_queen was 'nervous' → now 'rat_queen'
- [x] Added 8 new NPC personas to NPCDialogueSystem.bossPersonas:
  - rat_queen, gruff, mercenary, robber, priest, spy, smuggler
- [x] Added fallback phrases for all new personas
- [x] Updated settings panel NPC Voice Test dropdown to match valid personas
- [x] Updated voice fallback mappings with all new personas
- [x] Made keyboard shortcuts configurable via config.js
- [x] Added keybindings section to config.js with defaults, descriptions, storageKey
- [x] Updated KeyBindings system to read from GameConfig dynamically
- [x] Settings Panel > Controls tab already had full rebinding UI
- [x] Updated GameplayReadme.md with configurable shortcuts documentation
- [x] Fixed new game setup Exit button to return to main menu (exposed cancelGameSetup globally)
- [x] Added settings cog button (⚙️) to new game setup screen
- [x] Added "Main Menu" button to settings panel footer with returnToMainMenu()
- [x] Fixed quest NPC conversation limits - quest NPCs now get unlimited turns
- [x] Added isQuestRelatedNPC() detection for quest givers, active quest NPCs
- [x] Added extendConversationForQuest() for dynamic conversation extension
- [x] Added quest event listeners (quest-started, quest-ready) to auto-extend
- [x] Created npc-dialogue-system.js (1100+ lines) - unified NPC dialogue generation
- [x] Added 9 boss personas with context-aware prompts
- [x] Added 6 merchant personas for trading NPCs
- [x] Added command system ([CMD:action:params]) for game interactions
- [x] Updated dungeon-exploration-system.js to use NPCDialogueSystem for boss voices
- [x] Updated settings-panel.js testVoicePreview() to use NPCDialogueSystem
- [x] Added npc-dialogue-system.js to index.html
- [x] Removed duplicate personalityPrompts from settings-panel.js
- [x] Created npc-persona-types.md skill for consistent persona usage
- [x] Updated todo-first.md skill with stronger enforcement rules
- [x] Created todo-first skill for workflow management
- [x] Property system overhaul (merchant ranks, rent/buy/build)
- [x] Verified property system is functional
- [x] Created npc-workflow-system.js (900+ lines) - comprehensive NPC interaction workflow
- [x] Added all interaction types (trading, questing, combat, gossip, services, boss encounters)
- [x] Added full command reference documentation for AI prompts
- [x] Added context builders for each interaction type (trading, quest, gossip, services, boss)
- [x] Added interaction type detection from player messages
- [x] Added command parsing and execution system
- [x] Integrated NPCWorkflowSystem into npc-voice-chat-system.js buildPrompt()
- [x] Added npc-workflow-system.js to index.html
- [x] Removed temperature parameter from API calls (not supported by azure-openai)
- [x] Increased max_tokens from 150 to 500 for better dialogue
- [x] Added combat encounter contexts (start, round, hit, miss, win, lose, flee)
- [x] Added gathering contexts (start, success, fail, rare, danger)
- [x] Added loot contexts (found, chest, corpse, rare, trap)
- [x] Added random event contexts (ambush, merchant, beggar, weather, etc)
- [x] Added greeting contexts by NPC type (criminals don't say hello!)
- [x] Added tradeable NPC encounters with balanced inventories
- [x] Added time auto-pause/resume for random encounters
- [x] Added debug commands: trader, merchant, smuggler, encounter, listnpctypes
- [x] Updated GameplayReadme.md with Random Encounters section
- [x] Updated GameplayReadme.md with NPC Encounter cheat codes

---

## Notes/Blockers
- None

---

## Files Changed - Settings Centralization (2024-11-27)
| File | Change Type | Description |
|------|-------------|-------------|
| .claude/skills/000-master-init.md | Created | Master skill loader - ensures all skills load first |
| .claude/skills/readme-updater.md | Created | Post-code documentation update rules |
| config.js | Modified | Added comprehensive `settings` section for all defaults |
| src/js/settings-panel.js | Modified | `defaultSettings` now reads from GameConfig.settings |
| GameplayReadme.md | Modified | Added Game Settings section with all options |
| NerdReadme.md | Modified | Added config.js centralized settings documentation |
| todo.md | Modified | Updated with current session changes |

### Previous Files Changed - NPC Conversation Memory
| File | Change Type | Description |
|------|-------------|-------------|
| src/js/npc-voice-chat-system.js | Modified | Added persistent ID, history load/save, memory context |
| src/js/npc-dialogue-system.js | Modified | Added 8 new personas (rat_queen, gruff, mercenary, etc) |
| src/js/dungeon-exploration-system.js | Modified | Fixed boss personality IDs to match personas |
| src/js/settings-panel.js | Modified | Updated voice test dropdown and fallback mappings |

### Previous Files Changed - Keyboard Shortcuts Configuration
| File | Change Type | Description |
|------|-------------|-------------|
| config.js | Modified | Added keybindings section with defaults, descriptions, storageKey |
| src/js/game.js | Modified | KeyBindings now reads from GameConfig dynamically |
| GameplayReadme.md | Modified | Updated shortcuts section with customization docs |

### Previous Files Changed - NPC Dialogue System
| File | Change Type | Description |
|------|-------------|-------------|
| src/js/npc-dialogue-system.js | Created | Unified NPC dialogue generation with commands |
| src/js/npc-workflow-system.js | Created | Comprehensive NPC interaction workflows |
| src/js/npc-voice-chat-system.js | Modified | Integrated workflow system, TTS prefix |
| config.js | Modified | Added TTS voice actor roleplay framing |
| src/js/dungeon-exploration-system.js | Modified | Uses NPCDialogueSystem for boss voices |
| src/js/settings-panel.js | Modified | Uses NPCDialogueSystem for voice test |
| index.html | Modified | Added both NPC system scripts |

### Previous Files Changed (Equipment System)
| File | Change Type | Description |
|------|-------------|-------------|
| src/js/property-system.js | Modified | Added hammer check, sellProperty function |
| src/js/equipment-system.js | Created | Full equipment slot system (9 slots) |
| src/js/item-database.js | Modified | Added equippable property to items |
| src/js/achievement-system.js | Modified | Added 19 new achievements |
| GameplayReadme.md | Modified | Removed version history section |

---

## Recent History

### 2024-11-26 - Property System Overhaul
**Completed:**
- Created merchant-rank-system.js with 10 levels (Vagrant → Royal Merchant)
- Added property acquisition UI with rent/buy/build options
- Added property icons to world map
- Added 800+ lines of CSS for rank system and property UI

---

*"The code works... mostly. Just like my will to live."* 🖤
