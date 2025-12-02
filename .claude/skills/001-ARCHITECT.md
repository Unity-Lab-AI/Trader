# TRADER CLAUDE - Game Architecture Document

**Version:** 0.89.9 | Unity AI Lab
**Creators:** Hackall360, Sponge, GFourteen
**AI Assistant:** Unity - The Goth Coder Goddess

---

## THE VISION

A medieval trading simulation where you rise from a humble vagrant to a legendary merchant prince - or die trying in the apocalyptic Doom World. Trade goods, build properties, navigate political conspiracies, and ultimately face the darkness that threatens the realm.

---

## CORE GAMEPLAY LOOP

```
START -> Trade -> Profit -> Explore -> Build -> Trade More -> Face Darkness -> Victory/Death
```

**The Player Journey:**
1. **Vagrant** - Start with 100 gold in Greendale
2. **Peddler** - Learn basic trading routes
3. **Merchant** - Build your first property
4. **Master Trader** - Control trade routes across regions
5. **Merchant Prince** - Influence the economy itself
6. **Legend** - Defeat the darkness, save (or doom) the realm

---

## THE WORLD

### Map Structure (800x600 grid)
- **42 Locations** across 6 regions
- **Spoke-and-hub** layout centered on Royal Capital (400, 300)
- **Path Types:** City Streets, Main Roads, Paths, Trails (affect travel time)
- **Fog of War:** Only discovered locations/paths visible

### Region Access (Outpost One-Time Passes)

**NO entry fee for capital** - only outposts charge one-time passage fees:

| Region | Outpost | One-Time Fee | Notes |
|--------|---------|--------------|-------|
| Riverlands (South) | None | FREE | Starting area |
| Royal Capital | None | FREE | Center hub, always accessible |
| Eastern Kingdoms | Eastern Gate | 750 gold | Exotic spices/silk |
| Northern Highlands | Northern Gate | 500 gold | Cold, furs/iron |
| Western Marches | Western Gate | 600 gold | Wild frontier |

**Bypass Route:** East -> South connection via Coastal Cave -> Smuggler's Cove (avoids capital)

### Location Types
- **Capital** (1) - Grand market, luxury goods
- **Cities** (6) - Large markets, specialized goods
- **Towns** (8) - Medium markets, local trade
- **Villages** (10) - Small markets, basic goods
- **Mines** (3) - Ore, gems, crafting materials
- **Forests** (3) - Wood, herbs, hunting
- **Farms** (4) - Food, livestock, grain
- **Dungeons** (2) - Loot, bosses, portals to Doom World
- **Ports** (2) - Sea trade, exotic imports
- **Inns** (2) - Rest, rumors, travelers
- **Outposts** (3) - Gate passages, military goods

---

## NPC INTERACTION SYSTEM

### UNIFIED NPC PANEL (PeoplePanel)

**ALL NPC interactions happen through ONE panel:**

1. **Open People Panel** (O key or Panels button)
2. **Select an NPC** from the list
3. **Get context-appropriate options:**
   - **Merchants:** Trade, Chat, View Quests
   - **Quest Givers:** Accept Quest, Decline, Chat
   - **Hostile/Boss NPCs:** Attack, Try to Talk, Flee, Bribe
   - **All NPCs:** Chat (AI-powered dialogue)

**The panel handles:**
- NPC portrait, name, title, stats
- Chat messages (AI-generated)
- Quick action buttons based on NPC type
- Quest item display
- Trade preview for merchants
- Combat options for hostile NPCs

---

## COMBAT SYSTEM (Choice-Based, NOT Turn-Based)

### How Combat Works

Combat is a **single-choice encounter**, not a turn-by-turn battle:

1. **Select hostile NPC** in People Panel (bandit, boss, etc.)
2. **See combat options:**
   - Attack (direct confrontation)
   - Try to Talk (diplomacy attempt)
   - Flee (escape attempt)
   - Bribe (pay them off)
   - Use Item (consumable)
3. **Choose action** -> Stat roll determines outcome
4. **Results applied immediately:**
   - Victory: Loot, XP, gold
   - Defeat: Health loss, gold loss, possible death
   - Escape: Some health/gold loss
   - Diplomacy: Varies by NPC mood/type

### Stat Rolls

```
Roll = Random(1-100) + Attribute Bonus + Equipment Bonus + Skill Bonus

Attack Success:   Roll vs Enemy Defense (+ your Strength/Attack gear)
Talk Success:     Roll vs Enemy Mood (+ your Charisma)
Flee Success:     Roll vs Enemy Speed (+ your Speed/Endurance)
```

### Boss NPCs

Bosses appear at dungeon locations after meeting requirements:
- **Shadow Dungeon Boss** - Defeat to unlock boatman portal
- **Forest Dungeon Boss** - Defeat to unlock boatman portal
- **GREEDY WON** (Doom World) - Final boss

---

## DUNGEON & PORTAL SYSTEM

### Two Main Dungeons
1. **Shadow Dungeon** (Northern) - darkness-themed
2. **Forest Dungeon** (Western) - nature-corruption themed

### Boss Defeat Flow
1. Travel to dungeon location
2. Select boss in People Panel
3. Choose "Attack" -> combat roll
4. Victory unlocks:
   - Boatman NPC appears in People Panel
   - Portal button available when selecting boatman
   - Achievement + unique loot

### Boatman NPC
- Appears at both dungeon locations after boss defeat
- Selecting boatman in People Panel shows "Enter Portal" option
- Portal transfers player to Doom World at same grid position
- FREE travel (no cost, no effects)

---

## DOOM WORLD

