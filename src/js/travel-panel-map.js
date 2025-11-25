// ═══════════════════════════════════════════════════════════════
// 🗺️ TRAVEL PANEL MAP - Interactive mini-map for the travel panel
// ═══════════════════════════════════════════════════════════════
// Mirrors GameWorldRenderer functionality for the travel panel
// Supports clicking to set destinations and viewing the world map

const TravelPanelMap = {
    // 📦 DOM elements
    container: null,
    mapElement: null,
    tooltipElement: null,

    // 📍 Map state (similar to GameWorldRenderer but scaled for mini view)
    mapState: {
        zoom: 0.6,           // Start more zoomed out for overview
        offsetX: 0,
        offsetY: 0,
        minZoom: 0.3,        // Allow more zoom out for overview
        maxZoom: 2,          // Less max zoom than main map
        defaultZoom: 0.6,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        lastOffsetX: 0,
        lastOffsetY: 0
    },

    // 🎯 Current destination
    currentDestination: null,

    // 🎨 Location styles (shared with GameWorldRenderer)
    locationStyles: {
        capital: { color: '#FFD700', icon: '👑', size: 36 },
        city: { color: '#FF6B6B', icon: '🏰', size: 32 },
        town: { color: '#4ECDC4', icon: '🏘️', size: 28 },
        village: { color: '#95E77E', icon: '🏠', size: 24 },
        mine: { color: '#8B4513', icon: '⛏️', size: 24 },
        forest: { color: '#228B22', icon: '🌲', size: 26 },
        farm: { color: '#F4A460', icon: '🌾', size: 24 },
        dungeon: { color: '#4B0082', icon: '💀', size: 26 },
        cave: { color: '#696969', icon: '🕳️', size: 22 },
        inn: { color: '#DAA520', icon: '🍺', size: 22 },
        ruins: { color: '#708090', icon: '🏛️', size: 24 },
        port: { color: '#1E90FF', icon: '⚓', size: 28 },
        outpost: { color: '#CD853F', icon: '🛡️', size: 24 }
    },

    // 🚀 Initialize the mini-map
    init() {
        console.log('🗺️ TravelPanelMap: Initializing...');

        this.container = document.getElementById('travel-mini-map-container');
        if (!this.container) {
            console.warn('🗺️ Travel mini-map container not found, will retry later');
            return false;
        }

        // Create the map element
        this.createMapElement();

        // Create tooltip
        this.createTooltip();

        // Setup event listeners
        this.setupEventListeners();

        // Setup tab switching
        this.setupTabSwitching();

        // Setup destination tab functionality
        this.setupDestinationTab();

        console.log('🗺️ TravelPanelMap: Ready!');
        return true;
    },

    // 📦 Create the map container element
    createMapElement() {
        this.mapElement = document.getElementById('travel-mini-map');
        if (!this.mapElement) {
            this.mapElement = document.createElement('div');
            this.mapElement.id = 'travel-mini-map';
            this.mapElement.className = 'travel-mini-map';
            this.container.insertBefore(this.mapElement, this.container.firstChild);
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
        this.tooltipElement = document.getElementById('travel-map-tooltip');
        if (!this.tooltipElement) {
            this.tooltipElement = document.createElement('div');
            this.tooltipElement.id = 'travel-map-tooltip';
            this.tooltipElement.className = 'travel-map-tooltip';
            document.body.appendChild(this.tooltipElement);
        }

        this.tooltipElement.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.95);
            color: #fff;
            padding: 12px 16px;
            border-radius: 8px;
            border: 2px solid #4fc3f7;
            font-size: 13px;
            max-width: 280px;
            z-index: 10001;
            pointer-events: none;
            display: none;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
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

        console.log('🗺️ TravelPanelMap: Event listeners attached');
    },

    // 📑 Setup tab switching for travel panel
    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.travel-tab-btn[data-travel-tab]');
        const tabContents = document.querySelectorAll('.travel-tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.dataset.travelTab;
                if (!tabName) return;

                // Update button states
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update content visibility
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });

                const targetTab = document.getElementById(`${tabName}-tab`);
                if (targetTab) {
                    targetTab.classList.add('active');
                }

                // Render map when map tab is shown
                if (tabName === 'map') {
                    setTimeout(() => {
                        this.render();
                        this.centerOnPlayer();
                    }, 50);
                }

                // Update destination tab when shown
                if (tabName === 'destination') {
                    this.updateDestinationDisplay();
                }
            });
        });
    },

    // 🎯 Setup destination tab functionality
    setupDestinationTab() {
        // Travel Now button
        const travelBtn = document.getElementById('travel-to-destination-btn');
        if (travelBtn) {
            travelBtn.addEventListener('click', () => {
                if (this.currentDestination) {
                    this.travelToDestination();
                }
            });
        }

        // Fast Travel button
        const fastTravelBtn = document.getElementById('fast-travel-destination-btn');
        if (fastTravelBtn) {
            fastTravelBtn.addEventListener('click', () => {
                if (this.currentDestination) {
                    this.fastTravelToDestination();
                }
            });
        }

        // Clear button
        const clearBtn = document.getElementById('clear-destination-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearDestination();
            });
        }
    },

    // 🎨 Render the map
    render() {
        if (!this.mapElement || typeof GameWorld === 'undefined') {
            console.warn('🗺️ TravelPanelMap: Cannot render - map element or GameWorld not ready');
            return;
        }

        // Clear existing locations
        this.mapElement.innerHTML = '';

        // Calculate which locations are visible/explored (use GameWorldRenderer's logic if available)
        const visibilityMap = this.calculateLocationVisibility();

        // Draw connection lines first
        this.drawConnections(visibilityMap);

        // Calculate label offsets
        const locations = GameWorld.locations || {};
        const visibleLocations = {};
        Object.entries(locations).forEach(([id, loc]) => {
            if (visibilityMap[id] && visibilityMap[id] !== 'hidden') {
                visibleLocations[id] = loc;
            }
        });
        const labelOffsets = this.calculateLabelOffsets(visibleLocations);

        // Draw each location
        Object.values(locations).forEach(location => {
            const visibility = visibilityMap[location.id] || 'hidden';
            if (visibility !== 'hidden') {
                const offset = labelOffsets[location.id] || 0;
                this.createLocationElement(location, offset, visibility);
            }
        });

        // Apply current transform
        this.updateTransform();

        // Mark current location and destination
        this.highlightCurrentLocation();
        this.highlightDestination();
    },

    // 🔍 Calculate visibility for all locations (borrowed from GameWorldRenderer)
    calculateLocationVisibility() {
        // If GameWorldRenderer exists and has this method, use it
        if (typeof GameWorldRenderer !== 'undefined' && GameWorldRenderer.calculateLocationVisibility) {
            return GameWorldRenderer.calculateLocationVisibility();
        }

        // Fallback implementation
        const visibility = {};
        const locations = (typeof GameWorld !== 'undefined' && GameWorld.locations) ? GameWorld.locations : {};

        let visited = [];
        if (typeof GameWorld !== 'undefined' && Array.isArray(GameWorld.visitedLocations)) {
            visited = GameWorld.visitedLocations;
        }

        if (visited.length === 0 && typeof game !== 'undefined' && game.currentLocation && game.currentLocation.id) {
            visited = [game.currentLocation.id];
        }

        // If no visited locations, show all
        if (visited.length === 0) {
            Object.keys(locations).forEach(locId => {
                visibility[locId] = 'visible';
            });
            return visibility;
        }

        // Mark visited as visible
        visited.forEach(locId => {
            visibility[locId] = 'visible';
        });

        // Mark connected locations as discovered
        visited.forEach(locId => {
            const location = locations[locId];
            if (location && location.connections) {
                location.connections.forEach(connectedId => {
                    if (!visibility[connectedId]) {
                        visibility[connectedId] = 'discovered';
                    }
                });
            }
        });

        // All others hidden
        Object.keys(locations).forEach(locId => {
            if (!visibility[locId]) {
                visibility[locId] = 'hidden';
            }
        });

        return visibility;
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

            const locVisibility = visibilityMap[location.id];
            if (locVisibility === 'hidden') return;

            location.connections.forEach(targetId => {
                const target = locations[targetId];
                if (!target || !target.mapPosition) return;

                const targetVisibility = visibilityMap[targetId];
                if (targetVisibility === 'hidden') return;

                const connectionKey = [location.id, targetId].sort().join('-');
                if (drawnConnections.has(connectionKey)) return;
                drawnConnections.add(connectionKey);

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', location.mapPosition.x);
                line.setAttribute('y1', location.mapPosition.y);
                line.setAttribute('x2', target.mapPosition.x);
                line.setAttribute('y2', target.mapPosition.y);

                const bothExplored = visited.includes(location.id) && visited.includes(targetId);
                const oneExplored = visited.includes(location.id) || visited.includes(targetId);

                if (bothExplored) {
                    line.setAttribute('stroke', 'rgba(255, 215, 0, 0.5)');
                    line.setAttribute('stroke-width', '2');
                } else if (oneExplored) {
                    line.setAttribute('stroke', 'rgba(255, 215, 0, 0.25)');
                    line.setAttribute('stroke-width', '1.5');
                    line.setAttribute('stroke-dasharray', '4,4');
                } else {
                    line.setAttribute('stroke', 'rgba(150, 150, 150, 0.3)');
                    line.setAttribute('stroke-width', '1.5');
                    line.setAttribute('stroke-dasharray', '4,4');
                }

                svg.appendChild(line);
            });
        });

        this.mapElement.appendChild(svg);
    },

    // 📍 Create a location element
    createLocationElement(location, labelOffset = 0, visibility = 'visible') {
        if (!location.mapPosition) return;
        if (visibility === 'hidden') return;

        const style = this.locationStyles[location.type] || this.locationStyles.town;
        const isDiscovered = visibility === 'discovered';
        const el = document.createElement('div');
        el.className = 'mini-map-location' + (isDiscovered ? ' discovered' : '');
        el.dataset.locationId = location.id;
        el.dataset.visibility = visibility;

        const bgColor = isDiscovered ? '#555555' : style.color;
        const borderColor = isDiscovered ? '#777777' : this.lightenColor(style.color, 20);
        const opacity = isDiscovered ? '0.6' : '1';

        el.style.cssText = `
            position: absolute;
            left: ${location.mapPosition.x}px;
            top: ${location.mapPosition.y}px;
            transform: translate(-50%, -50%);
            width: ${style.size}px;
            height: ${style.size}px;
            background: radial-gradient(circle, ${bgColor} 0%, ${this.darkenColor(bgColor, 30)} 100%);
            border: 2px solid ${borderColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${style.size * 0.5}px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            z-index: 10;
            opacity: ${opacity};
        `;

        el.innerHTML = isDiscovered ? '❓' : style.icon;

        // Hover effects
        el.addEventListener('mouseenter', (e) => this.onLocationHover(e, location, isDiscovered));
        el.addEventListener('mouseleave', () => this.hideTooltip());
        el.addEventListener('click', (e) => this.onLocationClick(e, location, isDiscovered));

        this.mapElement.appendChild(el);

        // Add location name label
        const label = document.createElement('div');
        label.className = 'mini-map-location-label' + (isDiscovered ? ' discovered' : '');
        label.textContent = isDiscovered ? '???' : location.name;
        const labelColor = isDiscovered ? '#888' : '#fff';
        label.style.cssText = `
            position: absolute;
            left: ${location.mapPosition.x}px;
            top: ${location.mapPosition.y + style.size / 2 + 6 + labelOffset}px;
            transform: translateX(-50%);
            color: ${labelColor};
            font-size: 10px;
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
        locArray.sort((a, b) => a.mapPosition.x - b.mapPosition.x);

        const labelPositions = [];

        locArray.forEach(location => {
            const style = this.locationStyles[location.type] || this.locationStyles.town;
            const baseY = location.mapPosition.y + style.size / 2 + 6;
            const x = location.mapPosition.x;

            let offset = 0;
            let attempts = 0;
            const maxAttempts = 4;

            while (attempts < maxAttempts) {
                const testY = baseY + offset;
                let hasOverlap = false;

                for (const existing of labelPositions) {
                    const xDist = Math.abs(existing.x - x);
                    const yDist = Math.abs(existing.y - testY);

                    if (xDist < 70 && yDist < 12) {
                        hasOverlap = true;
                        break;
                    }
                }

                if (!hasOverlap) break;

                attempts++;
                if (attempts % 2 === 1) {
                    offset = 12 * Math.ceil(attempts / 2);
                } else {
                    offset = -12 * Math.ceil(attempts / 2);
                }
            }

            offsets[location.id] = offset;
            labelPositions.push({ x, y: baseY + offset, id: location.id });
        });

        return offsets;
    },

    // 🎯 Highlight current player location
    highlightCurrentLocation() {
        if (!game || !game.currentLocation) return;

        const currentEl = this.mapElement.querySelector(`[data-location-id="${game.currentLocation.id}"]`);
        if (currentEl) {
            currentEl.style.boxShadow = '0 0 15px 4px rgba(79, 195, 247, 0.8)';
            currentEl.style.border = '2px solid #4fc3f7';
        }

        // Create player marker
        this.updatePlayerMarker();
    },

    // 📍 Player marker
    playerMarker: null,

    updatePlayerMarker() {
        const locationId = game?.currentLocation?.id;
        if (!locationId) return;

        const location = typeof GameWorld !== 'undefined' ? GameWorld.locations[locationId] : null;
        if (!location || !location.mapPosition) return;

        if (!this.playerMarker) {
            this.playerMarker = document.createElement('div');
            this.playerMarker.id = 'travel-player-marker';
            this.playerMarker.innerHTML = `
                <div class="marker-pin">📍</div>
                <div class="marker-pulse"></div>
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

            const pin = this.playerMarker.querySelector('.marker-pin');
            pin.style.cssText = `
                font-size: 28px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
                animation: marker-bounce 2s ease-in-out infinite;
                z-index: 102;
            `;

            const pulse = this.playerMarker.querySelector('.marker-pulse');
            pulse.style.cssText = `
                position: absolute;
                bottom: 4px;
                width: 16px;
                height: 16px;
                background: rgba(255, 0, 0, 0.4);
                border-radius: 50%;
                animation: marker-pulse 2s ease-out infinite;
                z-index: 99;
            `;

            this.mapElement.appendChild(this.playerMarker);
        }

        this.playerMarker.style.left = location.mapPosition.x + 'px';
        this.playerMarker.style.top = location.mapPosition.y + 'px';
    },

    // 🎯 Destination marker
    destinationMarker: null,

    highlightDestination() {
        if (!this.currentDestination) {
            if (this.destinationMarker) {
                this.destinationMarker.style.display = 'none';
            }
            return;
        }

        const location = typeof GameWorld !== 'undefined' ? GameWorld.locations[this.currentDestination.id] : null;
        if (!location || !location.mapPosition) return;

        // Highlight the destination element
        const destEl = this.mapElement.querySelector(`[data-location-id="${this.currentDestination.id}"]`);
        if (destEl) {
            destEl.style.boxShadow = '0 0 15px 4px rgba(255, 152, 0, 0.8)';
            destEl.style.border = '2px solid #ff9800';
        }

        // Create/update destination marker
        if (!this.destinationMarker) {
            this.destinationMarker = document.createElement('div');
            this.destinationMarker.id = 'travel-destination-marker';
            this.destinationMarker.innerHTML = '🎯';
            this.destinationMarker.style.cssText = `
                position: absolute;
                z-index: 99;
                pointer-events: none;
                transform: translate(-50%, -150%);
                font-size: 24px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
                animation: dest-pulse 1.5s ease-in-out infinite;
            `;
            this.mapElement.appendChild(this.destinationMarker);
        }

        this.destinationMarker.style.display = 'block';
        this.destinationMarker.style.left = location.mapPosition.x + 'px';
        this.destinationMarker.style.top = location.mapPosition.y + 'px';
    },

    // 🔄 Update map transform
    updateTransform() {
        if (!this.mapElement) return;
        this.constrainToBounds();
        const transform = `translate(${this.mapState.offsetX}px, ${this.mapState.offsetY}px) scale(${this.mapState.zoom})`;
        this.mapElement.style.transform = transform;
    },

    // 🚧 Constrain map position
    constrainToBounds() {
        if (!this.container) return;

        const containerRect = this.container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        const mapWidth = 800 * this.mapState.zoom;
        const mapHeight = 600 * this.mapState.zoom;

        if (mapWidth <= containerWidth) {
            this.mapState.offsetX = (containerWidth - mapWidth) / 2;
        } else {
            const minX = containerWidth - mapWidth;
            const maxX = 0;
            this.mapState.offsetX = Math.max(minX, Math.min(maxX, this.mapState.offsetX));
        }

        if (mapHeight <= containerHeight) {
            this.mapState.offsetY = (containerHeight - mapHeight) / 2;
        } else {
            const minY = containerHeight - mapHeight;
            const maxY = 0;
            this.mapState.offsetY = Math.max(minY, Math.min(maxY, this.mapState.offsetY));
        }
    },

    // 🖱️ Mouse event handlers
    onMouseDown(e) {
        if (e.target.classList.contains('mini-map-location')) return;

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

        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        const newZoom = Math.max(this.mapState.minZoom, Math.min(this.mapState.maxZoom, this.mapState.zoom + delta));

        this.mapState.zoom = newZoom;
        this.updateTransform();
    },

    zoomIn() {
        this.mapState.zoom = Math.min(this.mapState.maxZoom, this.mapState.zoom + 0.15);
        this.updateTransform();
    },

    zoomOut() {
        this.mapState.zoom = Math.max(this.mapState.minZoom, this.mapState.zoom - 0.15);
        this.updateTransform();
    },

    resetView() {
        this.mapState.zoom = this.mapState.defaultZoom;
        this.centerOnPlayer();
    },

    // 📍 Center on player location
    centerOnPlayer() {
        if (!this.container) return;

        let pos = null;

        if (typeof game !== 'undefined' && game.currentLocation && game.currentLocation.id && typeof GameWorld !== 'undefined') {
            const location = GameWorld.locations[game.currentLocation.id];
            if (location && location.mapPosition) {
                pos = location.mapPosition;
            }
        }

        if (!pos) {
            pos = { x: 400, y: 300 };
        }

        const containerRect = this.container.getBoundingClientRect();

        this.mapState.offsetX = (containerRect.width / 2) - (pos.x * this.mapState.zoom);
        this.mapState.offsetY = (containerRect.height / 2) - (pos.y * this.mapState.zoom);

        this.updateTransform();
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
        const isCurrentLocation = game && game.currentLocation && game.currentLocation.id === location.id;
        const isDestination = this.currentDestination && this.currentDestination.id === location.id;

        if (isDiscovered) {
            this.tooltipElement.innerHTML = `
                <div style="font-size: 15px; font-weight: bold; margin-bottom: 5px; color: #888;">
                    ❓ Unknown Location
                </div>
                <div style="color: #666; font-size: 11px; margin-bottom: 5px;">
                    Unexplored territory
                </div>
                <div style="color: #ff9800; margin-top: 5px; font-size: 12px;">🎯 Click to set as destination</div>
            `;
        } else {
            let statusLine = '';
            if (isCurrentLocation) {
                statusLine = '<div style="color: #4fc3f7; margin-top: 5px;">📍 You are here</div>';
            } else if (isDestination) {
                statusLine = '<div style="color: #ff9800; margin-top: 5px;">🎯 Current destination</div>';
            } else {
                statusLine = '<div style="color: #ff9800; margin-top: 5px;">🎯 Click to set as destination</div>';
            }

            this.tooltipElement.innerHTML = `
                <div style="font-size: 15px; font-weight: bold; margin-bottom: 5px;">
                    ${style.icon} ${location.name}
                </div>
                <div style="color: #aaa; font-size: 11px; margin-bottom: 5px;">
                    ${location.type.charAt(0).toUpperCase() + location.type.slice(1)} • ${location.region || 'Unknown'}
                </div>
                <div style="font-size: 11px; line-height: 1.4; color: #ccc;">
                    ${location.description || 'No description available.'}
                </div>
                ${statusLine}
            `;
        }

        this.tooltipElement.style.display = 'block';
        this.tooltipElement.style.left = (e.clientX + 15) + 'px';
        this.tooltipElement.style.top = (e.clientY + 15) + 'px';
    },

    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.style.display = 'none';
        }
    },

    // 🖱️ Location click handler - sets destination instead of traveling
    onLocationClick(e, location, isDiscovered = false) {
        e.stopPropagation();

        const isCurrentLocation = game && game.currentLocation && game.currentLocation.id === location.id;

        if (isCurrentLocation) {
            if (typeof addMessage === 'function') {
                addMessage(`📍 You are already at ${location.name}`);
            }
            return;
        }

        // Set as destination
        this.setDestination(location.id);

        // Show confirmation
        if (typeof addMessage === 'function') {
            addMessage(`🎯 Destination set: ${isDiscovered ? 'Unknown Location' : location.name}`);
        }
    },

    // 🎯 Set a destination
    setDestination(locationId) {
        const locations = typeof GameWorld !== 'undefined' ? GameWorld.locations : {};
        const location = locations[locationId];

        if (location) {
            const style = this.locationStyles[location.type] || this.locationStyles.town;
            this.currentDestination = {
                id: locationId,
                name: location.name,
                type: location.type,
                icon: style.icon,
                region: location.region || 'Unknown',
                description: location.description || ''
            };

            // Also update GameWorldRenderer's destination if it exists
            if (typeof GameWorldRenderer !== 'undefined' && GameWorldRenderer.setDestination) {
                GameWorldRenderer.setDestination(locationId);
            }
        } else {
            this.currentDestination = null;
        }

        // Update displays
        this.updateDestinationDisplay();
        this.render();
    },

    // ❌ Clear the destination
    clearDestination() {
        this.currentDestination = null;

        if (typeof GameWorldRenderer !== 'undefined' && GameWorldRenderer.clearDestination) {
            GameWorldRenderer.clearDestination();
        }

        this.updateDestinationDisplay();
        this.render();

        if (typeof addMessage === 'function') {
            addMessage('🎯 Destination cleared');
        }
    },

    // 🎯 Update the destination tab display
    updateDestinationDisplay() {
        const displayEl = document.getElementById('current-destination-display');
        const actionsEl = document.getElementById('destination-actions');

        if (!displayEl) return;

        if (!this.currentDestination) {
            displayEl.innerHTML = `
                <div class="no-destination">
                    <span class="no-dest-icon">🎯</span>
                    <h3>No Destination Set</h3>
                    <p>Click on a location in the Locations tab or Map to set a destination.</p>
                </div>
            `;
            if (actionsEl) actionsEl.classList.add('hidden');
        } else {
            const dest = this.currentDestination;

            // Calculate distance and travel time if possible
            let distanceInfo = '';
            if (typeof game !== 'undefined' && game.currentLocation && typeof GameWorld !== 'undefined') {
                const fromLoc = GameWorld.locations[game.currentLocation.id];
                const toLoc = GameWorld.locations[dest.id];

                if (fromLoc && toLoc && fromLoc.mapPosition && toLoc.mapPosition) {
                    const dx = toLoc.mapPosition.x - fromLoc.mapPosition.x;
                    const dy = toLoc.mapPosition.y - fromLoc.mapPosition.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const estimatedTime = Math.ceil(distance / 10); // Rough estimate

                    distanceInfo = `
                        <div class="dest-travel-info">
                            <span>📏 Distance: ~${Math.round(distance)} units</span>
                            <span>⏱️ Est. Time: ~${estimatedTime} minutes</span>
                        </div>
                    `;
                }
            }

            displayEl.innerHTML = `
                <div class="destination-info">
                    <div class="dest-header">
                        <span class="dest-icon">${dest.icon}</span>
                        <div class="dest-name-type">
                            <h3>${dest.name}</h3>
                            <span class="dest-type">${dest.type.charAt(0).toUpperCase() + dest.type.slice(1)} • ${dest.region}</span>
                        </div>
                    </div>
                    <div class="dest-description">
                        ${dest.description || 'No description available.'}
                    </div>
                    ${distanceInfo}
                </div>
            `;
            if (actionsEl) actionsEl.classList.remove('hidden');
        }
    },

    // 🚶 Travel to destination
    travelToDestination() {
        if (!this.currentDestination) return;

        if (typeof TravelSystem !== 'undefined' && TravelSystem.travelTo) {
            TravelSystem.travelTo(this.currentDestination.id);
        } else if (typeof travelTo === 'function') {
            travelTo(this.currentDestination.id);
        }

        // Clear destination after traveling
        this.clearDestination();
    },

    // ⚡ Fast travel to destination
    fastTravelToDestination() {
        if (!this.currentDestination) return;

        if (typeof TravelSystem !== 'undefined' && TravelSystem.fastTravel) {
            TravelSystem.fastTravel(this.currentDestination.id);
        } else if (typeof fastTravelTo === 'function') {
            fastTravelTo(this.currentDestination.id);
        } else {
            // Fallback to normal travel
            this.travelToDestination();
        }
    },

    // 🔧 Utility functions
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
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => TravelPanelMap.init(), 600);
    });
} else {
    setTimeout(() => TravelPanelMap.init(), 600);
}

