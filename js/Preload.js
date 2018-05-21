var CommandoZombi = CommandoZombi || {};

//Loading the game assets
CommandoZombi.Preload = function(){};

var slickUI;

CommandoZombi.Preload.prototype = {
    preload: function() {

        //show loading screen
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.splash.anchor.setTo(0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);

        //load game assets
    	this.load.tilemap('worldmap1', 'assets/tilemaps/Level 0/ados/city.json', null, Phaser.Tilemap.TILED_JSON);
        //this.load.tilemap('worldmap1', 'assets/tilemaps/world_map/worldmap1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('worldmap2', 'assets/tilemaps/world_map/worldmap2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('worldmap3', 'assets/tilemaps/world_map/worldmap3.json', null, Phaser.Tilemap.TILED_JSON);

        this.game.load.json('level', 'assets/level/level.json');

        this.load.image('gameTiles', 'assets/tilemaps/world_map/tileset.png');
        this.load.image('map', 'assets/images/map.png');
 
		this.game.load.json('asset', 'assets/tilemaps/Level 0/ados/asset.json', null, this);

        this.load.spritesheet('player', 'assets/images/player.png', 48, 64);
        this.load.spritesheet('player_head', 'assets/images/player_head.png', 48, 64);
        this.load.spritesheet('player_body', 'assets/images/player_body.png', 48, 64);
        this.load.spritesheet('player_rightarm', 'assets/images/player_rightarm.png', 48, 64);
        this.load.spritesheet('player_leftarm', 'assets/images/player_leftarm.png', 48, 64);
        this.load.spritesheet('player_rightleg', 'assets/images/player_rightleg.png', 48, 64);
        this.load.spritesheet('player_leftleg', 'assets/images/player_leftleg.png', 48, 64);

        this.load.spritesheet('playerBullet', 'assets/images/playerBullet.png', 32, 32);

        this.load.image('black_armor', 'assets/images/black_armor.png', 32, 32);
        this.load.image('black_pant', 'assets/images/black_pant.png', 32, 32);
        this.load.image('black_boot', 'assets/images/black_boot.png', 32, 32);
        this.load.image('black_shield', 'assets/images/black_shield.png', 32, 32);
        this.load.image('black_helmet', 'assets/images/black_helmet.png', 32, 32);
        this.load.image('black_sword', 'assets/images/black_sword.png', 50, 26);
		this.load.image('magazine', 'assets/images/magazine.png', 15, 20);
		this.load.image('firstaidkit', 'assets/images/firstaidkit.png', 32, 28);


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
        this.load.spritesheet('buttonMission', 'assets/buttons/button_mission.png', 117, 40);
		this.load.spritesheet('buttonOption', 'assets/buttons/button_option.png', 108, 40);
		this.load.spritesheet('buttonHelp', 'assets/buttons/button_help.png', 84, 40);
	    this.load.spritesheet('buttonAbout', 'assets/buttons/button_about.png', 102, 40);
 		this.load.spritesheet('buttonMainMenu', 'assets/buttons/button_main-menu.png', 154, 40);

        slickUI = this.game.plugins.add(Phaser.Plugin.SlickUI);
        this.game.load.image('menu-button', 'assets/ui/menu.png');
        slickUI.load('assets/ui/kenney/kenney.json');

        this.load.image('button_pad', 'assets/controllers/button_pad.png');
        this.load.image('button_a', 'assets/controllers/button_a.png');
        this.load.image('button_b', 'assets/controllers/button_b.png');
        this.load.image('button_c', 'assets/controllers/button_c.png');

    },

    create: function() {
        this.state.start('MainMenu');
        console.log("asset");
        asset = this.game.cache.getJSON('asset');
        for (i in asset.level) {
        	key = asset.level[i].key;
        	url = asset.level[i].url;
			this.load.image(key, url);
        }

    }
};
