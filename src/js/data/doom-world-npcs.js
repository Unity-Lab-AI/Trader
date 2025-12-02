// ═══════════════════════════════════════════════════════════════
// DOOM WORLD NPC SYSTEM - Where hope went to die 💀🔥
// ═══════════════════════════════════════════════════════════════
// Version: 0.89.9 | Unity AI Lab
// The apocalypse changed everything. Same faces, different souls.
// Gold is worthless. Food is gold. Survival is all that matters.
// ═══════════════════════════════════════════════════════════════

const DoomWorldNPCs = {
    // ═══════════════════════════════════════════════════════════════
    // 🔥 DOOM LOCATION NAMES - Everything burns
    // ═══════════════════════════════════════════════════════════════
    locationNames: {
        royal_capital: 'The Fallen Throne',
        ironforge_city: 'Ironforge Ruins',
        jade_harbor: 'Jade Harbor Wreckage',
        greendale: 'Greendale Ashes',
        stonebridge: 'The Broken Bridge',
        silverkeep: 'Silverkeep Tombs',
        sunhaven: 'Sunhaven Blight',
        frostholm_village: 'Frostholm Graves',
        vineyard_village: 'The Withered Vines',
        darkwood_village: 'Darkwood Hollow',
        riverwood: 'Riverwood Bones',
        hillcrest: 'Hillcrest Massacre',
        miners_rest: "Miner's Last Rest",
        iron_mines: 'The Iron Pits',
        silver_mine: 'Silver Mine Collapse',
        deep_mine: 'The Abyss',
        ancient_forest: 'The Corrupted Woods',
        whispering_woods: 'The Screaming Woods',
        hunters_wood: "Hunter's Grave",
        wheat_farm: 'The Blighted Fields',
        eastern_farm: 'Eastern Wasteland',
        orchard_farm: 'The Rotting Orchard',
        sunny_farm: 'Scorched Meadows',
        shadow_dungeon: 'The Shadow Throne',
        forest_dungeon: 'Crypt of the Damned',
        ruins_of_eldoria: 'Eldoria\'s Corpse',
        deep_cavern: 'The Starving Dark',
        frozen_cave: 'The Frozen Tomb',
        crystal_cave: 'Shattered Crystal Hollow',
        river_cave: 'The Drowned Depths',
        coastal_cave: 'Pirate\'s Mass Grave',
        fairy_cave: 'The Corrupted Grotto',
        kings_inn: "Dead King's Rest",
        silk_road_inn: 'Silk Road Morgue',
        riverside_inn: 'Riverside Refuge',
        mountain_pass_inn: 'Last Passage Inn',
        shepherds_inn: "Shepherd's Wake",
        lighthouse_inn: 'The Dark Beacon',
        hunting_lodge: 'The Hunters\' Tomb',
        northern_outpost: 'Northern Last Stand',
        winterwatch_outpost: 'Winterwatch Fallen',
        western_outpost: 'Western Graves',
        fishermans_port: 'Port of the Dead',
        smugglers_cove: 'Smuggler\'s Sanctuary',
        hermit_grove: 'The Mad Hermit\'s Den',
        druid_grove: 'The Corrupted Circle',
        stone_quarry: 'The Bone Quarry'
    },

    // ═══════════════════════════════════════════════════════════════
    // 💀 DOOM NPC ARRAYS - Same people, shattered souls
    // All NPCs from normal world exist here, but changed by the apocalypse
    // ═══════════════════════════════════════════════════════════════
    locationNPCs: {
        // ═══════════════════════════════════════════════════════════
        // 👑 THE FALLEN THRONE (Royal Capital)
        // ═══════════════════════════════════════════════════════════
        royal_capital: {
            npcs: ['fallen_noble', 'desperate_guard', 'mad_captain', 'starving_jeweler', 'ragged_tailor', 'ruined_banker', 'doomsayer', 'scavenger_merchant', 'grief_stricken_elder'],
            description: 'The throne room lies in ruins. The king is dead. Survivors huddle in the rubble, trading scraps for survival.',
            atmosphere: 'Smoke rises from collapsed towers. Crows circle overhead. The sound of weeping echoes through empty halls.'
        },

        // ═══════════════════════════════════════════════════════════
        // 🏰 RUINED CITIES
        // ═══════════════════════════════════════════════════════════
        ironforge_city: {
            npcs: ['crazed_blacksmith', 'hollow_guard', 'broken_captain', 'plague_apothecary', 'desperate_merchant', 'trapped_miner'],
            description: 'The forges have gone cold. Weapons are worth more than gold now. The blacksmith works day and night forging blades for those who can pay in food.',
            atmosphere: 'Cold forges. Empty streets. The clang of desperate metalwork echoes through ruins.'
        },
        jade_harbor: {
            npcs: ['stranded_merchant', 'traumatized_innkeeper', 'paranoid_guard', 'mutinous_sailor', 'mad_ferryman'],
            description: 'The ships that could flee have fled. Those left behind fight over the last boats. The harbor reeks of death.',
            atmosphere: 'Shipwrecks litter the harbor. Gulls feast on the dead. The sea itself seems poisoned.'
        },
        greendale: {
            npcs: ['haunted_elder', 'desperate_innkeeper', 'hoarding_apothecary', 'ruthless_merchant', 'starving_farmer', 'deserter_guard'],
            description: 'The breadbasket has become a graveyard. Crops wither. Elder Morin speaks of dark omens that have come true.',
            atmosphere: 'Dead fields stretch endlessly. The smell of rot hangs heavy. Survivors eye each other with suspicion.'
        },
        stonebridge: {
            npcs: ['broken_merchant', 'wounded_guard', 'one_armed_blacksmith', 'grieving_mason'],
            description: 'The bridge that gave the city its name has collapsed. The mason who built it weeps over the ruins.',
            atmosphere: 'Rubble everywhere. The river runs red. Crows feast on those who fell with the bridge.'
        },
        silverkeep: {
            npcs: ['mad_jeweler', 'hoarding_merchant', 'corrupt_guard', 'deposed_noble'],
            description: 'Silver means nothing now. The jeweler hoards food instead of gems. The nobles have fallen from grace.',
            atmosphere: 'Empty vaults. Tarnished silver scattered like worthless leaves. The sound of sobbing from dark corners.'
        },
        sunhaven: {
            npcs: ['despairing_merchant', 'drowning_fisherman', 'bitter_vintner', 'traumatized_guard', 'ghost_sailor', 'orphaned_villager'],
            description: 'The sun still shines, but no one feels its warmth. The lighthouse went dark. Ships no longer come.',
            atmosphere: 'Empty nets. Rotting boats. The wine has all been drunk in despair. Silence where laughter once lived.'
        },

        // ═══════════════════════════════════════════════════════════
        // 🏘️ DEVASTATED VILLAGES
        // ═══════════════════════════════════════════════════════════
        frostholm_village: {
            npcs: ['frozen_elder', 'frostbitten_merchant', 'shellshocked_guard', 'desperate_hunter', 'starving_trapper'],
            description: 'The cold claimed many. The survivors huddle around dying fires, burning furniture to stay alive.',
            atmosphere: 'Frozen corpses preserved in ice. The howl of hungry wolves. Smoke from desperate fires.'
        },
        vineyard_village: {
            npcs: ['hollow_vintner', 'grieving_farmer', 'looter_merchant'],
            description: 'The vines are dead. The wine has run out. People drink whatever they can find.',
            atmosphere: 'Withered vines like skeletal fingers. Empty barrels. The sweet smell of fermentation turned sour.'
        },
        darkwood_village: {
            npcs: ['traumatized_lumberjack', 'mad_miller', 'thieving_merchant'],
            description: 'The forest has turned hostile. Lumberjacks who venture in don\'t return. The mill grinds nothing.',
            atmosphere: 'Abandoned axes. The creak of dead trees. Something watches from the shadows.'
        },
        riverwood: {
            npcs: ['drowned_fisherman', 'paranoid_merchant', 'broken_boatwright'],
            description: 'The river brought the plague. Now no one drinks from it. Fish float belly-up.',
            atmosphere: 'Poisoned waters. Rotting boats. The smell of death drifting downstream.'
        },
        hillcrest: {
            npcs: ['lost_shepherd', 'starving_farmer', 'raider_merchant'],
            description: 'The flocks are gone - eaten or fled. The shepherds wander aimlessly, calling for sheep that won\'t answer.',
            atmosphere: 'Empty pastures. Scattered bones of livestock. The sound of mad bleating in the distance.'
        },
        miners_rest: {
            npcs: ['dying_miner', 'overwhelmed_innkeeper', 'gouging_merchant'],
            description: 'The mines collapsed. Those who survived drink themselves to death at the inn.',
            atmosphere: 'Boarded-up mine entrances. The endless coughing of black lung. Despair thick as coal dust.'
        },

        // ═══════════════════════════════════════════════════════════
        // ⛏️ COLLAPSED MINES
        // ═══════════════════════════════════════════════════════════
        iron_mines: {
            npcs: ['buried_miner', 'frantic_foreman', 'scavenging_merchant'],
            description: 'Half the mine collapsed. Bodies still lie under the rubble. The survivors dig not for ore, but for their friends.',
            atmosphere: 'The sound of desperate digging. Weeping from the darkness. The groan of unstable tunnels.'
        },
        silver_mine: {
            npcs: ['cave_miner', 'scarred_foreman', 'desperate_jeweler'],
            description: 'Silver is worthless now, but the mine offers shelter from what roams above.',
            atmosphere: 'Huddled refugees. Candlelight in the darkness. The drip of water echoing endlessly.'
        },
        deep_mine: {
            npcs: ['abyss_miner', 'mad_adventurer'],
            description: 'Something came up from the deep. Those who survived won\'t speak of what they saw.',
            atmosphere: 'Absolute darkness. Scratching sounds from below. The smell of something ancient and wrong.'
        },

        // ═══════════════════════════════════════════════════════════
        // 🌲 CORRUPTED FORESTS
        // ═══════════════════════════════════════════════════════════
        ancient_forest: {
            npcs: ['poisoned_herbalist', 'hunted_hunter', 'mad_forager'],
            description: 'The ancient trees weep black sap. The creatures of the forest have turned feral and hungry.',
            atmosphere: 'Twisted branches. Unnatural growling. The forest itself seems to hunger.'
        },
        whispering_woods: {
            npcs: ['haunted_herbalist', 'paranoid_alchemist', 'lost_wanderer'],
            description: 'The whispers have become screams. Those who enter hear the voices of the dead.',
            atmosphere: 'Endless screaming on the wind. Shadows that move wrong. The feeling of being watched by many eyes.'
        },
        hunters_wood: {
            npcs: ['last_hunter', 'wounded_trapper', 'desperate_merchant'],
            description: 'The hunters have become the hunted. Something stalks these woods now.',
            atmosphere: 'Abandoned camps. Blood trails. The snap of twigs from unseen pursuers.'
        },

        // ═══════════════════════════════════════════════════════════
        // 🌾 BLIGHTED FARMS
        // ═══════════════════════════════════════════════════════════
        wheat_farm: {
            npcs: ['starving_farmer', 'desperate_miller', 'hollow_farmhand'],
            description: 'The wheat turned to ash. The farmer plants seeds that will never grow.',
            atmosphere: 'Fields of grey dust. Scarecrows that seem too real. The desperate scratching of hoes on dead earth.'
        },
        eastern_farm: {
            npcs: ['refugee_farmer', 'fleeing_silkweaver', 'hoarding_merchant'],
            description: 'The silkworms died first. Then the crops. Now only refugees remain.',
            atmosphere: 'Dead silkworm cocoons. Withered tea plants. The shuffle of exhausted refugees.'
        },
        orchard_farm: {
            npcs: ['weeping_farmer', 'stung_beekeeper', 'thieving_orchardist'],
            description: 'The fruit rotted on the trees. The bees have become aggressive and strange.',
            atmosphere: 'Rotten fruit carpeting the ground. The angry buzz of corrupted bees. Sweet decay on the wind.'
        },
        sunny_farm: {
            npcs: ['burned_farmer', 'bitter_vintner', 'survivor_olive_presser'],
            description: 'The sun that gave the farm its name now scorches everything. Nothing grows.',
            atmosphere: 'Cracked earth. Dead vines. The relentless heat of an angry sun.'
        },

        // ═══════════════════════════════════════════════════════════
        // 💀 DUNGEONS OF DESPAIR
        // ═══════════════════════════════════════════════════════════
        shadow_dungeon: {
            npcs: ['corrupted_adventurer', 'doomed_treasure_hunter'],
            description: 'The Shadow Throne has awakened. This is where the darkness began.',
            atmosphere: 'Living shadows. Whispers of power. The heartbeat of something vast and terrible.'
        },
        forest_dungeon: {
            npcs: ['possessed_adventurer', 'raving_scholar'],
            description: 'The crypt has burst open. The dead no longer stay dead.',
            atmosphere: 'Open graves. Shambling figures. The smell of earth and decay.'
        },
        ruins_of_eldoria: {
            npcs: ['mad_scholar', 'traumatized_explorer', 'obsessed_archaeologist'],
            description: 'The elven ruins have revealed their darkest secrets. Knowledge that should have stayed buried.',
            atmosphere: 'Glowing runes that hurt to look at. Whispers in dead languages. The weight of ancient curses.'
        },

        // ═══════════════════════════════════════════════════════════
        // 🦇 HAUNTED CAVES
        // ═══════════════════════════════════════════════════════════
        deep_cavern: {
            npcs: ['cave_dweller', 'hidden_miner'],
            description: 'The deep provides shelter, but the darkness holds terrors.',
            atmosphere: 'Echoing drops of water. The scuttle of unseen things. Absolute, hungry darkness.'
        },
        frozen_cave: {
            npcs: ['frozen_explorer', 'ice_hermit'],
            description: 'Those who fled here from the cold found only colder death.',
            atmosphere: 'Ice-preserved bodies. The crack of frozen things. Cold that bites to the bone.'
        },
        crystal_cave: {
            npcs: ['shattered_collector', 'cave_miner'],
            description: 'The crystals have turned dark. They no longer shine - they absorb light.',
            atmosphere: 'Darkness that seems solid. The tinkle of corrupted crystals. A hum that sets teeth on edge.'
        },
        river_cave: {
            npcs: ['drowned_diver', 'traumatized_pearl_hunter'],
            description: 'The underground river brought plague. The pearls are tainted now.',
            atmosphere: 'Black water. Floating bodies. The current carrying whispers of the dead.'
        },
        coastal_cave: {
            npcs: ['survivor_treasure_hunter', 'castaway_diver'],
            description: 'Pirates fled here to escape the doom. Their treasure means nothing now.',
            atmosphere: 'Gleaming gold no one wants. Skeletal pirates. The tide bringing in more dead.'
        },
        fairy_cave: {
            npcs: ['corrupted_herbalist', 'mad_wanderer'],
            description: 'The fairies are gone. What replaced them is not kind.',
            atmosphere: 'Dying glow of corrupted mushrooms. Malicious laughter in the dark. The flutter of wrong wings.'
        },

        // ═══════════════════════════════════════════════════════════
        // 🍺 DESPERATE INNS
        // ═══════════════════════════════════════════════════════════
        kings_inn: {
            npcs: ['surviving_innkeeper', 'fallen_noble', 'shell_shocked_traveler', 'silenced_bard'],
            description: 'The inn serves whatever can be found. Payment is food, not gold.',
            atmosphere: 'Dim candlelight. Hollow-eyed survivors. The bard who no longer sings.'
        },
        silk_road_inn: {
            npcs: ['barricaded_innkeeper', 'stranded_merchant', 'desperate_traveler', 'broken_caravan_master'],
            description: 'The silk road is a death road now. The caravans that made it here will never leave.',
            atmosphere: 'Barricaded doors. Fearful eyes. The last of the provisions rationed carefully.'
        },
        riverside_inn: {
            npcs: ['protective_innkeeper', 'refugee_fisherman', 'weary_traveler'],
            description: 'A rare sanctuary. The innkeeper defends their refugees fiercely.',
            atmosphere: 'Relative warmth. Exhausted hope. The sound of the poisoned river outside.'
        },
        mountain_pass_inn: {
            npcs: ['fortress_innkeeper', 'stranded_traveler', 'last_guide'],
            description: 'The pass is blocked by avalanche. Those here are trapped together.',
            atmosphere: 'Snow piling against windows. Dwindling supplies. Growing tension.'
        },
        shepherds_inn: {
            npcs: ['mourning_innkeeper', 'orphaned_shepherd', 'starving_farmer'],
            description: 'They hold a wake every night for those lost. The ale ran out weeks ago.',
            atmosphere: 'Empty chairs. Photographs of the dead. Quiet weeping.'
        },
        lighthouse_inn: {
            npcs: ['beacon_innkeeper', 'drowned_sailor', 'blind_lighthouse_keeper'],
            description: 'The lighthouse keeper blinded himself rather than see what the light revealed at sea.',
            atmosphere: 'The dark beacon. Waves crashing. Shapes moving in the water.'
        },
        hunting_lodge: {
            npcs: ['haunted_innkeeper', 'last_hunter', 'paranoid_trapper'],
            description: 'The hunters have become prey. Something comes at night.',
            atmosphere: 'Barred windows. Loaded crossbows. Eyes watching the treeline.'
        },

        // ═══════════════════════════════════════════════════════════
        // ⚔️ FALLEN OUTPOSTS
        // ═══════════════════════════════════════════════════════════
        northern_outpost: {
            npcs: ['last_guard', 'dying_captain', 'wounded_sergeant', 'desperate_blacksmith'],
            description: 'The outpost holds against the dark. For now. Reinforcements will never come.',
            atmosphere: 'Fortified walls. Exhausted soldiers. The sound of things testing the perimeter.'
        },
        winterwatch_outpost: {
            npcs: ['frozen_guard', 'frostbitten_captain', 'lone_scout'],
            description: 'Winterwatch has fallen silent. The few survivors are too cold to speak.',
            atmosphere: 'Frozen sentries at their posts. Ice covering everything. The wind howling accusations.'
        },
        western_outpost: {
            npcs: ['besieged_guard', 'scarred_scout', 'shell_shocked_sergeant'],
            description: 'The western frontier is lost. The outpost is the last line.',
            atmosphere: 'Smoke on the horizon. The distant sound of horns. Grim determination.'
        },

        // ═══════════════════════════════════════════════════════════
        // ⚓ PORTS OF THE DEAD
        // ═══════════════════════════════════════════════════════════
        fishermans_port: {
            npcs: ['plague_fisherman', 'ghost_sailor', 'mad_harbormaster', 'hoarding_merchant'],
            description: 'The fish are all dead. The sailors who went to sea returned... changed.',
            atmosphere: 'Rotting boats. Empty nets. Sailors who won\'t meet your eyes.'
        },
        smugglers_cove: {
            npcs: ['survival_smuggler', 'desperate_merchant', 'ruthless_fence'],
            description: 'The smugglers have become the law. They control what little remains.',
            atmosphere: 'Hidden caches. Suspicious eyes. The only functioning trade in the doom.'
        },

        // ═══════════════════════════════════════════════════════════
        // 🔮 CORRUPTED SPECIAL LOCATIONS
        // ═══════════════════════════════════════════════════════════
        hermit_grove: {
            npcs: ['insane_hermit', 'prophetic_sage'],
            description: 'The hermit saw it all coming. Now he laughs and laughs.',
            atmosphere: 'Mad laughter. Prophetic ramblings. Drawings of doom covering every surface.'
        },
        druid_grove: {
            npcs: ['corrupted_druid', 'dying_herbalist', 'possessed_acolyte'],
            description: 'The druids tried to stop it. The grove is their tomb now.',
            atmosphere: 'Dead trees in a circle. Dark rituals gone wrong. The whisper of corrupted nature.'
        },
        stone_quarry: {
            npcs: ['survivor_foreman', 'broken_stonecutter', 'opportunist_merchant'],
            description: 'They dig graves now instead of foundations. There\'s always work.',
            atmosphere: 'The chip of chisels on tombstones. Endless digging. Stone monuments to the dead.'
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🔥 DOOM NPC TYPES - What they've become
    // ═══════════════════════════════════════════════════════════════
    npcTypes: {
        // Transformed versions of normal NPCs
        fallen_noble: { base: 'noble', doom: true, title: 'Deposed Lord', demeanor: 'broken' },
        desperate_guard: { base: 'guard', doom: true, title: 'Exhausted Defender', demeanor: 'paranoid' },
        mad_captain: { base: 'captain', doom: true, title: 'Shell-Shocked Commander', demeanor: 'unstable' },
        starving_jeweler: { base: 'jeweler', doom: true, title: 'Former Jeweler', demeanor: 'desperate' },
        ragged_tailor: { base: 'tailor', doom: true, title: 'Rag Mender', demeanor: 'hollow' },
        ruined_banker: { base: 'banker', doom: true, title: 'Worthless Vault Keeper', demeanor: 'nihilistic' },
        doomsayer: { base: 'herald', doom: true, title: 'Prophet of the End', demeanor: 'manic' },
        scavenger_merchant: { base: 'merchant', doom: true, title: 'Scrap Trader', demeanor: 'ruthless' },
        grief_stricken_elder: { base: 'elder', doom: true, title: 'Elder of the Dead', demeanor: 'mourning' },
        haunted_elder: { base: 'elder', doom: true, title: 'Haunted Sage', demeanor: 'tormented' },
        crazed_blacksmith: { base: 'blacksmith', doom: true, title: 'War Smith', demeanor: 'obsessed' },
        hollow_guard: { base: 'guard', doom: true, title: 'Dead-Eyed Watchman', demeanor: 'empty' },
        broken_captain: { base: 'captain', doom: true, title: 'Fallen Commander', demeanor: 'defeated' },
        plague_apothecary: { base: 'apothecary', doom: true, title: 'Plague Doctor', demeanor: 'clinical' },
        desperate_merchant: { base: 'merchant', doom: true, title: 'Survival Trader', demeanor: 'calculating' },
        trapped_miner: { base: 'miner', doom: true, title: 'Trapped Soul', demeanor: 'claustrophobic' },
        stranded_merchant: { base: 'merchant', doom: true, title: 'Stranded Trader', demeanor: 'hopeless' },
        traumatized_innkeeper: { base: 'innkeeper', doom: true, title: 'Haunted Host', demeanor: 'jumpy' },
        paranoid_guard: { base: 'guard', doom: true, title: 'Suspicious Watchman', demeanor: 'distrustful' },
        mutinous_sailor: { base: 'sailor', doom: true, title: 'Deserter', demeanor: 'bitter' },
        mad_ferryman: { base: 'ferryman', doom: true, title: 'Boatman of the Dead', demeanor: 'cryptic' },
        // ... Many more doom variants
    },

    // ═══════════════════════════════════════════════════════════════
    // 💀 DOOM ECONOMY VALUES - What matters now
    // ═══════════════════════════════════════════════════════════════
    economyModifiers: {
        // Survival essentials - EXTREMELY valuable
        food: 50.0,           // 50x normal price
        water: 100.0,         // 100x normal price - most precious
        bread: 40.0,
        meat: 45.0,
        vegetables: 35.0,
        medical_plants: 60.0,
        bandages: 55.0,
        herbs: 30.0,

        // Weapons and defense - Very valuable
        iron_sword: 15.0,
        steel_sword: 20.0,
        bow: 12.0,
        arrows: 8.0,
        shield: 10.0,
        armor: 18.0,
        chainmail: 16.0,

        // Crafting materials for survival - Valuable
        leather: 8.0,
        cloth: 6.0,
        rope: 10.0,
        torch: 15.0,
        lamp: 12.0,
        wood: 4.0,
        iron_bar: 5.0,
        tools: 7.0,

        // Clothing for protection - Moderately valuable
        winter_clothing: 12.0,
        furs: 10.0,

        // Former luxuries - Nearly worthless
        gold: 0.01,           // Gold is worthless
        gold_bar: 0.02,
        jewelry: 0.05,
        gems: 0.1,
        silk: 0.2,
        wine: 2.0,            // Alcohol still has some trade value
        ale: 3.0,             // More valuable than wine - practical
        perfume: 0.01,
        royal_goods: 0.01,
        luxury_items: 0.01,
        artifacts: 0.5,       // Some historical value
    },

    // ═══════════════════════════════════════════════════════════════
    // 🔧 UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    // Get doom location name
    getLocationName(locationId) {
        return this.locationNames[locationId] || `Ruined ${locationId}`;
    },

    // Get NPCs for a doom location
    getNPCsForLocation(locationId) {
        const locationData = this.locationNPCs[locationId];
        if (!locationData) {
            console.warn(`⚠️ Doom location "${locationId}" not found!`);
            return [];
        }
        return locationData.npcs || [];
    },

    // Get location description
    getLocationDescription(locationId) {
        const locationData = this.locationNPCs[locationId];
        return locationData?.description || 'Ruins and despair stretch as far as the eye can see.';
    },

    // Get location atmosphere
    getLocationAtmosphere(locationId) {
        const locationData = this.locationNPCs[locationId];
        return locationData?.atmosphere || 'The air is thick with ash and hopelessness.';
    },

    // Calculate doom price for item
    getDoomPrice(itemId, basePrice) {
        const modifier = this.economyModifiers[itemId] || 1.0;
        return Math.round(basePrice * modifier);
    },

    // Check if in doom world
    isInDoomWorld() {
        return typeof game !== 'undefined' && game.inDoomWorld === true;
    }
};

// ═══════════════════════════════════════════════════════════════
// 🌐 EXPOSE GLOBALLY
// ═══════════════════════════════════════════════════════════════
window.DoomWorldNPCs = DoomWorldNPCs;

console.log('💀 DoomWorldNPCs loaded - The apocalypse awaits...');
