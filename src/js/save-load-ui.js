// ═══════════════════════════════════════════════════════════════
// 💾 SAVE/LOAD UI - the interface for timeline manipulation
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// buttons and panels for saving your precious progress
// slot management is basically time travel with extra steps

const SaveLoadUI = {
    // UI state
    isVisible: false,
    currentTab: 'saves', // 'saves', 'load', 'manage'
    selectedSlot: null,
    
    // Initialize UI
    init() {
        this.createSaveLoadModal();
        this.setupEventListeners();
    },
    
    // Create the main save/load modal
    createSaveLoadModal() {
        // Check if modal already exists
        if (document.getElementById('save-load-modal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = 'save-load-modal';
        modal.className = 'modal-overlay hidden';
        modal.innerHTML = `
            <div class="modal-content save-load-content">
                <div class="modal-header">
                    <h2>Save & Load Game</h2>
                    <button class="close-btn" onclick="SaveLoadUI.hide()">×</button>
                </div>
                
                <div class="modal-body">
                    <div class="tabs">
                        <button class="tab-btn active" data-tab="saves" onclick="SaveLoadUI.switchTab('saves')">Save Game</button>
                        <button class="tab-btn" data-tab="load" onclick="SaveLoadUI.switchTab('load')">Load Game</button>
                        <button class="tab-btn" data-tab="manage" onclick="SaveLoadUI.switchTab('manage')">Manage Saves</button>
                    </div>
                    
                    <div class="tab-content">
                        <!-- Save Tab -->
                        <div id="saves-tab" class="tab-panel active">
                            <div class="save-options">
                                <div class="quick-actions">
                                    <button class="quick-save-btn" onclick="SaveLoadUI.quickSave()" title="Quick Save (F5)">
                                        <span class="icon">💾</span>
                                        <span class="label">Quick Save</span>
                                        <span class="shortcut">F5</span>
                                    </button>
                                    <button class="auto-save-toggle ${game.settings.autoSave ? 'active' : ''}" 
                                            onclick="SaveLoadUI.toggleAutoSave()" title="Toggle Auto-Save">
                                        <span class="icon">⏰</span>
                                        <span class="label">Auto-Save</span>
                                        <span class="status">${game.settings.autoSave ? 'ON' : 'OFF'}</span>
                                    </button>
                                </div>
                                
                                <div class="save-slots">
                                    <h3>Save Slots</h3>
                                    <div id="save-slots-grid" class="slots-grid">
                                        <!-- Save slots will be populated here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Load Tab -->
                        <div id="load-tab" class="tab-panel">
                            <div class="load-options">
                                <div class="quick-actions">
                                    <button class="quick-load-btn" onclick="SaveLoadUI.quickLoad()" title="Quick Load (F9)">
                                        <span class="icon">📂</span>
                                        <span class="label">Quick Load</span>
                                        <span class="shortcut">F9</span>
                                    </button>
                                </div>
                                
                                <div class="save-slots">
                                    <h3>Load Game</h3>
                                    <div id="load-slots-grid" class="slots-grid">
                                        <!-- Save slots will be populated here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Manage Tab -->
                        <div id="manage-tab" class="tab-panel">
                            <div class="manage-options">
                                <div class="backup-section">
                                    <h3>Backup & Recovery</h3>
                                    <div class="backup-actions">
                                        <button class="backup-btn" onclick="SaveLoadUI.createBackup()">
                                            <span class="icon">💿</span>
                                            <span class="label">Create Backup</span>
                                        </button>
                                        <button class="restore-backup-btn" onclick="SaveLoadUI.restoreFromBackup()">
                                            <span class="icon">📥</span>
                                            <span class="label">Restore Backup</span>
                                        </button>
                                        <button class="repair-saves-btn" onclick="SaveLoadUI.repairSaves()">
                                            <span class="icon">🔧</span>
                                            <span class="label">Repair Saves</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="import-export-section">
                                    <h3>Import & Export</h3>
                                    <div class="import-export-actions">
                                        <div class="export-section">
                                            <label>Export Save:</label>
                                            <select id="export-slot-select">
                                                <option value="">Select slot...</option>
                                            </select>
                                            <button class="export-btn" onclick="SaveLoadUI.exportSelectedSlot()">
                                                <span class="icon">📤</span>
                                                <span class="label">Export</span>
                                            </button>
                                        </div>
                                        
                                        <div class="import-section">
                                            <label>Import Save:</label>
                                            <select id="import-slot-select">
                                                <option value="">Select slot...</option>
                                            </select>
                                            <input type="file" id="import-file-input" accept=".json" style="display: none;">
                                            <button class="import-btn" onclick="document.getElementById('import-file-input').click()">
                                                <span class="icon">📥</span>
                                                <span class="label">Import</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="settings-section">
                                    <h3>Save Settings</h3>
                                    <div class="save-settings">
                                        <div class="setting-item">
                                            <label>
                                                <input type="checkbox" id="compression-enabled" ${SaveLoadSystem.compressionEnabled ? 'checked' : ''}>
                                                       onchange="SaveLoadUI.toggleCompression()">
                                                </label>
                                                <span>Enable Save Compression</span>
                                            </div>
                                        <div class="setting-item">
                                            <label>
                                                Auto-save Interval:
                                                <select id="auto-save-interval" onchange="SaveLoadUI.setAutoSaveInterval(this.value)">
                                                    <option value="60000" ${game.settings.autoSaveInterval === 60000 ? 'selected' : ''}>1 minute</option>
                                                    <option value="300000" ${game.settings.autoSaveInterval === 300000 ? 'selected' : ''}>5 minutes</option>
                                                    <option value="600000" ${game.settings.autoSaveInterval === 600000 ? 'selected' : ''}>10 minutes</option>
                                                    <option value="1800000" ${game.settings.autoSaveInterval === 1800000 ? 'selected' : ''}>30 minutes</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <div class="save-info" id="save-status-info">
                        <span id="last-auto-save-time">Last auto-save: Never</span>
                    </div>
                    <button class="close-btn" onclick="SaveLoadUI.hide()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup file input listener
        EventManager.addEventListener(document.getElementById('import-file-input'), 'change', (e) => {
            this.handleFileImport(e);
        });
        
        // Initialize slot displays
        this.updateSaveSlotsDisplay();
        this.updateLoadSlotsDisplay();
        this.updateManageOptions();
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Update displays when save system changes
        TimerManager.setInterval(() => {
            this.updateAutoSaveStatus();
        }, 1000);
    },
    
    // Show the save/load modal
    show(tab = 'saves') {
        this.isVisible = true;
        this.switchTab(tab);
        document.getElementById('save-load-modal').classList.remove('hidden');
        
        // Update displays
        this.updateSaveSlotsDisplay();
        this.updateLoadSlotsDisplay();
        this.updateManageOptions();
    },
    
    // Hide the save/load modal
    hide() {
        this.isVisible = false;
        document.getElementById('save-load-modal').classList.add('hidden');
    },
    
    // Switch between tabs
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    },
    
    // Update save slots display
    updateSaveSlotsDisplay() {
        const container = document.getElementById('save-slots-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 1; i <= SaveLoadSystem.maxSaveSlots; i++) {
            const slotInfo = SaveLoadSystem.getSaveSlotInfo(i);
            const slotElement = this.createSaveSlotElement(i, slotInfo, 'save');
            container.appendChild(slotElement);
        }
    },
    
    // Update load slots display
    updateLoadSlotsDisplay() {
        const container = document.getElementById('load-slots-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 1; i <= SaveLoadSystem.maxSaveSlots; i++) {
            const slotInfo = SaveLoadSystem.getSaveSlotInfo(i);
            const slotElement = this.createSaveSlotElement(i, slotInfo, 'load');
            container.appendChild(slotElement);
        }
    },
    
    // Create save slot element
    createSaveSlotElement(slotNumber, slotInfo, mode) {
        const slotElement = document.createElement('div');
        slotElement.className = `save-slot ${slotInfo.exists ? 'has-save' : 'empty'} ${mode === 'save' ? 'save-mode' : 'load-mode'}`;
        slotElement.dataset.slotNumber = slotNumber;
        
        if (slotInfo.exists) {
            slotElement.innerHTML = `
                <div class="slot-header">
                    <div class="slot-number">Slot ${slotNumber}</div>
                    <div class="slot-name" contenteditable="true" onblur="SaveLoadUI.updateSlotName(${slotNumber}, this.textContent)">${slotInfo.name}</div>
                    <div class="slot-actions">
                        ${mode === 'save' ? `
                            <button class="overwrite-btn" onclick="SaveLoadUI.confirmOverwrite(${slotNumber})" title="Overwrite">⚠️</button>
                        ` : ''}
                        <button class="delete-btn" onclick="SaveLoadUI.confirmDelete(${slotNumber})" title="Delete">🗑️</button>
                        <button class="export-btn" onclick="SaveLoadUI.exportSave(${slotNumber})" title="Export">📤</button>
                    </div>
                </div>
                <div class="slot-content">
                    <div class="player-info">
                        <div class="player-name">${slotInfo.playerInfo?.name || 'Unknown'}</div>
                        <div class="player-details">
                            <span class="level">Level ${slotInfo.playerInfo?.level || 1}</span>
                            <span class="gold">${slotInfo.playerInfo?.gold || 0} gold</span>
                            <span class="location">${slotInfo.playerInfo?.location || 'Unknown'}</span>
                        </div>
                    </div>
                    <div class="save-info">
                        <div class="timestamp">${slotInfo.formattedDate}</div>
                        <div class="time-ago">${slotInfo.timeSinceSave}</div>
                        <div class="days-survived">${slotInfo.playerInfo?.daysSurvived || 0} days survived</div>
                        <div class="version">v${slotInfo.version || '1.0.0'}</div>
                    </div>
                </div>
                <div class="slot-actions-bottom">
                    ${mode === 'save' ? `
                        <button class="save-btn" onclick="SaveLoadUI.saveToSlot(${slotNumber})">Save Here</button>
                    ` : `
                        <button class="load-btn" onclick="SaveLoadUI.loadFromSlot(${slotNumber})">Load Game</button>
                    `}
                </div>
            `;
        } else {
            slotElement.innerHTML = `
                <div class="slot-header">
                    <div class="slot-number">Slot ${slotNumber}</div>
                    <div class="slot-name" contenteditable="true" onblur="SaveLoadUI.updateSlotName(${slotNumber}, this.textContent)">${slotInfo.name}</div>
                    <div class="slot-actions">
                        <button class="delete-btn" onclick="SaveLoadUI.confirmDelete(${slotNumber})" title="Delete" disabled>🗑️</button>
                    </div>
                </div>
                <div class="slot-content empty">
                    <div class="empty-message">
                        <span class="icon">📭</span>
                        <span class="text">Empty Save Slot</span>
                    </div>
                </div>
                <div class="slot-actions-bottom">
                    ${mode === 'save' ? `
                        <button class="save-btn" onclick="SaveLoadUI.saveToSlot(${slotNumber})">Save Here</button>
                    ` : `
                        <button class="load-btn" disabled>Load Game</button>
                    `}
                </div>
            `;
        }
        
        return slotElement;
    },
    
    // Update manage options
    updateManageOptions() {
        // Update export slot select
        const exportSelect = document.getElementById('export-slot-select');
        if (exportSelect) {
            exportSelect.innerHTML = '<option value="">Select slot...</option>';
            for (let i = 1; i <= SaveLoadSystem.maxSaveSlots; i++) {
                const slotInfo = SaveLoadSystem.getSaveSlotInfo(i);
                if (slotInfo.exists) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Slot ${i}: ${slotInfo.name}`;
                    exportSelect.appendChild(option);
                }
            }
        }
        
        // Update import slot select
        const importSelect = document.getElementById('import-slot-select');
        if (importSelect) {
            importSelect.innerHTML = '<option value="">Select slot...</option>';
            for (let i = 1; i <= SaveLoadSystem.maxSaveSlots; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Slot ${i}`;
                importSelect.appendChild(option);
            }
        }
    },
    
    // Update slot name
    updateSlotName(slotNumber, newName) {
        if (!newName || newName.trim() === '') {
            newName = `Save Slot ${slotNumber}`;
        }
        
        SaveLoadSystem.saveSlots[slotNumber].name = newName.trim();
        SaveLoadSystem.saveSaveSlotsMetadata();
        this.updateSaveSlotsDisplay();
        this.updateLoadSlotsDisplay();
    },
    
    // Save to slot
    saveToSlot(slotNumber) {
        const slotInfo = SaveLoadSystem.getSaveSlotInfo(slotNumber);
        
        if (slotInfo.exists) {
            this.confirmOverwrite(slotNumber);
        } else {
            SaveLoadSystem.saveToSlot(slotNumber);
            this.updateSaveSlotsDisplay();
            this.updateLoadSlotsDisplay();
        }
    },
    
    // Load from slot
    loadFromSlot(slotNumber) {
        const slotInfo = SaveLoadSystem.getSaveSlotInfo(slotNumber);
        
        if (!slotInfo.exists) {
            addMessage('This save slot is empty!', 'error');
            return;
        }
        
        SaveLoadSystem.loadFromSlot(slotNumber);
        this.hide();
    },
    
    // Confirm overwrite
    confirmOverwrite(slotNumber) {
        const slotInfo = SaveLoadSystem.getSaveSlotInfo(slotNumber);
        
        if (confirm(`Are you sure you want to overwrite "${slotInfo.name}"?\n\nThis action cannot be undone.`)) {
            SaveLoadSystem.saveToSlot(slotNumber);
            this.updateSaveSlotsDisplay();
            this.updateLoadSlotsDisplay();
        }
    },
    
    // Confirm delete
    confirmDelete(slotNumber) {
        const slotInfo = SaveLoadSystem.getSaveSlotInfo(slotNumber);
        
        if (confirm(`Are you sure you want to delete "${slotInfo.name}"?\n\nThis action cannot be undone.`)) {
            SaveLoadSystem.deleteSave(slotNumber);
            this.updateSaveSlotsDisplay();
            this.updateLoadSlotsDisplay();
            this.updateManageOptions();
        }
    },
    
    // Quick save
    quickSave() {
        SaveLoadSystem.quickSave();
        this.updateSaveSlotsDisplay();
        this.updateLoadSlotsDisplay();
    },
    
    // Quick load
    quickLoad() {
        SaveLoadSystem.quickLoad();
        this.hide();
    },
    
    // Toggle auto-save
    toggleAutoSave() {
        game.settings.autoSave = !game.settings.autoSave;
        
        const btn = document.querySelector('.auto-save-toggle');
        if (btn) {
            btn.classList.toggle('active', game.settings.autoSave);
            btn.querySelector('.status').textContent = game.settings.autoSave ? 'ON' : 'OFF';
        }
        
        addMessage(`Auto-save ${game.settings.autoSave ? 'enabled' : 'disabled'}`);
    },
    
    // Update auto-save status
    updateAutoSaveStatus() {
        const statusElement = document.getElementById('last-auto-save-time');
        if (statusElement) {
            if (SaveLoadSystem.lastAutoSave > 0) {
                const date = new Date(SaveLoadSystem.lastAutoSave);
                statusElement.textContent = `Last auto-save: ${date.toLocaleString()}`;
            } else {
                statusElement.textContent = 'Last auto-save: Never';
            }
        }
    },
    
    // Toggle compression
    toggleCompression() {
        SaveLoadSystem.compressionEnabled = !SaveLoadSystem.compressionEnabled;
        addMessage(`Save compression ${SaveLoadSystem.compressionEnabled ? 'enabled' : 'disabled'}`);
    },
    
    // Set auto-save interval
    setAutoSaveInterval(interval) {
        game.settings.autoSaveInterval = parseInt(interval);
        addMessage(`Auto-save interval set to ${interval / 60000} minute(s)`);
    },
    
    // Export save
    exportSave(slotNumber) {
        SaveLoadSystem.exportSave(slotNumber);
    },
    
    // Export selected slot
    exportSelectedSlot() {
        const select = document.getElementById('export-slot-select');
        const slotNumber = parseInt(select.value);
        
        if (slotNumber) {
            this.exportSave(slotNumber);
        }
    },
    
    // Handle file import
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const select = document.getElementById('import-slot-select');
            const slotNumber = parseInt(select.value);
            
            if (slotNumber) {
                SaveLoadSystem.importSave(slotNumber, e.target.result);
                this.updateSaveSlotsDisplay();
                this.updateLoadSlotsDisplay();
                this.updateManageOptions();
            }
        };
        
        reader.readAsText(file);
    },
    
    // Create backup
    createBackup() {
        if (confirm('This will create a backup of all your save games. Continue?')) {
            SaveLoadSystem.createBackup();
            addMessage('Backup created successfully!');
        }
    },
    
    // Restore from backup
    restoreFromBackup() {
        if (confirm('This will restore all save games from the last backup and overwrite current saves. Continue?')) {
            SaveLoadSystem.restoreFromBackup();
            this.updateSaveSlotsDisplay();
            this.updateLoadSlotsDisplay();
            this.updateManageOptions();
            addMessage('Backup restored successfully!');
        }
    },
    
    // Repair saves
    repairSaves() {
        const repairedCount = SaveLoadSystem.checkAndRepairSaves();
        
        if (repairedCount > 0) {
            this.updateSaveSlotsDisplay();
            this.updateLoadSlotsDisplay();
            this.updateManageOptions();
            addMessage(`Repaired ${repairedCount} corrupted save(s)!`);
        } else {
            addMessage('No corrupted saves found.');
        }
    }
};

// Initialize UI when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            SaveLoadUI.init();
        }, 1500);
    });
} else {
    setTimeout(() => {
        SaveLoadUI.init();
    }, 1500);
}