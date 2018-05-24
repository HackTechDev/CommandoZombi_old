var CommandoZombi = CommandoZombi || {};

CommandoZombi.Boot = function(){};

// Set game config and loading assets for the loading screen:
CommandoZombi.Boot.prototype = {
    preload: function() {
        // Assets for loading screen:
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('preloadbar', 'assets/images/preloader-bar.png');
    },
    create: function() {
        // Loading screen has white background:
        this.game.stage.backgroundColor = "#fff";

        // Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('Preload');
    }
};
