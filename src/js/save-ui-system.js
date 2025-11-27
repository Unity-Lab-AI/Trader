// ═══════════════════════════════════════════════════════════════
// 🖤 SAVE UI SYSTEM - the interface for timeline manipulation 🖤
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// save dialogs, load browsers, and the leaderboard of fallen souls
// because losing progress is the real death in gaming

const SaveUISystem = {
    // ═══════════════════════════════════════════════════════════════
    // 🕯️ INITIALIZATION - summoning the dark arts of ui preservation
    // ═══════════════════════════════════════════════════════════════

    init() {
        console.log('💾 SaveUISystem: Initializing...');

        // drag these ui elements kicking and screaming into existence
        this.createSaveAsDialog();
        this.createLoadGameDialog();
        this.createLeaderboardDisplay();

        // paranoid autosave because browsers don't care about your feelings
        this.setupAutoSaveOnUnload();

        // bind the cursed menu buttons to their dark purpose
        this.wireUpMainMenuButtons();

        // refresh the hall of fallen merchants
        this.updateLeaderboard();

        // wake the load button if there's anything worth remembering
        this.updateLoadButtonState();

        console.log('💾 SaveUISystem: Ready!');
    },

    // ═══════════════════════════════════════════════════════════════
    // 💀 AUTO-SAVE ON PAGE CLOSE - panic mode activated
    // ═══════════════════════════════════════════════════════════════

    setupAutoSaveOnUnload() {
        // beforeunload - because rage quitting shouldn't mean data loss
        window.addEventListener('beforeunload', (e) => {
            this.performEmergencySave();
        });

        // pagehide - mobile users deserve salvation too
        window.addEventListener('pagehide', (e) => {
            this.performEmergencySave();
        });

        // visibilitychange - alt-tab doesn't mean i trust you, browser
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.performEmergencySave();
            }
        });

        console.log('💾 Auto-save on unload configured');
    },

    performEmergencySave() {
        // only save if you're not already dead inside (and outside)
        if (typeof game === 'undefined' || !game.player) return;
        if (game.state !== GameState.PLAYING) return;

        try {
            // package your life's work into json and hope for the best
            const saveData = {
                version: SaveLoadSystem.saveVersion || '1.0.0',
                timestamp: Date.now(),
                isEmergencySave: true,
                gameData: SaveLoadSystem.getCompleteGameState?.()?.gameData || this.getBasicGameState()
            };

            // shove it into the void known as localStorage
            localStorage.setItem('tradingGameEmergencySave', JSON.stringify(saveData));
            console.log('💾 Emergency save completed');

        } catch (e) {
            console.error('💾 Emergency save failed:', e);
        }
    },

    getBasicGameState() {
        // desperate fallback for when the real save system is mia
        return {
            player: game.player ? { ...game.player } : null,
            currentLocation: game.currentLocation,
            timeState: typeof TimeSystem !== 'undefined' ? {
                currentTime: TimeSystem.currentTime,
                currentSpeed: TimeSystem.currentSpeed,
                isPaused: TimeSystem.isPaused
            } : null
        };
    },

    // scavenge the wreckage for any signs of life
    checkForEmergencySave() {
        const emergencySave = localStorage.getItem('tradingGameEmergencySave');
        if (emergencySave) {
            try {
                const saveData = JSON.parse(emergencySave);
                const timestamp = new Date(saveData.timestamp).toLocaleString();
                return {
                    exists: true,
                    timestamp: timestamp,
                    data: saveData
                };
            } catch (e) {
                return { exists: false };
            }
        }
        return { exists: false };
    },

    // ═══════════════════════════════════════════════════════════════
    // 🥀 SAVE AS DIALOG - choose your timeline's tombstone
    // ═══════════════════════════════════════════════════════════════

    createSaveAsDialog() {
        // exorcise any previous incarnations
        const existing = document.getElementById('save-as-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'save-as-overlay';
        overlay.className = 'save-ui-overlay';
        overlay.innerHTML = `
            <div class="save-ui-backdrop" onclick="SaveUISystem.closeSaveAsDialog()"></div>
            <div class="save-ui-dialog save-as-dialog">
                <div class="save-ui-header">
                    <h2>💾 Save Game</h2>
                    <button class="save-ui-close" onclick="SaveUISystem.closeSaveAsDialog()">✕</button>
                </div>
                <div class="save-ui-content">
                    <div class="save-name-input-section">
                        <label for="save-name-input">Save Name:</label>
                        <input type="text" id="save-name-input" placeholder="Enter save name..." maxlength="30" autocomplete="off" />
                        <div class="save-name-hint">Max 30 characters</div>
                    </div>
                    <div class="save-slot-section">
                        <label>Select Slot:</label>
                        <div id="save-slots-list" class="save-slots-grid"></div>
                    </div>
                    <div class="save-preview" id="save-preview">
                        <div class="preview-title">Current Game</div>
                        <div class="preview-info" id="save-preview-info"></div>
                    </div>
                </div>
                <div class="save-ui-footer">
                    <button class="save-ui-btn save-ui-btn-secondary" onclick="SaveUISystem.closeSaveAsDialog()">Cancel</button>
                    <button class="save-ui-btn save-ui-btn-primary" id="confirm-save-btn" onclick="SaveUISystem.confirmSave()">💾 Save</button>
                </div>
            </div>
        `;

        overlay.style.display = 'none';
        document.body.appendChild(overlay);
    },

    openSaveAsDialog() {
        console.log('🖤 openSaveAsDialog called');
        const overlay = document.getElementById('save-as-overlay');
        if (!overlay) {
            console.error('🖤 save-as-overlay not found! Recreating...');
            this.createSaveAsDialog();
            return this.openSaveAsDialog(); // Try again after creating
        }

        // sorry pal, no saving in the void
        if (typeof game === 'undefined' || game.state !== GameState.PLAYING) {
            console.warn('🖤 Cannot save - game state:', game?.state);
            if (typeof addMessage === 'function') {
                addMessage('Cannot save outside of gameplay!', 'error');
            }
            return;
        }

        // fill the slots with your alternate realities
        this.populateSaveSlots();

        // show what you're about to immortalize
        this.updateSavePreview();

        // auto-generate a name because naming things is hard at 3am
        const nameInput = document.getElementById('save-name-input');
        if (nameInput) {
            const playerName = game.player?.name || 'Hero';
            const day = typeof TimeSystem !== 'undefined' ? TimeSystem.currentTime?.day || 1 : 1;
            nameInput.value = `${playerName} - Day ${day}`;
            nameInput.focus();
            nameInput.select();
        }

        // 🖤 CRITICAL: Remove hidden class AND set display to ensure visibility
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
        console.log('🖤 Save dialog opened');

        // freeze time because multitasking is a myth
        if (typeof TimeSystem !== 'undefined' && !TimeSystem.isPaused) {
            this._wasGamePaused = false;
            TimeSystem.pause();
        } else {
            this._wasGamePaused = true;
        }
    },

    closeSaveAsDialog() {
        const overlay = document.getElementById('save-as-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }

        // let time flow again, like tears in rain
        if (!this._wasGamePaused && typeof TimeSystem !== 'undefined') {
            TimeSystem.resume();
        }
    },

    populateSaveSlots() {
        const container = document.getElementById('save-slots-list');
        if (!container) return;

        let html = '';

        for (let i = 1; i <= SaveLoadSystem.maxSaveSlots; i++) {
            const slot = SaveLoadSystem.saveSlots[i];
            const isEmpty = !slot || !slot.exists;
            const isSelected = this._selectedSaveSlot === i;

            if (isEmpty) {
                html += `
                    <div class="save-slot ${isSelected ? 'selected' : ''}" data-slot="${i}" onclick="SaveUISystem.selectSaveSlot(${i})">
                        <div class="slot-number">${i}</div>
                        <div class="slot-info">
                            <div class="slot-name">Empty Slot</div>
                            <div class="slot-empty">Click to save here</div>
                        </div>
                    </div>
                `;
            } else {
                const date = new Date(slot.timestamp).toLocaleDateString();
                const time = new Date(slot.timestamp).toLocaleTimeString();
                const gold = slot.playerInfo?.gold || 0;
                const location = slot.playerInfo?.location || 'Unknown';

                html += `
                    <div class="save-slot has-data ${isSelected ? 'selected' : ''}" data-slot="${i}" onclick="SaveUISystem.selectSaveSlot(${i})">
                        <div class="slot-number">${i}</div>
                        <div class="slot-info">
                            <div class="slot-name">${slot.name}</div>
                            <div class="slot-details">
                                <span>💰 ${gold.toLocaleString()}g</span>
                                <span>📍 ${location}</span>
                            </div>
                            <div class="slot-date">${date} ${time}</div>
                        </div>
                        <div class="slot-actions">
                            <div class="slot-overwrite-warning">⚠️ Overwrite</div>
                            <button class="slot-delete-btn" onclick="event.stopPropagation(); SaveUISystem.deleteSaveSlot(${i});" title="Delete this save">🗑️</button>
                        </div>
                    </div>
                `;
            }
        }

        container.innerHTML = html;

        // pick the first empty grave or whatever
        if (!this._selectedSaveSlot) {
            for (let i = 1; i <= SaveLoadSystem.maxSaveSlots; i++) {
                if (!SaveLoadSystem.saveSlots[i]?.exists) {
                    this.selectSaveSlot(i);
                    break;
                }
            }
            // all slots occupied? brutal. overwrite slot 1 like a monster
            if (!this._selectedSaveSlot) {
                this.selectSaveSlot(1);
            }
        }
    },

    selectSaveSlot(slotNumber) {
        this._selectedSaveSlot = slotNumber;

        // highlight the chosen vessel
        const slots = document.querySelectorAll('.save-slot');
        slots.forEach(slot => {
            slot.classList.remove('selected');
            if (parseInt(slot.dataset.slot) === slotNumber) {
                slot.classList.add('selected');
            }
        });

        // whisper ominously if you're about to delete someone's past
        const slot = SaveLoadSystem.saveSlots[slotNumber];
        const nameInput = document.getElementById('save-name-input');
        if (nameInput && slot?.exists) {
            nameInput.placeholder = `Overwriting: ${slot.name}`;
        } else if (nameInput) {
            nameInput.placeholder = 'Enter save name...';
        }
    },

    updateSavePreview() {
        const previewInfo = document.getElementById('save-preview-info');
        if (!previewInfo) return;

        const playerName = game.player?.name || 'Unknown';
        const gold = game.player?.gold || 0;
        const location = game.currentLocation?.name || 'Unknown';
        const day = typeof TimeSystem !== 'undefined' ? TimeSystem.currentTime?.day || 1 : 1;
        const month = typeof TimeSystem !== 'undefined' ? TimeSystem.currentTime?.month || 1 : 1;
        const year = typeof TimeSystem !== 'undefined' ? TimeSystem.currentTime?.year || 1 : 1;

        previewInfo.innerHTML = `
            <div class="preview-row"><span>👤</span> ${playerName}</div>
            <div class="preview-row"><span>💰</span> ${gold.toLocaleString()} gold</div>
            <div class="preview-row"><span>📍</span> ${location}</div>
            <div class="preview-row"><span>📅</span> Day ${day}, Month ${month}, Year ${year}</div>
        `;
    },

    confirmSave() {
        if (!this._selectedSaveSlot) {
            if (typeof addMessage === 'function') {
                addMessage('Please select a save slot!', 'error');
            }
            return;
        }

        const nameInput = document.getElementById('save-name-input');
        const saveName = nameInput?.value.trim() || `Save ${this._selectedSaveSlot}`;
        const savedSlot = this._selectedSaveSlot;

        console.log('🖤 confirmSave: committing slot', savedSlot, 'to the void...');

        // commit your progress to the digital afterlife
        const success = SaveLoadSystem.saveToSlot(this._selectedSaveSlot, saveName);

        if (success) {
            console.log('🖤 save succeeded, refreshing the graveyard...');

            // immediately force refresh the save slots display
            // (SaveLoadSystem.notifyUIRefresh should also call this, but belt and suspenders)
            this.populateSaveSlots();

            // re-select the slot we just saved to (keeps it highlighted)
            this._selectedSaveSlot = savedSlot;
            this.selectSaveSlot(savedSlot);

            // flash the slot like it's taking its dying breath
            setTimeout(() => {
                const slotElement = document.querySelector(`.save-slot[data-slot="${savedSlot}"]`);
                if (slotElement) {
                    slotElement.classList.add('just-saved');
                    setTimeout(() => slotElement.classList.remove('just-saved'), 1500);
                }
            }, 50);

            // vanish back into the game with your achievement unlocked
            setTimeout(() => {
                this.closeSaveAsDialog();
                this._selectedSaveSlot = null;
            }, 1000);
        } else {
            console.warn('🖤 save failed... the void rejected our offering');
        }
    },

    // 🗑️ Delete a save from the save panel
    deleteSaveSlot(slotNumber) {
        const slot = SaveLoadSystem.saveSlots[slotNumber];
        if (!slot || !slot.exists) {
            console.log('🗑️ Slot is already empty');
            return;
        }

        const confirmDelete = confirm(`⚠️ DELETE SAVE?\n\nYou are about to delete:\n"${slot.name}"\n\nThis cannot be undone!`);
        if (!confirmDelete) return;

        console.log(`🗑️ Deleting save slot ${slotNumber}...`);

        // Delete the save
        SaveLoadSystem.deleteSave(slotNumber);

        // Refresh the save slots display
        this.populateSaveSlots();

        // Clear selection if we deleted the selected slot
        if (this._selectedSaveSlot === slotNumber) {
            this._selectedSaveSlot = null;
            // Select first available empty slot
            for (let i = 1; i <= SaveLoadSystem.maxSaveSlots; i++) {
                if (!SaveLoadSystem.saveSlots[i]?.exists) {
                    this.selectSaveSlot(i);
                    break;
                }
            }
        }

        if (typeof addMessage === 'function') {
            addMessage(`Save "${slot.name}" deleted.`, 'info');
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🌑 LOAD GAME DIALOG - resurrect your past mistakes
    // ═══════════════════════════════════════════════════════════════

    createLoadGameDialog() {
        // banish the old dialog to the shadow realm
        const existing = document.getElementById('load-game-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'load-game-overlay';
        overlay.className = 'save-ui-overlay';
        overlay.innerHTML = `
            <div class="save-ui-backdrop" onclick="SaveUISystem.closeLoadGameDialog()"></div>
            <div class="save-ui-dialog load-game-dialog">
                <div class="save-ui-header">
                    <h2>📂 Load Game</h2>
                    <button class="save-ui-close" onclick="SaveUISystem.closeLoadGameDialog()">✕</button>
                </div>
                <div class="save-ui-tabs">
                    <button class="save-ui-tab active" data-tab="manual" onclick="SaveUISystem.switchLoadTab('manual')">💾 Saved Games</button>
                    <button class="save-ui-tab" data-tab="auto" onclick="SaveUISystem.switchLoadTab('auto')">🔄 Auto-Saves</button>
                </div>
                <div class="save-ui-content">
                    <div id="load-tab-manual" class="load-tab-content active">
                        <div id="load-slots-list" class="load-slots-list"></div>
                    </div>
                    <div id="load-tab-auto" class="load-tab-content">
                        <div id="load-autosaves-list" class="load-slots-list"></div>
                    </div>
                    <div class="load-preview" id="load-preview">
                        <div class="preview-title">Selected Save</div>
                        <div class="preview-info" id="load-preview-info">
                            <div class="no-selection">Select a save to view details</div>
                        </div>
                    </div>
                </div>
                <div class="save-ui-footer">
                    <button class="save-ui-btn save-ui-btn-danger" id="delete-save-btn" onclick="SaveUISystem.deleteSelectedSave()" disabled>🗑️ Delete</button>
                    <div class="footer-spacer"></div>
                    <button class="save-ui-btn save-ui-btn-secondary" onclick="SaveUISystem.closeLoadGameDialog()">Cancel</button>
                    <button class="save-ui-btn save-ui-btn-primary" id="confirm-load-btn" onclick="SaveUISystem.confirmLoad()" disabled>📂 Load</button>
                </div>
            </div>
        `;

        overlay.style.display = 'none';
        document.body.appendChild(overlay);
    },

    openLoadGameDialog() {
        console.log('🖤 openLoadGameDialog called');
        const overlay = document.getElementById('load-game-overlay');
        if (!overlay) {
            console.error('🖤 load-game-overlay not found! Recreating...');
            this.createLoadGameDialog();
            return this.openLoadGameDialog(); // Try again after creating
        }

        // wipe the slate clean, no preconceptions
        this._selectedLoadSlot = null;
        this._selectedLoadType = 'manual';

        // summon the ghosts of playthroughs past
        this.populateLoadSlots();
        this.populateAutoSaveSlots();

        // check if your browser saved your ass when you rage quit
        const emergencySave = this.checkForEmergencySave();
        if (emergencySave.exists) {
            this.showEmergencySaveNotice(emergencySave);
        }

        // clear the preview pane, waiting for your choice
        this.updateLoadPreview(null);

        // gray out buttons until you pick a timeline to restore
        document.getElementById('confirm-load-btn')?.setAttribute('disabled', 'true');
        document.getElementById('delete-save-btn')?.setAttribute('disabled', 'true');

        // 🖤 CRITICAL: Remove hidden class AND set display to ensure visibility
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
        console.log('🖤 Load dialog opened');
    },

    closeLoadGameDialog() {
        const overlay = document.getElementById('load-game-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },

    switchLoadTab(tabName) {
        // toggle between manual saves and autosaves like switching personalities
        document.querySelectorAll('.save-ui-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });

        // swap the visible content without ceremony
        document.querySelectorAll('.load-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`load-tab-${tabName}`)?.classList.add('active');

        // forget your previous selection, start fresh
        this._selectedLoadSlot = null;
        this._selectedLoadType = tabName;
        this.updateLoadPreview(null);
        document.getElementById('confirm-load-btn')?.setAttribute('disabled', 'true');
        document.getElementById('delete-save-btn')?.setAttribute('disabled', 'true');
    },

    populateLoadSlots() {
        const container = document.getElementById('load-slots-list');
        if (!container) return;

        let html = '';
        let hasSaves = false;

        for (let i = 1; i <= SaveLoadSystem.maxSaveSlots; i++) {
            const slot = SaveLoadSystem.saveSlots[i];
            if (!slot?.exists) continue;

            hasSaves = true;
            const date = new Date(slot.timestamp).toLocaleDateString();
            const time = new Date(slot.timestamp).toLocaleTimeString();
            const gold = slot.playerInfo?.gold || 0;
            const location = slot.playerInfo?.location || 'Unknown';
            const days = slot.playerInfo?.daysSurvived || 0;
            const playerName = slot.playerInfo?.name || 'Unknown';

            html += `
                <div class="load-slot" data-slot="${i}" data-type="manual" onclick="SaveUISystem.selectLoadSlot(${i}, 'manual')">
                    <div class="load-slot-icon">💾</div>
                    <div class="load-slot-info">
                        <div class="load-slot-name">${slot.name}</div>
                        <div class="load-slot-player">👤 ${playerName}</div>
                        <div class="load-slot-details">
                            <span>💰 ${gold.toLocaleString()}g</span>
                            <span>📍 ${location}</span>
                            <span>📅 ${days} days</span>
                        </div>
                        <div class="load-slot-date">${date} at ${time}</div>
                    </div>
                </div>
            `;
        }

        if (!hasSaves) {
            html = `
                <div class="no-saves-message">
                    <div class="no-saves-icon">📭</div>
                    <div class="no-saves-text">No saved games found</div>
                    <div class="no-saves-hint">Start a new game and save your progress!</div>
                </div>
            `;
        }

        container.innerHTML = html;
    },

    populateAutoSaveSlots() {
        const container = document.getElementById('load-autosaves-list');
        if (!container) return;

        const autoSaves = SaveLoadSystem.getAutoSaveList?.() || [];
        let html = '';

        if (autoSaves.length === 0) {
            html = `
                <div class="no-saves-message">
                    <div class="no-saves-icon">🔄</div>
                    <div class="no-saves-text">No auto-saves found</div>
                    <div class="no-saves-hint">Auto-saves are created every 5 minutes during gameplay</div>
                </div>
            `;
        } else {
            autoSaves.forEach((save, index) => {
                html += `
                    <div class="load-slot" data-slot="${save.index}" data-type="auto" onclick="SaveUISystem.selectLoadSlot(${save.index}, 'auto')">
                        <div class="load-slot-icon">🔄</div>
                        <div class="load-slot-info">
                            <div class="load-slot-name">${save.name}</div>
                            <div class="load-slot-player">👤 ${save.playerName}</div>
                            <div class="load-slot-details">
                                <span>💰 ${(save.gold || 0).toLocaleString()}g</span>
                                <span>📍 ${save.location || 'Unknown'}</span>
                                <span>📅 Day ${save.day || 1}</span>
                            </div>
                            <div class="load-slot-date">${save.formattedTime}</div>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;
    },

    showEmergencySaveNotice(emergencySave) {
        const container = document.getElementById('load-tab-manual');
        if (!container) return;

        const notice = document.createElement('div');
        notice.className = 'emergency-save-notice';
        notice.innerHTML = `
            <div class="emergency-save-icon">⚠️</div>
            <div class="emergency-save-info">
                <div class="emergency-save-title">Recovery Save Found!</div>
                <div class="emergency-save-text">Unsaved progress was recovered from ${emergencySave.timestamp}</div>
            </div>
            <button class="emergency-save-load" onclick="SaveUISystem.loadEmergencySave()">Recover</button>
            <button class="emergency-save-dismiss" onclick="SaveUISystem.dismissEmergencySave()">✕</button>
        `;

        container.insertBefore(notice, container.firstChild);
    },

    loadEmergencySave() {
        const emergencyData = localStorage.getItem('tradingGameEmergencySave');
        if (!emergencyData) return;

        try {
            const saveData = JSON.parse(emergencyData);
            if (SaveLoadSystem.loadGameState) {
                SaveLoadSystem.loadGameState(saveData.gameData);
            }

            // Clear emergency save after loading
            localStorage.removeItem('tradingGameEmergencySave');

            this.closeLoadGameDialog();

            if (typeof addMessage === 'function') {
                addMessage('🔄 Emergency save recovered!', 'success');
            }
        } catch (e) {
            console.error('Failed to load emergency save:', e);
        }
    },

    dismissEmergencySave() {
        localStorage.removeItem('tradingGameEmergencySave');
        const notice = document.querySelector('.emergency-save-notice');
        if (notice) notice.remove();
    },

    selectLoadSlot(slotNumber, type) {
        this._selectedLoadSlot = slotNumber;
        this._selectedLoadType = type;

        // mark the chosen save with the kiss of selection
        document.querySelectorAll('.load-slot').forEach(slot => {
            slot.classList.remove('selected');
            if (parseInt(slot.dataset.slot) === slotNumber && slot.dataset.type === type) {
                slot.classList.add('selected');
            }
        });

        // awaken the load and delete buttons from their slumber
        document.getElementById('confirm-load-btn')?.removeAttribute('disabled');
        document.getElementById('delete-save-btn')?.removeAttribute('disabled');

        // display the save's life story in the preview
        this.updateLoadPreview(slotNumber, type);
    },

    updateLoadPreview(slotNumber, type = 'manual') {
        const previewInfo = document.getElementById('load-preview-info');
        if (!previewInfo) return;

        if (slotNumber === null) {
            previewInfo.innerHTML = '<div class="no-selection">Select a save to view details</div>';
            return;
        }

        let saveData = null;

        if (type === 'manual') {
            const slot = SaveLoadSystem.saveSlots[slotNumber];
            if (slot?.exists) {
                saveData = slot;
            }
        } else {
            const autoSaves = SaveLoadSystem.getAutoSaveList?.() || [];
            saveData = autoSaves.find(s => s.index === slotNumber);
        }

        if (!saveData) {
            previewInfo.innerHTML = '<div class="no-selection">Save data not found</div>';
            return;
        }

        const playerName = saveData.playerInfo?.name || saveData.playerName || 'Unknown';
        const gold = saveData.playerInfo?.gold || saveData.gold || 0;
        const location = saveData.playerInfo?.location || saveData.location || 'Unknown';
        const days = saveData.playerInfo?.daysSurvived || saveData.day || 0;
        const version = saveData.version || 'Unknown';

        previewInfo.innerHTML = `
            <div class="preview-row"><span>👤</span> ${playerName}</div>
            <div class="preview-row"><span>💰</span> ${gold.toLocaleString()} gold</div>
            <div class="preview-row"><span>📍</span> ${location}</div>
            <div class="preview-row"><span>📅</span> ${days} days survived</div>
            <div class="preview-row version"><span>🔧</span> Version ${version}</div>
        `;
    },

    confirmLoad() {
        if (this._selectedLoadSlot === null) {
            console.log('🖤 confirmLoad: No slot selected');
            return;
        }

        console.log('🖤 confirmLoad: Attempting to load slot', this._selectedLoadSlot, 'type:', this._selectedLoadType);

        let success = false;

        try {
            if (this._selectedLoadType === 'manual') {
                success = SaveLoadSystem.loadFromSlot(this._selectedLoadSlot);
            } else {
                success = SaveLoadSystem.loadAutoSave(this._selectedLoadSlot);
            }
        } catch (e) {
            console.error('🖤 confirmLoad error:', e);
            success = false;
        }

        console.log('🖤 confirmLoad: Load result =', success);

        if (success) {
            // 🖤 CRITICAL: Close overlays and menus properly
            // BUT don't break the save/load dialogs for future use!
            console.log('🖤 Load successful, closing menus...');

            // Close the load dialog (just hide, don't add .hidden class)
            this.closeLoadGameDialog();

            // Dismiss the main menu completely
            const mainMenu = document.getElementById('main-menu');
            if (mainMenu) {
                mainMenu.classList.add('hidden');
                mainMenu.style.display = 'none';
            }

            // Hide any game-blocking overlays (but NOT the save-ui-overlay dialogs)
            const overlaysToHide = document.querySelectorAll('.overlay, .modal-overlay');
            overlaysToHide.forEach(overlay => {
                // Skip save/load dialogs - just set display:none, don't add .hidden
                if (overlay.id === 'save-as-overlay' || overlay.id === 'load-game-overlay') {
                    overlay.style.display = 'none';
                    return;
                }
                // Skip game over overlay
                if (overlay.id?.includes('game-over')) {
                    return;
                }
                // Hide other overlays
                overlay.classList.add('hidden');
                overlay.style.display = 'none';
            });

            console.log('🖤 Menus closed, game running! Save/Load dialogs ready for reuse.');
        }
    },

    deleteSelectedSave() {
        if (this._selectedLoadSlot === null) return;

        const confirmDelete = confirm('Are you sure you want to delete this save? This cannot be undone!');
        if (!confirmDelete) return;

        if (this._selectedLoadType === 'manual') {
            SaveLoadSystem.deleteSave(this._selectedLoadSlot);
        } else {
            // obliterate the autosave from existence
            localStorage.removeItem(`tradingGameAutoSave_${this._selectedLoadSlot}`);
            SaveLoadSystem.autoSaveSlots = SaveLoadSystem.autoSaveSlots.filter(s => s.index !== this._selectedLoadSlot);
            SaveLoadSystem.saveSaveSlotsMetadata();
        }

        // rebuild the list without the deceased
        this.populateLoadSlots();
        this.populateAutoSaveSlots();

        // clear your guilty conscience (and selection)
        this._selectedLoadSlot = null;
        this.updateLoadPreview(null);
        document.getElementById('confirm-load-btn')?.setAttribute('disabled', 'true');
        document.getElementById('delete-save-btn')?.setAttribute('disabled', 'true');

        // check if there's anything left worth loading
        this.updateLoadButtonState();
    },

    // ═══════════════════════════════════════════════════════════════
    // 🏆 HALL OF CHAMPIONS DISPLAY - the single source of truth
    // ═══════════════════════════════════════════════════════════════

    createLeaderboardDisplay() {
        // inject the Hall of Champions into the main menu
        const mainMenu = document.getElementById('main-menu');
        if (!mainMenu) return;

        const menuContent = mainMenu.querySelector('.menu-content');
        if (!menuContent) return;

        // don't create duplicates
        if (document.getElementById('main-menu-leaderboard')) return;

        const leaderboard = document.createElement('div');
        leaderboard.id = 'main-menu-leaderboard';
        leaderboard.className = 'menu-leaderboard';
        leaderboard.innerHTML = `
            <h3>🏆 Hall of Champions</h3>
            <div id="leaderboard-entries" class="leaderboard-entries">
                <div class="leaderboard-empty">No champions yet...</div>
            </div>
            <button class="view-all-champions-btn" onclick="SaveUISystem.openHallOfChampions()">View All Champions</button>
        `;

        // Insert before social links (so it appears after settings button)
        const socialLinks = document.getElementById('menu-social-links');
        if (socialLinks) {
            menuContent.insertBefore(leaderboard, socialLinks);
        } else {
            // Fallback: insert before menu-footer
            const menuFooter = menuContent.querySelector('.menu-footer');
            if (menuFooter) {
                menuContent.insertBefore(leaderboard, menuFooter);
            } else {
                menuContent.appendChild(leaderboard);
            }
        }
    },

    updateLeaderboard() {
        const container = document.getElementById('leaderboard-entries');
        if (!container) return;

        // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
        const getOrdinal = (n) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };

        // Use GlobalLeaderboardSystem as the single source of truth
        if (typeof GlobalLeaderboardSystem !== 'undefined') {
            // Fetch and render from GlobalLeaderboardSystem
            GlobalLeaderboardSystem.fetchLeaderboard().then(scores => {
                if (!scores || scores.length === 0) {
                    container.innerHTML = '<div class="leaderboard-empty">No champions have risen yet...</div>';
                    return;
                }

                let html = '';
                // Only show top 3 on start menu - full list available via "View All Champions"
                scores.slice(0, 3).forEach((score, index) => {
                    const rank = index + 1;
                    let rankDisplay;
                    let rankClass = '';

                    // 1st, 2nd, 3rd get medals + ordinal
                    if (rank === 1) {
                        rankDisplay = '👑 1st';
                        rankClass = 'gold';
                    } else if (rank === 2) {
                        rankDisplay = '🥈 2nd';
                        rankClass = 'silver';
                    } else if (rank === 3) {
                        rankDisplay = '🥉 3rd';
                        rankClass = 'bronze';
                    }

                    const statusIcon = score.isAlive ? '💚' : '💀';
                    const statusText = score.isAlive ? 'still playing' : (score.causeOfDeath || 'unknown');

                    html += `
                        <div class="leaderboard-entry ${rankClass}">
                            <div class="entry-rank ${rankClass}">${rankDisplay}</div>
                            <div class="entry-info">
                                <div class="entry-name">${GlobalLeaderboardSystem.escapeHtml(score.playerName || 'Unknown')}</div>
                                <div class="entry-stats">
                                    <span>💰 ${(score.score || 0).toLocaleString()}</span>
                                    <span>📅 ${score.daysSurvived || 0} days</span>
                                </div>
                                <div class="entry-status ${score.isAlive ? 'alive' : 'dead'}">${statusIcon} ${statusText}</div>
                            </div>
                        </div>
                    `;
                });

                // Show count of additional champions
                if (scores.length > 3) {
                    html += `<div class="leaderboard-more">+${scores.length - 3} more champions</div>`;
                }

                container.innerHTML = html;
            }).catch(err => {
                console.error('Failed to load Hall of Champions:', err);
                container.innerHTML = '<div class="leaderboard-empty">Failed to load champions...</div>';
            });
        } else {
            container.innerHTML = '<div class="leaderboard-empty">Leaderboard system unavailable...</div>';
        }
    },

    // Open the full Hall of Champions panel
    openHallOfChampions() {
        console.log('🏆 Opening Hall of Champions panel...');
        const overlay = document.getElementById('leaderboard-overlay');
        const content = document.getElementById('leaderboard-panel-content');

        if (!overlay) {
            console.error('🏆 leaderboard-overlay element not found!');
            return;
        }

        // Show the overlay immediately
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Show loading state
        if (content) {
            content.innerHTML = '<div class="leaderboard-loading">Loading Hall of Champions...</div>';
        }

        // Fetch and render the leaderboard
        if (typeof GlobalLeaderboardSystem !== 'undefined') {
            GlobalLeaderboardSystem.fetchLeaderboard().then(() => {
                GlobalLeaderboardSystem.renderFullHallOfChampions('leaderboard-panel-content');
            }).catch(err => {
                console.error('🏆 Failed to fetch leaderboard:', err);
                if (content) {
                    // Still show local data if available
                    if (GlobalLeaderboardSystem.leaderboard && GlobalLeaderboardSystem.leaderboard.length > 0) {
                        GlobalLeaderboardSystem.renderFullHallOfChampions('leaderboard-panel-content');
                    } else {
                        content.innerHTML = '<div class="leaderboard-empty"><p>Unable to load champions...</p><p>Check your connection and try again.</p></div>';
                    }
                }
            });
        } else {
            if (content) {
                content.innerHTML = '<div class="leaderboard-empty"><p>Leaderboard system not available.</p></div>';
            }
        }
    },

    // Close the Hall of Champions panel
    closeHallOfChampions() {
        const overlay = document.getElementById('leaderboard-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ⚡ MAIN MENU BUTTON WIRING - connecting the dots
    // ═══════════════════════════════════════════════════════════════

    wireUpMainMenuButtons() {
        // breathe life into the load game button
        const loadBtn = document.getElementById('load-game-btn');
        if (loadBtn) {
            loadBtn.removeAttribute('disabled');
            loadBtn.addEventListener('click', () => this.openLoadGameDialog());
        }
    },

    updateLoadButtonState() {
        const loadBtn = document.getElementById('load-game-btn');
        if (!loadBtn) return;

        // scavenge for any hint of a saved state
        let hasSaves = false;

        // search the manual save graveyard
        for (let i = 1; i <= (SaveLoadSystem?.maxSaveSlots || 10); i++) {
            if (SaveLoadSystem?.saveSlots?.[i]?.exists) {
                hasSaves = true;
                break;
            }
        }

        // check the autosave catacombs
        if (!hasSaves && SaveLoadSystem?.autoSaveSlots?.length > 0) {
            hasSaves = true;
        }

        // peek at the emergency save stash
        if (!hasSaves && localStorage.getItem('tradingGameEmergencySave')) {
            hasSaves = true;
        }

        if (hasSaves) {
            loadBtn.removeAttribute('disabled');
        } else {
            loadBtn.setAttribute('disabled', 'true');
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// 🎨 STYLES - css crimes and visual warfare
// ═══════════════════════════════════════════════════════════════

(function() {
    if (document.getElementById('save-ui-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'save-ui-styles';
    styles.textContent = `
        /* overlay that swallows your screen whole */
        .save-ui-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100000;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .save-ui-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(5px);
        }

        /* Dialog */
        .save-ui-dialog {
            position: relative;
            background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid rgba(79, 195, 247, 0.5);
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 40px rgba(79, 195, 247, 0.3);
        }

        .save-ui-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(79, 195, 247, 0.3);
        }

        .save-ui-header h2 {
            margin: 0;
            color: #4fc3f7;
            font-size: 20px;
        }

        .save-ui-close {
            background: rgba(244, 67, 54, 0.3);
            border: 1px solid #f44336;
            color: #f44336;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
        }

        .save-ui-close:hover {
            background: #f44336;
            color: #fff;
        }

        /* Tabs */
        .save-ui-tabs {
            display: flex;
            padding: 10px 20px 0;
            gap: 10px;
        }

        .save-ui-tab {
            background: rgba(40, 40, 70, 0.6);
            border: 1px solid rgba(79, 195, 247, 0.2);
            color: #888;
            padding: 8px 16px;
            border-radius: 8px 8px 0 0;
            cursor: pointer;
            transition: all 0.2s;
        }

        .save-ui-tab.active {
            background: rgba(79, 195, 247, 0.2);
            border-color: #4fc3f7;
            color: #4fc3f7;
        }

        .save-ui-tab:hover:not(.active) {
            background: rgba(79, 195, 247, 0.1);
        }

        /* Content */
        .save-ui-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        /* Save Name Input */
        .save-name-input-section {
            margin-bottom: 15px;
        }

        .save-name-input-section label {
            display: block;
            color: #4fc3f7;
            margin-bottom: 5px;
            font-size: 14px;
        }

        #save-name-input {
            width: 100%;
            padding: 10px 15px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(79, 195, 247, 0.3);
            border-radius: 8px;
            color: #fff;
            font-size: 16px;
            box-sizing: border-box;
        }

        #save-name-input:focus {
            outline: none;
            border-color: #4fc3f7;
        }

        .save-name-hint {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
        }

        /* Save Slots Grid */
        .save-slot-section label {
            display: block;
            color: #4fc3f7;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .save-slots-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            max-height: 200px;
            overflow-y: auto;
        }

        .save-slot {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: rgba(40, 40, 70, 0.4);
            border: 1px solid rgba(79, 195, 247, 0.2);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .save-slot:hover {
            background: rgba(79, 195, 247, 0.1);
            border-color: rgba(79, 195, 247, 0.4);
        }

        .save-slot.selected {
            background: rgba(79, 195, 247, 0.2);
            border-color: #4fc3f7;
        }

        .save-slot.has-data .slot-actions {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
        }

        .save-slot.has-data .slot-overwrite-warning {
            display: none;
            color: #ff9800;
            font-size: 11px;
        }

        .save-slot.has-data.selected .slot-overwrite-warning {
            display: block;
        }

        .slot-delete-btn {
            background: rgba(220, 53, 69, 0.2);
            border: 1px solid rgba(220, 53, 69, 0.4);
            color: #dc3545;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0.6;
            transition: all 0.2s ease;
        }

        .slot-delete-btn:hover {
            background: rgba(220, 53, 69, 0.4);
            border-color: #dc3545;
            opacity: 1;
        }

        .save-slot.has-data:hover .slot-delete-btn {
            opacity: 1;
        }

        .slot-number {
            width: 30px;
            height: 30px;
            background: rgba(79, 195, 247, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4fc3f7;
            font-weight: bold;
        }

        .slot-info {
            flex: 1;
        }

        .slot-name {
            color: #fff;
            font-size: 13px;
        }

        .slot-empty {
            color: #666;
            font-size: 11px;
        }

        .slot-details {
            display: flex;
            gap: 10px;
            font-size: 11px;
            color: #888;
            margin-top: 3px;
        }

        .slot-date {
            font-size: 10px;
            color: #666;
            margin-top: 3px;
        }

        /* Save Preview */
        .save-preview, .load-preview {
            margin-top: 15px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border: 1px solid rgba(79, 195, 247, 0.2);
        }

        .preview-title {
            color: #4fc3f7;
            font-size: 13px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .preview-row {
            display: flex;
            gap: 10px;
            padding: 5px 0;
            color: #ccc;
            font-size: 13px;
        }

        .preview-row span {
            min-width: 24px;
            text-align: center;
        }

        .preview-row.version {
            color: #666;
            font-size: 11px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(79, 195, 247, 0.1);
        }

        /* Load Slots List */
        .load-slots-list {
            max-height: 250px;
            overflow-y: auto;
        }

        .load-tab-content {
            display: none;
        }

        .load-tab-content.active {
            display: block;
        }

        .load-slot {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 15px;
            background: rgba(40, 40, 70, 0.4);
            border: 1px solid rgba(79, 195, 247, 0.2);
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 8px;
            transition: all 0.2s;
        }

        .load-slot:hover {
            background: rgba(79, 195, 247, 0.1);
            border-color: rgba(79, 195, 247, 0.4);
        }

        .load-slot.selected {
            background: rgba(79, 195, 247, 0.2);
            border-color: #4fc3f7;
        }

        .load-slot-icon {
            font-size: 24px;
        }

        .load-slot-info {
            flex: 1;
        }

        .load-slot-name {
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }

        .load-slot-player {
            color: #4fc3f7;
            font-size: 12px;
            margin-top: 3px;
        }

        .load-slot-details {
            display: flex;
            gap: 15px;
            font-size: 11px;
            color: #888;
            margin-top: 5px;
        }

        .load-slot-date {
            font-size: 10px;
            color: #666;
            margin-top: 5px;
        }

        .no-saves-message {
            text-align: center;
            padding: 30px;
            color: #666;
        }

        .no-saves-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }

        .no-saves-text {
            font-size: 16px;
            color: #888;
        }

        .no-saves-hint {
            font-size: 12px;
            margin-top: 5px;
        }

        .no-selection {
            color: #666;
            font-style: italic;
            text-align: center;
            padding: 20px;
        }

        /* Emergency Save Notice */
        .emergency-save-notice {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            background: rgba(255, 152, 0, 0.2);
            border: 1px solid #ff9800;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .emergency-save-icon {
            font-size: 24px;
        }

        .emergency-save-info {
            flex: 1;
        }

        .emergency-save-title {
            color: #ff9800;
            font-weight: bold;
            font-size: 14px;
        }

        .emergency-save-text {
            color: #ccc;
            font-size: 12px;
        }

        .emergency-save-load {
            background: #ff9800;
            color: #000;
            border: none;
            padding: 8px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }

        .emergency-save-dismiss {
            background: transparent;
            color: #888;
            border: none;
            cursor: pointer;
            font-size: 18px;
        }

        /* Footer */
        .save-ui-footer {
            display: flex;
            gap: 10px;
            padding: 15px 20px;
            background: rgba(0, 0, 0, 0.3);
            border-top: 1px solid rgba(79, 195, 247, 0.2);
        }

        .footer-spacer {
            flex: 1;
        }

        .save-ui-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .save-ui-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .save-ui-btn-primary {
            background: linear-gradient(180deg, #4caf50 0%, #388e3c 100%);
            color: #fff;
        }

        .save-ui-btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
        }

        .save-ui-btn-secondary {
            background: rgba(79, 195, 247, 0.2);
            color: #4fc3f7;
            border: 1px solid rgba(79, 195, 247, 0.3);
        }

        .save-ui-btn-secondary:hover:not(:disabled) {
            background: rgba(79, 195, 247, 0.3);
        }

        .save-ui-btn-danger {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
            border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .save-ui-btn-danger:hover:not(:disabled) {
            background: rgba(244, 67, 54, 0.3);
        }

        /* Leaderboard on Main Menu */
        .menu-leaderboard {
            margin-top: 30px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 12px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }

        .menu-leaderboard h3 {
            color: #ffd700;
            text-align: center;
            margin: 0 0 15px 0;
            font-size: 18px;
        }

        .leaderboard-entries {
            max-height: 250px;
            overflow-y: auto;
        }

        .leaderboard-empty {
            color: #666;
            text-align: center;
            padding: 20px;
            font-style: italic;
        }

        .leaderboard-entry {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: rgba(40, 40, 70, 0.4);
            border-radius: 8px;
            margin-bottom: 8px;
        }

        .leaderboard-entry.top-three {
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid rgba(255, 215, 0, 0.2);
        }

        .entry-rank {
            font-size: 14px;
            min-width: 55px;
            text-align: center;
            font-weight: bold;
        }

        .entry-rank.gold {
            color: #ffd700;
        }

        .entry-rank.silver {
            color: #c0c0c0;
        }

        .entry-rank.bronze {
            color: #cd7f32;
        }

        .leaderboard-entry.gold {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%);
            border: 1px solid rgba(255, 215, 0, 0.4);
        }

        .leaderboard-entry.silver {
            background: linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(192, 192, 192, 0.05) 100%);
            border: 1px solid rgba(192, 192, 192, 0.4);
        }

        .leaderboard-entry.bronze {
            background: linear-gradient(135deg, rgba(205, 127, 50, 0.15) 0%, rgba(205, 127, 50, 0.05) 100%);
            border: 1px solid rgba(205, 127, 50, 0.4);
        }

        .entry-info {
            flex: 1;
        }

        .entry-name {
            color: #fff;
            font-weight: bold;
            font-size: 14px;
        }

        .entry-stats {
            display: flex;
            gap: 15px;
            font-size: 11px;
            color: #888;
            margin-top: 3px;
        }

        .entry-death {
            font-size: 10px;
            color: #f44336;
            margin-top: 3px;
        }

        .entry-date {
            font-size: 10px;
            color: #666;
        }

        .entry-status {
            font-size: 10px;
            margin-top: 3px;
            font-style: italic;
        }

        .entry-status.alive {
            color: #4caf50;
        }

        .entry-status.dead {
            color: #f44336;
        }

        .leaderboard-more {
            color: #888;
            text-align: center;
            padding: 10px;
            font-style: italic;
            font-size: 12px;
            border-top: 1px dashed rgba(255, 215, 0, 0.2);
            margin-top: 10px;
        }

        .view-all-champions-btn {
            width: 100%;
            margin-top: 15px;
            padding: 10px 20px;
            background: linear-gradient(180deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.1) 100%);
            border: 1px solid rgba(255, 215, 0, 0.5);
            border-radius: 8px;
            color: #ffd700;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .view-all-champions-btn:hover {
            background: linear-gradient(180deg, rgba(255, 215, 0, 0.5) 0%, rgba(255, 215, 0, 0.2) 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }

        /* Just Saved Animation */
        .save-slot.just-saved {
            background: rgba(76, 175, 80, 0.3) !important;
            border-color: #4caf50 !important;
            animation: save-pulse 0.5s ease-out;
        }

        @keyframes save-pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
            }
            50% {
                transform: scale(1.02);
                box-shadow: 0 0 20px 5px rgba(76, 175, 80, 0.4);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
        }
    `;

    document.head.appendChild(styles);
})();

// 🌐 Expose SaveUISystem globally so onclick handlers can access it
window.SaveUISystem = SaveUISystem;

// wake up the system when the dom finally gets its act together
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => SaveUISystem.init(), 800);
    });
} else {
    setTimeout(() => SaveUISystem.init(), 800);
}

console.log('💾 SaveUISystem loaded');
