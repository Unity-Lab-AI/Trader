// ═══════════════════════════════════════════════════════════════
// ⏰ TIMER MANAGER - time waits for no one (but we track it anyway)
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// centralized timer management because memory leaks are scarier than ghosts
// tick tock goes the existential clock

const TimerManager = {
    // ⏱️ Store all active timers - time bombs of scheduled chaos
    timers: new Map(),
    
    // Set a timeout with tracking
    setTimeout(callback, delay, ...args) {
        const timerId = setTimeout(callback, delay, ...args);
        const key = `timer_${Date.now()}_${Math.random()}`;
        
        this.timers.set(key, {
            id: timerId,
            type: 'timeout',
            callback,
            delay,
            active: true,
            createdAt: Date.now()
        });
        
        return key; // Return key for cancellation
    },
    
    // Set an interval with tracking
    setInterval(callback, interval, ...args) {
        const intervalId = setInterval(callback, interval, ...args);
        const key = `interval_${Date.now()}_${Math.random()}`;
        
        this.timers.set(key, {
            id: intervalId,
            type: 'interval',
            callback,
            interval,
            active: true,
            createdAt: Date.now()
        });
        
        return key; // Return key for cancellation
    },
    
    // Clear a timeout by key
    clearTimeout(key) {
        if (!this.timers.has(key)) {
            console.warn(`TimerManager: No timer found for key ${key}`);
            return false;
        }
        
        const timer = this.timers.get(key);
        
        if (timer.type === 'timeout') {
            clearTimeout(timer.id);
        } else {
            clearInterval(timer.id);
        }
        
        this.timers.delete(key);
        return true;
    },
    
    // Clear all timers
    clearAllTimers() {
        const count = this.timers.size;
        
        this.timers.forEach((timer) => {
            if (timer.type === 'timeout') {
                clearTimeout(timer.id);
            } else {
                clearInterval(timer.id);
            }
        });
        
        this.timers.clear();
        return count;
    },
    
    // Clear all timeouts
    clearTimeouts() {
        const keysToClear = [];
        
        this.timers.forEach((timer, key) => {
            if (timer.type === 'timeout') {
                clearTimeout(timer.id);
                keysToClear.push(key);
            }
        });
        
        keysToClear.forEach(key => this.timers.delete(key));
        return keysToClear.length;
    },
    
    // Clear all intervals
    clearIntervals() {
        const keysToClear = [];
        
        this.timers.forEach((timer, key) => {
            if (timer.type === 'interval') {
                clearInterval(timer.id);
                keysToClear.push(key);
            }
        });
        
        keysToClear.forEach(key => this.timers.delete(key));
        return keysToClear.length;
    },
    
    // Get active timers count
    getActiveTimersCount() {
        return this.timers.size;
    },
    
    // Get timers for debugging
    getTimers() {
        return Array.from(this.timers.entries()).map(([key, timer]) => ({
            key,
            type: timer.type,
            active: timer.active,
            delay: timer.delay || timer.interval,
            age: Date.now() - timer.createdAt
        }));
    },
    
    // Check if timer is still active
    isTimerActive(key) {
        return this.timers.has(key) && this.timers.get(key).active;
    },
    
    // Deactivate a timer without clearing it
    deactivateTimer(key) {
        if (this.timers.has(key)) {
            const timer = this.timers.get(key);
            timer.active = false;
            return true;
        }
        return false;
    },
    
    // Reactivate a timer
    reactivateTimer(key) {
        if (this.timers.has(key)) {
            const timer = this.timers.get(key);
            timer.active = true;
            return true;
        }
        return false;
    },
    
    // Cleanup on page unload
    init() {
        // Add cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.clearAllTimers();
        });

        console.log('TimerManager initialized');
    }
};

// Initialize timer manager
if (typeof document !== 'undefined') {
    TimerManager.init();
}