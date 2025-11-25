// ═══════════════════════════════════════════════════════════════
// 🎮 GAME ENGINE - The heart that makes everything tick
// ═══════════════════════════════════════════════════════════════
// This module orchestrates the game loop, time system, and travel

const GameEngine = {
    // Engine state
    isRunning: false,
    lastFrameTime: 0,
    animationFrameId: null,

    // Debug mode
    debug: false,

    // Initialize the engine
    init() {
        console.log('🎮 GameEngine: Initializing...');

        // Ensure TimeSystem exists and is initialized
        if (typeof TimeSystem !== 'undefined') {
            // TimeSystem.init() is called by game.init(), but we ensure it's ready
            console.log('🎮 GameEngine: TimeSystem found, current speed:', TimeSystem.currentSpeed);
        } else {
            console.error('🎮 GameEngine: TimeSystem not found!');
            return false;
        }

        // Setup time control buttons with direct handlers
        this.setupTimeControls();

        // Setup location click handlers for travel
        this.setupTravelTriggers();

        console.log('🎮 GameEngine: Initialized successfully');
        return true;
    },

    // Main game loop - runs continuously
    tick(currentTime) {
        if (!this.isRunning) {
            this.animationFrameId = null;
            return;
        }

        // Calculate delta time
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        // Cap delta time to prevent spiral of death
        const cappedDelta = Math.min(deltaTime, 100);

        // Update time system (this makes game time advance)
        if (typeof TimeSystem !== 'undefined') {
            const timeAdvanced = TimeSystem.update(cappedDelta);

            // If time advanced, update all dependent systems
            if (timeAdvanced) {
                this.onTimeAdvance();
            }
        }

        // Update travel progress if traveling
        this.updateTravel();

        // Update UI displays
        this.updateUI();

        // Continue the loop
        this.animationFrameId = requestAnimationFrame((t) => this.tick(t));
    },

    // Start the engine
    start() {
        if (this.isRunning) {
            console.log('🎮 GameEngine: Already running');
            return;
        }

        console.log('🎮 GameEngine: Starting...');
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.animationFrameId = requestAnimationFrame((t) => this.tick(t));
        console.log('🎮 GameEngine: Running!');
    },

    // Stop the engine
    stop() {
        console.log('🎮 GameEngine: Stopping...');
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    },

    // Called when game time advances
    onTimeAdvance() {
        // Update event system
        if (typeof EventSystem !== 'undefined') {
            EventSystem.update();
        }

        // Update market prices
        if (typeof game !== 'undefined' && typeof game.updateMarketPrices === 'function') {
            game.updateMarketPrices();
        }

        // Check scheduled events
        if (typeof game !== 'undefined' && typeof game.checkScheduledEvents === 'function') {
            game.checkScheduledEvents();
        }

        // Update city events
        if (typeof CityEventSystem !== 'undefined') {
            CityEventSystem.updateEvents();
        }

        // Update dynamic market
        if (typeof DynamicMarketSystem !== 'undefined') {
            DynamicMarketSystem.updateMarketPrices();
        }

        // Process property work queues
        if (typeof PropertySystem !== 'undefined') {
            PropertySystem.processWorkQueues();
        }

        // Daily processing at midnight
        if (TimeSystem.currentTime.hour === 0 && TimeSystem.currentTime.minute === 0) {
            if (typeof PropertySystem !== 'undefined') {
                PropertySystem.processDailyIncome();
            }
            if (typeof TradeRouteSystem !== 'undefined') {
                TradeRouteSystem.processDailyTrade();
            }
        }

        // Check price alerts
        if (typeof TradingSystem !== 'undefined') {
            TradingSystem.checkPriceAlerts();
        }
    },

    // Update travel system
    updateTravel() {
        if (typeof TravelSystem === 'undefined') return;

        // Check if player is traveling
        if (TravelSystem.playerPosition && TravelSystem.playerPosition.isTraveling) {
            // Only update if time is actually running
            if (!TimeSystem.isPaused && TimeSystem.currentSpeed !== 'PAUSED') {
                TravelSystem.updateTravelProgress();
            }
        }
    },

    // Update UI displays
    updateUI() {
        // Update time display
        this.updateTimeDisplay();

        // Update time control button states
        this.updateTimeControlButtons();

        // Update player stats display
        if (typeof updatePlayerStats === 'function') {
            updatePlayerStats();
        }
    },

    // Update the time display in the UI
    updateTimeDisplay() {
        if (typeof TimeSystem === 'undefined') return;

        const timeInfo = TimeSystem.getTimeInfo();

        // Update main time display
        const timeDisplay = document.getElementById('game-time') ||
                           document.getElementById('time-display') ||
                           document.querySelector('.time-display');
        if (timeDisplay) {
            timeDisplay.textContent = timeInfo.formatted;
        }

        // Update day/date displays
        const dayDisplay = document.getElementById('current-day');
        if (dayDisplay) {
            dayDisplay.textContent = `Day ${timeInfo.day}`;
        }

        const yearDisplay = document.getElementById('current-year');
        if (yearDisplay) {
            yearDisplay.textContent = `Year ${timeInfo.year}`;
        }

        // Update speed indicator
        const speedDisplay = document.getElementById('speed-indicator') ||
                            document.querySelector('.speed-indicator');
        if (speedDisplay) {
            const speedLabels = {
                'PAUSED': '⏸ Paused',
                'NORMAL': '▶ Normal',
                'FAST': '▶▶ Fast',
                'VERY_FAST': '▶▶▶ Very Fast'
            };
            speedDisplay.textContent = speedLabels[timeInfo.speed] || timeInfo.speed;
        }
    },

    // Update time control button active states
    updateTimeControlButtons() {
        if (typeof TimeSystem === 'undefined') return;

        const speed = TimeSystem.currentSpeed;

        // Button ID to speed mapping
        const buttons = {
            'pause-btn': 'PAUSED',
            'normal-speed-btn': 'NORMAL',
            'fast-speed-btn': 'FAST',
            'very-fast-speed-btn': 'VERY_FAST'
        };

        Object.entries(buttons).forEach(([btnId, btnSpeed]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                if (speed === btnSpeed) {
                    btn.classList.add('active');
                    btn.style.background = 'rgba(76, 175, 80, 0.8)';
                } else {
                    btn.classList.remove('active');
                    btn.style.background = '';
                }
            }
        });
    },

    // Setup time control buttons
    setupTimeControls() {
        console.log('🎮 GameEngine: Setting up time controls...');

        const self = this;

        // Helper to create button handler
        const createSpeedHandler = (speed) => {
            return function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🎮 Speed button clicked: ${speed}`);
                TimeSystem.setSpeed(speed);
                if (speed !== 'PAUSED' && !self.isRunning) {
                    self.start();
                }
                self.updateTimeControlButtons();
                // Also update game.updateTimeControls if it exists
                if (typeof game !== 'undefined' && game.updateTimeControls) {
                    game.updateTimeControls();
                }
            };
        };

        // Configure all speed buttons using the helper
        const buttons = [
            { id: 'pause-btn', speed: 'PAUSED' },
            { id: 'normal-speed-btn', speed: 'NORMAL' },
            { id: 'fast-speed-btn', speed: 'FAST' },
            { id: 'very-fast-speed-btn', speed: 'VERY_FAST' }
        ];

        buttons.forEach(({ id, speed }) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.onclick = createSpeedHandler(speed);
                console.log(`🎮 ${speed} button configured`);
            } else {
                console.warn(`🎮 Button not found: ${id}`);
            }
        });

        console.log('🎮 GameEngine: Time controls ready');
    },

    // Setup travel triggers (clicking on map locations)
    setupTravelTriggers() {
        console.log('🎮 GameEngine: Setting up travel triggers...');

        // The TravelSystem handles its own click events on the canvas
        // But we need to ensure travel auto-starts time when initiated

        // Patch TravelSystem.startTravel to auto-start time
        if (typeof TravelSystem !== 'undefined' && TravelSystem.startTravel) {
            const originalStartTravel = TravelSystem.startTravel.bind(TravelSystem);
            const self = this;

            TravelSystem.startTravel = function(destinationId) {
                console.log('🚶 Travel initiated to:', destinationId);

                // Call original start travel
                originalStartTravel(destinationId);

                // Auto-start time if paused
                if (TimeSystem.isPaused || TimeSystem.currentSpeed === 'PAUSED') {
                    console.log('🚶 Auto-starting time for travel...');
                    TimeSystem.setSpeed('NORMAL');
                    self.updateTimeControlButtons();
                }

                // Ensure engine is running
                if (!self.isRunning) {
                    self.start();
                }
            };

            console.log('🎮 GameEngine: Travel triggers patched');
        }
    },

    // Set game speed (convenience method)
    setSpeed(speed) {
        if (typeof TimeSystem !== 'undefined') {
            TimeSystem.setSpeed(speed);
            this.updateTimeControlButtons();

            // Start engine if setting to non-paused speed
            if (speed !== 'PAUSED' && !this.isRunning) {
                this.start();
            }
        }
    },

    // Pause the game
    pause() {
        this.setSpeed('PAUSED');
    },

    // Resume at normal speed
    play() {
        this.setSpeed('NORMAL');
    },

    // Get current game state info
    getState() {
        return {
            isRunning: this.isRunning,
            timeSpeed: TimeSystem?.currentSpeed || 'UNKNOWN',
            isPaused: TimeSystem?.isPaused || true,
            gameTime: TimeSystem?.getFormattedTime() || 'N/A',
            isTraveling: TravelSystem?.playerPosition?.isTraveling || false
        };
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            GameEngine.init();
            // Don't auto-start - let user click play
            console.log('🎮 GameEngine ready - click play to begin!');
        }, 500);
    });
} else {
    setTimeout(() => {
        GameEngine.init();
        console.log('🎮 GameEngine ready - click play to begin!');
    }, 500);
}

// Expose globally
window.GameEngine = GameEngine;
