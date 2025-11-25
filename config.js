// ═══════════════════════════════════════════════════════════════
// 🖤 GAME CONFIG - the dark heart of all settings 🖤
// ═══════════════════════════════════════════════════════════════
// File Version: 0.1
// one file to rule them all, one file to bind them
// change something here and watch the whole world shift
// it's like being a god but with less responsibility
// ═══════════════════════════════════════════════════════════════

const GameConfig = {
    // ═══════════════════════════════════════════════════════════════
    // 📋 VERSION INFO - tracking our descent into madness
    // ═══════════════════════════════════════════════════════════════
    version: {
        game: '0.1',           // we're just getting started, darling
        file: '0.1',           // baby's first version
        build: '2024.01',      // born in the depths of 2024
        releaseDate: '2024'    // the year we unleashed this beast
    },

    // ═══════════════════════════════════════════════════════════════
    // 🎮 GAME IDENTITY - who even are we anyway
    // ═══════════════════════════════════════════════════════════════
    game: {
        name: 'Medieval Trading Game',
        shortName: 'MTG',      // not that MTG, cease and desist lawyers
        tagline: 'where capitalism meets the dark ages... and thrives',
        description: 'a browser-based descent into medieval capitalism. hoard gold, exploit markets, feel nothing. just like real life but with more plague.'
    },

    // ═══════════════════════════════════════════════════════════════
    // 👥 CREDITS - the souls who sacrificed their sanity
    // ═══════════════════════════════════════════════════════════════
    credits: {
        studio: 'Unity AI Lab',
        developers: [
            { name: 'Hackall360', role: 'Lead Code Necromancer' },
            { name: 'Sponge', role: 'Chaos Engineer' },
            { name: 'GFourteen', role: 'Digital Alchemist' }
        ],
        year: '2024',
        copyright: '© 2024 Unity AI Lab. all rights reserved. souls sold separately.'
    },

    // ═══════════════════════════════════════════════════════════════
    // 🔗 LINKS - escape routes from this madness
    // ═══════════════════════════════════════════════════════════════
    links: {
        website: '',           // TODO: build a shrine
        github: '',            // where the bodies are buried
        discord: '',           // screaming into the void, together
        support: ''            // emotional or technical? yes.
    },

    // ═══════════════════════════════════════════════════════════════
    // 🎨 UI STRINGS - words that haunt the interface
    // ═══════════════════════════════════════════════════════════════
    ui: {
        welcomeMessage: '🖤 welcome to Medieval Trading Game... your wallet will never recover',
        loadingMessage: 'summoning Medieval Trading Game from the void...',
        mainMenuTitle: 'Medieval Trading Game',
        topBarTitle: 'Medieval Trading Game'
    },

    // ═══════════════════════════════════════════════════════════════
    // 💾 STORAGE KEYS - where memories go to die (localStorage)
    // ═══════════════════════════════════════════════════════════════
    storage: {
        prefix: 'medievalTradingGame',
        highScores: 'medievalTradingGameHighScores',      // hall of fallen merchants
        saveSlots: 'medievalTradingGameSaveSlots',        // parallel timelines of regret
        autoSaveSlots: 'medievalTradingGameAutoSaveSlots', // paranoia saves lives
        emergencySave: 'medievalTradingGameEmergencySave', // panic button data
        settings: 'medievalTradingGameSettings',           // your preferences, preserved
        locationHistory: 'medieval-trading-game-location-history' // everywhere you've fled from
    },

    // ═══════════════════════════════════════════════════════════════
    // ⚙️ DEFAULTS - factory settings for fresh souls
    // ═══════════════════════════════════════════════════════════════
    defaults: {
        soundVolume: 0.7,          // loud enough to drown out thoughts
        musicVolume: 0.5,          // background existential dread
        autoSave: true,            // because trust issues
        autoSaveInterval: 300000,  // 5 mins of anxiety between saves
        maxSaveSlots: 10,          // 10 alternate realities
        maxAutoSaveSlots: 10       // 10 safety nets
    },

    // ═══════════════════════════════════════════════════════════════
    // 🛠️ HELPER METHODS - dark utilities for darker purposes
    // ═══════════════════════════════════════════════════════════════

    // summon the version string from the abyss
    getVersionString() {
        return `v${this.version.game}`;
    },

    // the full title, in all its glory
    getFullTitle() {
        return `${this.game.name} ${this.getVersionString()}`;
    },

    // credits formatted for the mortals
    getCreditsText() {
        const devNames = this.credits.developers.map(d => d.name).join(', ');
        return `forged by ${this.credits.studio}\ncode necromancers: ${devNames}`;
    },

    // developer list as HTML (for the about page shrine)
    getDevelopersHTML() {
        return this.credits.developers.map(dev =>
            `<div class="credit-entry"><span class="dev-name">${dev.name}</span><span class="dev-role">${dev.role}</span></div>`
        ).join('');
    },

    // the about section - our digital tombstone
    getAboutHTML() {
        return `
            <div class="about-section">
                <div class="about-logo">🏰</div>
                <h2>${this.game.name}</h2>
                <p class="about-tagline">${this.game.tagline}</p>
                <div class="about-version">version ${this.version.game}</div>
                <div class="about-studio">
                    <span class="studio-label">conjured by</span>
                    <span class="studio-name">${this.credits.studio}</span>
                </div>
                <div class="about-developers">
                    <h4>the coven</h4>
                    ${this.getDevelopersHTML()}
                </div>
                <div class="about-copyright">${this.credits.copyright}</div>
            </div>
        `;
    },

    // bend the browser tab to our will
    updateDocumentTitle(suffix = '') {
        document.title = suffix ? `${this.game.name} - ${suffix}` : this.game.name;
    },

    // awaken the config from its slumber
    init() {
        console.log(`🖤 ${this.game.name} v${this.version.game} rises from the void`);
        console.log(`⚰️ forged by ${this.credits.studio}`);
        this.updateDocumentTitle();
        return this;
    }
};

// bind to the window like a curse
if (typeof window !== 'undefined') {
    window.GameConfig = GameConfig;
}

console.log('🖤 GameConfig awakened... the darkness spreads');
