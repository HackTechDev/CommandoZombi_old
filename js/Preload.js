var CommandoZombi = CommandoZombi || {};

//Loading the game assets
CommandoZombi.Preload = function(){};

CommandoZombi.Preload.prototype = {
    preload: function() {
        //show loading screen
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.splash.anchor.setTo(0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);

        //load game assets
        this.load.tilemap('world_map', 'assets/tilemaps/world_map/world_map.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', 'assets/tilemaps/world_map/tileset.png');
        this.load.image('map', 'assets/images/map.png');
        this.load.spritesheet('player', 'assets/images/player.png', 48, 64);
        this.load.spritesheet('playerBullet', 'assets/images/playerBullet.png', 32, 32);

        this.load.spritesheet('guard', 'assets/images/guard.png', 48, 64);
        this.load.spritesheet('devil', 'assets/images/devil.png', 48, 64);

        this.game.load.spritesheet('kaboom', 'assets/images/kaboom.png', 64, 64);

        this.load.spritesheet('blacklord', 'assets/images/blacklord.png', 48, 64);
        this.load.spritesheet('blacklordBullet', 'assets/images/blacklordBullet.png', 32, 32);

        this.game.load.spritesheet('kaboom', 'assets/images/explosion.png', 64, 64);

        this.load.audio('zombieAmbiance', ['assets/audio/zombieAmbiance.mp3', 'assets/audio/zombieAmbiance.ogg']);
        this.load.audio('playerSpell', ['assets/audio/playerSpell.mp3', 'assets/audio/playerSpell.ogg']);
        this.load.audio('playerLaugh', ['assets/audio/playerLaugh.mp3', 'assets/audio/playerLaugh.ogg']);
        this.load.audio('kaboom', ['assets/audio/kaboom.mp3', 'assets/audio/kaboom.ogg']);

        this.load.spritesheet('buttonSniper', 'assets/buttons/button_sniper.png', 104, 40);
        this.load.spritesheet('buttonBreacher', 'assets/buttons/button_breacher.png', 129, 40);
        this.load.spritesheet('buttonMedic', 'assets/buttons/button_medic.png', 101, 40);

    },

    create: function() {
        this.state.start('MainMenu');
    }
};
