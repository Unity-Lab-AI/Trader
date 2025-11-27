// ═══════════════════════════════════════════════════════════════
// 🎬 ANIMATION SYSTEM - making pixels dance
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// character movement, item effects, UI transitions
// bringing life to this digital realm of commerce

const AnimationSystem = {
    // Animation settings
    settings: {
        animationsEnabled: true,
        animationSpeed: 1.0,
        reducedMotion: false,
        quality: 'medium' // 'low', 'medium', 'high'
    },
    
    // Active animations tracking
    activeAnimations: [],
    animationId: 0,
    
    // Animation frame request
    animationFrame: null,
    
    // Character animation states
    characterAnimations: {
        idle: { frames: 4, duration: 1000, loop: true },
        walk: { frames: 8, duration: 800, loop: true },
        run: { frames: 6, duration: 600, loop: true },
        jump: { frames: 6, duration: 800, loop: false },
        attack: { frames: 6, duration: 600, loop: false },
        use: { frames: 4, duration: 400, loop: false },
        hurt: { frames: 3, duration: 300, loop: false },
        celebrate: { frames: 8, duration: 1200, loop: false }
    },
    
    // Building animation states
    buildingAnimations: {
        idle: { frames: 1, duration: 1000, loop: true },
        active: { frames: 4, duration: 2000, loop: true },
        construction: { frames: 8, duration: 1600, loop: false },
        upgrade: { frames: 6, duration: 1200, loop: false },
        damaged: { frames: 2, duration: 2000, loop: true }
    },
    
    // Initialize animation system
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.startAnimationLoop();
        console.log('Animation system initialized');
    },
    
    // Load settings from localStorage
    loadSettings() {
        const savedSettings = localStorage.getItem('tradingGameAnimationSettings');
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            } catch (error) {
                console.error('Failed to load animation settings:', error);
            }
        }
    },
    
    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('tradingGameAnimationSettings', JSON.stringify(this.settings));
    },
    
    // Setup event listeners for animations
    setupEventListeners() {
        EventManager.addEventListener(document, 'characterMove', (e) => this.animateCharacterMovement(e.detail));
        EventManager.addEventListener(document, 'itemUse', (e) => this.animateItemUsage(e.detail));
        EventManager.addEventListener(document, 'buildingAction', (e) => this.animateBuilding(e.detail));
        EventManager.addEventListener(document, 'travelStart', (e) => this.animateTravelStart(e.detail));
        EventManager.addEventListener(document, 'travelComplete', (e) => this.animateTravelComplete(e.detail));
        EventManager.addEventListener(document, 'marketStallAction', (e) => this.animateMarketStall(e.detail));
        EventManager.addEventListener(document, 'loadingStart', (e) => this.animateLoadingStart(e.detail));
        EventManager.addEventListener(document, 'loadingComplete', (e) => this.animateLoadingComplete(e.detail));
    },
    
    // Start animation loop
    startAnimationLoop() {
        const animate = () => {
            this.updateAnimations();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    },
    
    // Update all active animations
    updateAnimations() {
        const now = Date.now();
        
        this.activeAnimations = this.activeAnimations.filter(animation => {
            const elapsed = now - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            
            // Update animation based on type
            switch (animation.type) {
                case 'character':
                    this.updateCharacterAnimation(animation, progress);
                    break;
                case 'building':
                    this.updateBuildingAnimation(animation, progress);
                    break;
                case 'ui':
                    this.updateUIAnimation(animation, progress);
                    break;
                case 'travel':
                    this.updateTravelAnimation(animation, progress);
                    break;
                case 'particle':
                    this.updateParticleAnimation(animation, progress);
                    break;
            }
            
            // Check if animation is complete
            if (progress >= 1 && !animation.loop) {
                if (animation.onComplete) {
                    animation.onComplete();
                }
                return false;
            }
            
            // Handle looping animations
            if (progress >= 1 && animation.loop) {
                animation.startTime = now;
            }
            
            return true;
        });
    },
    
    // Create animation object
    createAnimation(type, element, options = {}) {
        if (!this.settings.animationsEnabled) {
            return null;
        }
        
        const animation = {
            id: this.animationId++,
            type: type,
            element: element,
            startTime: Date.now(),
            duration: options.duration || 1000,
            loop: options.loop || false,
            onComplete: options.onComplete || null,
            ...options
        };
        
        this.activeAnimations.push(animation);
        return animation;
    },
    
    // Character movement animations
    animateCharacterMovement(data) {
        const { character, fromX, fromY, toX, toY, speed = 'walk' } = data;
        const characterElement = document.getElementById(character);
        
        if (!characterElement) return;
        
        const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const baseDuration = this.characterAnimations[speed].duration;
        const duration = (distance / 100) * baseDuration;
        
        this.createAnimation('character', characterElement, {
            fromX: fromX,
            fromY: fromY,
            toX: toX,
            toY: toY,
            duration: duration / this.settings.animationSpeed,
            animationType: 'move',
            speed: speed
        });
    },
    
    updateCharacterAnimation(animation, progress) {
        const { element, fromX, fromY, toX, toY, animationType, speed } = animation;
        
        switch (animationType) {
            case 'move':
                // Smooth movement
                const easeProgress = this.easeInOutQuad(progress);
                const currentX = fromX + (toX - fromX) * easeProgress;
                const currentY = fromY + (toY - fromY) * easeProgress;
                
                element.style.transform = `translate(${currentX}px, ${currentY}px)`;
                
                // Update sprite based on movement
                this.updateCharacterSprite(element, speed, progress);
                break;
                
            case 'action':
                // Action-specific animation
                this.updateCharacterActionAnimation(element, progress, speed);
                break;
        }
    },
    
    updateCharacterSprite(element, action, progress) {
        const animationData = this.characterAnimations[action];
        if (!animationData) return;
        
        const frameIndex = Math.floor(progress * animationData.frames) % animationData.frames;
        element.style.backgroundPosition = `-${frameIndex * 64}px 0`;
    },
    
    updateCharacterActionAnimation(element, progress, action) {
        const animationData = this.characterAnimations[action];
        if (!animationData) return;
        
        const frameIndex = Math.floor(progress * animationData.frames);
        const scale = action === 'attack' ? 1.2 - (progress * 0.2) : 1;
        const rotation = action === 'hurt' ? Math.sin(progress * Math.PI) * 10 : 0;
        
        element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        element.style.backgroundPosition = `-${frameIndex * 64}px 0`;
    },
    
    // Item usage animations
    animateItemUsage(data) {
        const { item, user, target, type } = data;
        const userElement = document.getElementById(user);
        const targetElement = document.getElementById(target);
        
        if (!userElement) return;
        
        // Animate user action
        this.createAnimation('character', userElement, {
            animationType: 'action',
            speed: 'use',
            duration: 400 / this.settings.animationSpeed
        });
        
        // Create item effect
        if (targetElement) {
            this.createItemEffect(userElement, targetElement, item, type);
        }
    },
    
    createItemEffect(fromElement, toElement, item, type) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        
        const effectElement = document.createElement('div');
        effectElement.className = 'item-effect';
        effectElement.style.cssText = `
            position: fixed;
            left: ${fromRect.left + fromRect.width / 2}px;
            top: ${fromRect.top + fromRect.height / 2}px;
            width: 20px;
            height: 20px;
            background: ${this.getItemColor(item, type)};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 0 10px ${this.getItemColor(item, type)};
        `;
        
        document.body.appendChild(effectElement);
        
        this.createAnimation('particle', effectElement, {
            fromX: fromRect.left + fromRect.width / 2,
            fromY: fromRect.top + fromRect.height / 2,
            toX: toRect.left + toRect.width / 2,
            toY: toRect.top + toRect.height / 2,
            duration: 600 / this.settings.animationSpeed,
            animationType: 'projectile',
            onComplete: () => {
                effectElement.remove();
                this.createImpactEffect(toRect.left + toRect.width / 2, toRect.top + toRect.height / 2, type);
            }
        });
    },
    
    getItemColor(item, type) {
        const colors = {
            weapon: '#FF6B6B',
            armor: '#4ECDC4',
            consumable: '#45B7D1',
            tool: '#96CEB4',
            magic: '#DDA0DD',
            default: '#FFD700'
        };
        return colors[type] || colors.default;
    },
    
    createImpactEffect(x, y, type) {
        const impactElement = document.createElement('div');
        impactElement.className = 'impact-effect';
        impactElement.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 40px;
            height: 40px;
            border: 2px solid ${this.getItemColor(null, type)};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%) scale(0);
        `;
        
        document.body.appendChild(impactElement);
        
        this.createAnimation('ui', impactElement, {
            animationType: 'impact',
            duration: 300 / this.settings.animationSpeed,
            onComplete: () => impactElement.remove()
        });
    },
    
    // Building animations
    animateBuilding(data) {
        const { building, action, level } = data;
        const buildingElement = document.getElementById(building);
        
        if (!buildingElement) return;
        
        const animationData = this.buildingAnimations[action];
        if (!animationData) return;
        
        this.createAnimation('building', buildingElement, {
            animationType: action,
            duration: animationData.duration / this.settings.animationSpeed,
            level: level
        });
    },
    
    updateBuildingAnimation(animation, progress) {
        const { element, animationType, level } = animation;
        
        switch (animationType) {
            case 'construction':
                // Gradual building appearance
                const scale = progress;
                element.style.transform = `scale(${scale})`;
                element.style.opacity = progress;
                break;
                
            case 'upgrade':
                // Pulsing effect during upgrade
                const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.1;
                element.style.transform = `scale(${pulseScale})`;
                element.style.filter = `brightness(${1 + Math.sin(progress * Math.PI * 2) * 0.3})`;
                break;
                
            case 'active':
                // Gentle bobbing when active
                const bobY = Math.sin(progress * Math.PI * 2) * 2;
                element.style.transform = `translateY(${bobY}px)`;
                break;
                
            case 'damaged':
                // Shake effect when damaged
                const shakeX = Math.sin(progress * Math.PI * 8) * 2;
                element.style.transform = `translateX(${shakeX}px)`;
                break;
        }
        
        // Update building sprite if applicable
        this.updateBuildingSprite(element, animationType, progress, level);
    },
    
    updateBuildingSprite(element, action, progress, level) {
        const animationData = this.buildingAnimations[action];
        if (!animationData || animationData.frames <= 1) return;
        
        const frameIndex = Math.floor(progress * animationData.frames) % animationData.frames;
        element.style.backgroundPosition = `-${frameIndex * 128}px -${level * 128}px`;
    },
    
    // Travel animations
    animateTravelStart(data) {
        const { character, destination } = data;
        const characterElement = document.getElementById(character);
        
        if (!characterElement) return;
        
        // Fade out character
        this.createAnimation('travel', characterElement, {
            animationType: 'fadeOut',
            duration: 800 / this.settings.animationSpeed
        });
        
        // Create travel effect
        this.createTravelEffect(characterElement, destination);
    },
    
    animateTravelComplete(data) {
        const { character, destination } = data;
        const characterElement = document.getElementById(character);
        
        if (!characterElement) return;
        
        // Fade in character
        this.createAnimation('travel', characterElement, {
            animationType: 'fadeIn',
            duration: 800 / this.settings.animationSpeed
        });
        
        // Create arrival effect
        this.createArrivalEffect(characterElement, destination);
    },
    
    createTravelEffect(characterElement, destination) {
        const effectElement = document.createElement('div');
        effectElement.className = 'travel-effect';
        effectElement.style.cssText = `
            position: fixed;
            left: ${characterElement.offsetLeft}px;
            top: ${characterElement.offsetTop}px;
            width: ${characterElement.offsetWidth}px;
            height: ${characterElement.offsetHeight}px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%) scale(0);
        `;
        
        characterElement.parentNode.appendChild(effectElement);
        
        this.createAnimation('ui', effectElement, {
            animationType: 'expand',
            duration: 600 / this.settings.animationSpeed,
            onComplete: () => effectElement.remove()
        });
    },
    
    createArrivalEffect(characterElement, destination) {
        const effectElement = document.createElement('div');
        effectElement.className = 'arrival-effect';
        effectElement.style.cssText = `
            position: fixed;
            left: ${characterElement.offsetLeft}px;
            top: ${characterElement.offsetTop}px;
            width: ${characterElement.offsetWidth * 2}px;
            height: ${characterElement.offsetHeight * 2}px;
            background: radial-gradient(circle, rgba(100,200,255,0.6) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%) scale(2);
        `;
        
        characterElement.parentNode.appendChild(effectElement);
        
        this.createAnimation('ui', effectElement, {
            animationType: 'contract',
            duration: 600 / this.settings.animationSpeed,
            onComplete: () => effectElement.remove()
        });
    },
    
    // Market stall animations
    animateMarketStall(data) {
        const { stall, action, item } = data;
        const stallElement = document.getElementById(stall);
        
        if (!stallElement) return;
        
        switch (action) {
            case 'open':
                this.animateStallOpen(stallElement);
                break;
            case 'close':
                this.animateStallClose(stallElement);
                break;
            case 'transaction':
                this.animateStallTransaction(stallElement, item);
                break;
        }
    },
    
    animateStallOpen(stallElement) {
        this.createAnimation('ui', stallElement, {
            animationType: 'stallOpen',
            duration: 400 / this.settings.animationSpeed
        });
    },
    
    animateStallClose(stallElement) {
        this.createAnimation('ui', stallElement, {
            animationType: 'stallClose',
            duration: 400 / this.settings.animationSpeed
        });
    },
    
    animateStallTransaction(stallElement, item) {
        // Create sparkle effect
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                left: ${Math.random() * stallElement.offsetWidth}px;
                top: ${Math.random() * stallElement.offsetHeight}px;
                width: 4px;
                height: 4px;
                background: #FFD700;
                border-radius: 50%;
                pointer-events: none;
            `;
            
            stallElement.appendChild(sparkle);
            
            this.createAnimation('particle', sparkle, {
                animationType: 'sparkle',
                duration: 800 / this.settings.animationSpeed,
                onComplete: () => sparkle.remove()
            });
        }
    },
    
    // Loading animations
    animateLoadingStart(data) {
        const { message = 'Loading...' } = data;
        
        const loadingElement = document.createElement('div');
        loadingElement.id = 'loading-overlay';
        loadingElement.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        loadingElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        
        document.body.appendChild(loadingElement);
        
        // Fade in
        setTimeout(() => {
            loadingElement.style.opacity = '1';
        }, 10);
        
        // Animate spinner
        const spinner = loadingElement.querySelector('.loading-spinner');
        this.createAnimation('ui', spinner, {
            animationType: 'spinner',
            duration: 2000 / this.settings.animationSpeed,
            loop: true
        });
    },
    
    animateLoadingComplete(data) {
        const loadingElement = document.getElementById('loading-overlay');
        if (!loadingElement) return;
        
        // Fade out
        loadingElement.style.opacity = '0';
        TimerManager.setTimeout(() => {
            loadingElement.remove();
        }, 300);
    },
    
    // UI animation updates
    updateUIAnimation(animation, progress) {
        const { element, animationType } = animation;
        
        switch (animationType) {
            case 'impact':
                const impactScale = 1 + (1 - progress) * 2;
                const impactOpacity = 1 - progress;
                element.style.transform = `translate(-50%, -50%) scale(${impactScale})`;
                element.style.opacity = impactOpacity;
                break;
                
            case 'expand':
                const expandScale = progress * 3;
                const expandOpacity = 1 - progress;
                element.style.transform = `translate(-50%, -50%) scale(${expandScale})`;
                element.style.opacity = expandOpacity;
                break;
                
            case 'contract':
                const contractScale = 2 - progress * 2;
                const contractOpacity = 1 - progress;
                element.style.transform = `translate(-50%, -50%) scale(${contractScale})`;
                element.style.opacity = contractOpacity;
                break;
                
            case 'stallOpen':
                const scaleY = progress;
                element.style.transform = `scaleY(${scaleY})`;
                element.style.transformOrigin = 'bottom';
                break;
                
            case 'stallClose':
                const closeScaleY = 1 - progress;
                element.style.transform = `scaleY(${closeScaleY})`;
                element.style.transformOrigin = 'bottom';
                break;
                
            case 'spinner':
                const rotation = progress * 360;
                element.style.transform = `rotate(${rotation}deg)`;
                break;
                
            case 'sparkle':
                const sparkleY = -progress * 20;
                const sparkleOpacity = 1 - progress;
                const sparkleScale = 1 + progress;
                element.style.transform = `translateY(${sparkleY}px) scale(${sparkleScale})`;
                element.style.opacity = sparkleOpacity;
                break;
        }
    },
    
    // Travel animation updates
    updateTravelAnimation(animation, progress) {
        const { element, animationType } = animation;
        
        switch (animationType) {
            case 'fadeOut':
                element.style.opacity = 1 - progress;
                const fadeScale = 1 - progress * 0.5;
                element.style.transform = `scale(${fadeScale})`;
                break;
                
            case 'fadeIn':
                element.style.opacity = progress;
                const fadeInScale = 0.5 + progress * 0.5;
                element.style.transform = `scale(${fadeInScale})`;
                break;
        }
    },
    
    // Particle animation updates
    updateParticleAnimation(animation, progress) {
        const { element, fromX, fromY, toX, toY, animationType } = animation;
        
        switch (animationType) {
            case 'projectile':
                const currentX = fromX + (toX - fromX) * progress;
                const currentY = fromY + (toY - fromY) * progress;
                const arcHeight = Math.sin(progress * Math.PI) * 50;
                
                element.style.left = `${currentX}px`;
                element.style.top = `${currentY - arcHeight}px`;
                element.style.transform = `translate(-50%, -50%) rotate(${progress * 360}deg)`;
                break;
        }
    },
    
    // Easing functions
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    
    easeOutBounce(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    },
    
    // Button press animations
    animateButtonPress(button, options = {}) {
        if (!button || !this.settings.animationsEnabled) return;
        
        const defaults = {
            scale: 0.95,
            duration: 150,
            color: null
        };
        
        const config = { ...defaults, ...options };
        
        button.style.transition = `transform ${config.duration / 1000}s ease-in-out`;
        button.style.transform = `scale(${config.scale})`;
        
        if (config.color) {
            button.style.backgroundColor = config.color;
        }
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            if (config.color) {
                button.style.backgroundColor = '';
            }
        }, config.duration);
    },
    
    // Progress bar animations
    animateProgressBar(progressBar, currentProgress, targetProgress, duration = 1000) {
        if (!progressBar || !this.settings.animationsEnabled) return;
        
        const startTime = Date.now();
        const startProgress = currentProgress;
        const progressDiff = targetProgress - startProgress;
        
        const animateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeInOutQuad(progress);
            const currentValue = startProgress + progressDiff * easedProgress;
            
            progressBar.style.width = `${currentValue}%`;
            progressBar.setAttribute('aria-valuenow', currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animateProgress);
            }
        };
        
        animateProgress();
    },
    
    // Text scrolling animation
    animateTextScroll(element, text, speed = 50) {
        if (!element || !this.settings.animationsEnabled) return;
        
        element.textContent = '';
        let index = 0;
        
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                TimerManager.setTimeout(typeChar, speed / this.settings.animationSpeed);
            }
        };
        
        typeChar();
    },
    
    // Icon animations
    animateIcon(icon, animationType = 'bounce', duration = 1000) {
        if (!icon || !this.settings.animationsEnabled) return;
        
        icon.style.animation = 'none';
        
        TimerManager.setTimeout(() => {
            icon.style.animation = `${animationType} ${duration / this.settings.animationSpeed}ms ease-in-out`;
        }, 10);
        
        TimerManager.setTimeout(() => {
            icon.style.animation = '';
        }, duration);
    },
    
    // Settings management
    setAnimationSpeed(speed) {
        this.settings.animationSpeed = Math.max(0.1, Math.min(3.0, speed));
        this.saveSettings();
    },
    
    setQuality(quality) {
        this.settings.quality = quality;
        
        // Adjust animation quality based on setting
        switch (quality) {
            case 'low':
                // Reduce animation complexity
                break;
            case 'medium':
                // Balanced animation quality
                break;
            case 'high':
                // Maximum animation quality
                break;
        }
        
        this.saveSettings();
    },
    
    toggleAnimations() {
        this.settings.animationsEnabled = !this.settings.animationsEnabled;
        if (!this.settings.animationsEnabled) {
            this.stopAllAnimations();
        }
        this.saveSettings();
    },
    
    toggleReducedMotion() {
        this.settings.reducedMotion = !this.settings.reducedMotion;
        if (this.settings.reducedMotion) {
            // Apply reduced motion styles
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        } else {
            document.documentElement.style.setProperty('--animation-duration', '');
        }
        this.saveSettings();
    },
    
    // Stop all animations
    stopAllAnimations() {
        this.activeAnimations = [];
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    },
    
    // Cleanup
    cleanup() {
        this.stopAllAnimations();
        
        // Remove any animation-related elements
        const animationElements = document.querySelectorAll('.item-effect, .impact-effect, .travel-effect, .arrival-effect, .sparkle');
        animationElements.forEach(element => element.remove());
        
        // Remove loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.remove();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationSystem;
}