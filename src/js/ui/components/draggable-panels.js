// ═══════════════════════════════════════════════════════════════
// DRAGGABLE PANELS - drag and drop system for UI panels
// ═══════════════════════════════════════════════════════════════
// Version: 0.88 | Unity AI Lab
// Creators: Hackall360, Sponge, GFourteen
// www.unityailab.com | github.com/Unity-Lab-AI/Medieval-Trading-Game
// unityailabcontact@gmail.com
// ═══════════════════════════════════════════════════════════════

const DraggablePanels = {
    dragState: null,
    STORAGE_KEY: 'trader-claude-panel-positions',
    eventsSetup: false,

    // 🖤 Map of panel IDs to their drag handle selectors
    // If not listed, will try common header selectors
    panelDragHandles: {
        'market-panel': '.market-header',
        'travel-panel': '.travel-header',
        'game-setup-panel': '.setup-header',
        'inventory-panel': '.inventory-header, h2, h3',
        'side-panel': 'h3',
        'message-log': 'h3',
        'character-sheet-overlay': '.character-header, h2',
        'quest-overlay': '.quest-header, h2',
        'achievement-overlay': '.achievement-header, h2',
        'financial-sheet-overlay': '.financial-header, h2',
        'property-employee-panel': '.property-header, h2',
        'people-panel': '.people-header, h2, h3',
        'transportation-panel': '.transportation-header, h2',
        'settings-panel': '.settings-header, h2'
    },

    init() {
        console.log('🖤 DraggablePanels: Initializing (drag-only mode)...');

        // Setup global drag events
        this.setupGlobalEvents();

        // Setup draggables on all panels
        this.setupAllDraggables();

        // Observe for new panels
        this.observePanelChanges();

        // Load saved positions
        this.loadPositions();

        console.log('🖤 DraggablePanels: Ready');
    },

    setupGlobalEvents() {
        // 🖤 No more always-on listeners - we add/remove during drag only 💀
        // This prevents 60fps mousemove events when nobody's dragging
        if (this.eventsSetup) return;

        // 🦇 Store bound handlers so we can remove them later
        this._onDragHandler = (e) => this.onDrag(e);
        this._endDragHandler = () => this.endDrag();

        this.eventsSetup = true;
    },

    // 🖤 Add listeners when drag starts - remove when drag ends 💀
    _addDragListeners() {
        document.addEventListener('mousemove', this._onDragHandler);
        document.addEventListener('mouseup', this._endDragHandler);
        document.addEventListener('touchmove', this._onDragHandler, { passive: false });
        document.addEventListener('touchend', this._endDragHandler);
    },

    _removeDragListeners() {
        document.removeEventListener('mousemove', this._onDragHandler);
        document.removeEventListener('mouseup', this._endDragHandler);
        document.removeEventListener('touchmove', this._onDragHandler);
        document.removeEventListener('touchend', this._endDragHandler);
    },

    setupAllDraggables() {
        // Setup all panels with .panel class
        document.querySelectorAll('.panel').forEach(panel => {
            this.makeDraggable(panel);
        });

        // Setup overlays
        document.querySelectorAll('.overlay').forEach(overlay => {
            this.makeDraggable(overlay);
        });

        // Setup specific elements
        const specificElements = [
            'side-panel',
            'message-log',
            'panel-toolbar'
        ];

        specificElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) this.makeDraggable(el);
        });

        // Setup quest tracker separately (may load late)
        this.setupQuestTracker();
    },

    setupQuestTracker() {
        const questTracker = document.querySelector('.quest-tracker');
        if (!questTracker) {
            setTimeout(() => this.setupQuestTracker(), 1000);
            return;
        }

        if (questTracker.dataset.draggable === 'true') return;
        questTracker.dataset.draggable = 'true';

        const header = questTracker.querySelector('.tracker-header');
        if (header) {
            this.attachDragEvents(header, questTracker);
            console.log('🖤 Quest tracker drag enabled');
        }
    },

    // 🖤 Main function - makes a panel draggable by its header
    // NO auto-generated headers or buttons!
    makeDraggable(element) {
        if (!element || element.dataset.draggable === 'true') return;
        element.dataset.draggable = 'true';

        // Find the drag handle (header element)
        const handle = this.findDragHandle(element);
        if (!handle) {
            console.log('🖤 No drag handle found for:', element.id || element.className);
            return;
        }

        // Style the handle as draggable
        handle.style.cursor = 'move';
        handle.style.userSelect = 'none';

        // Attach drag events
        this.attachDragEvents(handle, element);

        console.log('🖤 Drag enabled for:', element.id || element.className);
    },

    // 🦇 Find the appropriate drag handle for a panel
    findDragHandle(element) {
        // Check specific mapping first
        const selectorList = this.panelDragHandles[element.id];
        if (selectorList) {
            const selectors = selectorList.split(',').map(s => s.trim());
            for (const selector of selectors) {
                const handle = element.querySelector(selector);
                if (handle) return handle;
            }
        }

        // Try common header patterns
        const commonSelectors = [
            '.panel-header',
            '.modal-header',
            '.overlay-header',
            'header',
            'h2',
            'h3'
        ];

        for (const selector of commonSelectors) {
            const handle = element.querySelector(selector);
            if (handle) return handle;
        }

        return null;
    },

    // 🖤 Attach drag events to a handle
    attachDragEvents(handle, element) {
        const self = this;

        // Remove old handlers by cloning (prevents duplicates)
        const newHandle = handle.cloneNode(true);
        if (handle.parentNode) {
            handle.parentNode.replaceChild(newHandle, handle);
        }

        newHandle.addEventListener('mousedown', function(e) {
            // Don't drag if clicking buttons or inputs
            if (e.target.closest('button, input, select, .panel-close-x, .panel-close-btn')) return;
            e.preventDefault();
            e.stopPropagation();
            self.startDrag(e, element);
        }, true);

        newHandle.addEventListener('touchstart', function(e) {
            if (e.target.closest('button, input, select, .panel-close-x, .panel-close-btn')) return;
            e.preventDefault();
            e.stopPropagation();
            self.startDrag(e, element);
        }, { passive: false, capture: true });
    },

    startDrag(e, element) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const rect = element.getBoundingClientRect();

        // Move to body if needed for proper fixed positioning
        if (element.parentElement?.id === 'ui-panels') {
            element.dataset.originalParent = 'ui-panels';
            document.body.appendChild(element);
        }

        // Set fixed position at current location
        element.style.position = 'fixed';
        element.style.left = rect.left + 'px';
        element.style.top = rect.top + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        element.style.transform = 'none';
        element.style.margin = '0';
        element.style.zIndex = '1000';

        // 🖤 Cache width/height here - no getBoundingClientRect() spam in onDrag()
        // This prevents layout thrashing during drag operations 💀
        this.dragState = {
            element,
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top,
            width: rect.width,    // Cached for onDrag()
            height: rect.height,  // Cached for onDrag()
            maxX: window.innerWidth,
            maxY: window.innerHeight
        };

        element.classList.add('dragging');

        // 🦇 NOW we add the listeners - only when actually dragging
        this._addDragListeners();
    },

    onDrag(e) {
        if (!this.dragState) return;

        e.preventDefault();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // 🖤 Use cached values - no reflow spam in this realm
        const { element, offsetX, offsetY, width, height, maxX, maxY } = this.dragState;

        let newX = clientX - offsetX;
        let newY = clientY - offsetY;

        // Keep within viewport using CACHED dimensions - no getBoundingClientRect() 💀
        newX = Math.max(0, Math.min(newX, maxX - width));
        newY = Math.max(0, Math.min(newY, maxY - height));

        element.style.left = newX + 'px';
        element.style.top = newY + 'px';
    },

    endDrag() {
        if (!this.dragState) return;

        const { element } = this.dragState;
        element.classList.remove('dragging');
        element.style.zIndex = '100';

        this.savePosition(element);
        this.dragState = null;

        // 🖤 Remove listeners - no more mousemove spam until next drag 💀
        this._removeDragListeners();
    },

    observePanelChanges() {
        // 🖤 Disconnect old observer if it exists - no zombie watchers 💀
        if (this._panelObserver) {
            this._panelObserver.disconnect();
        }

        this._panelObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.classList?.contains('panel') || node.classList?.contains('overlay')) {
                                setTimeout(() => this.makeDraggable(node), 100);
                            }
                        }
                    });
                }
            });
        });

        this._panelObserver.observe(document.body, { childList: true, subtree: true });

        // 🦇 Clean up on page unload - no memory leaks in my realm
        window.addEventListener('beforeunload', () => this.disconnectObserver());
    },

    // 🖤 Call this to stop watching for new panels 💀
    disconnectObserver() {
        if (this._panelObserver) {
            this._panelObserver.disconnect();
            this._panelObserver = null;
        }
    },

    savePosition(element) {
        const id = element.id;
        if (!id) return;

        const positions = this.getAllPositions();
        positions[id] = {
            left: element.style.left,
            top: element.style.top
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(positions));
        } catch (e) {}
    },

    getAllPositions() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};
        } catch (e) {
            return {};
        }
    },

    loadPositions() {
        const positions = this.getAllPositions();

        Object.keys(positions).forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;

            const pos = positions[id];
            if (pos.left && pos.top) {
                if (element.parentElement?.id === 'ui-panels') {
                    document.body.appendChild(element);
                }

                element.style.position = 'fixed';
                element.style.left = pos.left;
                element.style.top = pos.top;
                element.style.right = 'auto';
                element.style.bottom = 'auto';
                element.style.transform = 'none';
                element.style.margin = '0';
            }
        });
    },

    resetPositions() {
        localStorage.removeItem(this.STORAGE_KEY);
        location.reload();
    }
};

// Initialize after DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => DraggablePanels.init(), 300));
} else {
    setTimeout(() => DraggablePanels.init(), 300);
}

window.DraggablePanels = DraggablePanels;
