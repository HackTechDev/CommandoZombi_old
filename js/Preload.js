var LegendOfAdlez = LegendOfAdlez || {};

//Loading the game assets
LegendOfAdlez.Preload = function(){};

LegendOfAdlez.Preload.prototype = {
    preload: function() {
        //show loading screen
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.splash.anchor.setTo(0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);

        //load game assets
        this.load.tilemap('world_map', 'assets/tilemaps/world_map/world_map_no_terrain.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', 'assets/tilemaps/world_map/tileset.png');
        this.load.image('map', 'assets/images/map.png');
        this.load.spritesheet('player', 'assets/images/player.png', 48, 64);
        this.load.spritesheet('adlezBullet', 'assets/images/adlezBullet.png', 32, 32);
        this.load.spritesheet('goon', 'assets/images/nightguardswordnpc.png', 48, 64);
        this.load.spritesheet('chicken', 'assets/images/chicken.png', 32, 32);
        this.load.spritesheet('nonag', 'assets/images/nonag.png', 44, 70);
        this.load.spritesheet('nonagBullet', 'assets/images/nonagBullet.png', 32, 32);
        this.game.load.spritesheet('kaboom', 'assets/images/explosion.png', 64, 64);

    },

    create: function() {
        this.state.start('MainMenu');
    }
};
