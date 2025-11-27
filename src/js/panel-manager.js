// ═══════════════════════════════════════════════════════════════
// 🪟 PANEL MANAGER - herding cats but the cats are floating windows
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// handles panel open/close order, ESC key navigation, and reopen buttons
// keeping track of all the chaos you've opened

const PanelManager = {
    // Stack of currently open panels (most recent last)
    openPanels: [],

    // All managed panel IDs and their info
    panelInfo: {
        'market-panel': { name: 'Market', icon: '🏪', shortcut: 'M' },
        'inventory-panel': { name: 'Inventory', icon: '🎒', shortcut: 'I' },
        'travel-panel': { name: 'Travel', icon: '🗺️', shortcut: 'T' },
        'transportation-panel': { name: 'Transport', icon: '🚗', shortcut: 'W' },
        'character-sheet-overlay': { name: 'Character', icon: '👤', shortcut: 'C', useActiveClass: true },
        'financial-sheet-overlay': { name: 'Finances', icon: '💰', shortcut: 'F', useActiveClass: true },
        'achievement-overlay': { name: 'Achievements', icon: '🏆', shortcut: 'H', useActiveClass: true },
        'settings-panel': { name: 'Settings', icon: '⚙️', shortcut: ',' },
        'property-employee-panel': { name: 'Properties', icon: '🏠', shortcut: 'P', useActiveClass: true },
        'location-panel': { name: 'Location', icon: '📍', shortcut: '' },
        'side-panel': { name: 'Player Info', icon: '👤', shortcut: '' },
        'message-log': { name: 'Messages', icon: '💬', shortcut: '' },
        'game-menu-overlay': { name: 'Menu', icon: '📋', shortcut: 'Escape', useActiveClass: true },
        'help-overlay': { name: 'Help', icon: '❓', shortcut: '', useActiveClass: true }
    },

    // Initialize panel manager
    init() {
        console.log('🪟 PanelManager: Initializing...');

        // Create the panel toolbar
        this.createPanelToolbar();

        // Setup ESC key handler
        this.setupEscHandler();

        // Monitor panel visibility changes
        this.observePanelChanges();

        // Patch existing panel functions
        this.patchPanelFunctions();

        console.log('🪟 PanelManager: Ready');
    },

    // Create a toolbar with buttons to reopen panels
    createPanelToolbar() {
        // Check if toolbar already exists
        if (document.getElementById('panel-toolbar')) return;

        const toolbar = document.createElement('div');
        toolbar.id = 'panel-toolbar';
        toolbar.innerHTML = `
            <div class="panel-toolbar-header">
                <span class="toolbar-grip">⋮⋮</span>
                <span class="toolbar-title">Panels</span>
                <button class="toolbar-collapse" title="Collapse">−</button>
            </div>
            <div class="panel-toolbar-buttons"></div>
        `;

        toolbar.style.cssText = `
            position: fixed;
            top: 70px;
            right: 220px;
            background: rgba(20, 20, 30, 0.95);
            border: 1px solid rgba(79, 195, 247, 0.3);
            border-radius: 8px;
            z-index: 9999;
            min-width: 50px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            display: none;
        `;

        document.body.appendChild(toolbar);

        // Style the header
        const header = toolbar.querySelector('.panel-toolbar-header');
        header.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 10px;
            background: linear-gradient(180deg, rgba(79, 195, 247, 0.2) 0%, rgba(79, 195, 247, 0.05) 100%);
            border-bottom: 1px solid rgba(79, 195, 247, 0.3);
            border-radius: 8px 8px 0 0;
            cursor: move;
            user-select: none;
        `;

        // Style collapse button
        const collapseBtn = toolbar.querySelector('.toolbar-collapse');
        collapseBtn.style.cssText = `
            background: none;
            border: none;
            color: #4fc3f7;
            font-size: 18px;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
        `;

        // Toggle collapse
        let collapsed = false;
        const buttonsContainer = toolbar.querySelector('.panel-toolbar-buttons');
        collapseBtn.onclick = () => {
            collapsed = !collapsed;
            buttonsContainer.style.display = collapsed ? 'none' : 'flex';
            collapseBtn.textContent = collapsed ? '+' : '−';
        };

        // Make toolbar draggable
        this.makeToolbarDraggable(toolbar, header);

        // Style buttons container
        buttonsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 8px;
        `;

        // Add buttons for main panels
        const mainPanels = [
            'market-panel',
            'inventory-panel',
            'travel-panel',
            'transportation-panel',
            'character-sheet-overlay',
            'financial-sheet-overlay',
            'property-employee-panel',
            'achievement-overlay',
            'settings-panel',
            'side-panel',
            'message-log'
        ];

        mainPanels.forEach(panelId => {
            const info = this.panelInfo[panelId];
            if (!info) return;

            const btn = document.createElement('button');
            btn.className = 'panel-toolbar-btn';
            btn.dataset.panelId = panelId;
            btn.title = info.name + (info.shortcut ? ` [${info.shortcut}]` : '');
            btn.innerHTML = `<span class="btn-icon">${info.icon}</span><span class="btn-label">${info.name}</span>`;

            btn.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px 10px;
                background: rgba(79, 195, 247, 0.1);
                border: 1px solid rgba(79, 195, 247, 0.2);
                border-radius: 6px;
                color: #e0e0e0;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
                white-space: nowrap;
            `;

            btn.onmouseenter = () => {
                btn.style.background = 'rgba(79, 195, 247, 0.3)';
                btn.style.borderColor = 'rgba(79, 195, 247, 0.5)';
            };

            btn.onmouseleave = () => {
                const isOpen = this.isPanelOpen(panelId);
                btn.style.background = isOpen ? 'rgba(76, 175, 80, 0.3)' : 'rgba(79, 195, 247, 0.1)';
                btn.style.borderColor = isOpen ? 'rgba(76, 175, 80, 0.5)' : 'rgba(79, 195, 247, 0.2)';
            };

            btn.onclick = () => this.togglePanel(panelId);

            buttonsContainer.appendChild(btn);
        });

        this.updateToolbarButtons();
    },

    // Make toolbar draggable
    makeToolbarDraggable(toolbar, handle) {
        let isDragging = false;
        let offsetX, offsetY;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('toolbar-collapse')) return;
            isDragging = true;
            offsetX = e.clientX - toolbar.getBoundingClientRect().left;
            offsetY = e.clientY - toolbar.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            toolbar.style.left = (e.clientX - offsetX) + 'px';
            toolbar.style.top = (e.clientY - offsetY) + 'px';
            toolbar.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    },

    // Check if panel is currently open/visible
    isPanelOpen(panelId) {
        // Special handling for settings-panel - check SettingsPanel.isOpen
        if (panelId === 'settings-panel') {
            return typeof SettingsPanel !== 'undefined' && SettingsPanel.isOpen === true;
        }

        const panel = document.getElementById(panelId);
        if (!panel) return false;

        // Check if this panel uses the 'active' class instead of 'hidden'
        const info = this.panelInfo[panelId];
        if (info && info.useActiveClass) {
            return panel.classList.contains('active');
        }

        // Check various visibility indicators
        const isHidden = panel.classList.contains('hidden');
        const displayNone = window.getComputedStyle(panel).display === 'none';
        const visibilityHidden = window.getComputedStyle(panel).visibility === 'hidden';

        return !isHidden && !displayNone && !visibilityHidden;
    },

    // Toggle panel visibility
    togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        const info = this.panelInfo[panelId];

        // Special handling for settings-panel - use SettingsPanel.show()
        if (panelId === 'settings-panel') {
            if (typeof SettingsPanel !== 'undefined') {
                if (SettingsPanel.isOpen) {
                    SettingsPanel.hide();
                } else {
                    SettingsPanel.show();
                }
            }
            return;
        }

        // Special handling for dynamically created panels that may not exist yet
        if (!panel) {
            // If it's a dynamically created panel, try to open it (which will create it)
            if (panelId === 'character-sheet-overlay' || panelId === 'financial-sheet-overlay') {
                console.log(`🪟 Panel ${panelId} not found, attempting to create it...`);
                this.openPanel(panelId);
                return;
            }
            console.warn(`🪟 Panel not found: ${panelId}`);
            return;
        }

        if (this.isPanelOpen(panelId)) {
            this.closePanel(panelId);
        } else {
            this.openPanel(panelId);
        }
    },

    // Open a panel
    openPanel(panelId) {
        const panel = document.getElementById(panelId);
        const info = this.panelInfo[panelId];

        // Special handling for settings-panel - use SettingsPanel.show()
        if (panelId === 'settings-panel') {
            if (typeof SettingsPanel !== 'undefined' && SettingsPanel.show) {
                SettingsPanel.show();
            }
            return;
        }

        // Handle panels that use 'active' class (like achievement-overlay)
        if (info && info.useActiveClass) {
            // Special handling for dynamically created overlays
            if (panelId === 'character-sheet-overlay') {
                // Use KeyBindings to create/show the character sheet
                if (typeof KeyBindings !== 'undefined' && KeyBindings.openCharacterSheet) {
                    KeyBindings.openCharacterSheet();
                    return;
                }
            }
            if (panelId === 'financial-sheet-overlay') {
                // Use KeyBindings to create/show the financial sheet
                if (typeof KeyBindings !== 'undefined' && KeyBindings.openFinancialSheet) {
                    KeyBindings.openFinancialSheet();
                    return;
                }
            }
            if (panelId === 'achievement-overlay' && typeof openAchievementPanel === 'function') {
                openAchievementPanel();
                return; // Let the function handle everything
            }
            // For other active-class panels, just add the class
            if (panel) {
                panel.classList.add('active');
            }
        } else {
            // Show the panel normally
            if (!panel) return;
            panel.classList.remove('hidden');
            panel.style.display = '';
            panel.style.visibility = '';
        }

        if (!panel) return;

        // Add to open stack (remove if already there, then add to end)
        this.openPanels = this.openPanels.filter(id => id !== panelId);
        this.openPanels.push(panelId);

        // Bring to front
        panel.style.zIndex = 100 + this.openPanels.length;

        this.updateToolbarButtons();
        console.log(`🪟 Opened panel: ${panelId}, stack:`, this.openPanels);
    },

    // Close a panel
    closePanel(panelId) {
        // Special handling for settings-panel - use SettingsPanel.hide()
        if (panelId === 'settings-panel') {
            if (typeof SettingsPanel !== 'undefined' && SettingsPanel.hide) {
                SettingsPanel.hide();
            }
            this.openPanels = this.openPanels.filter(id => id !== panelId);
            this.updateToolbarButtons();
            return;
        }

        const panel = document.getElementById(panelId);
        if (!panel) return;

        const info = this.panelInfo[panelId];

        // Handle panels that use 'active' class (like achievement-overlay)
        if (info && info.useActiveClass) {
            panel.classList.remove('active');
            // Also call the specific close function if it exists
            if (panelId === 'achievement-overlay' && typeof closeAchievementPanel === 'function') {
                closeAchievementPanel();
            }
        } else {
            // Hide the panel normally
            panel.classList.add('hidden');
        }

        // Remove from open stack
        this.openPanels = this.openPanels.filter(id => id !== panelId);

        this.updateToolbarButtons();
        console.log(`🪟 Closed panel: ${panelId}, stack:`, this.openPanels);
    },

    // Close the most recently opened panel
    closeTopPanel() {
        if (this.openPanels.length === 0) {
            console.log('🪟 No panels to close');
            return false;
        }

        const topPanelId = this.openPanels[this.openPanels.length - 1];
        this.closePanel(topPanelId);
        return true;
    },

    // Update toolbar button states
    updateToolbarButtons() {
        const buttons = document.querySelectorAll('.panel-toolbar-btn');
        buttons.forEach(btn => {
            const panelId = btn.dataset.panelId;
            const isOpen = this.isPanelOpen(panelId);

            if (isOpen) {
                btn.style.background = 'rgba(76, 175, 80, 0.3)';
                btn.style.borderColor = 'rgba(76, 175, 80, 0.5)';
            } else {
                btn.style.background = 'rgba(79, 195, 247, 0.1)';
                btn.style.borderColor = 'rgba(79, 195, 247, 0.2)';
            }
        });
    },

    // Setup ESC key handler to close panels in order
    setupEscHandler() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Prevent default behavior
                e.preventDefault();
                e.stopPropagation();

                // Close the most recently opened panel
                const closed = this.closeTopPanel();

                if (closed) {
                    console.log('🪟 ESC: Closed top panel');
                } else {
                    console.log('🪟 ESC: No panels open');
                }
            }
        }, true); // Use capture to handle before other handlers
    },

    // Observe panel changes to keep track of what's open
    observePanelChanges() {
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'class' ||
                     mutation.attributeName === 'style')) {
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                // Debounce updates
                clearTimeout(this._updateTimeout);
                this._updateTimeout = setTimeout(() => {
                    this.syncOpenPanels();
                    this.updateToolbarButtons();
                }, 100);
            }
        });

        // Observe all known panels
        Object.keys(this.panelInfo).forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (panel) {
                observer.observe(panel, {
                    attributes: true,
                    attributeFilter: ['class', 'style']
                });
            }
        });
    },

    // Sync openPanels array with actual DOM state
    syncOpenPanels() {
        const actuallyOpen = [];
        Object.keys(this.panelInfo).forEach(panelId => {
            if (this.isPanelOpen(panelId)) {
                // Keep the order from existing stack, or add to end
                if (this.openPanels.includes(panelId)) {
                    actuallyOpen.push(panelId);
                }
            }
        });

        // Add newly opened panels that weren't tracked
        Object.keys(this.panelInfo).forEach(panelId => {
            if (this.isPanelOpen(panelId) && !actuallyOpen.includes(panelId)) {
                actuallyOpen.push(panelId);
            }
        });

        this.openPanels = actuallyOpen;
    },

    // Show the panel toolbar (call when game starts)
    showToolbar() {
        const toolbar = document.getElementById('panel-toolbar');
        if (toolbar) {
            toolbar.style.display = 'block';
            console.log('🪟 PanelManager: Toolbar shown');
        }
    },

    // Hide the panel toolbar (call on start screen / game setup)
    hideToolbar() {
        const toolbar = document.getElementById('panel-toolbar');
        if (toolbar) {
            toolbar.style.display = 'none';
            console.log('🪟 PanelManager: Toolbar hidden');
        }
    },

    // Patch existing showPanel/hidePanel functions to work with manager
    patchPanelFunctions() {
        const self = this;

        // Patch global showPanel
        if (typeof window.showPanel === 'function') {
            const originalShow = window.showPanel;
            window.showPanel = function(panelId) {
                originalShow(panelId);
                self.openPanel(panelId);
            };
        }

        // Patch global hidePanel if exists
        if (typeof window.hidePanel === 'function') {
            const originalHide = window.hidePanel;
            window.hidePanel = function(panelId) {
                originalHide(panelId);
                self.closePanel(panelId);
            };
        }

        // Patch game.showOverlay if exists
        if (typeof game !== 'undefined' && game.showOverlay) {
            const originalShowOverlay = game.showOverlay.bind(game);
            game.showOverlay = function(panelId) {
                originalShowOverlay(panelId);
                self.openPanel(panelId);
            };
        }

        // Patch game.hideOverlay if exists
        if (typeof game !== 'undefined' && game.hideOverlay) {
            const originalHideOverlay = game.hideOverlay.bind(game);
            game.hideOverlay = function(panelId) {
                originalHideOverlay(panelId);
                self.closePanel(panelId);
            };
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => PanelManager.init(), 600);
    });
} else {
    setTimeout(() => PanelManager.init(), 600);
}

// Expose globally
window.PanelManager = PanelManager;
