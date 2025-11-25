// ═══════════════════════════════════════════════════════════════
// 🗺️ GAME WORLD RENDERER v2 - HTML/CSS based for reliable interactions
// ═══════════════════════════════════════════════════════════════
// Rebuilt from scratch because canvas was being a drama queen
// Now using good old HTML elements that actually respond to clicks

const GameWorldRenderer = {
    // 📦 DOM elements
    container: null,
    mapElement: null,
    tooltipElement: null,

    // 📍 Map state
    mapState: {
        zoom: 3,             // Start at max zoom (zoomed in to fill screen)
        offsetX: 0,
        offsetY: 0,
        minZoom: 0.5,        // Max zoomed out - shows entire world
        maxZoom: 3,          // Max zoomed in - fills screen
        defaultZoom: 3,      // Default zoom for reset (max zoom - fills screen)
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        lastOffsetX: 0,
        lastOffsetY: 0
    },

    // 📜 Location visit history - tracks each visit with details
    locationHistory: [],
    currentDestination: null,
    HISTORY_STORAGE_KEY: 'trader-claude-location-history',

    // 🎨 Location styles
    locationStyles: {
        capital: { color: '#FFD700', icon: '👑', size: 48 },
        city: { color: '#FF6B6B', icon: '🏰', size: 40 },
        town: { color: '#4ECDC4', icon: '🏘️', size: 34 },
        village: { color: '#95E77E', icon: '🏠', size: 28 },
        mine: { color: '#8B4513', icon: '⛏️', size: 30 },
        forest: { color: '#228B22', icon: '🌲', size: 32 },
        farm: { color: '#F4A460', icon: '🌾', size: 30 },
        dungeon: { color: '#4B0082', icon: '💀', size: 32 },
        cave: { color: '#696969', icon: '🕳️', size: 28 },
        inn: { color: '#DAA520', icon: '🍺', size: 26 },
        ruins: { color: '#708090', icon: '🏛️', size: 30 },
        port: { color: '#1E90FF', icon: '⚓', size: 34 },
        outpost: { color: '#CD853F', icon: '🛡️', size: 28 }
    },

    // 🚀 Initialize the renderer
    init() {
        console.log('🗺️ GameWorldRenderer v2: Initializing HTML-based map...');

        this.container = document.getElementById('map-container');
        if (!this.container) {
            console.error('🗺️ Map container not found!');
            return false;
        }

        // Create the map element
        this.createMapElement();

        // Create tooltip
        this.createTooltip();

        // Setup event listeners
        this.setupEventListeners();

        // Load location history from storage
        this.loadLocationHistory();

        // Render the map
        this.render();

        // Center the map at default zoom after delays (to let container size settle)
        setTimeout(() => {
            this.resetView();
        }, 200);

        // Also center again after a longer delay in case game state loads
        setTimeout(() => {
            this.resetView();
            // Update history panel after game fully loads
            this.updateHistoryPanel();
            // Record initial location visit if history is empty
            if (this.locationHistory.length === 0 && typeof game !== 'undefined' && game.currentLocation) {
                this.recordLocationVisit(game.currentLocation.id, { isFirstVisit: true });
            }
        }, 1000);

        console.log('🗺️ GameWorldRenderer v2: Ready to rock!');
        return true;
    },

    // 📦 Create the map container element
    createMapElement() {
        // Remove old canvas if exists
        const oldCanvas = document.getElementById('world-map-canvas');
        if (oldCanvas) {
            oldCanvas.style.display = 'none';
        }

        // Create map element if not exists
        this.mapElement = document.getElementById('world-map-html');
        if (!this.mapElement) {
            this.mapElement = document.createElement('div');
            this.mapElement.id = 'world-map-html';
            this.mapElement.className = 'world-map-html';
            this.container.appendChild(this.mapElement);
        }

        // Style the map element
        this.mapElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 800px;
            height: 600px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            transform-origin: 0 0;
            cursor: grab;
            user-select: none;
            border-radius: 8px;
        `;
    },

    // 💬 Create tooltip element
    createTooltip() {
        this.tooltipElement = document.getElementById('map-tooltip');
        if (!this.tooltipElement) {
            this.tooltipElement = document.createElement('div');
            this.tooltipElement.id = 'map-tooltip';
            this.tooltipElement.className = 'map-tooltip';
            document.body.appendChild(this.tooltipElement);
        }

        this.tooltipElement.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 10px 15px;
            border-radius: 8px;
            border: 2px solid #4fc3f7;
            font-size: 14px;
            max-width: 300px;
            z-index: 10000;
            pointer-events: none;
            display: none;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
    },

    // 👂 Setup event listeners
    setupEventListeners() {
        // Map dragging
        this.mapElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));

        // Zoom with scroll wheel
        this.container.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

        // Touch support
        this.mapElement.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.onTouchEnd(e));

        console.log('🗺️ Event listeners attached');
    },

    // 🎨 Render the map
    render() {
        if (!this.mapElement || typeof GameWorld === 'undefined') {
            console.warn('🗺️ Cannot render - map element or GameWorld not ready');
            return;
        }

        // Clear existing locations
        this.mapElement.innerHTML = '';

        // Calculate which locations are visible/explored
        const visibilityMap = this.calculateLocationVisibility();

        // Draw connection lines first (behind locations) - only for visible connections
        this.drawConnections(visibilityMap);

        // Calculate label offsets to prevent overlapping text (only for visible locations)
        const locations = GameWorld.locations || {};
        const visibleLocations = {};
        Object.entries(locations).forEach(([id, loc]) => {
            if (visibilityMap[id] && visibilityMap[id] !== 'hidden') {
                visibleLocations[id] = loc;
            }
        });
        const labelOffsets = this.calculateLabelOffsets(visibleLocations);

        // Draw each location with its calculated label offset and visibility state
        Object.values(locations).forEach(location => {
            const visibility = visibilityMap[location.id] || 'hidden';
            if (visibility !== 'hidden') {
                const offset = labelOffsets[location.id] || 0;
                this.createLocationElement(location, offset, visibility);
            }
        });

        // Apply current transform
        this.updateTransform();

        // Mark current location
        this.highlightCurrentLocation();
    },

    // 🔍 Calculate visibility for all locations
    // Returns: 'visible' (explored), 'discovered' (adjacent to explored, greyed out), 'hidden' (not visible)
    calculateLocationVisibility() {
        const visibility = {};
        const locations = (typeof GameWorld !== 'undefined' && GameWorld.locations) ? GameWorld.locations : {};

        // Get visited locations - check multiple sources
        let visited = [];
        if (typeof GameWorld !== 'undefined' && Array.isArray(GameWorld.visitedLocations)) {
            visited = GameWorld.visitedLocations;
        }

        // If no visited locations yet, use current location as starting point
        if (visited.length === 0 && typeof game !== 'undefined' && game.currentLocation && game.currentLocation.id) {
            visited = [game.currentLocation.id];
            // Also add to GameWorld if possible
            if (typeof GameWorld !== 'undefined') {
                GameWorld.visitedLocations = GameWorld.visitedLocations || [];
                if (!GameWorld.visitedLocations.includes(game.currentLocation.id)) {
                    GameWorld.visitedLocations.push(game.currentLocation.id);
                }
            }
        }

        console.log('🗺️ Visibility calc - visited locations:', visited);

        // If still no visited locations, show all as visible (fallback)
        if (visited.length === 0) {
            console.warn('🗺️ No visited locations found - showing all locations');
            Object.keys(locations).forEach(locId => {
                visibility[locId] = 'visible';
            });
            return visibility;
        }

        // First pass: mark all visited locations as visible
        visited.forEach(locId => {
            visibility[locId] = 'visible';
        });

        // Second pass: mark locations connected to visited ones as 'discovered' (greyed out)
        visited.forEach(locId => {
            const location = locations[locId];
            if (location && location.connections) {
                location.connections.forEach(connectedId => {
                    // Only mark as discovered if not already visible
                    if (!visibility[connectedId]) {
                        // Check if this location is behind a locked gatehouse
                        if (this.isLocationBehindLockedGate(connectedId)) {
                            visibility[connectedId] = 'hidden';
                        } else {
                            visibility[connectedId] = 'discovered';
                        }
                    }
                });
            }
        });

        // All other locations remain hidden (undefined or 'hidden')
        Object.keys(locations).forEach(locId => {
            if (!visibility[locId]) {
                visibility[locId] = 'hidden';
            }
        });

        return visibility;
    },

    // 🚧 Check if a location is behind a locked gatehouse
    isLocationBehindLockedGate(locationId) {
        // If GatehouseSystem doesn't exist or isn't initialized, don't block anything
        if (typeof GatehouseSystem === 'undefined' || !GatehouseSystem.canAccessLocation) {
            return false;
        }

        // Check if this is the player's starting zone or capital - never block these
        if (typeof GatehouseSystem.startingZone !== 'undefined') {
            const locZone = GatehouseSystem.LOCATION_ZONES ? GatehouseSystem.LOCATION_ZONES[locationId] : null;
            if (locZone === 'capital' || locZone === GatehouseSystem.startingZone) {
                return false;
            }
        }

        try {
            const access = GatehouseSystem.canAccessLocation(locationId);
            return !access.accessible;
        } catch (e) {
            console.warn('🗺️ Error checking gatehouse access:', e);
            return false;
        }
    },

    // 🔗 Draw connection lines between locations
    drawConnections(visibilityMap = {}) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '800');
        svg.setAttribute('height', '600');
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
        `;

        const locations = GameWorld.locations || {};
        const visited = GameWorld.visitedLocations || [];
        const drawnConnections = new Set();

        Object.values(locations).forEach(location => {
            if (!location.connections || !location.mapPosition) return;

            // Only draw connections from visible or discovered locations
            const locVisibility = visibilityMap[location.id];
            if (locVisibility === 'hidden') return;

            location.connections.forEach(targetId => {
                const target = locations[targetId];
                if (!target || !target.mapPosition) return;

                // Only draw connection if target is also visible or discovered
                const targetVisibility = visibilityMap[targetId];
                if (targetVisibility === 'hidden') return;

                // Avoid drawing duplicate lines
                const connectionKey = [location.id, targetId].sort().join('-');
                if (drawnConnections.has(connectionKey)) return;
                drawnConnections.add(connectionKey);

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', location.mapPosition.x);
                line.setAttribute('y1', location.mapPosition.y);
                line.setAttribute('x2', target.mapPosition.x);
                line.setAttribute('y2', target.mapPosition.y);

                // Color based on exploration status
                const bothExplored = visited.includes(location.id) && visited.includes(targetId);
                const oneExplored = visited.includes(location.id) || visited.includes(targetId);

                if (bothExplored) {
                    // Fully explored path - gold
                    line.setAttribute('stroke', 'rgba(255, 215, 0, 0.5)');
                    line.setAttribute('stroke-width', '3');
                    line.setAttribute('stroke-dasharray', 'none');
                } else if (oneExplored) {
                    // Partially explored - faded gold
                    line.setAttribute('stroke', 'rgba(255, 215, 0, 0.25)');
                    line.setAttribute('stroke-width', '2');
                    line.setAttribute('stroke-dasharray', '5,5');
                } else {
                    // Discovered but not explored - grey
                    line.setAttribute('stroke', 'rgba(150, 150, 150, 0.3)');
                    line.setAttribute('stroke-width', '2');
                    line.setAttribute('stroke-dasharray', '5,5');
                }

                svg.appendChild(line);
            });
        });

        this.mapElement.appendChild(svg);
    },

    // 📍 Create a location element
    // visibility: 'visible' (explored), 'discovered' (greyed out), 'hidden' (not rendered)
    createLocationElement(location, labelOffset = 0, visibility = 'visible') {
        if (!location.mapPosition) return;
        if (visibility === 'hidden') return;

        const style = this.locationStyles[location.type] || this.locationStyles.town;
        const isDiscovered = visibility === 'discovered';
        const el = document.createElement('div');
        el.className = 'map-location' + (isDiscovered ? ' discovered' : '');
        el.dataset.locationId = location.id;
        el.dataset.visibility = visibility;

        // For discovered (unexplored) locations, use greyed out styling
        const bgColor = isDiscovered ? '#555555' : style.color;
        const borderColor = isDiscovered ? '#777777' : this.lightenColor(style.color, 20);
        const opacity = isDiscovered ? '0.6' : '1';
        const iconFilter = isDiscovered ? 'grayscale(100%) opacity(0.5)' : 'none';

        el.style.cssText = `
            position: absolute;
            left: ${location.mapPosition.x}px;
            top: ${location.mapPosition.y}px;
            transform: translate(-50%, -50%);
            width: ${style.size}px;
            height: ${style.size}px;
            background: radial-gradient(circle, ${bgColor} 0%, ${this.darkenColor(bgColor, 30)} 100%);
            border: 3px solid ${borderColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${style.size * 0.5}px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            z-index: 10;
            opacity: ${opacity};
            filter: ${iconFilter};
        `;

        // Show question mark for undiscovered, icon for explored
        el.innerHTML = isDiscovered ? '❓' : style.icon;

        // Hover effects
        el.addEventListener('mouseenter', (e) => this.onLocationHover(e, location, isDiscovered));
        el.addEventListener('mouseleave', () => this.hideTooltip());
        el.addEventListener('click', (e) => this.onLocationClick(e, location, isDiscovered));

        this.mapElement.appendChild(el);

        // Add location name label with stagger offset for overlapping labels
        const label = document.createElement('div');
        label.className = 'map-location-label' + (isDiscovered ? ' discovered' : '');
        // Show "Unknown" or "???" for discovered but unexplored locations
        label.textContent = isDiscovered ? '???' : location.name;
        const labelColor = isDiscovered ? '#888' : '#fff';
        label.style.cssText = `
            position: absolute;
            left: ${location.mapPosition.x}px;
            top: ${location.mapPosition.y + style.size / 2 + 8 + labelOffset}px;
            transform: translateX(-50%);
            color: ${labelColor};
            font-size: 11px;
            font-style: ${isDiscovered ? 'italic' : 'normal'};
            text-shadow: 1px 1px 2px #000, -1px -1px 2px #000, 0 0 4px #000;
            white-space: nowrap;
            pointer-events: none;
            z-index: 5;
        `;
        this.mapElement.appendChild(label);
    },

    // 🔍 Calculate label offsets to prevent overlapping
    calculateLabelOffsets(locations) {
        const offsets = {};
        const locArray = Object.values(locations).filter(l => l.mapPosition);

        // Sort by x position to process left to right
        locArray.sort((a, b) => a.mapPosition.x - b.mapPosition.x);

        // Track label positions to detect overlaps
        const labelPositions = [];

        locArray.forEach(location => {
            const style = this.locationStyles[location.type] || this.locationStyles.town;
            const baseY = location.mapPosition.y + style.size / 2 + 8;
            const x = location.mapPosition.x;

            // Check for nearby labels that might overlap (within 80px horizontally and similar Y)
            let offset = 0;
            let attempts = 0;
            const maxAttempts = 4;

            while (attempts < maxAttempts) {
                const testY = baseY + offset;
                let hasOverlap = false;

                for (const existing of labelPositions) {
                    const xDist = Math.abs(existing.x - x);
                    const yDist = Math.abs(existing.y - testY);

                    // If horizontally close (within 80px) and vertically close (within 14px)
                    if (xDist < 80 && yDist < 14) {
                        hasOverlap = true;
                        break;
                    }
                }

                if (!hasOverlap) {
                    break;
                }

                // Alternate between pushing down and up
                attempts++;
                if (attempts % 2 === 1) {
                    offset = 14 * Math.ceil(attempts / 2);
                } else {
                    offset = -14 * Math.ceil(attempts / 2);
                }
            }

            offsets[location.id] = offset;
            labelPositions.push({ x, y: baseY + offset, id: location.id });
        });

        return offsets;
    },

    // 🎯 Highlight current player location and show player marker
    highlightCurrentLocation() {
        if (!game || !game.currentLocation) return;

        // Highlight the location element
        const currentEl = this.mapElement.querySelector(`[data-location-id="${game.currentLocation.id}"]`);
        if (currentEl) {
            currentEl.style.boxShadow = '0 0 20px 5px rgba(79, 195, 247, 0.8)';
            currentEl.style.border = '3px solid #4fc3f7';
        }

        // Create or update player marker
        this.updatePlayerMarker();
    },

    // 📍 Player marker element reference
    playerMarker: null,
    travelAnimation: null,

    // 📍 Create/update the player marker (red pin tack)
    updatePlayerMarker(x = null, y = null) {
        // Get position from current location if not provided
        if (x === null || y === null) {
            const locationId = game?.currentLocation?.id;
            if (!locationId) return;

            const location = typeof GameWorld !== 'undefined' ? GameWorld.locations[locationId] : null;
            if (!location || !location.mapPosition) return;

            x = location.mapPosition.x;
            y = location.mapPosition.y;
        }

        // Create marker if it doesn't exist
        if (!this.playerMarker) {
            this.playerMarker = document.createElement('div');
            this.playerMarker.id = 'player-marker';
            this.playerMarker.className = 'player-marker';
            this.playerMarker.innerHTML = `
                <div class="marker-pin">📍</div>
                <div class="marker-pulse"></div>
                <div class="marker-label">YOU ARE HERE</div>
            `;
            this.playerMarker.style.cssText = `
                position: absolute;
                z-index: 100;
                pointer-events: none;
                transform: translate(-50%, -100%);
                display: flex;
                flex-direction: column;
                align-items: center;
            `;

            // Style the pin
            const pin = this.playerMarker.querySelector('.marker-pin');
            pin.style.cssText = `
                font-size: 36px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
                animation: marker-bounce 2s ease-in-out infinite;
                z-index: 102;
            `;

            // Style the pulse effect
            const pulse = this.playerMarker.querySelector('.marker-pulse');
            pulse.style.cssText = `
                position: absolute;
                bottom: 4px;
                width: 20px;
                height: 20px;
                background: rgba(255, 0, 0, 0.4);
                border-radius: 50%;
                animation: marker-pulse 2s ease-out infinite;
                z-index: 99;
            `;

            // Style the label
            const label = this.playerMarker.querySelector('.marker-label');
            label.style.cssText = `
                background: linear-gradient(180deg, #ff4444 0%, #cc0000 100%);
                color: white;
                font-size: 10px;
                font-weight: bold;
                padding: 3px 8px;
                border-radius: 10px;
                white-space: nowrap;
                margin-top: -8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                border: 2px solid #fff;
                z-index: 101;
                letter-spacing: 1px;
            `;

            // Add CSS animations
            if (!document.getElementById('player-marker-styles')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'player-marker-styles';
                styleSheet.textContent = `
                    @keyframes marker-bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }
                    @keyframes marker-pulse {
                        0% { transform: scale(1); opacity: 0.6; }
                        100% { transform: scale(3); opacity: 0; }
                    }
                    @keyframes marker-travel {
                        0% { transform: translate(-50%, -100%) scale(1); }
                        50% { transform: translate(-50%, -100%) scale(1.2); }
                        100% { transform: translate(-50%, -100%) scale(1); }
                    }
                `;
                document.head.appendChild(styleSheet);
            }

            this.mapElement.appendChild(this.playerMarker);
        }

        // Update position
        this.playerMarker.style.left = x + 'px';
        this.playerMarker.style.top = y + 'px';
    },

    // 🚶 Animate player marker along a path from current location to destination
    // travelTimeMinutes: game time in minutes for this journey
    animateTravel(fromLocationId, toLocationId, travelTimeMinutes) {
        const locations = typeof GameWorld !== 'undefined' ? GameWorld.locations : {};
        const fromLoc = locations[fromLocationId];
        const toLoc = locations[toLocationId];

        if (!fromLoc?.mapPosition || !toLoc?.mapPosition) {
            console.warn('🗺️ Cannot animate travel - missing location positions');
            return;
        }

        // Cancel any existing animation
        if (this.travelAnimation) {
            cancelAnimationFrame(this.travelAnimation);
        }

        // Store travel info for time-synced animation
        this.currentTravel = {
            fromId: fromLocationId,
            toId: toLocationId,
            startX: fromLoc.mapPosition.x,
            startY: fromLoc.mapPosition.y,
            endX: toLoc.mapPosition.x,
            endY: toLoc.mapPosition.y,
            durationMinutes: travelTimeMinutes,
            startGameTime: typeof TimeSystem !== 'undefined' ? TimeSystem.getTotalMinutes() : 0
        };

        // Add traveling class to marker
        if (this.playerMarker) {
            this.playerMarker.classList.add('traveling');
            const pin = this.playerMarker.querySelector('.marker-pin');
            if (pin) {
                pin.style.animation = 'marker-travel 0.5s ease-in-out infinite';
            }
            // Update label to show "TRAVELING..."
            const label = this.playerMarker.querySelector('.marker-label');
            if (label) {
                label.textContent = 'TRAVELING...';
                label.style.background = 'linear-gradient(180deg, #ff8844 0%, #cc4400 100%)';
            }
        }

        // Start the animation loop
        this.runTravelAnimation();
    },

    // 🔄 Run travel animation synced to game time
    runTravelAnimation() {
        if (!this.currentTravel) return;

        const travel = this.currentTravel;

        // Get current game time progress
        let progress = 0;
        if (typeof TimeSystem !== 'undefined') {
            const currentGameTime = TimeSystem.getTotalMinutes();
            const elapsed = currentGameTime - travel.startGameTime;
            progress = Math.min(elapsed / travel.durationMinutes, 1);
        } else {
            // Fallback if TimeSystem not available
            progress = 1;
        }

        // Ease in-out function for smooth movement
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Calculate current position
        const currentX = travel.startX + (travel.endX - travel.startX) * easeProgress;
        const currentY = travel.startY + (travel.endY - travel.startY) * easeProgress;

        // Update marker position
        this.updatePlayerMarker(currentX, currentY);

        if (progress < 1) {
            // Continue animation - check every frame
            this.travelAnimation = requestAnimationFrame(() => this.runTravelAnimation());
        } else {
            // Animation complete
            this.completeTravelAnimation();
        }
    },

    // ✅ Complete the travel animation
    completeTravelAnimation() {
        this.travelAnimation = null;
        this.currentTravel = null;

        if (this.playerMarker) {
            this.playerMarker.classList.remove('traveling');
            const pin = this.playerMarker.querySelector('.marker-pin');
            if (pin) {
                pin.style.animation = 'marker-bounce 2s ease-in-out infinite';
            }
            // Reset label
            const label = this.playerMarker.querySelector('.marker-label');
            if (label) {
                label.textContent = 'YOU ARE HERE';
                label.style.background = 'linear-gradient(180deg, #ff4444 0%, #cc0000 100%)';
            }
        }

        // Re-render to update exploration state
        this.render();
    },

    // 🗺️ Called when travel starts - hook into TravelSystem
    onTravelStart(fromId, toId, travelTimeMinutes) {
        console.log(`🗺️ Travel animation: ${fromId} -> ${toId}, duration: ${travelTimeMinutes} game minutes`);
        this.animateTravel(fromId, toId, travelTimeMinutes);
    },

    // 🛑 Called when travel is cancelled or interrupted
    onTravelCancel() {
        if (this.travelAnimation) {
            cancelAnimationFrame(this.travelAnimation);
            this.travelAnimation = null;
        }
        this.currentTravel = null;
        this.completeTravelAnimation();
    },

    // 🔄 Update map transform
    updateTransform() {
        if (!this.mapElement) return;

        // Apply boundary constraints
        this.constrainToBounds();

        const transform = `translate(${this.mapState.offsetX}px, ${this.mapState.offsetY}px) scale(${this.mapState.zoom})`;
        this.mapElement.style.transform = transform;
    },

    // 🚧 Constrain map position to keep it within viewable area
    constrainToBounds() {
        if (!this.container) return;

        const containerRect = this.container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        // Scaled map dimensions
        const mapWidth = 800 * this.mapState.zoom;
        const mapHeight = 600 * this.mapState.zoom;

        // If map is smaller than container, center it
        if (mapWidth <= containerWidth) {
            this.mapState.offsetX = (containerWidth - mapWidth) / 2;
        } else {
            // Map is larger than container - constrain so it doesn't go past edges
            const minX = containerWidth - mapWidth; // Can't scroll past right edge
            const maxX = 0; // Can't scroll past left edge
            this.mapState.offsetX = Math.max(minX, Math.min(maxX, this.mapState.offsetX));
        }

        if (mapHeight <= containerHeight) {
            this.mapState.offsetY = (containerHeight - mapHeight) / 2;
        } else {
            // Map is larger than container - constrain so it doesn't go past edges
            const minY = containerHeight - mapHeight; // Can't scroll past bottom edge
            const maxY = 0; // Can't scroll past top edge
            this.mapState.offsetY = Math.max(minY, Math.min(maxY, this.mapState.offsetY));
        }
    },

    // 🖱️ Mouse event handlers
    onMouseDown(e) {
        if (e.target.classList.contains('map-location')) return; // Don't drag when clicking locations

        e.preventDefault();
        this.mapState.isDragging = true;
        this.mapState.dragStartX = e.clientX;
        this.mapState.dragStartY = e.clientY;
        this.mapState.lastOffsetX = this.mapState.offsetX;
        this.mapState.lastOffsetY = this.mapState.offsetY;
        this.mapElement.style.cursor = 'grabbing';
    },

    onMouseMove(e) {
        if (!this.mapState.isDragging) return;

        const dx = e.clientX - this.mapState.dragStartX;
        const dy = e.clientY - this.mapState.dragStartY;

        this.mapState.offsetX = this.mapState.lastOffsetX + dx;
        this.mapState.offsetY = this.mapState.lastOffsetY + dy;

        this.updateTransform();
    },

    onMouseUp(e) {
        this.mapState.isDragging = false;
        if (this.mapElement) {
            this.mapElement.style.cursor = 'grab';
        }
    },

    // 🔍 Zoom handlers
    onWheel(e) {
        e.preventDefault();

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(this.mapState.minZoom, Math.min(this.mapState.maxZoom, this.mapState.zoom + delta));

        this.mapState.zoom = newZoom;
        this.updateTransform();
    },

    zoomIn() {
        this.mapState.zoom = Math.min(this.mapState.maxZoom, this.mapState.zoom + 0.2);
        this.updateTransform();
    },

    zoomOut() {
        this.mapState.zoom = Math.max(this.mapState.minZoom, this.mapState.zoom - 0.2);
        this.updateTransform();
    },

    resetView() {
        // Reset to default zoom (max zoomed in - fills screen)
        this.mapState.zoom = this.mapState.defaultZoom;

        // Center on player's current location
        this.centerOnPlayer();
    },

    // 📍 Center on player location
    centerOnPlayer() {
        if (!this.container) return;

        // Try to get player's current location position
        let pos = null;

        // First try game.currentLocation.mapPosition
        if (typeof game !== 'undefined' && game.currentLocation && game.currentLocation.mapPosition) {
            pos = game.currentLocation.mapPosition;
        }
        // If not found, look up from GameWorld using location ID
        else if (typeof game !== 'undefined' && game.currentLocation && game.currentLocation.id && typeof GameWorld !== 'undefined') {
            const location = GameWorld.locations[game.currentLocation.id];
            if (location && location.mapPosition) {
                pos = location.mapPosition;
            }
        }
        // Fallback: try to find any location from GameWorld
        else if (typeof GameWorld !== 'undefined' && GameWorld.locations) {
            // Default to capital or first available location
            const defaultLoc = GameWorld.locations['royal_capital'] ||
                              GameWorld.locations['greendale'] ||
                              Object.values(GameWorld.locations)[0];
            if (defaultLoc && defaultLoc.mapPosition) {
                pos = defaultLoc.mapPosition;
            }
        }

        // If still no position, center the map itself
        if (!pos) {
            console.warn('🗺️ No location position found, centering map');
            pos = { x: 400, y: 300 }; // Default center of 800x600 map
        }

        const containerRect = this.container.getBoundingClientRect();

        // Calculate offset to center the location in the container
        // The location's position on the scaled map should appear at center of container
        this.mapState.offsetX = (containerRect.width / 2) - (pos.x * this.mapState.zoom);
        this.mapState.offsetY = (containerRect.height / 2) - (pos.y * this.mapState.zoom);

        // Apply constraints and update
        this.updateTransform();
        console.log('🗺️ Centered on location at', pos, 'offset:', this.mapState.offsetX, this.mapState.offsetY);
    },

    // 📱 Touch handlers
    onTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.mapState.isDragging = true;
            this.mapState.dragStartX = touch.clientX;
            this.mapState.dragStartY = touch.clientY;
            this.mapState.lastOffsetX = this.mapState.offsetX;
            this.mapState.lastOffsetY = this.mapState.offsetY;
        }
    },

    onTouchMove(e) {
        if (!this.mapState.isDragging || e.touches.length !== 1) return;

        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - this.mapState.dragStartX;
        const dy = touch.clientY - this.mapState.dragStartY;

        this.mapState.offsetX = this.mapState.lastOffsetX + dx;
        this.mapState.offsetY = this.mapState.lastOffsetY + dy;

        this.updateTransform();
    },

    onTouchEnd(e) {
        this.mapState.isDragging = false;
    },

    // 💬 Tooltip handlers
    onLocationHover(e, location, isDiscovered = false) {
        const style = this.locationStyles[location.type] || this.locationStyles.town;

        if (isDiscovered) {
            // Show limited info for undiscovered locations
            this.tooltipElement.innerHTML = `
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px; color: #888;">
                    ❓ Unknown Location
                </div>
                <div style="color: #666; font-size: 12px; margin-bottom: 5px;">
                    Unexplored territory
                </div>
                <div style="font-size: 12px; line-height: 1.4; color: #888; font-style: italic;">
                    Travel here to discover what lies in this area...
                </div>
                <div style="color: #95E77E; margin-top: 5px;">🖱️ Click to explore</div>
            `;
        } else {
            this.tooltipElement.innerHTML = `
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">
                    ${style.icon} ${location.name}
                </div>
                <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">
                    ${location.type.charAt(0).toUpperCase() + location.type.slice(1)} • ${location.region}
                </div>
                <div style="font-size: 12px; line-height: 1.4;">
                    ${location.description || 'No description available.'}
                </div>
                ${this.isCurrentLocation(location) ? '<div style="color: #4fc3f7; margin-top: 5px;">📍 You are here</div>' : '<div style="color: #95E77E; margin-top: 5px;">🖱️ Click to travel</div>'}
            `;
        }

        this.tooltipElement.style.display = 'block';
        this.tooltipElement.style.left = (e.clientX + 15) + 'px';
        this.tooltipElement.style.top = (e.clientY + 15) + 'px';
    },

    hideTooltip() {
        this.tooltipElement.style.display = 'none';
    },

    // 🚶 Location click handler
    onLocationClick(e, location, isDiscovered = false) {
        e.stopPropagation();

        if (this.isCurrentLocation(location)) {
            addMessage(`📍 You are already at ${location.name}`);
            return;
        }

        // Check if location is connected to current location
        const currentLoc = typeof GameWorld !== 'undefined' ? GameWorld.locations[game.currentLocation?.id] : null;
        if (currentLoc && currentLoc.connections) {
            if (!currentLoc.connections.includes(location.id)) {
                addMessage(`❌ This location is not directly connected to your current location`);
                return;
            }
        }

        // Initiate travel (which will reveal the location)
        if (typeof TravelSystem !== 'undefined' && TravelSystem.travelTo) {
            TravelSystem.travelTo(location.id);
        } else if (typeof travelTo === 'function') {
            travelTo(location.id);
        } else {
            addMessage(`🗺️ Traveling to ${isDiscovered ? 'unknown location' : location.name}...`);
            // Fallback: direct location change
            if (game && game.setCurrentLocation) {
                game.setCurrentLocation(location);
            }
        }

        this.render(); // Re-render to update current location highlight and exploration
    },

    // 🔧 Utility functions
    isCurrentLocation(location) {
        return game && game.currentLocation && game.currentLocation.id === location.id;
    },

    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    },

    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    },

    // 🖼️ Fullscreen toggle
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen().catch(err => {
                console.warn('Fullscreen failed:', err);
            });
        } else {
            document.exitFullscreen();
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 📜 LOCATION HISTORY SYSTEM
    // ═══════════════════════════════════════════════════════════════

    // Load history from localStorage
    loadLocationHistory() {
        try {
            const saved = localStorage.getItem(this.HISTORY_STORAGE_KEY);
            if (saved) {
                this.locationHistory = JSON.parse(saved);
                console.log('📜 Loaded location history:', this.locationHistory.length, 'entries');
            }
        } catch (e) {
            console.warn('📜 Could not load location history:', e);
            this.locationHistory = [];
        }
    },

    // Save history to localStorage
    saveLocationHistory() {
        try {
            // Keep only last 100 entries to prevent storage bloat
            if (this.locationHistory.length > 100) {
                this.locationHistory = this.locationHistory.slice(-100);
            }
            localStorage.setItem(this.HISTORY_STORAGE_KEY, JSON.stringify(this.locationHistory));
        } catch (e) {
            console.warn('📜 Could not save location history:', e);
        }
    },

    // Record a location visit
    recordLocationVisit(locationId, details = {}) {
        const locations = typeof GameWorld !== 'undefined' ? GameWorld.locations : {};
        const location = locations[locationId];
        if (!location) return;

        const style = this.locationStyles[location.type] || this.locationStyles.town;

        const entry = {
            id: locationId,
            name: location.name,
            type: location.type,
            icon: style.icon,
            region: location.region || 'Unknown',
            timestamp: Date.now(),
            gameTime: typeof TimeSystem !== 'undefined' ? TimeSystem.getFormattedTime() : 'Unknown',
            gameDay: typeof TimeSystem !== 'undefined' ? TimeSystem.currentTime.day : 1,
            goldOnArrival: typeof game !== 'undefined' ? game.player?.gold || 0 : 0,
            goldOnDeparture: null,
            profitLoss: null,
            events: details.events || [],
            trades: details.trades || [],
            isFirstVisit: details.isFirstVisit || false
        };

        this.locationHistory.push(entry);
        this.saveLocationHistory();
        console.log('📜 Recorded visit to:', location.name);

        return entry;
    },

    // Update the last visit entry when leaving a location
    recordLocationDeparture() {
        if (this.locationHistory.length === 0) return;

        const lastEntry = this.locationHistory[this.locationHistory.length - 1];
        const currentGold = typeof game !== 'undefined' ? game.player?.gold || 0 : 0;

        lastEntry.goldOnDeparture = currentGold;
        lastEntry.profitLoss = currentGold - lastEntry.goldOnArrival;

        this.saveLocationHistory();
        console.log('📜 Recorded departure, profit/loss:', lastEntry.profitLoss);
    },

    // Add an event to the current location visit
    addEventToCurrentVisit(eventDescription) {
        if (this.locationHistory.length === 0) return;

        const lastEntry = this.locationHistory[this.locationHistory.length - 1];
        lastEntry.events.push({
            time: typeof TimeSystem !== 'undefined' ? TimeSystem.getFormattedTime() : 'Unknown',
            description: eventDescription
        });

        this.saveLocationHistory();
    },

    // Set current destination
    setDestination(locationId) {
        const locations = typeof GameWorld !== 'undefined' ? GameWorld.locations : {};
        const location = locations[locationId];

        if (location) {
            const style = this.locationStyles[location.type] || this.locationStyles.town;
            this.currentDestination = {
                id: locationId,
                name: location.name,
                type: location.type,
                icon: style.icon
            };
        } else {
            this.currentDestination = null;
        }

        this.updateHistoryPanel();
    },

    // Clear destination
    clearDestination() {
        this.currentDestination = null;
        this.updateHistoryPanel();
    },

    // Get visit history for a specific location
    getLocationVisits(locationId) {
        return this.locationHistory.filter(entry => entry.id === locationId);
    },

    // Get total profit/loss for a location
    getLocationTotalProfit(locationId) {
        const visits = this.getLocationVisits(locationId);
        return visits.reduce((total, visit) => total + (visit.profitLoss || 0), 0);
    },

    // Render the history panel
    updateHistoryPanel() {
        const historyContainer = document.getElementById('travel-history');
        if (!historyContainer) return;

        const locations = typeof GameWorld !== 'undefined' ? GameWorld.locations : {};
        const currentLocId = typeof game !== 'undefined' && game.currentLocation ? game.currentLocation.id : null;
        const currentLoc = currentLocId ? locations[currentLocId] : null;
        const currentStyle = currentLoc ? (this.locationStyles[currentLoc.type] || this.locationStyles.town) : null;

        let html = '';

        // Current Location Section
        html += `<div class="history-section current-location-section">
            <h3>📍 Current Location</h3>
            <div class="current-location-card">`;

        if (currentLoc) {
            html += `
                <div class="location-header">
                    <span class="location-icon">${currentStyle.icon}</span>
                    <span class="location-name">${currentLoc.name}</span>
                </div>
                <div class="location-details">
                    <span class="location-type">${currentLoc.type}</span>
                    <span class="location-region">${currentLoc.region || 'Unknown Region'}</span>
                </div>`;
        } else {
            html += `<div class="no-location">Unknown</div>`;
        }

        html += `</div></div>`;

        // Destination Section
        html += `<div class="history-section destination-section">
            <h3>🎯 Destination</h3>
            <div class="destination-card">`;

        if (this.currentDestination) {
            html += `
                <div class="location-header">
                    <span class="location-icon">${this.currentDestination.icon}</span>
                    <span class="location-name">${this.currentDestination.name}</span>
                </div>
                <div class="traveling-indicator">🚶 Traveling...</div>`;
        } else {
            html += `<div class="no-destination">No destination set</div>`;
        }

        html += `</div></div>`;

        // Visit History Section
        html += `<div class="history-section visit-history-section">
            <h3>📜 Travel Journal (${this.locationHistory.length} entries)</h3>
            <div class="history-list">`;

        if (this.locationHistory.length === 0) {
            html += `<div class="no-history">No travel history yet. Start exploring!</div>`;
        } else {
            // Show most recent first
            const recentHistory = [...this.locationHistory].reverse().slice(0, 50);

            recentHistory.forEach((entry, index) => {
                const profitClass = entry.profitLoss > 0 ? 'profit' : (entry.profitLoss < 0 ? 'loss' : 'neutral');
                const profitText = entry.profitLoss !== null
                    ? (entry.profitLoss >= 0 ? `+${entry.profitLoss}` : `${entry.profitLoss}`)
                    : '---';

                html += `
                <div class="history-entry ${entry.isFirstVisit ? 'first-visit' : ''}">
                    <div class="entry-header">
                        <span class="entry-icon">${entry.icon}</span>
                        <span class="entry-name">${entry.name}</span>
                        ${entry.isFirstVisit ? '<span class="first-visit-badge">NEW!</span>' : ''}
                    </div>
                    <div class="entry-details">
                        <span class="entry-time">Day ${entry.gameDay} - ${entry.gameTime}</span>
                        <span class="entry-profit ${profitClass}">${profitText} gold</span>
                    </div>`;

                // Show events if any
                if (entry.events && entry.events.length > 0) {
                    html += `<div class="entry-events">`;
                    entry.events.slice(0, 3).forEach(evt => {
                        html += `<div class="event-item">⚡ ${evt.description}</div>`;
                    });
                    if (entry.events.length > 3) {
                        html += `<div class="event-more">+${entry.events.length - 3} more events</div>`;
                    }
                    html += `</div>`;
                }

                html += `</div>`;
            });
        }

        html += `</div></div>`;

        historyContainer.innerHTML = html;

        // Add styles if not already present
        this.addHistoryStyles();
    },

    // Add CSS styles for the history panel
    addHistoryStyles() {
        if (document.getElementById('location-history-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'location-history-styles';
        styles.textContent = `
            .history-section {
                margin-bottom: 15px;
                padding: 10px;
                background: rgba(30, 30, 50, 0.8);
                border-radius: 8px;
                border: 1px solid rgba(79, 195, 247, 0.2);
            }

            .history-section h3 {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #4fc3f7;
                border-bottom: 1px solid rgba(79, 195, 247, 0.3);
                padding-bottom: 5px;
            }

            .current-location-card, .destination-card {
                background: rgba(40, 40, 70, 0.6);
                padding: 10px;
                border-radius: 6px;
            }

            .location-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 5px;
            }

            .location-icon {
                font-size: 24px;
            }

            .location-name {
                font-size: 16px;
                font-weight: bold;
                color: #fff;
            }

            .location-details {
                display: flex;
                gap: 10px;
                font-size: 12px;
                color: #888;
            }

            .location-type {
                text-transform: capitalize;
            }

            .no-location, .no-destination, .no-history {
                color: #666;
                font-style: italic;
                text-align: center;
                padding: 10px;
            }

            .traveling-indicator {
                color: #ff9800;
                font-size: 12px;
                margin-top: 5px;
                animation: pulse 1.5s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .history-list {
                max-height: 400px;
                overflow-y: auto;
                padding-right: 5px;
            }

            .history-entry {
                background: rgba(40, 40, 70, 0.6);
                padding: 8px 10px;
                border-radius: 6px;
                margin-bottom: 8px;
                border-left: 3px solid #4fc3f7;
            }

            .history-entry.first-visit {
                border-left-color: #ff9800;
            }

            .entry-header {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 4px;
            }

            .entry-icon {
                font-size: 18px;
            }

            .entry-name {
                font-weight: bold;
                color: #fff;
                font-size: 13px;
            }

            .first-visit-badge {
                background: #ff9800;
                color: #000;
                font-size: 9px;
                padding: 2px 5px;
                border-radius: 3px;
                font-weight: bold;
            }

            .entry-details {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                color: #888;
            }

            .entry-profit {
                font-weight: bold;
            }

            .entry-profit.profit {
                color: #4caf50;
            }

            .entry-profit.loss {
                color: #f44336;
            }

            .entry-profit.neutral {
                color: #888;
            }

            .entry-events {
                margin-top: 5px;
                padding-top: 5px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .event-item {
                font-size: 11px;
                color: #aaa;
                padding: 2px 0;
            }

            .event-more {
                font-size: 10px;
                color: #666;
                font-style: italic;
            }

            /* Scrollbar styling */
            .history-list::-webkit-scrollbar {
                width: 6px;
            }

            .history-list::-webkit-scrollbar-track {
                background: rgba(30, 30, 50, 0.5);
                border-radius: 3px;
            }

            .history-list::-webkit-scrollbar-thumb {
                background: rgba(79, 195, 247, 0.5);
                border-radius: 3px;
            }

            .history-list::-webkit-scrollbar-thumb:hover {
                background: rgba(79, 195, 247, 0.7);
            }
        `;

        document.head.appendChild(styles);
    },

    // Clear all history
    clearHistory() {
        this.locationHistory = [];
        this.saveLocationHistory();
        this.updateHistoryPanel();
        console.log('📜 Location history cleared');
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => GameWorldRenderer.init(), 500);
    });
} else {
    setTimeout(() => GameWorldRenderer.init(), 500);
}

console.log('🗺️ GameWorldRenderer v2 loaded');
