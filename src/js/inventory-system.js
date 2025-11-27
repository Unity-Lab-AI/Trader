// ═══════════════════════════════════════════════════════════════
// 🎒 INVENTORY SYSTEM - hoarding simulator 3000
// ═══════════════════════════════════════════════════════════════
// where we store all the junk we cant let go of... i relate
// File Version: 0.5
// Game Version: 0.2
// Made by Unity AI Lab - Hackall360, Sponge, GFourteen

const InventorySystem = {
    // ⚙️ Config - limits on our hoarding tendencies
    maxSlots: 20,
    maxWeight: 100,
    sortCriteria: 'name',
    filterCriteria: null,
    
    // 🌙 Initialize - waking up the hoard
    init() {
        this.setupEventListeners();
        this.updateInventoryDisplay();
    },
    
    // 👂 Setup event listeners - listening for organizing impulses
    setupEventListeners() {
        // sorting - for the anxious organizers
        const sortBtn = document.getElementById('sort-inventory-btn');
        if (sortBtn) {
            EventManager.addEventListener(sortBtn, 'click', () => this.showSortOptions());
        }
        
        // filtering - finding the needle in the hoarder haystack
        const filterBtn = document.getElementById('filter-inventory-btn');
        if (filterBtn) {
            EventManager.addEventListener(filterBtn, 'click', () => this.showFilterOptions());
        }
        
        // settings - customizing the chaos
        const settingsBtn = document.getElementById('inventory-settings-btn');
        if (settingsBtn) {
            EventManager.addEventListener(settingsBtn, 'click', () => this.showInventorySettings());
        }
    },
    
    // 📦 Update inventory display - admiring our collection
    updateInventoryDisplay() {
        const inventoryContainer = document.getElementById('inventory-items');
        if (!inventoryContainer) return;
        
        inventoryContainer.innerHTML = '';
        
        if (!game.player || !game.player.inventory) {
            inventoryContainer.innerHTML = '<p>Your inventory is empty.</p>';
            return;
        }
        
        let totalWeight = 0;
        let totalValue = 0;
        
        for (const [itemId, quantity] of Object.entries(game.player.inventory)) {
            if (quantity <= 0) continue;
            
            const item = ItemDatabase.getItem(itemId);
            if (!item) continue;
            
            const weight = ItemDatabase.calculateWeight(itemId, quantity);
            const value = ItemDatabase.calculatePrice(itemId) * quantity;
            
            totalWeight += weight;
            totalValue += value;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';

            // check if item is equippable
            const isEquippable = typeof EquipmentSystem !== 'undefined' && EquipmentSystem.isEquippable(itemId);
            const equipSlot = isEquippable ? EquipmentSystem.findSlotForItem(itemId) : null;

            // check if item is currently equipped
            const isEquipped = isEquippable && game.player.equipment?.[equipSlot] === itemId;

            itemElement.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}${isEquipped ? ' <span class="equipped-badge">✓</span>' : ''}</div>
                <div class="item-quantity">×${quantity}</div>
                <div class="item-weight">${weight.toFixed(1)} lbs</div>
                <div class="item-value">${value} gold</div>
                <div class="item-actions">
                    ${item.consumable ? `<button class="use-item-btn" onclick="InventorySystem.useItem('${itemId}')">Use</button>` : ''}
                    ${isEquippable ? `<button class="equip-item-btn" onclick="EquipmentSystem.equip('${itemId}')">Equip</button>` : ''}
                </div>
            `;

            // show bonuses on hover if item has them
            if (item.bonuses) {
                itemElement.title = Object.entries(item.bonuses)
                    .map(([stat, val]) => `${stat}: ${val > 0 ? '+' : ''}${val}`)
                    .join(', ');
            }

            inventoryContainer.appendChild(itemElement);
        }
        
        // Update inventory info
        const weightDisplay = document.getElementById('inventory-weight');
        const valueDisplay = document.getElementById('inventory-value');
        
        if (weightDisplay) {
            weightDisplay.textContent = `Weight: ${totalWeight.toFixed(1)}/${this.maxWeight} lbs`;
        }
        
        if (valueDisplay) {
            valueDisplay.textContent = `Value: ${totalValue} gold`;
        }
    },
    
    // Sort inventory
    sortInventory(criteria) {
        if (!game.player || !game.player.inventory) return;
        
        const items = Object.entries(game.player.inventory);
        
        items.sort((a, b) => {
            const itemA = ItemDatabase.getItem(a[0]);
            const itemB = ItemDatabase.getItem(b[0]);
            
            if (!itemA || !itemB) return 0;
            
            switch (criteria) {
                case 'name':
                    return itemA.name.localeCompare(itemB.name);
                case 'value':
                    return (ItemDatabase.calculatePrice(b[0]) * b[1]) - (ItemDatabase.calculatePrice(a[0]) * a[1]);
                case 'weight':
                    return ItemDatabase.calculateWeight(a[0], a[1]) - ItemDatabase.calculateWeight(b[0], b[1]);
                case 'quantity':
                    return a[1] - b[1];
                case 'category':
                    return itemA.category.localeCompare(itemB.category);
                case 'rarity':
                    return itemA.rarity.localeCompare(itemB.rarity);
                default:
                    return 0;
            }
        });
        
        // Rebuild inventory object
        game.player.inventory = {};
        items.forEach(([itemId, quantity]) => {
            game.player.inventory[itemId] = quantity;
        });
        
        this.updateInventoryDisplay();
    },
    
    // Use item
    useItem(itemId) {
        if (typeof game.useItem === 'function') {
            game.useItem(itemId);
        } else {
            const item = ItemDatabase.getItem(itemId);
            if (item && item.consumable) {
                // Apply item effects
                const effects = ItemDatabase.getItemEffects(itemId);
                for (const [stat, value] of Object.entries(effects)) {
                    if (game.player.stats[stat] !== undefined) {
                        game.player.stats[stat] = Math.min(
                            game.player.stats[`max${stat.charAt(0).toUpperCase() + stat.slice(1)}`] || 100,
                            game.player.stats[stat] + value
                        );
                    }
                }
                
                // Remove one item from inventory
                if (game.player.inventory[itemId] > 1) {
                    game.player.inventory[itemId]--;
                } else {
                    delete game.player.inventory[itemId];
                }
                
                addMessage(`You used ${item.name}!`);
                updatePlayerStats();
                this.updateInventoryDisplay();
            }
        }
    },
    
    // Equip item
    equipItem(itemId) {
        const item = ItemDatabase.getItem(itemId);
        if (item && ItemDatabase.isTool(itemId)) {
            game.player.equippedTool = itemId;
            addMessage(`You equipped ${item.name}!`);
            this.updateInventoryDisplay();
        }
    },
    
    // Drop item
    dropItem(itemId) {
        if (game.player.inventory[itemId] > 0) {
            const item = ItemDatabase.getItem(itemId);
            const quantity = game.player.inventory[itemId];
            
            if (confirm(`Are you sure you want to drop ${quantity} × ${item.name}?`)) {
                delete game.player.inventory[itemId];
                addMessage(`You dropped ${quantity} × ${item.name}!`);
                this.updateInventoryDisplay();
            }
        }
    },
    
    // Show sort options
    showSortOptions() {
        // Implementation for sort options UI
        addMessage('Sort options not yet implemented');
    },
    
    // Show filter options
    showFilterOptions() {
        // Implementation for filter options UI
        addMessage('Filter options not yet implemented');
    },
    
    // Show inventory settings - redirect to main settings panel
    showInventorySettings() {
        if (typeof SettingsPanel !== 'undefined' && SettingsPanel.show) {
            SettingsPanel.show();
        } else {
            addMessage('settings panel loading... try again in a moment');
        }
    },
    
    // Save inventory state for save system
    getInventoryState() {
        return {
            maxSlots: this.maxSlots,
            maxWeight: this.maxWeight,
            sortCriteria: this.sortCriteria,
            filterCriteria: this.filterCriteria
        };
    },
    
    // Load inventory state from save system
    loadInventoryState(state) {
        if (state) {
            this.maxSlots = state.maxSlots || 20;
            this.maxWeight = state.maxWeight || 100;
            this.sortCriteria = state.sortCriteria || 'name';
            this.filterCriteria = state.filterCriteria || null;
        }
    }
};

// Initialize inventory system when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            InventorySystem.init();
        }, 100);
    });
} else {
    setTimeout(() => {
        InventorySystem.init();
    }, 100);
}