// ═══════════════════════════════════════════════════════════════
// ⚙️ SETTINGS PANEL - customizing your suffering experience
// ═══════════════════════════════════════════════════════════════
// audio, visual, accessibility... tweak everything to your liking
// because one size fits none

const SettingsPanel = {
    // Panel state
    isOpen: false,
    panelElement: null,
    settingsTabs: {},
    
    // Default settings
    defaultSettings: {
        // Audio settings
        audio: {
            masterVolume: 0.7,
            musicVolume: 0.5,
            sfxVolume: 0.7,
            isMuted: false,
            isMusicMuted: false,
            isSfxMuted: false,
            audioEnabled: true
        },
        
        // Visual settings
        visual: {
            particlesEnabled: true,
            screenShakeEnabled: true,
            animationsEnabled: true,
            weatherEffectsEnabled: true,
            quality: 'medium',
            reducedMotion: false,
            flashWarnings: true
        },
        
        // Animation settings
        animation: {
            animationsEnabled: true,
            animationSpeed: 1.0,
            reducedMotion: false,
            quality: 'medium'
        },
        
        // UI settings
        ui: {
            animationsEnabled: true,
            hoverEffectsEnabled: true,
            transitionsEnabled: true,
            reducedMotion: false,
            highContrast: false,
            fontSize: 'medium',
            theme: 'default'
        },
        
        // Environmental settings
        environmental: {
            weatherEffectsEnabled: true,
            lightingEnabled: true,
            seasonalEffectsEnabled: true,
            quality: 'medium',
            reducedEffects: false
        },
        
        // Accessibility settings
        accessibility: {
            reducedMotion: false,
            highContrast: false,
            screenReaderEnabled: false,
            flashWarnings: true,
            colorBlindMode: 'none',
            fontSize: 'medium',
            keyboardNavigation: true
        }
    },
    
    // Current settings
    currentSettings: {},
    
    // Initialize settings panel
    init() {
        this.loadSettings();
        this.createPanel();
        this.setupEventListeners();
        console.log('Settings panel initialized');
    },
    
    // Load settings from localStorage
    loadSettings() {
        // Load all setting categories
        Object.keys(this.defaultSettings).forEach(category => {
            const savedSettings = localStorage.getItem(`tradingGame${category.charAt(0).toUpperCase() + category.slice(1)}Settings`);
            if (savedSettings) {
                try {
                    this.currentSettings[category] = { ...this.defaultSettings[category], ...JSON.parse(savedSettings) };
                } catch (error) {
                    console.error(`Failed to load ${category} settings:`, error);
                    this.currentSettings[category] = { ...this.defaultSettings[category] };
                }
            } else {
                this.currentSettings[category] = { ...this.defaultSettings[category] };
            }
        });
    },
    
    // Save settings to localStorage
    saveSettings(category = null) {
        if (category) {
            localStorage.setItem(`tradingGame${category.charAt(0).toUpperCase() + category.slice(1)}Settings`, 
                               JSON.stringify(this.currentSettings[category]));
        } else {
            // Save all categories
            Object.keys(this.currentSettings).forEach(cat => {
                localStorage.setItem(`tradingGame${cat.charAt(0).toUpperCase() + cat.slice(1)}Settings`, 
                                   JSON.stringify(this.currentSettings[cat]));
            });
        }
    },
    
    // Create settings panel
    createPanel() {
        // Create main panel container
        this.panelElement = document.createElement('div');
        this.panelElement.id = 'settings-panel';
        this.panelElement.className = 'settings-panel';
        this.panelElement.style.display = 'none';
        
        // Create panel structure
        this.panelElement.innerHTML = `
            <div class="settings-panel-overlay">
                <div class="settings-panel-container">
                    <div class="settings-panel-header">
                        <h2>Game Settings</h2>
                        <button class="settings-close-btn" aria-label="Close settings">&times;</button>
                    </div>
                    
                    <div class="settings-panel-tabs">
                        <button class="settings-tab active" data-tab="audio">Audio</button>
                        <button class="settings-tab" data-tab="visual">Visual</button>
                        <button class="settings-tab" data-tab="animation">Animation</button>
                        <button class="settings-tab" data-tab="ui">UI</button>
                        <button class="settings-tab" data-tab="environmental">Environmental</button>
                        <button class="settings-tab" data-tab="accessibility">Accessibility</button>
                        <button class="settings-tab" data-tab="controls">⌨️ Controls</button>
                        <button class="settings-tab" data-tab="saveload">💾 Save/Load</button>
                    </div>
                    
                    <div class="settings-panel-content">
                        <!-- Audio Tab -->
                        <div class="settings-tab-content active" data-tab="audio">
                            <h3>Audio Settings</h3>
                            <div class="settings-group">
                                <div class="setting-item">
                                    <label for="master-volume">Master Volume</label>
                                    <input type="range" id="master-volume" min="0" max="1" step="0.1" value="0.7">
                                    <span class="setting-value">70%</span>
                                </div>
                                <div class="setting-item">
                                    <label for="music-volume">Music Volume</label>
                                    <input type="range" id="music-volume" min="0" max="1" step="0.1" value="0.5">
                                    <span class="setting-value">50%</span>
                                </div>
                                <div class="setting-item">
                                    <label for="sfx-volume">Sound Effects Volume</label>
                                    <input type="range" id="sfx-volume" min="0" max="1" step="0.1" value="0.7">
                                    <span class="setting-value">70%</span>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="audio-enabled" checked>
                                        Enable Audio
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="master-mute">
                                        Mute All
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="music-mute">
                                        Mute Music
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="sfx-mute">
                                        Mute Sound Effects
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Visual Tab -->
                        <div class="settings-tab-content" data-tab="visual">
                            <h3>Visual Settings</h3>
                            <div class="settings-group">
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="particles-enabled" checked>
                                        Enable Particle Effects
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="screen-shake-enabled" checked>
                                        Enable Screen Shake
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="visual-animations-enabled" checked>
                                        Enable Animations
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="weather-effects-enabled" checked>
                                        Enable Weather Effects
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="flash-warnings" checked>
                                        Enable Flash Warnings
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label for="visual-quality">Graphics Quality</label>
                                    <select id="visual-quality">
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="reduced-motion">
                                        Reduced Motion
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Animation Tab -->
                        <div class="settings-tab-content" data-tab="animation">
                            <h3>Animation Settings</h3>
                            <div class="settings-group">
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="animation-enabled" checked>
                                        Enable Animations
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label for="animation-speed">Animation Speed</label>
                                    <input type="range" id="animation-speed" min="0.1" max="3" step="0.1" value="1">
                                    <span class="setting-value">1.0x</span>
                                </div>
                                <div class="setting-item">
                                    <label for="animation-quality">Animation Quality</label>
                                    <select id="animation-quality">
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="animation-reduced-motion">
                                        Reduced Motion
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- UI Tab -->
                        <div class="settings-tab-content" data-tab="ui">
                            <h3>UI Settings</h3>
                            <div class="settings-group">
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="ui-animations-enabled" checked>
                                        Enable UI Animations
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="hover-effects-enabled" checked>
                                        Enable Hover Effects
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="transitions-enabled" checked>
                                        Enable Transitions
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label for="ui-theme">UI Theme</label>
                                    <select id="ui-theme">
                                        <option value="default" selected>Default</option>
                                        <option value="dark">Dark</option>
                                        <option value="high-contrast">High Contrast</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label for="ui-font-size">Font Size</label>
                                    <select id="ui-font-size">
                                        <option value="small">Small</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="ui-reduced-motion">
                                        Reduced Motion
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="ui-high-contrast">
                                        High Contrast
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Environmental Tab -->
                        <div class="settings-tab-content" data-tab="environmental">
                            <h3>Environmental Settings</h3>
                            <div class="settings-group">
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="env-weather-enabled" checked>
                                        Enable Weather Effects
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="env-lighting-enabled" checked>
                                        Enable Dynamic Lighting
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="env-seasonal-enabled" checked>
                                        Enable Seasonal Effects
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label for="env-quality">Environmental Quality</label>
                                    <select id="env-quality">
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="env-reduced-effects">
                                        Reduced Effects
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Accessibility Tab -->
                        <div class="settings-tab-content" data-tab="accessibility">
                            <h3>Accessibility Settings</h3>
                            <div class="settings-group">
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="access-reduced-motion">
                                        Reduced Motion
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="access-high-contrast">
                                        High Contrast
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="access-screen-reader">
                                        Screen Reader Support
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="access-flash-warnings" checked>
                                        Flash Warnings
                                    </label>
                                </div>
                                <div class="setting-item">
                                    <label for="access-colorblind">Color Blind Mode</label>
                                    <select id="access-colorblind">
                                        <option value="none" selected>None</option>
                                        <option value="protanopia">Protanopia (Red-blind)</option>
                                        <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                                        <option value="tritanopia">Tritanopia (Blue-blind)</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label for="access-font-size">Font Size</label>
                                    <select id="access-font-size">
                                        <option value="small">Small</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="large">Large</option>
                                        <option value="extra-large">Extra Large</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label>
                                        <input type="checkbox" id="access-keyboard-nav" checked>
                                        Enhanced Keyboard Navigation
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- ⌨️ Controls Tab - keybindings for the suffering -->
                        <div class="settings-tab-content" data-tab="controls">
                            <h3>⌨️ Keyboard Controls</h3>
                            <p class="settings-description">Click any key binding to change it. Press Escape to cancel.</p>
                            <div class="settings-group">
                                <div class="keybindings-list" id="keybindings-list">
                                    <!-- Keybindings populated by refreshKeyBindingsUI -->
                                </div>
                                <div class="setting-item keybind-actions">
                                    <button class="save-load-btn" id="reset-keybindings-btn">🔄 Reset to Defaults</button>
                                </div>
                            </div>
                        </div>

                        <!-- 💾 Save/Load Tab - timeline manipulation -->
                        <div class="settings-tab-content" data-tab="saveload">
                            <h3>💾 Save & Load Game</h3>
                            <div class="settings-group">
                                <div class="setting-item save-actions">
                                    <button id="manual-save-btn" class="save-load-btn" onclick="if(typeof SaveLoadSystem !== 'undefined') SaveLoadSystem.manualSave();">
                                        💾 Save Game Now
                                    </button>
                                    <button id="quick-save-btn" class="save-load-btn" onclick="if(typeof SaveLoadSystem !== 'undefined') SaveLoadSystem.quickSave();">
                                        ⚡ Quick Save (F5)
                                    </button>
                                </div>

                                <h4>📂 Auto-Saves (Rotating - up to 10)</h4>
                                <p class="settings-description">Auto-saves happen every 5 minutes during gameplay</p>
                                <div id="auto-save-list" class="auto-save-list">
                                    <!-- Auto-saves will be populated here -->
                                    <p class="no-saves">No auto-saves yet...</p>
                                </div>

                                <h4>📁 Manual Saves</h4>
                                <div id="manual-save-list" class="manual-save-list">
                                    <!-- Manual saves will be populated here -->
                                    <p class="no-saves">No manual saves yet...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings-panel-footer">
                        <button class="settings-btn settings-apply-btn">Apply</button>
                        <button class="settings-btn settings-reset-btn">Reset to Defaults</button>
                        <button class="settings-btn settings-cancel-btn">Cancel</button>
                        <button class="settings-btn settings-clear-all-btn" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); margin-left: auto;">🗑️ Clear All Data</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        this.addStyles();
        
        // Append to body
        document.body.appendChild(this.panelElement);
    },
    
    // Add styles for settings panel
    addStyles() {
        const style = document.createElement('style');
        style.id = 'settings-panel-styles';
        style.textContent = `
            .settings-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10002;
                display: none;
            }
            
            .settings-panel-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .settings-panel-container {
                background: var(--panel-bg, #2d2d2d);
                color: var(--panel-text, #e0e0e0);
                border-radius: 8px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            
            .settings-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--border-color, #444);
            }
            
            .settings-panel-header h2 {
                margin: 0;
                font-size: 24px;
                color: var(--header-text, #ffffff);
            }
            
            .settings-close-btn {
                background: none;
                border: none;
                color: var(--close-btn-color, #999);
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .settings-close-btn:hover {
                background-color: var(--hover-bg, #444);
                color: var(--close-btn-hover, #fff);
            }
            
            .settings-panel-tabs {
                display: flex;
                background: var(--tabs-bg, #1a1a1a);
                border-bottom: 1px solid var(--border-color, #444);
            }
            
            .settings-tab {
                background: none;
                border: none;
                color: var(--tab-text, #999);
                padding: 15px 20px;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.2s;
                font-size: 14px;
                font-weight: 500;
            }
            
            .settings-tab:hover {
                background-color: var(--tab-hover-bg, #333);
                color: var(--tab-hover-text, #fff);
            }
            
            .settings-tab.active {
                color: var(--tab-active-text, #4CAF50);
                border-bottom-color: var(--tab-active-border, #4CAF50);
                background-color: var(--tab-active-bg, #2d2d2d);
            }
            
            .settings-panel-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }
            
            .settings-tab-content {
                display: none;
            }
            
            .settings-tab-content.active {
                display: block;
            }
            
            .settings-tab-content h3 {
                margin: 0 0 20px 0;
                font-size: 18px;
                color: var(--section-header, #ffffff);
                border-bottom: 1px solid var(--border-color, #444);
                padding-bottom: 10px;
            }
            
            .settings-group {
                display: grid;
                gap: 15px;
            }
            
            .setting-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid var(--setting-border, #333);
            }
            
            .setting-item:last-child {
                border-bottom: none;
            }
            
            .setting-item label {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                color: var(--setting-text, #e0e0e0);
                cursor: pointer;
            }
            
            .setting-item input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }
            
            .setting-item input[type="range"] {
                width: 150px;
                cursor: pointer;
            }
            
            .setting-item select {
                background: var(--input-bg, #333);
                color: var(--input-text, #e0e0e0);
                border: 1px solid var(--input-border, #555);
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .setting-value {
                min-width: 40px;
                text-align: right;
                font-size: 14px;
                color: var(--value-text, #999);
            }
            
            .settings-panel-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 20px;
                border-top: 1px solid var(--border-color, #444);
                background: var(--footer-bg, #1a1a1a);
            }
            
            .settings-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .settings-apply-btn {
                background: var(--apply-btn-bg, #4CAF50);
                color: var(--apply-btn-text, #fff);
            }
            
            .settings-apply-btn:hover {
                background: var(--apply-btn-hover, #45a049);
            }
            
            .settings-reset-btn {
                background: var(--reset-btn-bg, #f44336);
                color: var(--reset-btn-text, #fff);
            }
            
            .settings-reset-btn:hover {
                background: var(--reset-btn-hover, #da190b);
            }
            
            .settings-cancel-btn {
                background: var(--cancel-btn-bg, #666);
                color: var(--cancel-btn-text, #fff);
            }
            
            .settings-cancel-btn:hover {
                background: var(--cancel-btn-hover, #555);
            }
            
            /* Save/Load Tab Styles */
            .save-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-bottom: 20px;
            }

            .save-load-btn {
                padding: 12px 20px;
                background: var(--btn-bg, #4CAF50);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            }

            .save-load-btn:hover {
                background: var(--btn-hover, #45a049);
                transform: translateY(-2px);
            }

            .settings-description {
                color: #888;
                font-size: 12px;
                margin: 5px 0 15px 0;
                font-style: italic;
            }

            .auto-save-list, .manual-save-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-height: 200px;
                overflow-y: auto;
                padding: 10px;
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
                margin-bottom: 20px;
            }

            .save-slot-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: rgba(255,255,255,0.05);
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.1);
                transition: all 0.2s;
            }

            .save-slot-item:hover {
                background: rgba(255,255,255,0.1);
                border-color: var(--accent-color, #4CAF50);
            }

            .save-slot-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .save-slot-name {
                font-weight: 500;
                color: #fff;
            }

            .save-slot-details {
                font-size: 11px;
                color: #888;
            }

            .save-slot-actions {
                display: flex;
                gap: 8px;
            }

            .save-slot-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }

            .save-slot-btn.load-btn {
                background: #2196F3;
                color: white;
            }

            .save-slot-btn.load-btn:hover {
                background: #1976D2;
            }

            .save-slot-btn.delete-btn {
                background: #f44336;
                color: white;
            }

            .save-slot-btn.delete-btn:hover {
                background: #d32f2f;
            }

            .no-saves {
                color: #666;
                font-style: italic;
                text-align: center;
                padding: 20px;
            }

            .settings-tab-content h4 {
                color: #aaa;
                font-size: 14px;
                margin: 15px 0 5px 0;
                border-bottom: 1px solid #333;
                padding-bottom: 5px;
            }

            /* ⌨️ Keybindings styles - the keys to our demise */
            .keybindings-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-height: 400px;
                overflow-y: auto;
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
            }

            .keybind-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.2s;
            }

            .keybind-row:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .keybind-action {
                font-size: 14px;
                color: #e0e0e0;
            }

            .keybind-key {
                display: inline-block;
                min-width: 80px;
                padding: 8px 16px;
                background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
                border: 1px solid #555;
                border-radius: 6px;
                color: #fff;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 13px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .keybind-key:hover {
                background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%);
                border-color: #4CAF50;
                transform: translateY(-1px);
            }

            .keybind-key.listening {
                background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
                border-color: #81C784;
                animation: pulse-key 1s ease-in-out infinite;
            }

            @keyframes pulse-key {
                0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
                50% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
            }

            .keybind-actions {
                margin-top: 15px;
                justify-content: center;
            }

            .keybind-section-header {
                color: #888;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                padding: 10px 0 5px 0;
                border-bottom: 1px solid #333;
                margin-top: 10px;
            }

            .keybind-section-header:first-child {
                margin-top: 0;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .settings-panel-container {
                    width: 95%;
                    height: 95vh;
                }

                .settings-panel-tabs {
                    flex-wrap: wrap;
                }

                .settings-tab {
                    flex: 1;
                    min-width: 100px;
                    font-size: 12px;
                    padding: 10px 5px;
                }

                .setting-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }

                .settings-panel-footer {
                    flex-direction: column;
                }

                .settings-btn {
                    width: 100%;
                }

                .save-actions {
                    flex-direction: column;
                }

                .save-load-btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Tab switching
        const tabs = this.panelElement.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            EventManager.addEventListener(tab, 'click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Close button
        const closeBtn = this.panelElement.querySelector('.settings-close-btn');
        closeBtn.addEventListener('click', () => this.closePanel());
        
        // Footer buttons
        const applyBtn = this.panelElement.querySelector('.settings-apply-btn');
        applyBtn.addEventListener('click', () => this.applySettings());
        
        const resetBtn = this.panelElement.querySelector('.settings-reset-btn');
        resetBtn.addEventListener('click', () => this.resetToDefaults());
        
        const cancelBtn = this.panelElement.querySelector('.settings-cancel-btn');
        cancelBtn.addEventListener('click', () => this.closePanel());

        // Clear all data button
        const clearAllBtn = this.panelElement.querySelector('.settings-clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllData());
        }

        // Setting controls
        this.setupSettingControls();
        
        // Keyboard navigation
        EventManager.addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });
    },
    
    // Setup individual setting controls
    setupSettingControls() {
        // Audio settings
        this.setupRangeControl('master-volume', 'audio', 'masterVolume', (value) => `${Math.round(value * 100)}%`);
        this.setupRangeControl('music-volume', 'audio', 'musicVolume', (value) => `${Math.round(value * 100)}%`);
        this.setupRangeControl('sfx-volume', 'audio', 'sfxVolume', (value) => `${Math.round(value * 100)}%`);
        
        this.setupCheckboxControl('audio-enabled', 'audio', 'audioEnabled');
        this.setupCheckboxControl('master-mute', 'audio', 'isMuted');
        this.setupCheckboxControl('music-mute', 'audio', 'isMusicMuted');
        this.setupCheckboxControl('sfx-mute', 'audio', 'isSfxMuted');
        
        // Visual settings
        this.setupCheckboxControl('particles-enabled', 'visual', 'particlesEnabled');
        this.setupCheckboxControl('screen-shake-enabled', 'visual', 'screenShakeEnabled');
        this.setupCheckboxControl('visual-animations-enabled', 'visual', 'animationsEnabled');
        this.setupCheckboxControl('weather-effects-enabled', 'visual', 'weatherEffectsEnabled');
        this.setupCheckboxControl('flash-warnings', 'visual', 'flashWarnings');
        this.setupCheckboxControl('reduced-motion', 'visual', 'reducedMotion');
        
        this.setupSelectControl('visual-quality', 'visual', 'quality');
        
        // Animation settings
        this.setupCheckboxControl('animation-enabled', 'animation', 'animationsEnabled');
        this.setupCheckboxControl('animation-reduced-motion', 'animation', 'reducedMotion');
        
        this.setupRangeControl('animation-speed', 'animation', 'animationSpeed', (value) => `${value}x`);
        this.setupSelectControl('animation-quality', 'animation', 'quality');
        
        // UI settings
        this.setupCheckboxControl('ui-animations-enabled', 'ui', 'animationsEnabled');
        this.setupCheckboxControl('hover-effects-enabled', 'ui', 'hoverEffectsEnabled');
        this.setupCheckboxControl('transitions-enabled', 'ui', 'transitionsEnabled');
        this.setupCheckboxControl('ui-reduced-motion', 'ui', 'reducedMotion');
        this.setupCheckboxControl('ui-high-contrast', 'ui', 'highContrast');
        
        this.setupSelectControl('ui-theme', 'ui', 'theme');
        this.setupSelectControl('ui-font-size', 'ui', 'fontSize');
        
        // Environmental settings
        this.setupCheckboxControl('env-weather-enabled', 'environmental', 'weatherEffectsEnabled');
        this.setupCheckboxControl('env-lighting-enabled', 'environmental', 'lightingEnabled');
        this.setupCheckboxControl('env-seasonal-enabled', 'environmental', 'seasonalEffectsEnabled');
        this.setupCheckboxControl('env-reduced-effects', 'environmental', 'reducedEffects');
        
        this.setupSelectControl('env-quality', 'environmental', 'quality');
        
        // Accessibility settings
        this.setupCheckboxControl('access-reduced-motion', 'accessibility', 'reducedMotion');
        this.setupCheckboxControl('access-high-contrast', 'accessibility', 'highContrast');
        this.setupCheckboxControl('access-screen-reader', 'accessibility', 'screenReaderEnabled');
        this.setupCheckboxControl('access-flash-warnings', 'accessibility', 'flashWarnings');
        this.setupCheckboxControl('access-keyboard-nav', 'accessibility', 'keyboardNavigation');
        
        this.setupSelectControl('access-colorblind', 'accessibility', 'colorBlindMode');
        this.setupSelectControl('access-font-size', 'accessibility', 'fontSize');
    },
    
    // Setup range control
    setupRangeControl(elementId, category, settingKey, formatter) {
        const element = this.panelElement.querySelector(`#${elementId}`);
        if (!element) return;
        
        // Set initial value
        element.value = this.currentSettings[category][settingKey];
        
        // Update value display
        const valueDisplay = element.parentElement.querySelector('.setting-value');
        if (valueDisplay && formatter) {
            valueDisplay.textContent = formatter(element.value);
        }
        
        // Add input listener
        EventManager.addEventListener(element, 'input', (e) => {
            const value = parseFloat(e.target.value);
            this.currentSettings[category][settingKey] = value;
            
            if (valueDisplay && formatter) {
                valueDisplay.textContent = formatter(value);
            }
            
            // Apply setting immediately for audio controls
            if (category === 'audio' && typeof AudioSystem !== 'undefined') {
                switch (settingKey) {
                    case 'masterVolume':
                        AudioSystem.setMasterVolume(value);
                        break;
                    case 'musicVolume':
                        AudioSystem.setMusicVolume(value);
                        break;
                    case 'sfxVolume':
                        AudioSystem.setSfxVolume(value);
                        break;
                }
            }
        });
    },
    
    // Setup checkbox control
    setupCheckboxControl(elementId, category, settingKey) {
        const element = this.panelElement.querySelector(`#${elementId}`);
        if (!element) return;
        
        // Set initial value
        element.checked = this.currentSettings[category][settingKey];
        
        // Add change listener
        EventManager.addEventListener(element, 'change', (e) => {
            const value = e.target.checked;
            this.currentSettings[category][settingKey] = value;
            
            // Apply setting immediately for certain controls
            this.applyImmediateSetting(category, settingKey, value);
        });
    },
    
    // Setup select control
    setupSelectControl(elementId, category, settingKey) {
        const element = this.panelElement.querySelector(`#${elementId}`);
        if (!element) return;
        
        // Set initial value
        element.value = this.currentSettings[category][settingKey];
        
        // Add change listener
        EventManager.addEventListener(element, 'change', (e) => {
            const value = e.target.value;
            this.currentSettings[category][settingKey] = value;
            
            // Apply setting immediately for certain controls
            this.applyImmediateSetting(category, settingKey, value);
        });
    },
    
    // Apply immediate setting changes
    applyImmediateSetting(category, settingKey, value) {
        switch (category) {
            case 'audio':
                if (typeof AudioSystem !== 'undefined') {
                    switch (settingKey) {
                        case 'isMuted':
                            AudioSystem.toggleMute();
                            break;
                        case 'isMusicMuted':
                            AudioSystem.toggleMusicMute();
                            break;
                        case 'isSfxMuted':
                            AudioSystem.toggleSfxMute();
                            break;
                    }
                }
                break;
                
            case 'visual':
                if (typeof VisualEffectsSystem !== 'undefined') {
                    switch (settingKey) {
                        case 'quality':
                            VisualEffectsSystem.setQuality(value);
                            break;
                        case 'particlesEnabled':
                            VisualEffectsSystem.toggleParticles();
                            break;
                        case 'screenShakeEnabled':
                            VisualEffectsSystem.toggleScreenShake();
                            break;
                        case 'animationsEnabled':
                            VisualEffectsSystem.toggleAnimations();
                            break;
                        case 'weatherEffectsEnabled':
                            VisualEffectsSystem.toggleWeatherEffects();
                            break;
                        case 'reducedMotion':
                            VisualEffectsSystem.toggleReducedMotion();
                            break;
                        case 'flashWarnings':
                            VisualEffectsSystem.toggleFlashWarnings();
                            break;
                    }
                }
                break;
                
            case 'animation':
                if (typeof AnimationSystem !== 'undefined') {
                    switch (settingKey) {
                        case 'animationSpeed':
                            AnimationSystem.setAnimationSpeed(value);
                            break;
                        case 'quality':
                            AnimationSystem.setQuality(value);
                            break;
                        case 'animationsEnabled':
                            AnimationSystem.toggleAnimations();
                            break;
                        case 'reducedMotion':
                            AnimationSystem.toggleReducedMotion();
                            break;
                    }
                }
                break;
                
            case 'ui':
                if (typeof UIPolishSystem !== 'undefined') {
                    switch (settingKey) {
                        case 'theme':
                            UIPolishSystem.setTheme(value);
                            break;
                        case 'fontSize':
                            UIPolishSystem.setFontSize(value);
                            break;
                        case 'animationsEnabled':
                            UIPolishSystem.toggleAnimations();
                            break;
                        case 'hoverEffectsEnabled':
                            UIPolishSystem.toggleHoverEffects();
                            break;
                        case 'transitionsEnabled':
                            UIPolishSystem.toggleTransitions();
                            break;
                        case 'reducedMotion':
                            UIPolishSystem.toggleReducedMotion();
                            break;
                        case 'highContrast':
                            UIPolishSystem.toggleHighContrast();
                            break;
                    }
                }
                break;
                
            case 'environmental':
                if (typeof EnvironmentalEffectsSystem !== 'undefined') {
                    switch (settingKey) {
                        case 'quality':
                            EnvironmentalEffectsSystem.setQuality(value);
                            break;
                        case 'weatherEffectsEnabled':
                            EnvironmentalEffectsSystem.toggleWeatherEffects();
                            break;
                        case 'lightingEnabled':
                            EnvironmentalEffectsSystem.toggleLighting();
                            break;
                        case 'seasonalEffectsEnabled':
                            EnvironmentalEffectsSystem.toggleSeasonalEffects();
                            break;
                    }
                }
                break;
        }
    },
    
    // Switch tabs
    switchTab(tabName) {
        // Update tab buttons
        const tabs = this.panelElement.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        const contents = this.panelElement.querySelectorAll('.settings-tab-content');
        contents.forEach(content => {
            content.classList.toggle('active', content.dataset.tab === tabName);
        });

        // Refresh save lists when switching to saveload tab
        if (tabName === 'saveload') {
            this.refreshSaveLists();
        }

        // Refresh keybindings when switching to controls tab
        if (tabName === 'controls') {
            this.refreshKeyBindingsUI();
        }
    },

    // ⌨️ Refresh keybindings UI - showing all the ways to control your fate
    refreshKeyBindingsUI() {
        const listContainer = document.getElementById('keybindings-list');
        if (!listContainer) return;

        if (typeof KeyBindings === 'undefined') {
            listContainer.innerHTML = '<p class="no-saves">Keyboard system not available</p>';
            return;
        }

        // Group keybindings by category
        const categories = {
            'Game Control': ['pause', 'escape'],
            'Panels': ['inventory', 'character', 'financial', 'market', 'travel', 'properties', 'achievements', 'settings'],
            'Map Navigation': ['mapUp', 'mapDown', 'mapLeft', 'mapRight', 'zoomIn', 'zoomOut'],
            'Quick Actions': ['quickSave', 'quickLoad']
        };

        let html = '';

        Object.entries(categories).forEach(([category, actions]) => {
            html += `<div class="keybind-section-header">${category}</div>`;

            actions.forEach(action => {
                const key = KeyBindings.getKey(action);
                const description = KeyBindings.descriptions[action] || action;
                const formattedKey = KeyBindings.formatKey(key);

                html += `
                    <div class="keybind-row" data-action="${action}">
                        <span class="keybind-action">${description}</span>
                        <button class="keybind-key" data-action="${action}" onclick="SettingsPanel.startKeyRebind('${action}', this)">
                            ${formattedKey}
                        </button>
                    </div>
                `;
            });
        });

        listContainer.innerHTML = html;

        // Setup reset button
        const resetBtn = document.getElementById('reset-keybindings-btn');
        if (resetBtn) {
            resetBtn.onclick = () => {
                if (confirm('Reset all keybindings to defaults?')) {
                    KeyBindings.resetToDefaults();
                    this.refreshKeyBindingsUI();
                }
            };
        }
    },

    // 🎮 Start rebinding a key - the moment of choice
    startKeyRebind(action, buttonElement) {
        // Remove any existing listening state
        const allKeys = document.querySelectorAll('.keybind-key');
        allKeys.forEach(k => k.classList.remove('listening'));

        // Set this button to listening
        buttonElement.classList.add('listening');
        buttonElement.textContent = 'Press a key...';

        // Store the rebind context
        this.rebindContext = {
            action: action,
            button: buttonElement,
            originalKey: KeyBindings.getKey(action)
        };

        // Listen for keydown
        this.rebindListener = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Cancel on escape
            if (e.key === 'Escape') {
                this.cancelKeyRebind();
                return;
            }

            // Complete the rebind
            this.completeKeyRebind(e.key);
        };

        document.addEventListener('keydown', this.rebindListener, { once: true, capture: true });
    },

    // ✅ Complete rebinding - fate sealed
    completeKeyRebind(newKey) {
        if (!this.rebindContext) return;

        const { action, button } = this.rebindContext;

        // Check for conflicts
        const existingAction = Object.entries(KeyBindings.current).find(
            ([act, key]) => key === newKey && act !== action
        );

        if (existingAction) {
            const existingDesc = KeyBindings.descriptions[existingAction[0]] || existingAction[0];
            if (!confirm(`"${KeyBindings.formatKey(newKey)}" is already used for "${existingDesc}". Swap keys?`)) {
                this.cancelKeyRebind();
                return;
            }
            // Swap the keys (silently)
            KeyBindings.setKey(existingAction[0], this.rebindContext.originalKey, true);
        }

        // Set the new key (silently - we show UI feedback instead)
        KeyBindings.setKey(action, newKey, true);

        // Update UI
        button.classList.remove('listening');
        button.textContent = KeyBindings.formatKey(newKey);

        // Refresh to update any swapped keys
        this.refreshKeyBindingsUI();

        // Cleanup
        this.rebindContext = null;
    },

    // ❌ Cancel rebinding - fate undone
    cancelKeyRebind() {
        if (!this.rebindContext) return;

        const { button, originalKey } = this.rebindContext;
        button.classList.remove('listening');
        button.textContent = KeyBindings.formatKey(originalKey);

        // Remove listener if still attached
        if (this.rebindListener) {
            document.removeEventListener('keydown', this.rebindListener, { capture: true });
        }

        this.rebindContext = null;
    },

    // 📋 Refresh save lists - showing all our timelines
    refreshSaveLists() {
        this.populateAutoSaveList();
        this.populateManualSaveList();
    },

    // 📂 Populate auto-save list
    populateAutoSaveList() {
        const listContainer = document.getElementById('auto-save-list');
        if (!listContainer) return;

        if (typeof SaveLoadSystem === 'undefined') {
            listContainer.innerHTML = '<p class="no-saves">Save system not available</p>';
            return;
        }

        const autoSaves = SaveLoadSystem.getAutoSaveList();

        if (!autoSaves || autoSaves.length === 0) {
            listContainer.innerHTML = '<p class="no-saves">No auto-saves yet... play the game to create some!</p>';
            return;
        }

        listContainer.innerHTML = autoSaves.map(save => `
            <div class="save-slot-item" data-save-index="${save.index}">
                <div class="save-slot-info">
                    <span class="save-slot-name">💾 ${save.name}</span>
                    <span class="save-slot-details">
                        ${save.playerName} | Day ${save.day} | ${save.gold}g | ${save.location}
                    </span>
                    <span class="save-slot-details">${save.formattedTime}</span>
                </div>
                <div class="save-slot-actions">
                    <button class="save-slot-btn load-btn" onclick="SaveLoadSystem.loadAutoSave(${save.index}); SettingsPanel.closePanel();">
                        Load
                    </button>
                </div>
            </div>
        `).join('');
    },

    // 📁 Populate manual save list
    populateManualSaveList() {
        const listContainer = document.getElementById('manual-save-list');
        if (!listContainer) return;

        if (typeof SaveLoadSystem === 'undefined') {
            listContainer.innerHTML = '<p class="no-saves">Save system not available</p>';
            return;
        }

        const manualSaves = Object.entries(SaveLoadSystem.saveSlots)
            .filter(([slot, info]) => info.exists)
            .map(([slot, info]) => ({ slot: parseInt(slot), ...info }));

        if (manualSaves.length === 0) {
            listContainer.innerHTML = '<p class="no-saves">No manual saves yet... press Save Game to create one!</p>';
            return;
        }

        listContainer.innerHTML = manualSaves.map(save => `
            <div class="save-slot-item" data-save-slot="${save.slot}">
                <div class="save-slot-info">
                    <span class="save-slot-name">📁 ${save.name || 'Save Slot ' + save.slot}</span>
                    <span class="save-slot-details">
                        ${save.timestamp ? new Date(save.timestamp).toLocaleString() : 'Unknown date'}
                    </span>
                </div>
                <div class="save-slot-actions">
                    <button class="save-slot-btn load-btn" onclick="SaveLoadSystem.loadFromSlot(${save.slot}); SettingsPanel.closePanel();">
                        Load
                    </button>
                    <button class="save-slot-btn delete-btn" onclick="SaveLoadSystem.deleteSlot(${save.slot}); SettingsPanel.refreshSaveLists();">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Open settings panel
    openPanel() {
        this.isOpen = true;
        this.panelElement.style.display = 'block';
        
        // Add entrance animation
        TimerManager.setTimeout(() => {
            this.panelElement.classList.add('open');
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    },
    
    // Close settings panel
    closePanel() {
        this.isOpen = false;
        this.panelElement.classList.remove('open');

        // Remove after animation
        TimerManager.setTimeout(() => {
            this.panelElement.style.display = 'none';
        }, 300);

        // Restore body scroll
        document.body.style.overflow = '';
    },

    // Alias for show (called from settings button)
    show() {
        this.openPanel();
    },

    // Alias for hide
    hide() {
        this.closePanel();
    },
    
    // Apply settings
    applySettings() {
        // Save all settings
        this.saveSettings();
        
        // Apply all settings to their respective systems
        Object.keys(this.currentSettings).forEach(category => {
            Object.keys(this.currentSettings[category]).forEach(settingKey => {
                this.applyImmediateSetting(category, settingKey, this.currentSettings[category][settingKey]);
            });
        });
        
        // Show notification
        if (typeof UIPolishSystem !== 'undefined') {
            UIPolishSystem.showNotification('Settings applied successfully!', 'success');
        }
        
        this.closePanel();
    },
    
    // Reset to defaults
    resetToDefaults() {
        // Confirm reset
        if (!confirm('Are you sure you want to reset all settings to their default values?')) {
            return;
        }
        
        // Reset all settings
        try {
            this.currentSettings = JSON.parse(JSON.stringify(this.defaultSettings));
        } catch (error) {
            console.error('Failed to reset settings:', error);
            this.currentSettings = JSON.parse(JSON.stringify(this.defaultSettings));
        }
        
        // Update UI controls
        this.updateControlsFromSettings();
        
        // Apply settings
        this.applySettings();
    },

    // Clear ALL data - nuclear option for a fresh start
    clearAllData() {
        // Double confirm because this is destructive
        if (!confirm('⚠️ WARNING: This will DELETE ALL your data including:\n\n• All saved games\n• All settings\n• Panel positions\n• Achievement progress\n• Everything else\n\nThis cannot be undone!\n\nAre you sure you want to continue?')) {
            return;
        }

        // Second confirmation
        if (!confirm('🗑️ FINAL WARNING!\n\nYou are about to permanently delete ALL game data and reset the application to factory defaults.\n\nClick OK to confirm deletion.')) {
            return;
        }

        console.log('🗑️ Clearing all application data...');

        try {
            // Clear all localStorage
            localStorage.clear();
            console.log('✓ LocalStorage cleared');

            // Clear all sessionStorage
            sessionStorage.clear();
            console.log('✓ SessionStorage cleared');

            // Clear IndexedDB if used
            if (window.indexedDB) {
                const databases = ['TraderClaudeDB', 'trader-claude', 'game-saves'];
                databases.forEach(dbName => {
                    try {
                        indexedDB.deleteDatabase(dbName);
                        console.log(`✓ IndexedDB "${dbName}" deleted`);
                    } catch (e) {}
                });
            }

            // Clear cookies for this domain
            document.cookie.split(';').forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            });
            console.log('✓ Cookies cleared');

            // Show success message
            alert('✅ All data has been cleared!\n\nThe page will now reload to complete the reset.');

            // Reload the page to start fresh
            window.location.reload(true);

        } catch (error) {
            console.error('Error clearing data:', error);
            alert('❌ Error clearing some data. Please try clearing your browser data manually.\n\nError: ' + error.message);
        }
    },

    // Update controls from current settings
    updateControlsFromSettings() {
        Object.keys(this.currentSettings).forEach(category => {
            Object.keys(this.currentSettings[category]).forEach(settingKey => {
                const value = this.currentSettings[category][settingKey];
                const element = this.panelElement.querySelector(`#${this.getElementId(category, settingKey)}`);
                
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = value;
                    } else if (element.type === 'range') {
                        element.value = value;
                        // Update value display
                        const valueDisplay = element.parentElement.querySelector('.setting-value');
                        if (valueDisplay) {
                            if (category === 'audio') {
                                valueDisplay.textContent = `${Math.round(value * 100)}%`;
                            } else if (category === 'animation' && settingKey === 'animationSpeed') {
                                valueDisplay.textContent = `${value}x`;
                            }
                        }
                    } else if (element.tagName === 'SELECT') {
                        element.value = value;
                    }
                }
            });
        });
    },
    
    // Get element ID from category and setting key
    getElementId(category, settingKey) {
        const idMap = {
            'audio': {
                'masterVolume': 'master-volume',
                'musicVolume': 'music-volume',
                'sfxVolume': 'sfx-volume',
                'audioEnabled': 'audio-enabled',
                'isMuted': 'master-mute',
                'isMusicMuted': 'music-mute',
                'isSfxMuted': 'sfx-mute'
            },
            'visual': {
                'particlesEnabled': 'particles-enabled',
                'screenShakeEnabled': 'screen-shake-enabled',
                'animationsEnabled': 'visual-animations-enabled',
                'weatherEffectsEnabled': 'weather-effects-enabled',
                'flashWarnings': 'flash-warnings',
                'reducedMotion': 'reduced-motion',
                'quality': 'visual-quality'
            },
            'animation': {
                'animationsEnabled': 'animation-enabled',
                'animationSpeed': 'animation-speed',
                'reducedMotion': 'animation-reduced-motion',
                'quality': 'animation-quality'
            },
            'ui': {
                'animationsEnabled': 'ui-animations-enabled',
                'hoverEffectsEnabled': 'hover-effects-enabled',
                'transitionsEnabled': 'transitions-enabled',
                'reducedMotion': 'ui-reduced-motion',
                'highContrast': 'ui-high-contrast',
                'theme': 'ui-theme',
                'fontSize': 'ui-font-size'
            },
            'environmental': {
                'weatherEffectsEnabled': 'env-weather-enabled',
                'lightingEnabled': 'env-lighting-enabled',
                'seasonalEffectsEnabled': 'env-seasonal-enabled',
                'reducedEffects': 'env-reduced-effects',
                'quality': 'env-quality'
            },
            'accessibility': {
                'reducedMotion': 'access-reduced-motion',
                'highContrast': 'access-high-contrast',
                'screenReaderEnabled': 'access-screen-reader',
                'flashWarnings': 'access-flash-warnings',
                'keyboardNavigation': 'access-keyboard-nav',
                'colorBlindMode': 'access-colorblind',
                'fontSize': 'access-font-size'
            }
        };
        
        return idMap[category]?.[settingKey] || null;
    },
    
    // Get current settings
    getSettings(category = null) {
        if (category) {
            return { ...this.currentSettings[category] };
        }
        try {
            return JSON.parse(JSON.stringify(this.currentSettings));
        } catch (error) {
            console.error('Failed to clone settings:', error);
            return {};
        }
    },
    
    // Update specific setting
    updateSetting(category, settingKey, value) {
        if (this.currentSettings[category] && settingKey in this.currentSettings[category]) {
            this.currentSettings[category][settingKey] = value;
            this.saveSettings(category);
            this.applyImmediateSetting(category, settingKey, value);
        }
    },
    
    // Cleanup
    cleanup() {
        if (this.panelElement) {
            this.panelElement.remove();
        }
        
        const styles = document.getElementById('settings-panel-styles');
        if (styles) {
            styles.remove();
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsPanel;
}