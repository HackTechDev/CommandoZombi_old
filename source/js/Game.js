var CommandoZombi = CommandoZombi || {};

// Title screen
CommandoZombi.Game = function(){};

var displayGamepad = false;
var music = false;

var music, playerSpellSound;

var pworldmap, nworldmap, ngametiles;

var agent, operator, health, bullet, zombi;

var t1, t2, t3, t4, t5, t6, t7;

var cb1, cb2, cb3, cb4, cb5, cb6, cb7, cb8, cb9, cb10, cb11;

var panel, textField, button, menuButton;
var invpanel, invtextField, invbutton, invmenuButton;

var basePosition;

var playerhead, playerbody, playerarm, playerleg;

var pad;

var buttonA, buttonB, buttonX, buttonY, buttonDPadLeft, buttonDPadRight, buttonDPadUp, buttonDPadDown;

var imageA, imageB, imageX, imageY, imageDPad;

var playerMoveUp, playerMoveDown, playerMoveLeft, playerMoveRight;

var inventory = [];

// Create game instance
CommandoZombi.Game.prototype = {

    init: function(param1, param2, param3, param4, param5, param6, param7, param8) {
        pworldmap= param1;
        nworldmap = param2;
        ngametiles = param3;
        agent = param4;
        operator = param5;
        health = param6;
        bullet = param7;
        zombi = param8;
    },


    create: function() {
        this.map = this.game.add.tilemap(nworldmap);

        // Add music
        if ( music == true) {
            bgmusic = this.add.audio('zombieAmbiance');
            bgmusic.play();
        }

        // First argument: the tileset name as specified in Tiled; Second argument: the key to the asset
        this.map.addTilesetImage('tileset', ngametiles);


        // Map
        // Create map
        this.blockedLayer = this.map.createLayer('waterLayer');
        this.backgroundLayer = this.map.createLayer('groundLayer1');
        this.backgroundLayer = this.map.createLayer('groundLayer2');
        this.backgroundLayer = this.map.createLayer('groundLayer3');
        this.backgroundLayer = this.map.createLayer('pathLayer1');
        this.backgroundLayer = this.map.createLayer('pathLayer2');

        // Create player
        var result = this.findObjectsByType('playerStart', this.map, 'playerStart');
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
        this.game.physics.arcade.enable(this.player);

        this.player.health = health;
        this.player.inventory = [];

        this.player.helmet = "";
        this.player.armor = "";
        this.player.shield_left = "";
        this.player.shield_right = "";
        this.player.weapon_left = "";
        this.player.weapon_right = "";
        this.player.pant = "";

        this.player.bullet = bullet;

        this.blockedLayer = this.map.createLayer('CANTGOHERE');
        this.foregroundLayer = this.map.createLayer('topLayer1');
        this.foregroundLayer = this.map.createLayer('topLayer2');
        this.foregroundLayer = this.map.createLayer('topLayer3');
        this.foregroundLayer = this.map.createLayer('topLayer4');

        this.foregroundLayer.bringToTop();

        // Resizes game world to match the layer dimensions
        this.backgroundLayer.resizeWorld();

        this.createItems();

        // Collisions
        // Collision on blocked layer. 2000 is the number of bricks we can collide into - this is found in the json file for the map
        this.map.setCollisionBetween(1, 2000, true, 'waterLayer');
        this.map.setCollisionBetween(1, 2000, true, 'CANTGOHERE');

        this.createPlayerBullets();
        this.createBlacklordBullets();
        this.createExplosions();

        this.createEnemies();

        // Player

        // The camera follows player
        this.game.camera.follow(this.player);

        // Move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.playerBulletTime = 0;
        this.blacklordBulletTime = 0;

        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.restartButton = [];

        this.player.animations.add('left', [9, 10, 11], 7, true);
        this.player.animations.add('right', [3, 4 , 5], 7, true);
        this.player.animations.add('down', [6, 7, 8], 7, true);
        this.player.animations.add('up', [0, 1, 2], 7, true);
        this.playerBullets.callAll('animations.add', 'animations', 'left', [8, 9, 10, 11], 7, true);
        this.playerBullets.callAll('animations.add', 'animations', 'right', [4, 5, 6, 7], 7, true);
        this.playerBullets.callAll('animations.add', 'animations', 'down', [12, 13, 14, 15], 7, true);
        this.playerBullets.callAll('animations.add', 'animations', 'up', [0, 1, 2, 3], 7, true);
        this.blacklordBullets.callAll('animations.add', 'animations', 'shoot', [0, 1, 2, 3, 4, 5], 10, true);
        this.explosions.callAll('animations.add', 'animations', 'kaboom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 15, true);

        // Non-Playable Characters
        // Create boss
        var blacklordResult = this.findObjectsByType('nonnagStart', this.map, 'basicEnemyLayer');
        this.blacklord = this.game.add.sprite(blacklordResult[0].x-15, blacklordResult[0].y, 'blacklord');
        this.game.physics.arcade.enable(this.blacklord);
        this.blacklord.health = 10;
        this.game.add.tween(this.blacklord).to( { x: this.blacklord.x+randomIntFromInterval(30,50) }, randomIntFromInterval(400,800), Phaser.Easing.Linear.None, true, 0, 1000, true);

        // Add non-player spritesheets
        this.playerBullet = this.game.add.sprite('playerBullet');
        this.blacklordBullet = this.game.add.sprite('blacklordBullet');


        // Head-Up Display
        t1 = this.game.add.text(10, 10, "Agent: " + agent, { font: "16px Arial", fill: "#000000", align: "left" });
        t1.fixedToCamera = true;
        t1.cameraOffset.setTo(10, 10);

        t2 = this.game.add.text(10, 30, "Operator: " + operator, { font: "16px Arial", fill: "#000000", align: "left" });
        t2.fixedToCamera = true;
        t2.cameraOffset.setTo(10, 30);

        t3 = this.game.add.text(10, 50, "Worldmap: " + nworldmap, { font: "16px Arial", fill: "#000000", align: "left" });
        t3.fixedToCamera = true;
        t3.cameraOffset.setTo(10, 50);

        t4 = this.game.add.text(10, 70, "Position: ", { font: "16px Arial", fill: "#000000", align: "left" });
        t4.fixedToCamera = true;
        t4.cameraOffset.setTo(10, 70);

        t5 = this.game.add.text(10, 90, "Health: ", { font: "16px Arial", fill: "#000000", align: "left" });
        t5.fixedToCamera = true;
        t5.cameraOffset.setTo(10, 90);

        t6 = this.game.add.text(10, 110, "Bullet: ", { font: "16px Arial", fill: "#000000", align: "left" });
        t6.fixedToCamera = true;
        t6.cameraOffset.setTo(10, 110);

        t7 = this.game.add.text(10, 130, "Zombi: ", { font: "16px Arial", fill: "#000000", align: "left" });
        t7.fixedToCamera = true;
        t7.cameraOffset.setTo(10, 130);

        // Gamepad
        if(displayGamepad == true) {
            buttonPU = this.game.add.button(100, 300, 'button_pad', this.actionOnClick, this, 0);
            buttonPU.fixedToCamera = true;
            buttonPU.cameraOffset.setTo(100, 300);
            buttonPU.onInputOver.add(this.buttonPUonOver, this);
            buttonPU.onInputOut.add(this.buttonPUonOut, this);

            buttonPD = this.game.add.button(100, 400, 'button_pad', this.actionOnClick, this, 0);
            buttonPD.fixedToCamera = true;
            buttonPD.cameraOffset.setTo(100, 400);
            buttonPD.onInputOver.add(this.buttonPDonOver, this);
            buttonPD.onInputOut.add(this.buttonPDonOut, this);

            buttonPL = this.game.add.button(50, 350, 'button_pad', this.actionOnClick, this, 0);
            buttonPL.fixedToCamera = true;
            buttonPL.cameraOffset.setTo(50, 350);
            buttonPL.onInputOver.add(this.buttonPLonOver, this);
            buttonPL.onInputOut.add(this.buttonPLonOut, this);

            buttonPR = this.game.add.button(150, 350, 'button_pad', this.actionOnClick, this, 0);
            buttonPR.fixedToCamera = true;
            buttonPR.cameraOffset.setTo(150, 350);
            buttonPR.onInputOver.add(this.buttonPRonOver, this);
            buttonPR.onInputOut.add(this.buttonPRonOut, this);


            buttonPF = this.game.add.button(100, 350, 'button_pad', this.actionbuttonpfOnClick, this, 0);
            buttonPF.fixedToCamera = true;
            buttonPF.cameraOffset.setTo(100, 350);

            buttonA = this.game.add.button(260, 400, 'button_a', this.actionbuttonpaOnClick, this, 0);
            buttonA.fixedToCamera = true;
            buttonA.cameraOffset.setTo(260, 400);

            buttonB = this.game.add.button(320, 400, 'button_b', this.actionbuttonpbOnClick, this, 0);
            buttonB.fixedToCamera = true;
            buttonB.cameraOffset.setTo(320, 400);

            buttonC = this.game.add.button(380, 400, 'button_c', this.actionbuttonpcOnClick, this, 0);
            buttonC.fixedToCamera = true;
            buttonC.cameraOffset.setTo(380, 400);
        }

        // User Interface
        this.world.add(slickUI.container.displayGroup);
        slickUI.add(panel = new SlickUI.Element.Panel(16, 8, 420, this.game.height - 170));

        textField = panel.add(new SlickUI.Element.TextField(10,30, 385, 40));

        var inv0 = new SlickUI.Element.Text(12,75, "0-");
        panel.add(inv0);

        var inv1 = new SlickUI.Element.Text(12,95, "1-");
        panel.add(inv1);

        var inv2 = new SlickUI.Element.Text(12,115, "2-");
        panel.add(inv2);

        var inv3 = new SlickUI.Element.Text(12,135, "3-");
        panel.add(inv3);

        var inv4 = new SlickUI.Element.Text(12,155, "4-");
        panel.add(inv4);

        var inv5 = new SlickUI.Element.Text(12,175, "5-");
        panel.add(inv5);

        textField.events.onOK.add(function () {
            arg = textField.value.split(" ");
            if( arg[0] == "inv") {
                console.log("inventory");
                for(i=0;i<inventory.length;i++) {
                    result += i + ": " + inventory[i] + "\n";
                    if(i==0) { inv0.value = "0- " + inventory[i]; }
                    if(i==1) { inv1.value = "1- " + inventory[i]; }
                    if(i==2) { inv2.value = "2- " + inventory[i]; }
                    if(i==3) { inv3.value = "3- " + inventory[i]; }
                    if(i==4) { inv4.value = "4- " + inventory[i]; }
                    if(i==5) { inv5.value = "5- " + inventory[i]; }
                }
            } else if (arg[0]  == "rem") {
                candeleteitem = false;
                console.log("remove item: " + inventory[arg[1]]);

                if(inventory[arg[1]] == "black_gun" && (cb5.checked == false || cb7.checked == false) ) {
                    candeleteitem = true;
                }

                if(inventory[arg[1]] == "black_shield" && (cb7.checked == false || cb6.checked == false) ) {
                    candeleteitem = true;
                }

                if(inventory[arg[1]] == "black_helmet" && cb1.checked == false ) {
                    candeleteitem = true;
                }

                if(inventory[arg[1]] == "black_armor" && cb2.checked == false ) {
                    candeleteitem = true;
                }

                if(inventory[arg[1]] == "black_pant" && cb3.checked == false ) {
                    candeleteitem = true;
                }

                if(inventory[arg[1]] == "black_boot" && cb8.checked == false ) {
                    candeleteitem = true;
                }

                if(candeleteitem == true) {
                    inventory.splice(arg[1], 1);

                    inv0.value = "0-";
                    inv1.value = "1-";
                    inv2.value = "2-";
                    inv3.value = "3-";
                    inv4.value = "4-";
                    inv5.value = "5-";

                    for(i=0; i < inventory.length; i++) {
                        result += i + ": " + inventory[i] + "\n";
                        if(i==0) { inv0.value = "0- " + inventory[i]; }
                        if(i==1) { inv1.value = "1- " + inventory[i]; }
                        if(i==2) { inv2.value = "2- " + inventory[i]; }
                        if(i==3) { inv3.value = "3- " + inventory[i]; }
                        if(i==4) { inv4.value = "4- " + inventory[i]; }
                        if(i==5) { inv5.value = "5- " + inventory[i]; }
                    }
                }
            } else {
                inv0.value = "0- Command unknown";
                inv1.value = "1-";
                inv2.value = "2-";
                inv3.value = "3-";
                inv4.value = "4-";
                inv5.value = "5-";
            }
        });

        textField.events.onToggle.add(function (open) {
            console.log('Virtual Keyboard ' + (open ? 'opened' : 'closed'));
        });

        textField.events.onKeyPress.add(function(key) {
            console.log('Key pressed: ' + key);
        });

        panel.add(new SlickUI.Element.Text(10,0, "Menu")).centerHorizontally().text.alpha = 0.5;

        panel.add(button = new SlickUI.Element.Button(0, 220, 140, 40));
        button.add(new SlickUI.Element.Text(0,0, "Close")).center();

        panel.visible = false;
        basePosition = panel.x;

        slickUI.add(menuButton = new SlickUI.Element.DisplayObject(this.game.width - 45, 8, this.game.make.sprite(0, 0, 'menu-button')));
        menuButton.inputEnabled = true;
        menuButton.input.useHandCursor = true;
        menuButton.events.onInputDown.add(function () {
            if(panel.visible) {
                return;
            }
            panel.visible = true;
            panel.x = basePosition + 156;
            this.game.add.tween(panel).to( {x: basePosition}, 500, Phaser.Easing.Exponential.Out, true).onComplete.add(function () {
                menuButton.visible = false;
            });
            slickUI.container.displayGroup.bringToTop(panel.container.displayGroup);
        }, this);

        button.events.onInputUp.add(function () {
            panel.visible = false;
            menuButton.visible = true;
        });


        // Head
        panel.add(cb1 = new SlickUI.Element.Checkbox(300,75, SlickUI.Element.Checkbox.TYPE_RADIO));

        // Body
        panel.add(cb2 = new SlickUI.Element.Checkbox(300,115, SlickUI.Element.Checkbox.TYPE_RADIO));

        // Leg
        panel.add(cb3 = new SlickUI.Element.Checkbox(300,155, SlickUI.Element.Checkbox.TYPE_CROSS));

        // Boot
        panel.add(cb8 = new SlickUI.Element.Checkbox(300,195, SlickUI.Element.Checkbox.TYPE_CROSS));

        // Left arm
        panel.add(cb4 = new SlickUI.Element.Checkbox(240,155, SlickUI.Element.Checkbox.TYPE_CROSS));
        panel.add(cb5 = new SlickUI.Element.Checkbox(260,115));

        // Right arm
        panel.add(cb7 = new SlickUI.Element.Checkbox(340,115));
        panel.add(cb6 = new SlickUI.Element.Checkbox(360,155, SlickUI.Element.Checkbox.TYPE_CROSS));


        // Head / Helmet
        cb1.events.onInputDown.add(function () {

            if(this.player.inventory.indexOf("black_helmet") < 0) {
                console.log("No helmet in inventory");
                cb1.checked = false;
            }

            if(this.player.inventory.indexOf("black_helmet") >= 0) {
                console.log("Helmet in inventory");
                if( cb1.checked ) {
                    console.log("Wear helmet");
                    health += 20;
                    this.player.health = health;
                    console.log("health: " + this.player.health);

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');
                    bmd.copy('player_head');

                    if (playerbody == 1) { bmd.copy('player_body'); }
                    if (playerarm == 1) { bmd.copy('player_leftarm'); }
                    if (playerarm == 1) { bmd.copy('player_rightarm'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    // To add a bitmapdata as a spritesheet to phaser:
                    // https://stackoverflow.com/questions/34401175/loading-spritesheet-from-bitmapdata-in-phaser

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerhead = 1;
                } else {
                    console.log("Take off Helmet");
                    health -= 20;
                    this.player.health = health;
                    console.log("health: " + this.player.health);

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');

                    if (playerbody == 1) { bmd.copy('player_body'); }
                    if (playerarm == 1) { bmd.copy('player_leftarm'); }
                    if (playerarm == 1) { bmd.copy('player_rightarm'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerhead = 0;
                }
            }

        }, this);

        // Body / Armor
        cb2.events.onInputDown.add(function () {

            if(this.player.inventory.indexOf("black_armor") < 0) {
                console.log("No armor in inventory");
                cb2.checked = false;
            }

            if(this.player.inventory.indexOf("black_armor") >= 0) {
                console.log("Armor in inventory");
                if( cb2.checked ) {
                    console.log("Armor");
                    health += 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');
                    bmd.copy('player_body');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerbody = 1;
                } else {
                    console.log("No armor");
                    health -= 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerarm == 1) { bmd.copy('player_leftarm'); }
                    if (playerarm == 1) { bmd.copy('player_rightarm'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerbody = 0;
                }
            }
        }, this);

        // Leg / Pant
        cb3.events.onInputDown.add(function () {
            if(this.player.inventory.indexOf("black_pant") < 0) {
                console.log("No pant in inventory");
                cb3.checked = false;
            }

            if(this.player.inventory.indexOf("black_pant") >= 0) {
                console.log("Pant in inventory");
                if( cb3.checked ) {
                    console.log("Pant");
                    health += 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');
                    bmd.copy('player_body');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerbody = 1;
                } else {
                    console.log("No Pant");
                    health -= 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerarm == 1) { bmd.copy('player_leftarm'); }
                    if (playerarm == 1) { bmd.copy('player_rightarm'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerbody = 0;
                }
            }

        }, this);

        // Left arm
        cb4.events.onInputDown.add(function () {
            console.log("Left arm");
            console.log(this.player.inventory.indexOf( "black_shield" ));
            if (cb6.checked == true && this.player.inventory.indexOf( "black_shield" ) >= 0 && (this.player.inventory.indexOf("black_shield") == this.player.inventory.lastIndexOf("black_shield"))) {
                console.log("1 shield in inventory, Shield is already wear");
                cb4.checked = false;
            }

            if ( this.player.inventory.indexOf( "black_shield" ) < 0 ) {
                console.log("No shield in inventory");
                cb4.checked = false;
            } else {

                if( cb4.checked ) {
                    console.log("Shield");
                    if (cb6.checked == true && (this.player.inventory.indexOf("black_shield") != this.player.inventory.lastIndexOf("black_shield"))) {
                        console.log("2 shield in inventory, another 1 Shield wear");
                    }

                    if (cb6.checked == false && (this.player.inventory.indexOf("black_shield") == this.player.inventory.lastIndexOf("black_shield"))) {
                        console.log("1 shield in inventory, unique shield wear");
                    }

                    if (cb6.checked == false && (this.player.inventory.indexOf("black_shield") != this.player.inventory.lastIndexOf("black_shield"))) {
                        console.log("2 shield in inventory, 1 of 2 Shield wear");
                    }
                    console.log("Shield");
                    health += 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');
                    bmd.copy('player_rightarm');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerarm = 1;

                } else {
                    console.log("No Shield");
                    health -= 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerbody == 1) { bmd.copy('player_body'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerarm = 0;
                }

            }

        }, this);

        cb5.events.onInputDown.add(function () {

            console.log("Left arm");
            console.log(this.player.inventory.indexOf( "black_gun"));
            if (cb7.checked == true && this.player.inventory.indexOf( "black_gun" ) >= 0 && (this.player.inventory.indexOf("black_gun") == this.player.inventory.lastIndexOf("black_gun"))) {
                console.log("1 gun in inventory, gun is already wear");
                cb5.checked = false;
            }


            if(this.player.inventory.indexOf("black_gun") < 0) {
                console.log("No gun in inventory");
                cb5.checked = false;
            } else {
                if( cb5.checked ) {
                    console.log("gun");
                    if (cb7.checked == true && (this.player.inventory.indexOf("black_gun") != this.player.inventory.lastIndexOf("black_gun"))) {
                        console.log("2 gun in inventory, another 1 gun wear");
                    }

                    if (cb7.checked == false && (this.player.inventory.indexOf("black_gun") == this.player.inventory.lastIndexOf("black_gun"))) {
                        console.log("1 gun in inventory, unique gun wear");
                    }

                    if (cb7.checked == false && (this.player.inventory.indexOf("black_gun") != this.player.inventory.lastIndexOf("black_gun"))) {
                        console.log("2 gun in inventory, 1 of 2 gun wear");
                    }

                    console.log("gun");
                    this.player.bullet += 10;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');
                    bmd.copy('player_rightarm');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerarm = 1;
                } else {
                    console.log("No gun");
                    this.player.bullet -= 10;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerbody == 1) { bmd.copy('player_body'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerarm = 0;
                }
            }
        }, this);

        // Right Arm

        cb7.events.onInputDown.add(function () {

            console.log("Right arm");
            console.log(this.player.inventory.indexOf( "black_gun"));
            if (cb5.checked == true && this.player.inventory.indexOf( "black_gun" ) >= 0 && (this.player.inventory.indexOf("black_gun") == this.player.inventory.lastIndexOf("black_gun"))) {
                console.log("1 gun in inventory, gun is already wear");
                cb7.checked = false;
            }

            if(this.player.inventory.indexOf("black_gun") < 0) {
                console.log("No gun in inventory");
                cb7.checked = false;
            } else {
                if( cb7.checked ) {
                    console.log("gun");

                    if (cb5.checked == true && (this.player.inventory.indexOf("black_gun") != this.player.inventory.lastIndexOf("black_gun"))) {
                        console.log("2 gun in inventory, another 1 gun wear");
                    }

                    if (cb5.checked == false && (this.player.inventory.indexOf("black_gun") == this.player.inventory.lastIndexOf("black_gun"))) {
                        console.log("1 gun in inventory, unique gun wear");
                    }

                    if (cb5.checked == false && (this.player.inventory.indexOf("black_gun") != this.player.inventory.lastIndexOf("black_gun"))) {
                        console.log("2 gun in inventory, 1 of 2 gun wear");
                    }

                    console.log("gun");
                    this.player.bullet += 10;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');
                    bmd.copy('player_leftarm');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) {bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);
                    this.player.loadTexture("player_new", 0, false);
                    playerarm = 1;
                } else {
                    console.log("No gun");
                    this.player.bullet -= 10;
                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerbody == 1) { bmd.copy('player_body'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerarm = 0;
                }
            }
        }, this);

        cb6.events.onInputDown.add(function () {
            console.log("Right arm");
            console.log(this.player.inventory.indexOf( "black_shield" ));
            if (cb4.checked == true && this.player.inventory.indexOf( "black_shield" ) >= 0 && (this.player.inventory.indexOf("black_shield") == this.player.inventory.lastIndexOf("black_shield"))) {
                console.log("1 shield in inventory, Shield is already wear");
                cb6.checked = false;
            }

            if ( this.player.inventory.indexOf( "black_shield" ) < 0 ) {
                console.log("No shield in inventory");
                cb6.checked = false;
            } else {

                if( cb6.checked ) {
                    console.log("Shield");
                    if (cb4.checked == true && (this.player.inventory.indexOf("black_shield") != this.player.inventory.lastIndexOf("black_shield"))) {
                        console.log("2 shield in inventory, another 1 Shield wear");
                    }

                    if (cb4.checked == false && (this.player.inventory.indexOf("black_shield") == this.player.inventory.lastIndexOf("black_shield"))) {
                        console.log("1 shield in inventory, unique shield wear");
                    }

                    if (cb4.checked == false && (this.player.inventory.indexOf("black_shield") != this.player.inventory.lastIndexOf("black_shield"))) {
                        console.log("2 shield in inventory, 1 of 2 Shield wear");
                    }
                    console.log("Shield");
                    health += 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');
                    bmd.copy('player_leftarm');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerarm = 1;

                } else {
                    console.log("No Shield");
                    health -= 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerbody == 1) { bmd.copy('player_body'); }
                    if (playerleg == 1) { bmd.copy('player_rightleg'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerarm = 0;
                }

            }

        }, this);

        // Feet / Boot
        cb8.events.onInputDown.add(function () {
            if(this.player.inventory.indexOf("black_boot") < 0) {
                console.log("No Boot in inventory");
                cb8.checked = false;
            }


            if(this.player.inventory.indexOf("black_boot") > 0) {
                console.log("Boot in inventory");
                if( cb8.checked ) {
                    console.log("Boot");
                    health += 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');
                    bmd.copy('player_rightleg');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerbody == 1) { bmd.copy('player_body'); }
                    if (playerarm == 1) { bmd.copy('player_leftarm'); }
                    if (playerarm == 1) { bmd.copy('player_rightarm'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerleg = 1;
                } else {
                    console.log("No Boot");
                    health -= 20;
                    this.player.health = health;

                    var bmd = this.game.add.bitmapData(144, 256);
                    bmd.copy('player');

                    if (playerhead == 1) { bmd.copy('player_head'); }
                    if (playerbody == 1) { bmd.copy('player_body'); }
                    if (playerarm == 1) { bmd.copy('player_leftarm'); }
                    if (playerleg == 1) { bmd.copy('player_leftleg'); }

                    this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                    this.player.loadTexture("player_new", 0, false);
                    playerleg = 0;
                }
            }

        }, this);

        this.KKey = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
        this.LKey = this.game.input.keyboard.addKey(Phaser.Keyboard.L);

    },

    createItems: function() {
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        result = this.findObjectsByType('item', this.map, 'itemLayer');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.items);
        }, this);
    },

    buttonPUonOver: function() {
        console.log('button pad up');
        playerMoveUp = true;
    },

    buttonPUonOut: function() {
        console.log('button pad up');
        playerMoveUp = false;
    },

    buttonPDonOver: function() {
        console.log('button pad down');
        playerMoveDown = true;
    },

    buttonPDonOut: function() {
        console.log('button pad down');
        playerMoveDown = false;
    },

    buttonPLonOver: function() {
        console.log('button pad left');
        playerMoveLeft = true;
    },

    buttonPLonOut: function() {
        console.log('button pad left');
        playerMoveLeft = false;
    },

    buttonPRonOver: function() {
        console.log('button pad right');
        playerMoveRight = true;
    },

    buttonPRonOut: function() {
        console.log('button pad right');
        playerMoveRight = false;
    },

    actionbuttonpfOnClick: function() {
        console.log('button pad fire');
        this.fireBullet();
    },

    actionbuttonpaOnClick: function() {
        console.log('button pad A');
    },

    actionbuttonpbOnClick: function() {
        console.log('button pad B');
    },

    actionbuttonpcOnClick: function() {
        console.log('button pad C');

        console.log('Level');
        levelJSON = this.game.cache.getJSON('level');
        var currentObject;

        cworldmap = nworldmap;
        for(var i = 0; i < levelJSON.level.length; i++) {
            levelObject = levelJSON.level[i];

            if (this.player.x > levelObject.x - 100 && this.player.x < levelObject.x + 100 &&
                this.player.y > levelObject.y - 100 && this.player.y < levelObject.y + 100 &&
                cworldmap == levelObject.current) {
                this.game.state.start('Game', true, false, cworldmap, levelObject.next, ngametiles, agent, operator, health, this.player.bullet, zombi)
            }
        }

    },


    //create NPC's
    createEnemies: function() {
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        var enemy;

        //devil!
        result = this.findObjectsByType('devil', this.map, 'basicEnemyLayer');
        result.forEach(function(element) {
            this.devil = this.enemies.create(element.x, element.y, 'devil');
            this.devil.anchor.setTo(0.5, 0.5);
            this.devil.animations.add('right', [3, 4, 5], 6, true);
            this.devil.animations.add('left', [9, 10, 11], 6, true);
            this.devil.prevX = this.devil.x;
            this.devil.body.moves = false;
            this.devil.anchor.x = 0.5;
            this.devil.anchor.y = 0.5;
            this.devil.health = 1;
            this.tween = this.game.add.tween(this.devil).to( { x: this.devil.x+randomIntFromInterval(80,100) }, randomIntFromInterval(7000,20000), Phaser.Easing.Linear.None, true, 0, 1000, true);
        }, this);

        //guard
        result = this.findObjectsByType('guard', this.map, 'basicEnemyLayer');
        result.forEach(function(element) {
            this.guard = this.enemies.create(element.x, element.y, 'guard');
            this.guard.anchor.setTo(0.5, 0.5);
            this.guard.animations.add('down', [6, 7, 8], 10, true);
            this.guard.animations.add('up', [0, 1, 2], 10, true);
            this.guard.prevY = this.guard.y;
            this.guard.body.moves = false;
            this.guard.anchor.x = 0.5;
            this.guard.anchor.y = 0.5;
            this.guard.health = 5;
            this.tween = this.game.add.tween(this.guard).to( { y: this.guard.y+randomIntFromInterval(60,80) }, randomIntFromInterval(800,1000), Phaser.Easing.Linear.None, true, 0, 1000, true);
        }, this);

    },

    // Create a sprite from an object
    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        // Copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });
    },

    // Places sprite in designated area
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if(element.properties.type === type) {
                element.y -= map.tileHeight;
                element.id = result.length + 1;
                result.push(element);
            }
        });
        return result;
    },

    // Bullets
    // Player bullets
    createPlayerBullets: function() {
        this.playerBullets = this.game.add.group();
        this.playerBullets.enableBody = true;
        this.playerBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.playerBullets.createMultiple(40, 'playerBullet');
        this.playerBullets.setAll('anchor.x', 0.5);
        this.playerBullets.setAll('anchor.y', 1);
        this.playerBullets.setAll('outOfBoundsKill', true);
        this.playerBullets.setAll('checkWorldBounds', true);
    },

    // Boss bullets
    createBlacklordBullets: function() {
        this.blacklordBullets = this.game.add.group();
        this.blacklordBullets.enableBody = true;
        this.blacklordBullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.blacklordBullets.createMultiple(200, 'blacklordBullet');
        this.blacklordBullets.setAll('anchor.x', 0.5);
        this.blacklordBullets.setAll('anchor.y', 1);
        this.blacklordBullets.setAll('outOfBoundsKill', true);
        this.blacklordBullets.setAll('checkWorldBounds', true);
    },

    // Fire player bullets
    fireBullet: function() {
        if (this.game.time.now > this.playerBulletTime) {
            // Grab the first bullet we can from the pool
            this.playerBullet = this.playerBullets.getFirstExists(false);
            if (this.playerBullet) {
                this.player.bullet -= 1;
                // And fire it
                if (this.player.facing == "right") {
                    this.playerBullets.callAllExists('play', false, 'right');
                    this.playerBullet.reset(this.player.x + 30, this.player.y + 60);
                    this.playerBullet.body.velocity.x = 200;
                    this.playerBulletTime = this.game.time.now + 200;
                    this.playerBullet.lifespan = 1000;
                } else if (this.player.facing == "up") {
                    this.playerBullets.callAllExists('play', false, 'up');
                    this.playerBullet.reset(this.player.x + 25, this.player.y + 20);
                    this.playerBullet.body.velocity.y = -200;
                    this.playerBulletTime = this.game.time.now + 200;
                    this.playerBullet.lifespan = 1000;
                } else if (this.player.facing == "left") {
                    this.playerBullets.callAllExists('play', false, 'left');
                    this.playerBullet.reset(this.player.x + 5, this.player.y + 60);
                    this.playerBullet.body.velocity.x = -200;
                    this.playerBulletTime = this.game.time.now + 200;
                    this.playerBullet.lifespan = 1000;
                } else if (this.player.facing == "down") {
                    this.playerBullets.callAllExists('play', false, 'down');
                    this.playerBullet.reset(this.player.x + 25, this.player.y + 60);
                    this.playerBullet.body.velocity.y = 200;
                    this.playerBulletTime = this.game.time.now + 200;
                    this.playerBullet.lifespan = 1000;
                }
            }
        }
    },

    // Fire boss bullets
    fireBlacklordBullet: function() {
        if (this.game.time.now > this.blacklordBulletTime) {
            //  Grab the first bullet we can from the pool
            this.blacklordBullet = this.blacklordBullets.getFirstExists(false);
            if (this.blacklord.health <= 0) {
                this.blacklordBullet = false;
            }
            if (this.blacklordBullet) {
                this.blacklordBullets.callAllExists('play', false, 'shoot');
                this.blacklordBullet.reset(this.blacklord.x+20, this.blacklord.y + 30);
                this.blacklordBullet.body.velocity.y = 200;

                this.blacklordBullet.lifespan = 770;
                this.blacklordBulletTime = this.game.time.now + randomIntFromInterval(1500,3000);
            }
        }
    },

    // Remove enemy from map
    enemyKiller: function(playerBullet, enemy) {
        this.playerBullet.kill();

        if (enemy.key == "devil") {
            this.explosion = this.explosions.getFirstExists(false);
            this.explosion.reset(enemy.body.x, enemy.body.y);
            this.explosion.play('kaboom', 30, false, true);

            this.sound.play('kaboom');
            this.sound.play('playerLaugh');

            zombi = zombi + 1;
            enemy.kill();
        } else if (enemy.key == "guard") {
            enemy.health -=1;
            this.playerBullet.kill();

            if(enemy.health <= 0){
                zombi = zombi + 1;
                enemy.kill();
                this.explosion = this.explosions.getFirstExists(false);
                this.explosion.reset(enemy.body.x, enemy.body.y);
                this.explosion.play('kaboom', 30, false, true);

                this.sound.play('kaboom');
                this.sound.play('playerLaugh');

            }
        } else if (enemy.key == "blacklord") {
            enemy.health -=1;
            console.log(enemy.health);
            this.playerBullet.kill();
            if(enemy.health <= 0){
                zombi = zombi + 1;
                enemy.kill();
                this.explosion = this.explosions.getFirstExists(false);
                this.explosion.reset(enemy.body.x, enemy.body.y);
                this.explosion.play('kaboom', 30, false, true);

                this.sound.play('kaboom');
                this.sound.play('playerLaugh');

            }
        }
    },

    // Remove player from map
    playerKiller: function(player, enemy) {
        this.xdirection = this.player.body.x - enemy.body.x;
        this.ydirection = enemy.body.y - this.player.body.y;
        this.xbounceVelocity = this.xdirection * 40;
        this.ybounceVelocity = this.ydirection * -40;
        this.player.body.velocity.y = this.ybounceVelocity;
        this.player.body.velocity.x = this.xbounceVelocity;

        if (enemy.key == "blacklordBullet") {
            player.health -= 10;
            health -= 1;
        }

        if (enemy.key == "devil") {
            player.health -= 3;
            health -= 3;
        }

        if (enemy.key == "guard") {
            player.health -= 5;
            health -= 5;
        }

        if(player.health <=0) {
            this.player.kill();
            this.explosion = this.explosions.getFirstExists(false);
            this.explosion.reset(this.player.body.x, this.player.body.y);
            this.explosion.play('kaboom', 30, false, true);

            this.sound.play('kaboom');

            this.fireButton = [];
            this.gameOver();
        }
    },

    // Animation for death
    createExplosions: function() {
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'kaboom');
    },

    // Remove bullet if offscreen
    resetPlayerBullet: function() {
        this.playerBullet.kill();
    },

    // Remove bullet if offscreen
    resetBlacklordBullet: function() {
        this.blacklordBullet.kill();
    },

    // Updates devils animation. First, we search for all devils and put them in array.
    // Then, we see which direction they're moving and set the animation.
    updateDevilAnimation: function() {
        var devilsArray = [];
        this.enemies.forEach(function(enemy) {
            if (enemy.key == "devil") {
                devilsArray.push(enemy);
            }
        });

        devilsArray.forEach(function(devil) {
            if (devil.x > devil.prevX) {
                devil.play('right');
            } else {
                devil.play('left');
            }
            devil.prevX = devil.x;
        });
    },

    // Updates guards animation. First, we search for all guards and put them in array.
    // Then, we see which direction they're moving and set the animation.
    updateGuardAnimation: function() {
        var guardsArray = [];
        this.enemies.forEach(function(enemy) {
            if (enemy.key == "guard") {
                guardsArray.push(enemy);
            }
        });

        guardsArray.forEach(function(guard) {
            if (guard.y > guard.prevY) {
                guard.play('down');
            } else {
                guard.play('up');
            }
            guard.prevY = guard.y;
        });
    },

    gameOver: function() {
        var text = "Zombis eat you!!!"
        var text2 = "press SPACE to restart!";
        var style = { font: "30px Arial", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.player.x, this.player.y, text, style);
        var t2 = this.game.add.text(this.player.x, this.player.y+50, text2, style);
        t.anchor.set(0.5);
        t2.anchor.set(0.5);
        this.restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update: function() {
        // Player movement
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        this.fireBlacklordBullet();

        if(this.restartButton.isDown) {
            this.game.state.start('MainMenu', true, false);
        }

        if(this.cursors.up.isDown || playerMoveUp == true) {
            this.player.facing = "up";
            this.player.body.velocity.y -= 175;
            this.player.animations.play('up');

        } else if(this.cursors.down.isDown || playerMoveDown == true) {
            this.player.facing = "down";
            this.player.body.velocity.y += 175;
            this.player.animations.play('down');

        } else if(this.cursors.left.isDown || playerMoveLeft == true) {
            this.player.facing = "left";
            this.player.body.velocity.x -= 175;
            this.player.animations.play('left');

        } else if(this.cursors.right.isDown || playerMoveRight == true) {
            this.player.facing = "right";
            this.player.body.velocity.x += 175;
            this.player.animations.play('right');

        } else if (this.fireButton.isDown) {

            if (cb5.checked == true || cb7.checked == true) {
                console.log("Firegun");
                if( this.player.bullet > 0 ) {
                    this.fireBullet();
                } else {
                    console.log("No more ammo");
                }
            } else {
                console.log("No firegun in hand");
            }


        } else {
            this.player.animations.stop();
        }

        // Update NPC animations
        this.updateDevilAnimation();
        this.updateGuardAnimation();

        // Collision
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.blacklordBullet, this.blockedLayer, this.resetBlacklordBullet, null, this);
        this.game.physics.arcade.collide(this.playerBullet, this.blockedLayer, this.resetPlayerBullet, null, this);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);

        // Player interactions (magic, running into enemies, etc)
        this.game.physics.arcade.overlap(this.playerBullet, this.guard, this.guardKiller, null, this);
        this.game.physics.arcade.overlap(this.player, this.blacklordBullet, this.playerKiller, null, this);
        this.game.physics.arcade.overlap(this.playerBullet, this.enemies.children, this.enemyKiller, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies.children, this.playerKiller, null, this);
        this.game.physics.arcade.overlap(this.playerBullet, this.blacklord, this.enemyKiller, null, this);

        t4.setText("Position: " + Math.round(this.player.x) + "/" + Math.round(this.player.y));
        t5.setText("Health: " + this.player.health);
        t6.setText("Bullet: " + this.player.bullet);
        t7.setText("Zombi: " + zombi);

        if(this.LKey.isDown) {
            console.log('Level');
            levelJSON = this.game.cache.getJSON('level');
            var currentObject;

            cworldmap = nworldmap;
            for(var i = 0; i < levelJSON.level.length; i++) {
                levelObject = levelJSON.level[i];

                if (this.player.x > levelObject.x - 100 && this.player.x < levelObject.x + 100 &&
                    this.player.y > levelObject.y - 100 && this.player.y < levelObject.y + 100 &&
                    cworldmap == levelObject.current) {
                    console.log(levelObject.current + " " + levelObject.x + " " + levelObject.y + " " + levelObject.next);
                    console.log('Change Level');
                    console.log('Current worldmap: ' + nworldmap);
                    console.log('Next worldmap: ' + levelObject.next);
                    this.game.state.start('Game', true, false, cworldmap, levelObject.next, ngametiles, agent, operator, health, bullet, zombi)
                }
            }
        }

    },

    collect: function(player, collectable) {
        if(this.player.inventory.length < 6) {
            // Can take only 2 items
            // In inventory, there are always 2 same items
            if(this.player.inventory.indexOf(collectable.key) == this.player.inventory.lastIndexOf(collectable.key) ) {
                console.log('Item taken:' + collectable.key);
                this.player.inventory.push(collectable.key);
                console.log( this.player.inventory);
                inventory = this.player.inventory;
                collectable.destroy();

                if (collectable.key == "magazine") {
                    this.player.bullet += 20;
                }

                if (collectable.key == "firstaidkit") {
                    console.log(this.player.health);
                    this.player.health += 20;
                }

            }
        }
    },
}
