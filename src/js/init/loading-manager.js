// ═══════════════════════════════════════════════════════════════
// 🖤 LOADING MANAGER - watching the void slowly fill with code
// ═══════════════════════════════════════════════════════════════
// File Version: GameConfig.version.file
// conjured by Unity AI Lab - *yawns* another loading screen...
// ═══════════════════════════════════════════════════════════════

const LoadingManager = {
    // 📊 Systems to track - order matters for status messages
    systems: [
        { name: 'GameConfig', check: () => typeof GameConfig !== 'undefined', label: 'Loading configuration...' },
        { name: 'GameWorld', check: () => typeof GameWorld !== 'undefined', label: 'Generating world...' },
        { name: 'ItemDatabase', check: () => typeof ItemDatabase !== 'undefined', label: 'Loading items...' },
        { name: 'TradingSystem', check: () => typeof TradingSystem !== 'undefined', label: 'Setting up markets...' },
        { name: 'QuestSystem', check: () => typeof QuestSystem !== 'undefined', label: 'Preparing quests...' },
        { name: 'AchievementSystem', check: () => typeof AchievementSystem !== 'undefined', label: 'Loading achievements...' },
        { name: 'TravelSystem', check: () => typeof TravelSystem !== 'undefined', label: 'Mapping routes...' },
        { name: 'SaveManager', check: () => typeof SaveManager !== 'undefined', label: 'Checking saves...' },
        { name: 'GameReady', check: () => typeof startNewGame === 'function' || typeof window.startNewGame === 'function', label: 'Finalizing...' }
    ],

    // 🎯 Timing configuration
    expectedLoadTime: 10000,  // 🖤 Expected 10 seconds to load
    maxWaitTime: 20000,       // 🖤 Max 20 seconds before force-completing

    // 📊 State
    progress: 0,
    displayProgress: 0,      // 🖤 Smooth visual progress (time-based)
    isComplete: false,
    isSystemsReady: false,
    checkInterval: null,
    animationFrame: null,
    startTime: 0,

    // 🚀 Start monitoring loading progress
    init() {
        console.log('🖤 LoadingManager: Starting to watch the void fill up...');
        this.startTime = Date.now();
        this.displayProgress = 0;
        this.updateUI(0, 'Summoning medieval times...');

        // 🖤 Check systems every 100ms
        this.checkInterval = setInterval(() => this.checkSystems(), 100);

        // 🎨 Smooth animation loop for progress bar (60fps)
        this.animateProgress();
    },

    // 🎨 Smooth progress bar animation based on time
    animateProgress() {
        if (this.isComplete) return;

        const elapsed = Date.now() - this.startTime;

        // 🖤 Calculate target progress based on time
        // Goes from 0% to 90% over expectedLoadTime, leaving room for final 10%
        let targetProgress;

        if (this.isSystemsReady) {
            // 🎯 Systems ready - smoothly complete to 100%
            targetProgress = 100;
        } else {
            // 🕐 Time-based progress: 0% to 90% over expectedLoadTime
            const timeRatio = Math.min(elapsed / this.expectedLoadTime, 1);
            // Use easeOutQuad for smooth deceleration near 90%
            const easedRatio = 1 - Math.pow(1 - timeRatio, 2);
            targetProgress = Math.min(easedRatio * 90, 90);
        }

        // 🖤 Smoothly interpolate display progress (lerp)
        const lerpSpeed = this.isSystemsReady ? 0.15 : 0.08;
        this.displayProgress += (targetProgress - this.displayProgress) * lerpSpeed;

        // 🖤 Update UI with smooth progress
        this.updateUISmooth(Math.round(this.displayProgress));

        // 🔄 Continue animation
        this.animationFrame = requestAnimationFrame(() => this.animateProgress());
    },

    // 📊 Check if all systems are loaded
    checkSystems() {
        let loaded = 0;
        let currentLabel = 'Loading...';

        for (let i = 0; i < this.systems.length; i++) {
            const sys = this.systems[i];
            if (sys.check()) {
                loaded++;
            } else {
                currentLabel = sys.label;
                break;
            }
        }

        this.progress = Math.round((loaded / this.systems.length) * 100);

        // 🖤 Update status text based on which system is loading
        const statusEl = document.getElementById('loading-status');
        if (statusEl) statusEl.textContent = currentLabel;

        // 💀 All systems loaded?
        if (loaded === this.systems.length && !this.isSystemsReady) {
            console.log('🖤 LoadingManager: All systems ready! Completing load...');
            this.isSystemsReady = true;
            // 🖤 Don't complete immediately - let animation reach 100%
            setTimeout(() => this.complete(), 800);
        }

        // 🖤 Timeout fallback
        const elapsed = Date.now() - this.startTime;
        if (elapsed > this.maxWaitTime && !this.isComplete) {
            console.warn(`🖤 LoadingManager: Timeout after ${elapsed}ms. Force-completing...`);
            this.isSystemsReady = true;
            setTimeout(() => this.complete(), 500);
        }
    },

    // 🎨 Update UI with smooth progress value
    updateUISmooth(progress) {
        const fill = document.getElementById('loading-progress-fill');
        const titleEl = document.getElementById('loading-title');

        if (fill) fill.style.width = progress + '%';

        // 🖤 Fun loading messages based on progress
        if (titleEl) {
            if (progress < 20) titleEl.textContent = 'Awakening the void...';
            else if (progress < 40) titleEl.textContent = 'Summoning merchants...';
            else if (progress < 60) titleEl.textContent = 'Forging trade routes...';
            else if (progress < 80) titleEl.textContent = 'Polishing gold coins...';
            else if (progress < 95) titleEl.textContent = 'Almost there...';
            else titleEl.textContent = 'Ready to trade!';
        }
    },

    // 🎨 Update the loading UI (legacy, used for initial state)
    updateUI(progress, status) {
        const fill = document.getElementById('loading-progress-fill');
        const statusEl = document.getElementById('loading-status');
        const titleEl = document.getElementById('loading-title');

        if (fill) fill.style.width = progress + '%';
        if (statusEl) statusEl.textContent = status;
        if (titleEl && progress === 0) titleEl.textContent = 'Awakening the void...';

        this.displayProgress = progress;
    },

    // ✅ Loading complete - show the menu
    complete() {
        if (this.isComplete) return;
        this.isComplete = true;

        clearInterval(this.checkInterval);
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        console.log('🖤 LoadingManager: Everything loaded! Time to suffer in the medieval economy.');

        // 🖤 Force 100% and final message
        const fill = document.getElementById('loading-progress-fill');
        const titleEl = document.getElementById('loading-title');
        const statusEl = document.getElementById('loading-status');

        if (fill) fill.style.width = '100%';
        if (titleEl) titleEl.textContent = 'Ready to trade!';
        if (statusEl) statusEl.textContent = 'Welcome, merchant...';

        // 🌙 Small delay to show 100%, then transition to menu
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const mainMenu = document.getElementById('main-menu');

            if (loadingScreen) loadingScreen.classList.add('hidden');
            if (mainMenu) mainMenu.classList.remove('hidden');

            // 🌦️ Start menu weather effects
            if (typeof MenuWeatherSystem !== 'undefined' && MenuWeatherSystem.init) {
                MenuWeatherSystem.init();
            }

            console.log('🖤 LoadingManager: Main menu revealed. Let the games begin.');
        }, 500);
    },

    // 🔧 Debug helper - check what's missing
    debugStatus() {
        console.log('🖤 LoadingManager Debug:');
        console.log(`  Elapsed: ${Date.now() - this.startTime}ms`);
        console.log(`  Display Progress: ${this.displayProgress}%`);
        console.log(`  Systems Ready: ${this.isSystemsReady}`);
        this.systems.forEach(sys => {
            console.log(`  ${sys.name}: ${sys.check() ? '✅' : '❌'}`);
        });
    }
};

// 🖤 Start loading check immediately
LoadingManager.init();

window.LoadingManager = LoadingManager;
console.log('🖤 LoadingManager loaded - watching scripts trickle in like my will to live');
