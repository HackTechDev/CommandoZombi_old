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
        
        this.load.image('indoor_tiles', 'assets/tileset/ground/indoor/tiles.png');
        this.load.image('tileset_building_castle.png', 'assets/tileset/building/castle.png');
        this.load.image('tileset_ground_ground.png', 'assets/tileset/ground/ground.png');
        this.load.image('tileset_ground_ground_2.png', 'assets/tileset/ground/ground_2.png');
        this.load.image('tileset_building_wall_wall_brown.png', 'assets/tileset/building/wall/wall_brown.png');
        this.load.image('tileset_building_decoration_banner.png', 'assets/tileset/building/decoration/banner.png');
        this.load.image('tileset_ground_brown_paving.png', 'assets/tileset/ground/brown_paving.png');
        this.load.image('tileset_ground_water_dungeon_water.png', 'assets/tileset/ground/water/dungeon_water.png');
        this.load.image('tileset_ground_water_pool.png', 'assets/tileset/ground/water/pool.png');
        this.load.image('tileset_building_roof_blue.png', 'assets/tileset/building/roof/blue.png');
        this.load.image('tileset_building_roof_yellow.png', 'assets/tileset/building/roof/yellow.png');
        this.load.image('tileset_building_wall_stone.png', 'assets/tileset/building/wall/stone.png');
        this.load.image('tileset_building_roof_green.png', 'assets/tileset/building/roof/green.png');
        this.load.image('tileset_building_wall_wood.png', 'assets/tileset/building/wall/wood.png');
        this.load.image('tileset_building_roof_red.png', 'assets/tileset/building/roof/red.png');
        this.load.image('tileset_plant_flower_daisy_white.png', 'assets/tileset/plant/flower/daisy_white.png');
        this.load.image('green_stone', 'assets/tileset/item/statue/green_stone.png');
        this.load.image('tileset_ground_cobbled_paving.png', 'assets/tileset/ground/cobbled_paving.png');
        this.load.image('statue_bird', 'assets/tileset/item/statue/bird.png');
        this.load.image('tileset_building_fence_fence_chunky.png', 'assets/tileset/building/fence/fence_chunky.png');
        this.load.image('tileset_plant_grasses.png', 'assets/tileset/plant/grasses.png');
        this.load.image('tileset_plant_bush_hedge.png', 'assets/tileset/plant/bush/hedge.png');
        this.load.image('tileset_plant_flower_daisy_blue.png', 'assets/tileset/plant/flower/daisy_blue.png');
        this.load.image('tileset_plant_flower_daisy_red.png', 'assets/tileset/plant/flower/daisy_red.png');
        this.load.image('tileset_plant_flower_daisy_yellow.png', 'assets/tileset/plant/flower/daisy_yellow.png');
        this.load.image('tileset_plant_bush_bushes.png', 'assets/tileset/plant/bush/bushes.png');
        this.load.image('tileset_plant_tree_tree_green.png', 'assets/tileset/plant/tree/tree_green.png');
        this.load.image('tileset_building_window_window_long.png', 'assets/tileset/building/window/window_long.png');
        this.load.image('tileset_building_window_window_left.png', 'assets/tileset/building/window/window_left.png');
        this.load.image('tileset_building_door_closed_with_key.png', 'assets/tileset/building/door/closed_with_key.png');
        this.load.image('tileset_building_window_window_right.png', 'assets/tileset/building/window/window_right.png');
        this.load.image('tileset_furniture_chair_wooden_pale.png', 'assets/tileset/furniture/chair/wooden_pale.png');
        this.load.image('tileset_furniture_table_wooden_pale.png', 'assets/tileset/furniture/table/wooden_pale.png');
        this.load.image('tileset_item_statue_grey_stone.png', 'assets/tileset/item/statue/grey_stone.png');
        this.load.image('tileset_item_statue_fairypool.png', 'assets/tileset/item/statue/fairypool.png');
        this.load.image('tileset_ground_eye.png', 'assets/tileset/ground/eye.png');
        this.load.image('tileset_item_sign_large.png', 'assets/tileset/item/sign_large.png');
        this.load.image('tileset_plant_stump_small_stump.png', 'assets/tileset/plant/stump/small_stump.png');
        this.load.image('tileset_building_door_door_n.png', 'assets/tileset/building/door/door_n.png');
        this.load.image('tileset_building_decoration_chimney.png', 'assets/tileset/building/decoration/chimney.png');
        this.load.image('tileset_building_door_closed.png', 'assets/tileset/building/door/closed.png');
        this.load.image('tileset_building_decoration_orbpedestal.png', 'assets/tileset/building/decoration/orbpedestal.png');
        this.load.image('tileset_building_decoration_longhorn_skull.png', 'assets/tileset/building/decoration/longhorn_skull.png');
        this.load.image('tileset_building_church.png', 'assets/tileset/building/church.png');
        this.load.image('tileset_building_entrance_int_iron_bars.png', 'assets/tileset/building/entrance/int_iron_bars.png');
        this.load.image('tileset_building_decoration_chimney_big.png', 'assets/tileset/building/decoration/chimney_big.png');
        this.load.image('tileset_item_statue_green_stone_2.png', 'assets/tileset/item/statue/green_stone_2.png');
        this.load.image('tileset_building_decoration_library_banner.png', 'assets/tileset/building/decoration/library_banner.png');
        this.load.image('tileset_building_door_door_e.png', 'assets/tileset/building/door/door_e.png');
        this.load.image('tileset_building_door_door_w.png', 'assets/tileset/building/door/door_w.png');
        this.load.image('collision', 'assets/tileset/logic/collision.png');
        this.load.image('stick', 'assets/tileset/furniture/other/stick.png');
        this.load.image('numbers', 'assets/tileset/building/decoration/numbers.png');
        this.load.image('deep_pool', 'assets/tileset/ground/water/pool_deep.png');
        this.load.image('suspension_bridge', 'assets/tileset/object/suspension_bridge.png');
        this.load.image('animal', 'assets/tileset/logic/creature/animal.png');
        this.load.image('mutant', 'assets/tileset/logic/creature/mutant.png');
        this.load.image('stairs', 'assets/tileset/building/stairs/stairs.png');
        this.load.image('board_walk', 'assets/tileset/object/boardwalk.png');
        this.load.image('log_vertical', 'assets/tileset/plant/stump/log_vertical.png');
        this.load.image('stump_vertical', 'assets/tileset/plant/stump/stump_vertical.png');
        this.load.image('tileset_ground_green_paving.png', 'assets/tileset/ground/green_paving.png');
        this.load.image('light5x5', 'assets/tileset/light/light_5x5.png');
        this.load.image('door_light', 'assets/tileset/light/door_light.png');
        this.load.image('lamp', 'assets/tileset/furniture/light/lamp_bronze.png');
        this.load.image('dim_light_7x5', 'assets/tileset/light/dim_light_7x5.png');
        this.load.image('huts', 'assets/tileset/building/huts.png');
        

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
    }
};
