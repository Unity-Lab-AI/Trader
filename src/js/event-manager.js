// ═══════════════════════════════════════════════════════════════
// 👂 EVENT MANAGER - listening to everything like a paranoid goth
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// centralized listener management so we dont leak memory
// because even code needs therapy for attachment issues

const EventManager = {
    // 📋 Store all event listeners - tracking our emotional attachments
    listeners: new Map(),
    
    // Add event listener with tracking - prevents duplicates for same element+event combo
    addListener(element, eventType, handler, options = {}) {
        // silently skip if element doesn't exist - this is expected during initialization
        // when some elements aren't in the DOM yet
        if (!element || !eventType || !handler) {
            return null;
        }

        // Check if this element already has a listener for this event type
        // This prevents duplicate listeners from multiple initialization paths
        const elementKey = element.id || element.className || 'unnamed';
        let existingListener = false;
        this.listeners.forEach((listener, key) => {
            if (listener.element === element && listener.eventType === eventType) {
                existingListener = true;
            }
        });

        if (existingListener) {
            // Already has a listener for this event type, skip
            return null;
        }

        // Create unique key for this listener
        const key = `${elementKey}_${eventType}_${Date.now()}_${Math.random()}`;

        // Store listener info
        this.listeners.set(key, {
            element,
            eventType,
            handler,
            options,
            active: true
        });

        // Add the actual event listener
        element.addEventListener(eventType, handler, options);

        return key; // Return key for removal
    },
    
    // Remove event listener by key
    removeListener(key) {
        if (!this.listeners.has(key)) {
            console.warn(`EventManager: No listener found for key ${key}`);
            return false;
        }
        
        const listener = this.listeners.get(key);
        
        try {
            listener.element.removeEventListener(listener.eventType, listener.handler, listener.options);
            this.listeners.delete(key);
            return true;
        } catch (error) {
            console.error(`EventManager: Error removing listener ${key}:`, error);
            return false;
        }
    },
    
    // Remove all listeners for a specific element
    removeListenersForElement(element) {
        const keysToRemove = [];
        
        this.listeners.forEach((listener, key) => {
            if (listener.element === element) {
                keysToRemove.push(key);
            }
        });
        
        keysToRemove.forEach(key => this.removeListener(key));
        return keysToRemove.length;
    },
    
    // Remove all listeners for a specific event type
    removeListenersForEventType(eventType) {
        const keysToRemove = [];
        
        this.listeners.forEach((listener, key) => {
            if (listener.eventType === eventType) {
                keysToRemove.push(key);
            }
        });
        
        keysToRemove.forEach(key => this.removeListener(key));
        return keysToRemove.length;
    },
    
    // Remove all listeners
    removeAllListeners() {
        const count = this.listeners.size;
        this.listeners.forEach((listener, key) => {
            try {
                listener.element.removeEventListener(listener.eventType, listener.handler, listener.options);
            } catch (error) {
                console.error(`EventManager: Error removing listener ${key}:`, error);
            }
        });
        this.listeners.clear();
        return count;
    },
    
    // Get active listeners count
    getActiveListenersCount() {
        return this.listeners.size;
    },
    
    // Get listeners for debugging
    getListeners() {
        return Array.from(this.listeners.entries()).map(([key, listener]) => ({
            key,
            element: listener.element.id || listener.element.tagName || 'unnamed',
            eventType: listener.eventType,
            active: listener.active
        }));
    },
    
    // Cleanup on page unload
    init() {
        // Add cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.removeAllListeners();
        });

        console.log('EventManager initialized');
    },
    
    // Utility method for one-time listeners
    addOneTimeListener(element, eventType, handler, options = {}) {
        const oneTimeHandler = (e) => {
            handler(e);
            // Find and remove this listener
            this.listeners.forEach((listener, key) => {
                if (listener.element === element &&
                    listener.eventType === eventType &&
                    listener.handler === oneTimeHandler) {
                    this.removeListener(key);
                }
            });
        };

        return this.addListener(element, eventType, oneTimeHandler, options);
    },

    // Alias for addEventListener - many parts of the code use this name
    addEventListener(element, eventType, handler, options = {}) {
        return this.addListener(element, eventType, handler, options);
    },

    // Alias for removeEventListener
    removeEventListener(element, eventType, handler) {
        // Find and remove the matching listener
        const keysToRemove = [];
        this.listeners.forEach((listener, key) => {
            if (listener.element === element &&
                listener.eventType === eventType &&
                listener.handler === handler) {
                keysToRemove.push(key);
            }
        });
        keysToRemove.forEach(key => this.removeListener(key));
        return keysToRemove.length > 0;
    }
};

// Initialize event manager
if (typeof document !== 'undefined') {
    EventManager.init();
}