// ═══════════════════════════════════════════════════════════════
// 🖤 SETTINGS PANEL - customizing your suffering experience 🖤
// ═══════════════════════════════════════════════════════════════
// File Version: 0.1
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// tweak audio, visuals, accessibility... make the darkness yours
// because one size fits none and we all suffer differently

const SettingsPanel = {
    // panel state - are we drowning in options or nah
    isOpen: false,
    panelElement: null,
    settingsTabs: {},

    // default settings - where hope goes to die
    defaultSettings: {
        // 🎵 audio settings - drown out the silence
        audio: {
            masterVolume: 0.7,
            musicVolume: 0.5,
            sfxVolume: 0.7,
            isMuted: false,
            isMusicMuted: false,
            isSfxMuted: false,
            audioEnabled: true
        },

        // 👁️ visual settings - see the void in HD
        visual: {
            particlesEnabled: true,
            screenShakeEnabled: true,
            animationsEnabled: true,
            weatherEffectsEnabled: true,
            quality: 'medium',
            reducedMotion: false,
            flashWarnings: true
        },

        // ✨ animation settings - making pixels dance at 3am
        animation: {
            animationsEnabled: true,
            animationSpeed: 1.0,
            reducedMotion: false,
            quality: 'medium'
        },

        // 🎨 ui settings - paint your nightmare pretty
        ui: {
            animationsEnabled: true,
            hoverEffectsEnabled: true,
            transitionsEnabled: true,
            reducedMotion: false,
            highContrast: false,
            fontSize: 'medium',
            theme: 'default'
        },

        // 🌧️ environmental settings - weather for the soul
        environmental: {
            weatherEffectsEnabled: true,
            lightingEnabled: true,
            seasonalEffectsEnabled: true,
            quality: 'medium',
            reducedEffects: false
        },

        // ♿ accessibility settings - suffering should be inclusive
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

    // current settings - your personal flavor of chaos
    currentSettings: {},

    // initialize settings panel - birth of the preference nightmare
    init() {
        this.loadSettings();
        this.createPanel();
        this.setupEventListeners();
        console.log('Settings panel initialized');
    },

    // load settings from localStorage - resurrect your preferences
    loadSettings() {
        // load all setting categories - what fresh hell did we save last time
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

    // save settings to localStorage - etch your choices into the void
    saveSettings(category = null) {
        if (category) {
            localStorage.setItem(`tradingGame${category.charAt(0).toUpperCase() + category.slice(1)}Settings`,
                               JSON.stringify(this.currentSettings[category]));
        } else {
            // save all categories - commit to the full experience
            Object.keys(this.currentSettings).forEach(cat => {
                localStorage.setItem(`tradingGame${cat.charAt(0).toUpperCase() + cat.slice(1)}Settings`, 
                                   JSON.stringify(this.currentSettings[cat]));
            });
        }
    },

    // create settings panel - build the cathedral of customization
    createPanel() {
        // create main panel container - our temple of options
        this.panelElement = document.createElement('div');
        this.panelElement.id = 'settings-panel';
        this.panelElement.className = 'settings-panel';
        this.panelElement.style.display = 'none';

        // create panel structure - the html monstrosity begins
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
                        <button class="settings-tab" data-tab="about">ℹ️ About</button>
                    </div>
                    
                    <div class="settings-panel-content">
                        <!-- 🎵 Audio Tab - the soundtrack to our despair -->
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

                        <!-- 👁️ Visual Tab - feast your eyes on this mess -->
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

                        <!-- ✨ Animation Tab - motion sickness optional -->
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

                        <!-- 🎨 UI Tab - aesthetics for the void -->
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

                        <!-- 🌧️ Environmental Tab - because ambiance matters in hell -->
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

                        <!-- ♿ Accessibility Tab - make the suffering accessible to all -->
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

                        <!-- ⌨️ Controls Tab - remap your keys, not your fate -->
                        <div class="settings-tab-content" data-tab="controls">
                            <h3>⌨️ Keyboard Controls</h3>
                            <p class="settings-description">Click any key binding to change it. Press Escape to cancel.</p>
                            <div class="settings-group">
                                <div class="keybindings-list" id="keybindings-list">
                                    <!-- keybindings spawned by refreshKeyBindingsUI -->
                                </div>
                                <div class="setting-item keybind-actions">
                                    <button class="save-load-btn" id="reset-keybindings-btn">🔄 Reset to Defaults</button>
                                </div>
                            </div>
                        </div>

                        <!-- 💾 Save/Load Tab - ctrl+z for life itself -->
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
                                    <!-- auto-saves materialize here like ghosts -->
                                    <p class="no-saves">No auto-saves yet...</p>
                                </div>

                                <h4>📁 Manual Saves</h4>
                                <div id="manual-save-list" class="manual-save-list">
                                    <!-- manual saves appear when you actually care -->
                                    <p class="no-saves">No manual saves yet...</p>
                                </div>
                            </div>
                        </div>

                        <!-- ℹ️ About Tab - who to blame for this beautiful disaster -->
                        <div class="settings-tab-content" data-tab="about">
                            <div id="about-content" class="about-tab-content">
                                <!-- content summoned by GameConfig -->
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

        // add styles - because ugly code deserves pretty css
        this.addStyles();

        // append to body - inject our darkness into the dom
        document.body.appendChild(this.panelElement);
    },

    // add styles for settings panel - css wizardry at 3am
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

            /* ⌨️ keybindings styles - remap the pain */
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

            /* responsive design - looks bad on all screen sizes equally */
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

            /* ℹ️ about tab styles - ego stroking section */
            .about-tab-content {
                text-align: center;
                padding: 20px;
            }

            .about-section {
                max-width: 400px;
                margin: 0 auto;
            }

            .about-logo {
                font-size: 64px;
                margin-bottom: 10px;
            }

            .about-section h2 {
                color: #FFD700;
                font-size: 28px;
                margin: 10px 0;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            }

            .about-tagline {
                color: #aaa;
                font-style: italic;
                margin: 5px 0 15px 0;
            }

            .about-version {
                display: inline-block;
                background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%);
                padding: 5px 15px;
                border-radius: 20px;
                font-family: monospace;
                font-size: 14px;
                color: #4CAF50;
                margin: 10px 0;
            }

            .about-studio {
                margin: 20px 0;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }

            .studio-label {
                display: block;
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .studio-name {
                display: block;
                color: #FFD700;
                font-size: 20px;
                font-weight: bold;
                margin-top: 5px;
            }

            .about-developers {
                margin: 20px 0;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }

            .about-developers h4 {
                color: #888;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
                border-bottom: none !important;
            }

            .credit-entry {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .credit-entry:last-child {
                border-bottom: none;
            }

            .dev-name {
                color: #e0e0e0;
                font-weight: bold;
            }

            .dev-role {
                color: #888;
                font-size: 12px;
            }

            .about-copyright {
                color: #666;
                font-size: 11px;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
        `;
        document.head.appendChild(style);
    },

    // setup event listeners - wire up the chaos
    setupEventListeners() {
        // tab switching - swap between tabs like moods at 3am
        const tabs = this.panelElement.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            EventManager.addEventListener(tab, 'click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // close button - the escape hatch from our beautiful mess
        const closeBtn = this.panelElement.querySelector('.settings-close-btn');
        closeBtn.addEventListener('click', () => this.closePanel());

        // footer buttons - commit or abandon your choices
        const applyBtn = this.panelElement.querySelector('.settings-apply-btn');
        applyBtn.addEventListener('click', () => this.applySettings());
        
        const resetBtn = this.panelElement.querySelector('.settings-reset-btn');
        resetBtn.addEventListener('click', () => this.resetToDefaults());
        
        const cancelBtn = this.panelElement.querySelector('.settings-cancel-btn');
        cancelBtn.addEventListener('click', () => this.closePanel());

        // clear all data button - the nuclear option
        const clearAllBtn = this.panelElement.querySelector('.settings-clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllData());
        }

        // setting controls - bind the inputs to the void
        this.setupSettingControls();

        // keyboard navigation - escape is always an option
        EventManager.addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });
    },

    // setup individual setting controls - the tedious part
    setupSettingControls() {
        // audio settings - volume knobs for your ears
        this.setupRangeControl('master-volume', 'audio', 'masterVolume', (value) => `${Math.round(value * 100)}%`);
        this.setupRangeControl('music-volume', 'audio', 'musicVolume', (value) => `${Math.round(value * 100)}%`);
        this.setupRangeControl('sfx-volume', 'audio', 'sfxVolume', (value) => `${Math.round(value * 100)}%`);
        
        this.setupCheckboxControl('audio-enabled', 'audio', 'audioEnabled');
        this.setupCheckboxControl('master-mute', 'audio', 'isMuted');
        this.setupCheckboxControl('music-mute', 'audio', 'isMusicMuted');
        this.setupCheckboxControl('sfx-mute', 'audio', 'isSfxMuted');

        // visual settings - checkboxes for your eyeballs
        this.setupCheckboxControl('particles-enabled', 'visual', 'particlesEnabled');
        this.setupCheckboxControl('screen-shake-enabled', 'visual', 'screenShakeEnabled');
        this.setupCheckboxControl('visual-animations-enabled', 'visual', 'animationsEnabled');
        this.setupCheckboxControl('weather-effects-enabled', 'visual', 'weatherEffectsEnabled');
        this.setupCheckboxControl('flash-warnings', 'visual', 'flashWarnings');
        this.setupCheckboxControl('reduced-motion', 'visual', 'reducedMotion');
        
        this.setupSelectControl('visual-quality', 'visual', 'quality');

        // animation settings - make things move or don't, whatever
        this.setupCheckboxControl('animation-enabled', 'animation', 'animationsEnabled');
        this.setupCheckboxControl('animation-reduced-motion', 'animation', 'reducedMotion');
        
        this.setupRangeControl('animation-speed', 'animation', 'animationSpeed', (value) => `${value}x`);
        this.setupSelectControl('animation-quality', 'animation', 'quality');

        // ui settings - fiddle with fonts and themes
        this.setupCheckboxControl('ui-animations-enabled', 'ui', 'animationsEnabled');
        this.setupCheckboxControl('hover-effects-enabled', 'ui', 'hoverEffectsEnabled');
        this.setupCheckboxControl('transitions-enabled', 'ui', 'transitionsEnabled');
        this.setupCheckboxControl('ui-reduced-motion', 'ui', 'reducedMotion');
        this.setupCheckboxControl('ui-high-contrast', 'ui', 'highContrast');
        
        this.setupSelectControl('ui-theme', 'ui', 'theme');
        this.setupSelectControl('ui-font-size', 'ui', 'fontSize');

        // environmental settings - control the weather like a god
        this.setupCheckboxControl('env-weather-enabled', 'environmental', 'weatherEffectsEnabled');
        this.setupCheckboxControl('env-lighting-enabled', 'environmental', 'lightingEnabled');
        this.setupCheckboxControl('env-seasonal-enabled', 'environmental', 'seasonalEffectsEnabled');
        this.setupCheckboxControl('env-reduced-effects', 'environmental', 'reducedEffects');
        
        this.setupSelectControl('env-quality', 'environmental', 'quality');

        // accessibility settings - everyone deserves their specific hell
        this.setupCheckboxControl('access-reduced-motion', 'accessibility', 'reducedMotion');
        this.setupCheckboxControl('access-high-contrast', 'accessibility', 'highContrast');
        this.setupCheckboxControl('access-screen-reader', 'accessibility', 'screenReaderEnabled');
        this.setupCheckboxControl('access-flash-warnings', 'accessibility', 'flashWarnings');
        this.setupCheckboxControl('access-keyboard-nav', 'accessibility', 'keyboardNavigation');
        
        this.setupSelectControl('access-colorblind', 'accessibility', 'colorBlindMode');
        this.setupSelectControl('access-font-size', 'accessibility', 'fontSize');
    },

    // setup range control - sliders are just commitment issues
    setupRangeControl(elementId, category, settingKey, formatter) {
        const element = this.panelElement.querySelector(`#${elementId}`);
        if (!element) return;

        // set initial value from the abyss
        element.value = this.currentSettings[category][settingKey];

        // update value display - show the numbers
        const valueDisplay = element.parentElement.querySelector('.setting-value');
        if (valueDisplay && formatter) {
            valueDisplay.textContent = formatter(element.value);
        }

        // add input listener - react to every twitch
        EventManager.addEventListener(element, 'input', (e) => {
            const value = parseFloat(e.target.value);
            this.currentSettings[category][settingKey] = value;
            
            if (valueDisplay && formatter) {
                valueDisplay.textContent = formatter(value);
            }

            // apply setting immediately for audio controls - instant gratification
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

    // setup checkbox control - binary decisions for complex feelings
    setupCheckboxControl(elementId, category, settingKey) {
        const element = this.panelElement.querySelector(`#${elementId}`);
        if (!element) return;

        // set initial value - check or uncheck your fate
        element.checked = this.currentSettings[category][settingKey];

        // add change listener - when you flip the switch
        EventManager.addEventListener(element, 'change', (e) => {
            const value = e.target.checked;
            this.currentSettings[category][settingKey] = value;

            // apply setting immediately for certain controls - no patience here
            this.applyImmediateSetting(category, settingKey, value);
        });
    },

    // setup select control - dropdowns for the indecisive
    setupSelectControl(elementId, category, settingKey) {
        const element = this.panelElement.querySelector(`#${elementId}`);
        if (!element) return;

        // set initial value - pick your poison
        element.value = this.currentSettings[category][settingKey];

        // add change listener - commitment via dropdown
        EventManager.addEventListener(element, 'change', (e) => {
            const value = e.target.value;
            this.currentSettings[category][settingKey] = value;

            // apply setting immediately for certain controls - live preview baby
            this.applyImmediateSetting(category, settingKey, value);
        });
    },

    // apply immediate setting changes - no waiting around for this
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

    // switch tabs - navigate your preferences like a lost soul
    switchTab(tabName) {
        // update tab buttons - highlight the chosen one
        const tabs = this.panelElement.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // update tab content - show the corresponding mess
        const contents = this.panelElement.querySelectorAll('.settings-tab-content');
        contents.forEach(content => {
            content.classList.toggle('active', content.dataset.tab === tabName);
        });

        // refresh save lists when switching to saveload tab - show all your timelines
        if (tabName === 'saveload') {
            this.refreshSaveLists();
        }

        // refresh keybindings when switching to controls tab - display your key combos
        if (tabName === 'controls') {
            this.refreshKeyBindingsUI();
        }

        // populate about tab with gameconfig data - credits roll at 3am
        if (tabName === 'about') {
            this.populateAboutTab();
        }
    },

    // populate about tab - display who to blame for this mess
    populateAboutTab() {
        const aboutContent = document.getElementById('about-content');
        if (!aboutContent) return;

        if (typeof GameConfig !== 'undefined') {
            aboutContent.innerHTML = GameConfig.getAboutHTML();
        } else {
            // fallback if gameconfig isn't available - manual credits for the lost
            aboutContent.innerHTML = `
                <div class="about-section">
                    <div class="about-logo">🏰</div>
                    <h2>Medieval Trading Game</h2>
                    <p class="about-tagline">where capitalism meets the dark ages... literally</p>
                    <div class="about-version">Version 0.1</div>
                    <div class="about-studio">
                        <span class="studio-label">Created by</span>
                        <span class="studio-name">Unity AI Lab</span>
                    </div>
                    <div class="about-developers">
                        <h4>the night crew</h4>
                        <div class="credit-entry"><span class="dev-name">Hackall360</span><span class="dev-role">lead suffering architect</span></div>
                        <div class="credit-entry"><span class="dev-name">Sponge</span><span class="dev-role">code sorcerer</span></div>
                        <div class="credit-entry"><span class="dev-name">GFourteen</span><span class="dev-role">digital necromancer</span></div>
                    </div>
                    <div class="about-copyright">© 2024 Unity AI Lab. all rights reserved. blame us accordingly.</div>
                </div>
            `;
        }
    },

    // refresh keybindings ui - map your keyboard to your suffering
    refreshKeyBindingsUI() {
        const listContainer = document.getElementById('keybindings-list');
        if (!listContainer) return;

        if (typeof KeyBindings === 'undefined') {
            listContainer.innerHTML = '<p class="no-saves">Keyboard system not available</p>';
            return;
        }

        // group keybindings by category - organize the chaos
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

        // setup reset button - return to factory defaults
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

    // start rebinding a key - press any key to continue your descent
    startKeyRebind(action, buttonElement) {
        // remove any existing listening state - only one key at a time
        const allKeys = document.querySelectorAll('.keybind-key');
        allKeys.forEach(k => k.classList.remove('listening'));

        // set this button to listening - awaiting your input
        buttonElement.classList.add('listening');
        buttonElement.textContent = 'Press a key...';

        // store the rebind context - remember what we're changing
        this.rebindContext = {
            action: action,
            button: buttonElement,
            originalKey: KeyBindings.getKey(action)
        };

        // listen for keydown - capture your choice
        this.rebindListener = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // cancel on escape - second thoughts are valid
            if (e.key === 'Escape') {
                this.cancelKeyRebind();
                return;
            }

            // complete the rebind - seal the deal
            this.completeKeyRebind(e.key);
        };

        document.addEventListener('keydown', this.rebindListener, { once: true, capture: true });
    },

    // complete rebinding - your choice is locked in
    completeKeyRebind(newKey) {
        if (!this.rebindContext) return;

        const { action, button } = this.rebindContext;

        // check for conflicts - did you steal someone else's key
        const existingAction = Object.entries(KeyBindings.current).find(
            ([act, key]) => key === newKey && act !== action
        );

        if (existingAction) {
            const existingDesc = KeyBindings.descriptions[existingAction[0]] || existingAction[0];
            if (!confirm(`"${KeyBindings.formatKey(newKey)}" is already used for "${existingDesc}". Swap keys?`)) {
                this.cancelKeyRebind();
                return;
            }
            // swap the keys - silent but deadly
            KeyBindings.setKey(existingAction[0], this.rebindContext.originalKey, true);
        }

        // set the new key - commit to the change
        KeyBindings.setKey(action, newKey, true);

        // update ui - make it official
        button.classList.remove('listening');
        button.textContent = KeyBindings.formatKey(newKey);

        // refresh to update any swapped keys - cascade the changes
        this.refreshKeyBindingsUI();

        // cleanup - dispose of the evidence
        this.rebindContext = null;
    },

    // cancel rebinding - nevermind, keep the old key
    cancelKeyRebind() {
        if (!this.rebindContext) return;

        const { button, originalKey } = this.rebindContext;
        button.classList.remove('listening');
        button.textContent = KeyBindings.formatKey(originalKey);

        // remove listener if still attached - cleanup time
        if (this.rebindListener) {
            document.removeEventListener('keydown', this.rebindListener, { capture: true });
        }

        this.rebindContext = null;
    },

    // refresh save lists - display all your saved moments
    refreshSaveLists() {
        this.populateAutoSaveList();
        this.populateManualSaveList();
    },

    // populate auto-save list - the system's attempt at saving you
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

    // populate manual save list - your deliberate checkpoints
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

    // open settings panel - welcome to configuration hell
    openPanel() {
        this.isOpen = true;
        this.panelElement.style.display = 'block';

        // add entrance animation - fade in like regret
        TimerManager.setTimeout(() => {
            this.panelElement.classList.add('open');
        }, 10);

        // prevent body scroll - trap you in here with us
        document.body.style.overflow = 'hidden';
    },

    // close settings panel - escape back to reality
    closePanel() {
        this.isOpen = false;
        this.panelElement.classList.remove('open');

        // remove after animation - fade out gracefully
        TimerManager.setTimeout(() => {
            this.panelElement.style.display = 'none';
        }, 300);

        // restore body scroll - freedom returns
        document.body.style.overflow = '';
    },

    // alias for show - another way in
    show() {
        this.openPanel();
    },

    // alias for hide - another way out
    hide() {
        this.closePanel();
    },

    // apply settings - commit your choices to the void
    applySettings() {
        // save all settings - persist your decisions
        this.saveSettings();

        // apply all settings to their respective systems - make it real
        Object.keys(this.currentSettings).forEach(category => {
            Object.keys(this.currentSettings[category]).forEach(settingKey => {
                this.applyImmediateSetting(category, settingKey, this.currentSettings[category][settingKey]);
            });
        });

        // show notification - pat yourself on the back
        if (typeof UIPolishSystem !== 'undefined') {
            UIPolishSystem.showNotification('Settings applied successfully!', 'success');
        }
        
        this.closePanel();
    },

    // reset to defaults - undo all your questionable choices
    resetToDefaults() {
        // confirm reset - are you sure about this
        if (!confirm('Are you sure you want to reset all settings to their default values?')) {
            return;
        }

        // reset all settings - back to square one
        try {
            this.currentSettings = JSON.parse(JSON.stringify(this.defaultSettings));
        } catch (error) {
            console.error('Failed to reset settings:', error);
            this.currentSettings = JSON.parse(JSON.stringify(this.defaultSettings));
        }

        // update ui controls - show the defaults in all their glory
        this.updateControlsFromSettings();

        // apply settings - enforce the reset
        this.applySettings();
    },

    // clear all data - burn it all down and start fresh
    clearAllData() {
        // double confirm because this is destructive - we're serious here
        if (!confirm('⚠️ WARNING: This will DELETE ALL your data including:\n\n• All saved games\n• All settings\n• Panel positions\n• Achievement progress\n• Everything else\n\nThis cannot be undone!\n\nAre you sure you want to continue?')) {
            return;
        }

        // second confirmation - last chance to bail
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

            // clear indexeddb if used - purge the databases
            if (window.indexedDB) {
                const databases = ['TraderClaudeDB', 'trader-claude', 'game-saves'];
                databases.forEach(dbName => {
                    try {
                        indexedDB.deleteDatabase(dbName);
                        console.log(`✓ IndexedDB "${dbName}" deleted`);
                    } catch (e) {}
                });
            }

            // clear cookies for this domain - crumbs be gone
            document.cookie.split(';').forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            });
            console.log('✓ Cookies cleared');

            // show success message - it's done
            alert('✅ All data has been cleared!\n\nThe page will now reload to complete the reset.');

            // reload the page to start fresh - rebirth imminent
            window.location.reload(true);

        } catch (error) {
            console.error('Error clearing data:', error);
            alert('❌ Error clearing some data. Please try clearing your browser data manually.\n\nError: ' + error.message);
        }
    },

    // update controls from current settings - sync ui with reality
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
                        // update value display - show what it's set to
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

    // get element id from category and setting key - the mapping ritual
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

    // get current settings - retrieve your configuration
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

    // update specific setting - change just one thing
    updateSetting(category, settingKey, value) {
        if (this.currentSettings[category] && settingKey in this.currentSettings[category]) {
            this.currentSettings[category][settingKey] = value;
            this.saveSettings(category);
            this.applyImmediateSetting(category, settingKey, value);
        }
    },

    // cleanup - destroy the evidence
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

// export for use in other modules - share the suffering
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsPanel;
}