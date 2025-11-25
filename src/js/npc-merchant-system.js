// ═══════════════════════════════════════════════════════════════
// 🧙 NPC MERCHANT SYSTEM - shopkeepers with actual personalities
// ═══════════════════════════════════════════════════════════════
// every merchant has their own quirks, trauma, and pricing strategies
// just like real life, but pixelated

const NPCMerchantSystem = {
    // 🎭 Merchant personality types - their emotional damage defines prices
    personalityTypes: {
        GREEDY: {
            id: 'greedy',
            name: 'Greedy',
            description: 'Focuses on profit above all else',
            pricingModifier: 1.3, // Sells 30% higher
            buyingModifier: 0.7, // Buys 30% lower
            haggleSuccess: 0.2, // 20% chance to haggle successfully
            greetings: [
                "Looking to spend some coin? My prices are... fair.",
                "Everything has a price, and mine are firm!",
                "Gold talks, friend. Let's see yours.",
                "You look like someone with deep pockets!"
            ],
            hagglingResponses: {
                success: "Fine, fine! You drive a hard bargain.",
                failure: "My prices are already generous!",
                insult: "Don't waste my time with such pathetic offers!"
            }
        },
        FRIENDLY: {
            id: 'friendly',
            name: 'Friendly',
            description: 'Warm and welcoming, offers fair prices',
            pricingModifier: 1.05, // Sells 5% higher
            buyingModifier: 0.95, // Buys 5% lower
            haggleSuccess: 0.6, // 60% chance to haggle successfully
            greetings: [
                "Welcome, friend! How can I help you today?",
                "Always a pleasure to see a new face!",
                "Come in, come in! Let's make a deal we both love!",
                "Ah, another traveler! What brings you to my shop?"
            ],
            hagglingResponses: {
                success: "You know what? I like you. Deal!",
                failure: "Sorry friend, that's as low as I can go.",
                insult: "Ah, let's not ruin this friendship over a few coins!"
            }
        },
        SHREWD: {
            id: 'shrewd',
            name: 'Shrewd',
            description: 'Clever businessperson, knows value well',
            pricingModifier: 1.15, // Sells 15% higher
            buyingModifier: 0.85, // Buys 15% lower
            haggleSuccess: 0.35, // 35% chance to haggle successfully
            greetings: [
                "I know quality when I see it. Both in goods and customers.",
                "Let's talk business.",
                "I run a tight ship here. No nonsense, just good deals.",
                "You seem like someone who knows value."
            ],
            hagglingResponses: {
                success: "You make a compelling argument. Agreed.",
                failure: "I've calculated my margins carefully. This is my final price.",
                insult: "Please, I've been in this business for decades."
            }
        },
        ECCENTRIC: {
            id: 'eccentric',
            name: 'Eccentric',
            description: 'Quirky and unpredictable',
            pricingModifier: 0.9, // Sells 10% lower (doesn't care about profit)
            buyingModifier: 1.1, // Buys 10% higher (overpays)
            haggleSuccess: 0.8, // 80% chance to haggle (but might go either way!)
            greetings: [
                "The stars told me you'd come today!",
                "Ah! A customer! Or are you? Who can say?",
                "Welcome to my humble... or is it magnificent? ...establishment!",
                "Do you believe in fate? Because I have just the thing for you!"
            ],
            hagglingResponses: {
                success: "Yes! The cosmos align! Take it!",
                failure: "No, no, no! The price is perfect as it is!",
                insult: "Interesting energy you have... let's do this!"
            }
        },
        MYSTERIOUS: {
            id: 'mysterious',
            name: 'Mysterious',
            description: 'Cryptic and secretive',
            pricingModifier: 1.2, // Sells 20% higher
            buyingModifier: 0.8, // Buys 20% lower
            haggleSuccess: 0.4, // 40% chance
            greetings: [
                "...",
                "You seek what I offer.",
                "Few find this place. Fewer leave satisfied.",
                "Speak your desire."
            ],
            hagglingResponses: {
                success: "...Acceptable.",
                failure: "No.",
                insult: "..."
            }
        },
        DESPERATE: {
            id: 'desperate',
            name: 'Desperate',
            description: 'Struggling, willing to make bad deals',
            pricingModifier: 0.8, // Sells 20% lower (needs to move inventory)
            buyingModifier: 1.15, // Buys 15% higher (needs inventory)
            haggleSuccess: 0.9, // 90% chance (accepts almost anything)
            greetings: [
                "Please, take a look at my wares!",
                "I'm running a special today! Everything must go!",
                "Business has been slow... but I have great deals!",
                "I'll make you an offer you can't refuse!"
            ],
            hagglingResponses: {
                success: "Yes! Thank you! You won't regret this!",
                failure: "Please! I can go lower!",
                insult: "I'll take it! I need the sale!"
            }
        }
    },

    // Merchant database
    merchants: {},

    // Merchant reputation system
    reputation: {},

    // Initialize the system
    init() {
        this.generateMerchants();
        this.loadReputation();
        console.log('NPC Merchant System initialized');
    },

    // Generate merchants for each location
    generateMerchants() {
        const locations = [
            'greendale', 'riverwood', 'stonebridge', 'amberhaven', 'oakshire',
            'silverpeak', 'blackwater', 'thornhill', 'ironforge', 'goldenleaf',
            'azure_bay', 'ember_rock', 'royal_capital'
        ];

        const merchantNames = [
            { first: 'Aldric', last: 'Goldweaver' },
            { first: 'Mira', last: 'Swifthand' },
            { first: 'Thorin', last: 'Ironpurse' },
            { first: 'Elara', last: 'Moonwhisper' },
            { first: 'Garrett', last: 'Coinsworth' },
            { first: 'Lysa', last: 'Fairweather' },
            { first: 'Marcus', last: 'Blackmarket' },
            { first: 'Seraphina', last: 'Starlight' },
            { first: 'Boris', last: 'Grumblefoot' },
            { first: 'Celeste', last: 'Dreamweaver' },
            { first: 'Viktor', last: 'Shadowdealer' },
            { first: 'Helena', last: 'Brightcoin' },
            { first: 'Orin', last: 'Stoutbelly' }
        ];

        locations.forEach((locationId, index) => {
            const nameData = merchantNames[index % merchantNames.length];
            const personalityKeys = Object.keys(this.personalityTypes);
            const personalityId = personalityKeys[Math.floor(Math.random() * personalityKeys.length)];
            const personality = this.personalityTypes[personalityId];

            this.merchants[locationId] = {
                id: `merchant_${locationId}`,
                name: `${nameData.first} ${nameData.last}`,
                firstName: nameData.first,
                lastName: nameData.last,
                location: locationId,
                personality: personality,
                specialties: this.generateSpecialties(),
                inventory: {},
                timesTraded: 0,
                totalGoldTraded: 0,
                lastTrade: null,
                relationship: 0 // -100 to 100
            };
        });
    },

    // Generate merchant specialties (items they have unique or in bulk)
    generateSpecialties() {
        const specialtyCategories = ['FOOD', 'MATERIALS', 'LUXURY', 'EQUIPMENT'];
        const numSpecialties = Math.floor(Math.random() * 2) + 1; // 1-2 specialties

        const specialties = [];
        for (let i = 0; i < numSpecialties; i++) {
            const category = specialtyCategories[Math.floor(Math.random() * specialtyCategories.length)];
            if (!specialties.includes(category)) {
                specialties.push(category);
            }
        }

        return specialties;
    },

    // Get merchant for current location
    getCurrentMerchant() {
        if (!game.currentLocation) return null;
        return this.merchants[game.currentLocation.id];
    },

    // Get merchant greeting
    getGreeting(merchantId) {
        const merchant = this.merchants[merchantId] || this.getCurrentMerchant();
        if (!merchant) return "Welcome!";

        const greetings = merchant.personality.greetings;
        let greeting = greetings[Math.floor(Math.random() * greetings.length)];

        // Add relationship-based suffix
        if (merchant.relationship > 50) {
            greeting += " Always good to see a valued customer!";
        } else if (merchant.relationship < -50) {
            greeting += " ...What do you want?";
        }

        return greeting;
    },

    // Calculate price with merchant personality and relationship
    calculatePrice(basePrice, merchant, isSelling = true) {
        if (!merchant) return basePrice;

        let modifier = isSelling
            ? merchant.personality.pricingModifier
            : merchant.personality.buyingModifier;

        // Adjust based on relationship (-10% to +10% based on -100 to 100 relationship)
        const relationshipModifier = 1 - (merchant.relationship / 1000);
        modifier *= relationshipModifier;

        return Math.round(basePrice * modifier);
    },

    // Attempt to haggle
    haggle(merchant, originalPrice, playerOffer) {
        if (!merchant) return { success: false, message: 'No merchant found.' };

        const priceGap = Math.abs(originalPrice - playerOffer) / originalPrice;
        const baseChance = merchant.personality.haggleSuccess;

        // Adjust chance based on how reasonable the offer is
        let haggleChance = baseChance;
        if (priceGap < 0.1) {
            haggleChance += 0.3; // Offering within 10% of price
        } else if (priceGap < 0.2) {
            haggleChance += 0.1; // Offering within 20% of price
        } else if (priceGap > 0.5) {
            haggleChance -= 0.3; // Offering more than 50% different
        }

        // Relationship bonus
        haggleChance += (merchant.relationship / 200); // -0.5 to +0.5

        const success = Math.random() < haggleChance;
        let response;

        if (success) {
            // Calculate final price (compromise between original and offer)
            const finalPrice = Math.round((originalPrice + playerOffer) / 2);
            response = merchant.personality.hagglingResponses.success;
            merchant.relationship += 5; // Improve relationship
            return { success: true, finalPrice, message: response };
        } else {
            if (priceGap > 0.5) {
                response = merchant.personality.hagglingResponses.insult;
                merchant.relationship -= 5; // Worsen relationship
            } else {
                response = merchant.personality.hagglingResponses.failure;
            }
            return { success: false, message: response };
        }
    },

    // Complete trade with merchant
    completeTrade(merchant, goldAmount) {
        if (!merchant) return;

        merchant.timesTraded++;
        merchant.totalGoldTraded += goldAmount;
        merchant.lastTrade = Date.now();

        // Improve relationship based on trade size
        const relationshipGain = Math.min(Math.floor(goldAmount / 100), 10);
        merchant.relationship = Math.min(100, merchant.relationship + relationshipGain);

        this.saveReputation();
    },

    // Get merchant stock (modified based on specialties)
    getMerchantStock(merchant, baseMarketItems) {
        if (!merchant) return baseMarketItems;

        const modifiedStock = { ...baseMarketItems };

        // Increase quantity and variety for specialty items
        merchant.specialties.forEach(specialty => {
            Object.entries(modifiedStock).forEach(([itemId, itemData]) => {
                const item = ItemDatabase.getItem(itemId);
                if (item?.category === specialty) {
                    // Specialty items have 2x quantity
                    modifiedStock[itemId] = {
                        ...itemData,
                        quantity: (itemData.quantity || 0) * 2
                    };
                }
            });
        });

        return modifiedStock;
    },

    // Get merchant dialogue
    getDialogue(merchant, situation = 'idle') {
        if (!merchant) return '';

        const dialogues = {
            idle: [
                `${merchant.firstName} is organizing some goods on the shelves.`,
                `${merchant.firstName} nods at you as you browse.`,
                `${merchant.firstName} appears to be counting inventory.`,
                `${merchant.firstName} watches you with interest.`
            ],
            highReputation: [
                `${merchant.firstName} smiles warmly. "My favorite customer!"`,
                `"Ah, ${game.player?.name || 'friend'}! I saved something special for you!"`,
                `"Your business has been a blessing. Please, let me know if you need anything."`,
                `"I always look forward to our trades!"`
            ],
            lowReputation: [
                `${merchant.firstName} eyes you warily.`,
                `"I hope you're here to make amends..."`,
                `${merchant.firstName} doesn't seem pleased to see you.`,
                `"Let's keep this brief."`
            ],
            afterGoodDeal: [
                `"Pleasure doing business with you!"`,
                `"Come back anytime!"`,
                `${merchant.firstName} seems satisfied with the trade.`,
                `"A fair deal for both of us!"`
            ],
            afterBadDeal: [
                `${merchant.firstName} looks displeased.`,
                `"I won't forget this..."`,
                `${merchant.firstName} grumbles under their breath.`,
                `"Next time I won't be so generous."`
            ]
        };

        // Select appropriate dialogue set
        let dialogueSet = dialogues.idle;

        if (situation === 'idle') {
            if (merchant.relationship > 50) {
                dialogueSet = dialogues.highReputation;
            } else if (merchant.relationship < -30) {
                dialogueSet = dialogues.lowReputation;
            }
        } else if (dialogues[situation]) {
            dialogueSet = dialogues[situation];
        }

        return dialogueSet[Math.floor(Math.random() * dialogueSet.length)];
    },

    // Save merchant reputation
    saveReputation() {
        const reputationData = {};

        Object.entries(this.merchants).forEach(([locationId, merchant]) => {
            reputationData[locationId] = {
                relationship: merchant.relationship,
                timesTraded: merchant.timesTraded,
                totalGoldTraded: merchant.totalGoldTraded,
                lastTrade: merchant.lastTrade
            };
        });

        localStorage.setItem('merchantReputation', JSON.stringify(reputationData));
    },

    // Load merchant reputation
    loadReputation() {
        const saved = localStorage.getItem('merchantReputation');
        if (!saved) return;

        try {
            const reputationData = JSON.parse(saved);

            Object.entries(reputationData).forEach(([locationId, data]) => {
                if (this.merchants[locationId]) {
                    this.merchants[locationId].relationship = data.relationship;
                    this.merchants[locationId].timesTraded = data.timesTraded;
                    this.merchants[locationId].totalGoldTraded = data.totalGoldTraded;
                    this.merchants[locationId].lastTrade = data.lastTrade;
                }
            });

            console.log('Merchant reputation loaded');
        } catch (error) {
            console.error('Error loading merchant reputation:', error);
        }
    },

    // Get merchant info display
    getMerchantInfo(merchant) {
        if (!merchant) return null;

        const relationshipText = this.getRelationshipText(merchant.relationship);
        const specialtiesText = merchant.specialties.join(', ');

        return {
            name: merchant.name,
            personality: merchant.personality.name,
            relationship: relationshipText,
            specialties: specialtiesText,
            tradesCompleted: merchant.timesTraded
        };
    },

    // Get relationship text
    getRelationshipText(relationship) {
        if (relationship >= 75) return '💚 Excellent';
        if (relationship >= 50) return '💙 Good';
        if (relationship >= 25) return '💛 Friendly';
        if (relationship >= 0) return '⚪ Neutral';
        if (relationship >= -25) return '🟡 Cautious';
        if (relationship >= -50) return '🟠 Unfriendly';
        return '🔴 Hostile';
    }
};

// Initialize on game load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            NPCMerchantSystem.init();
        }, 250);
    });
} else {
    setTimeout(() => {
        NPCMerchantSystem.init();
    }, 250);
}