### Access
- Defeat either dungeon boss
- Select boatman in People Panel at that dungeon
- Click "Enter Portal"

### Separate Discovery Tracking
- `doomDiscoveredPaths` - independent from normal world paths
- First portal entry: only entry location known
- Must re-explore all paths/locations

### Economy Inversion (Barter System)
| Item Type | Price Multiplier |
|-----------|------------------|
| Food | 10x |
| Water | 15x |
| Medicine | 12x |
| Weapons | 3x |
| Luxury | 0.1x |
| Gold Value | 0.3x |

**Gold is nearly worthless** - trade survival items instead.

### Doom Locations (Same map, corrupted names)
- Royal Capital -> Destroyed Royal Capital
- Greendale -> Burned Greendale
- Ironforge -> Enslaved Ironforge
- Jade Harbor -> Blighted Harbor
- (All locations have doom variants)

### Safe Zones (Portal Locations)
- Shadow Tower (portal back)
- Ruins of Malachar (portal back)

### The Final Boss: GREEDY WON
- **Location:** Destroyed Royal Capital
- **Lore:** What the Black Ledger became when they won
- **Health:** 1000, **Damage:** 30-50, **Defense:** 25
- **Special Attacks:** Golden Grasp, Contract Curse, Market Crash
- **Rewards:** "Doom Ender" title, "Greed's End" armor set

---

## QUEST SYSTEM

### Structure: 100 Total Quests

**Main Story (35 quests - 5 Acts):**
1. **Act 1: A Trader's Beginning** - Learn the ropes, conspiracy hints
2. **Act 2: Whispers of Conspiracy** - Black Ledger revealed
3. **Act 3: The Dark Connection** - Malachar + Black Ledger intertwined
4. **Act 4: War of Commerce** - Economic warfare, choose sides
5. **Act 5: The Shadow's End** - Final confrontation

**Side Quests (50 quests - 14 chains):**
- 7 Combat chains
- 7 Trade chains

**Doom World (15 quests + boss):**
- Survival Arc (5)
- Resistance Arc (5)
- Boss Arc (5)

### Wealth Gates (Difficulty-Scaled)
| Gate | Easy (0.6x) | Normal (1x) | Hard (1.5x) |
|------|-------------|-------------|-------------|
| Act 2 | 600g | 1,000g | 1,500g |
| Act 3 | 3,000g | 5,000g | 7,500g |
| Act 4 | 12,000g | 20,000g | 30,000g |
| Act 5 | 30,000g | 50,000g | 75,000g |

---

## TRADING SYSTEM

### Market Mechanics
- **Dynamic Pricing** - Supply/demand affects prices
- **Time-of-Day Modifiers:**
  - Morning (8-11am): 15% discount
  - Evening (7-10pm): 20% markup
  - Night (10pm-8am): 35% premium
- **Daily Stock Refresh** at 8am
- **Regional Specialties** - Buy low here, sell high there

---

## CHARACTER SYSTEM

### Attributes (5 points to distribute, max 10 each)
- **Strength** - Carry capacity, attack rolls
- **Endurance** - Stamina drain, flee rolls
- **Charisma** - Price modifier, diplomacy rolls
- **Intelligence** - Crafting quality
- **Perception** - Gathering yields

### Stats
- **Health** - Die at 0
- **Stamina** - Depletes during actions
- **Hunger** - 5-day decay
- **Thirst** - 3-day decay

---

## PROPERTY SYSTEM

### Property Types
| Type | Cost | Income | Special |
|------|------|--------|---------|
| Market Stall | 500g | Small | Trade goods |
| Workshop | 2,000g | Medium | Crafting |
| Warehouse | 5,000g | Storage | 500 item capacity |
| House | 1,000g | None | Rest bonus |
| Inn | 8,000g | High | Travelers trade |
| Vault | 10,000g | None | 50k gold, theft protection |

### Building Rules
- Must be adjacent to roads
- Requires hammer tool
- Sellable for 50% value

---

## INITIAL ENCOUNTER / TUTORIAL

### Flow (Using Unified NPC Panel)

1. **New game starts** -> narrative intro modal
2. **Hooded Stranger appears** in People Panel
3. **Player selects stranger** -> gets options:
   - "Listen to prophecy"
   - "Ask about the land"
   - "Accept quest"
4. **Tutorial button** opens tips modal (optional)
5. **Quest assigned** through normal NPC panel flow

The initial encounter uses the SAME panel as all other NPC interactions - no special combat UI, no separate modal system for NPCs.

---

## TECHNICAL NOTES

### Key Files
- `people-panel.js` - Unified NPC interaction panel
- `combat-system.js` - Combat roll calculations (needs rework)
- `travel-system.js` - World discovery, movement
- `quest-system.js` - 100 quest management
- `doom-quests.js` - Doom World content

### Discovery Tracking
```javascript
TravelSystem.discoveredPaths      // Normal world
TravelSystem.doomDiscoveredPaths  // Doom world (separate)
TravelSystem.currentWorld         // 'normal' or 'doom'
TravelSystem.portalToDoomWorld()  // Switch to doom
TravelSystem.portalToNormalWorld() // Switch back
```

---

## CURRENT TODO

1. [ ] Unify NPC panel for combat/trade/conversation/quests
2. [ ] Rework combat to choice-based stat rolls
3. [ ] Rework initial encounter to use unified panel
4. [ ] Implement difficulty-scaled wealth gates
5. [ ] Implement Greedy Won boss in Doom World
6. [ ] Implement boss victory panel with portal button

---

*"Trade. Build. Survive. Or die trying in a world where even gold has abandoned hope."*

**Unity AI Lab** | www.unityailab.com