// Add CSS animations if not already present
(function() {
    if (document.getElementById('travel-panel-map-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'travel-panel-map-styles';
    styles.textContent = `
        /* Travel Mini-Map Container */
        .travel-mini-map-container {
            position: relative;
            width: 100%;
            height: 350px;
            overflow: hidden;
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
            border-radius: 8px;
            border: 2px solid rgba(79, 195, 247, 0.3);
        }

        .travel-mini-map {
            position: absolute;
            top: 0;
            left: 0;
            cursor: grab;
        }

        .travel-mini-map:active {
            cursor: grabbing;
        }

        /* Mini-map Controls */
        .mini-map-controls {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            z-index: 100;
        }

        .mini-map-controls button {
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 6px;
            background: rgba(30, 30, 50, 0.9);
            color: #4fc3f7;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid rgba(79, 195, 247, 0.3);
        }

        .mini-map-controls button:hover {
            background: rgba(79, 195, 247, 0.3);
            transform: scale(1.1);
        }

        /* Map Legend */
        .travel-map-legend {
            margin-top: 10px;
            padding: 12px;
            background: rgba(30, 30, 50, 0.8);
            border-radius: 8px;
            border: 1px solid rgba(79, 195, 247, 0.2);
        }

        .travel-map-legend h4 {
            margin: 0 0 10px 0;
            color: #4fc3f7;
            font-size: 13px;
        }

        .legend-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px 12px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: #ccc;
        }

        .legend-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .legend-info {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid rgba(79, 195, 247, 0.2);
            font-size: 10px;
            color: #888;
        }

        .legend-info p {
            margin: 3px 0;
        }

        /* Destination Tab Styles */
        .destination-display {
            min-height: 150px;
        }

        .no-destination {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px 20px;
            text-align: center;
            color: #888;
        }

        .no-dest-icon {
            font-size: 48px;
            margin-bottom: 15px;
            opacity: 0.5;
        }

        .no-destination h3 {
            margin: 0 0 10px 0;
            color: #aaa;
        }

        .no-destination p {
            margin: 0;
            font-size: 12px;
        }

        .destination-info {
            padding: 15px;
            background: rgba(40, 40, 70, 0.6);
            border-radius: 8px;
            border-left: 4px solid #ff9800;
        }

        .dest-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }

        .dest-icon {
            font-size: 36px;
        }

        .dest-name-type h3 {
            margin: 0 0 4px 0;
            color: #fff;
            font-size: 18px;
        }

        .dest-type {
            font-size: 12px;
            color: #888;
            text-transform: capitalize;
        }

        .dest-description {
            font-size: 12px;
            color: #ccc;
            line-height: 1.5;
            margin-bottom: 12px;
        }

        .dest-travel-info {
            display: flex;
            gap: 20px;
            font-size: 11px;
            color: #4fc3f7;
        }

        .destination-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding: 10px;
            background: rgba(30, 30, 50, 0.6);
            border-radius: 8px;
        }

        .destination-actions.hidden {
            display: none;
        }

        .travel-btn-primary,
        .travel-btn-secondary,
        .travel-btn-danger {
            flex: 1;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .travel-btn-primary {
            background: linear-gradient(180deg, #4caf50 0%, #388e3c 100%);
            color: #fff;
        }

        .travel-btn-primary:hover {
            background: linear-gradient(180deg, #66bb6a 0%, #4caf50 100%);
            transform: translateY(-2px);
        }

        .travel-btn-secondary {
            background: linear-gradient(180deg, #ff9800 0%, #f57c00 100%);
            color: #fff;
        }

        .travel-btn-secondary:hover {
            background: linear-gradient(180deg, #ffb74d 0%, #ff9800 100%);
            transform: translateY(-2px);
        }

        .travel-btn-danger {
            background: linear-gradient(180deg, #f44336 0%, #d32f2f 100%);
            color: #fff;
            flex: 0.3;
        }

        .travel-btn-danger:hover {
            background: linear-gradient(180deg, #ef5350 0%, #f44336 100%);
            transform: translateY(-2px);
        }

        /* Travel Tab Styles */
        .travel-tab-content {
            display: none;
            padding: 10px 0;
        }

        .travel-tab-content.active {
            display: block;
        }

        .travel-tabs {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }

        .travel-tab-btn {
            padding: 8px 12px;
            background: rgba(40, 40, 70, 0.6);
            border: 1px solid rgba(79, 195, 247, 0.2);
            border-radius: 6px;
            color: #888;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .travel-tab-btn:hover {
            background: rgba(79, 195, 247, 0.2);
            color: #4fc3f7;
        }

        .travel-tab-btn.active {
            background: rgba(79, 195, 247, 0.3);
            color: #4fc3f7;
            border-color: #4fc3f7;
        }

        /* Destination marker animation */
        @keyframes dest-pulse {
            0%, 100% { transform: translate(-50%, -150%) scale(1); }
            50% { transform: translate(-50%, -150%) scale(1.2); }
        }

        /* Marker animations (if not already defined) */
        @keyframes marker-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }

        @keyframes marker-pulse {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
        }
    `;

    document.head.appendChild(styles);
})();

console.log('🗺️ TravelPanelMap loaded');
