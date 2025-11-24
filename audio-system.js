// Web Audio powered soundscape manager
const AudioSystem = {
    context: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    ambientGain: null,
    musicTimer: null,
    currentTheme: 'menu',
    initialized: false,
    settings: {
        master: 0.8,
        music: 0.6,
        sfx: 0.75,
        ambient: 0.5,
        muted: false,
        musicMuted: false,
        sfxMuted: false,
        ambientEnabled: true
    },

    init(preferences = {}) {
        if (this.initialized) return;

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContextClass();

        // Build gain graph
        this.masterGain = this.context.createGain();
        this.musicGain = this.context.createGain();
        this.sfxGain = this.context.createGain();
        this.ambientGain = this.context.createGain();

        this.musicGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.ambientGain.connect(this.masterGain);
        this.masterGain.connect(this.context.destination);

        this.applySettings(preferences);
        this.initialized = true;

        // Unlock on first user gesture
        ['click', 'keydown', 'touchstart'].forEach(evt => {
            window.addEventListener(evt, () => this.resumeContext(), { once: true });
        });

        // Start with a soft menu pad
        this.setTheme('menu');
    },

    resumeContext() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    },

    applySettings(preferences = {}) {
        this.settings = { ...this.settings, ...preferences };

        if (!this.masterGain) return;

        this.masterGain.gain.value = this.settings.muted ? 0 : this.settings.master;
        this.musicGain.gain.value = this.settings.musicMuted ? 0 : this.settings.music;
        this.sfxGain.gain.value = this.settings.sfxMuted ? 0 : this.settings.sfx;
        this.ambientGain.gain.value = this.settings.ambientEnabled ? this.settings.ambient : 0;
    },

    setTheme(theme) {
        if (this.currentTheme === theme && this.musicTimer) return;
        this.currentTheme = theme;
        this.stopMusic();
        this.playTheme(theme);
    },

    stopMusic() {
        if (this.musicTimer) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
        }
    },

    playTheme(theme) {
        if (!this.initialized) return;

        const palette = {
            menu: { notes: [392, 440, 523, 440], interval: 3600 },
            explore: { notes: [262, 330, 392, 523, 392], interval: 2600 },
            market: { notes: [392, 494, 587, 494], interval: 2400 },
            travel: { notes: [220, 247, 277, 330], interval: 2000 },
            night: { notes: [196, 233, 262], interval: 3200 }
        };

        const themeData = palette[theme] || palette.menu;
        this.playSequence(themeData.notes, themeData.interval);
    },

    playSequence(notes, interval = 2000) {
        const now = this.context.currentTime;
        notes.forEach((freq, index) => {
            const startTime = now + (index * 0.4);
            this.playTone({
                frequency: freq,
                duration: 0.35,
                type: 'sine',
                destination: this.musicGain,
                startTime,
                fade: 0.08
            });
        });

        this.musicTimer = setTimeout(() => {
            this.playSequence(notes, interval);
        }, interval);
    },

    playTone({ frequency = 440, duration = 0.2, type = 'sine', destination = this.sfxGain, startTime = this.context.currentTime, fade = 0.02, gain = 1 }) {
        if (!this.initialized) return;

        const osc = this.context.createOscillator();
        const envelope = this.context.createGain();

        osc.type = type;
        osc.frequency.value = frequency;

        envelope.gain.setValueAtTime(0, startTime);
        envelope.gain.linearRampToValueAtTime(gain, startTime + fade);
        envelope.gain.linearRampToValueAtTime(0.001, startTime + duration);

        osc.connect(envelope);
        envelope.connect(destination);

        osc.start(startTime);
        osc.stop(startTime + duration + fade);
    },

    playSfx(event) {
        if (!this.initialized || this.settings.sfxMuted) return;

        const cues = {
            purchase: [880, 988, 1174],
            sell: [523, 440, 392],
            travelStart: [330, 392, 523],
            arrival: [554, 659, 784],
            notification: [784, 698],
            alert: [220, 0, 220]
        };

        const sequence = cues[event];
        if (!sequence) return;

        sequence.forEach((freq, index) => {
            const toneFrequency = freq === 0 ? 120 : freq;
            const type = freq === 0 ? 'sawtooth' : 'triangle';
            this.playTone({
                frequency: toneFrequency,
                type,
                duration: 0.15,
                startTime: this.context.currentTime + (index * 0.08)
            });
        });
    },

    playAmbient(type) {
        if (!this.initialized || !this.settings.ambientEnabled) return;

        const colors = {
            city: 220,
            town: 320,
            forest: 160,
            mine: 120,
            tavern: 260
        };

        const baseFrequency = colors[type] || 200;
        const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const noise = this.context.createBufferSource();
        const filter = this.context.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.value = baseFrequency;

        noise.buffer = noiseBuffer;
        noise.loop = true;
        noise.connect(filter);
        filter.connect(this.ambientGain);

        noise.start();

        setTimeout(() => noise.stop(), 8000);
    }
};
