var CommandoZombi = CommandoZombi || {};

//title screen
CommandoZombi.Game = function(){};

    var music, playerSpellSound;

    var pworldmap, nworldmap, ngametiles;

    var agent, operator, health, bullet, zombi; 

    var t1, t2, t3, t4, t5, t6, t7;

    var panel, textField, button, menuButton;

    var basePosition;

    var playerhead, playerbody, playerarm, playerleg;

    var pad;

    var buttonA, buttonB, buttonX, buttonY, buttonDPadLeft, buttonDPadRight, buttonDPadUp, buttonDPadDown;

    var imageA, imageB, imageX, imageY, imageDPad;

    var playerMoveUp, playerMoveDown, playerMoveLeft, playerMoveRight;

//create game instance
CommandoZombi.Game.prototype = {

    init: function(param1, param2, param3, param4, param5, param6, param7, param8) {
        console.log('Game state');
        console.log('previous worldmap: ' + param1);
        console.log('next worldmap: ' + param2);
        console.log('next gametiles: ' + param3);
        console.log('agent: ' + param4);
        console.log('operator: ' + param5);
        console.log('health: ' + param6);
        console.log('bullet: ' + param7);
        console.log('zombi: ' + param8);

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

        //Add music
          music = this.add.audio('zombieAmbiance');
          music.play();

        //First argument: the tileset name as specified in Tiled; Second argument: the key to the asset
        this.map.addTilesetImage('tileset', ngametiles);


//MAP
    //Create map
        this.blockedLayer = this.map.createLayer('waterLayer');
        this.backgroundLayer = this.map.createLayer('groundLayer1');
        this.backgroundLayer = this.map.createLayer('groundLayer2');
        this.backgroundLayer = this.map.createLayer('groundLayer3');
        this.backgroundLayer = this.map.createLayer('pathLayer1');
        this.backgroundLayer = this.map.createLayer('pathLayer2');

        //create player
        var result = this.findObjectsByType('playerStart', this.map, 'playerStart');
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
        this.game.physics.arcade.enable(this.player);

        this.player.health = health;
        if(pworldmap === "intro") {
            for (i = 1; i <= 10; i++) {    
                $('#game-frame').append('<img src="assets/images/heart.png">');    
            }
        }

        this.blockedLayer = this.map.createLayer('CANTGOHERE');
        this.foregroundLayer = this.map.createLayer('topLayer1');
        this.foregroundLayer = this.map.createLayer('topLayer2');
        this.foregroundLayer = this.map.createLayer('topLayer3');
        this.foregroundLayer = this.map.createLayer('topLayer4');

        this.foregroundLayer.bringToTop();

        //Resizes game world to match the layer dimensions
        this.backgroundLayer.resizeWorld();



    //collisions
      //Collision on blocked layer. 2000 is the number of bricks we can collide into - this is found in the json file for the map
      this.map.setCollisionBetween(1, 2000, true, 'waterLayer');
      this.map.setCollisionBetween(1, 2000, true, 'CANTGOHERE');


        this.createPlayerBullets();
        this.createBlacklordBullets();
        this.createExplosions();

        this.createEnemies();



//PLAYER

    //the camera follows player
        this.game.camera.follow(this.player);

    //move player with cursor keys
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



//Non-Playable Characters
    //create boss
        var blacklordResult = this.findObjectsByType('nonnagStart', this.map, 'basicEnemyLayer');
        this.blacklord = this.game.add.sprite(blacklordResult[0].x-15, blacklordResult[0].y, 'blacklord');
        this.game.physics.arcade.enable(this.blacklord);
        this.blacklord.health = 10;
        this.game.add.tween(this.blacklord).to( { x: this.blacklord.x+randomIntFromInterval(30,50) }, randomIntFromInterval(400,800), Phaser.Easing.Linear.None, true, 0, 1000, true);

    //add non-player spritesheets
        this.playerBullet = this.game.add.sprite('playerBullet');
        this.blacklordBullet = this.game.add.sprite('blacklordBullet');


    // HUD
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


    // UI
        this.world.add(slickUI.container.displayGroup);
        slickUI.add(panel = new SlickUI.Element.Panel(16, 8, 420, this.game.height - 170));


        textField = panel.add(new SlickUI.Element.TextField(10,30, 385, 40));
        textField.events.onOK.add(function () {
            alert('Command: ' + textField.value);
        });
        textField.events.onToggle.add(function (open) {
            console.log('You just ' + (open ? 'opened' : 'closed') + ' the virtual keyboard');
        });
        textField.events.onKeyPress.add(function(key) {
            console.log('You pressed: ' + key);
        });

        
        panel.add(new SlickUI.Element.Text(10,0, "Menu")).centerHorizontally().text.alpha = 0.5;
        panel.add(button = new SlickUI.Element.Button(0, 170, 140, 40)).events.onInputUp.add(function () {
            console.log('Gear');
            bullet -= 10;
            health -= 10;
        });

        button.add(new SlickUI.Element.Text(0,0, "Gear")).center();

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


        
        var cb1, cb2, cb3, cb4, cb5, cb6, cb7, cb8, cb9, cb10, cb11;

        panel.add(cb1 = new SlickUI.Element.Checkbox(240,75, SlickUI.Element.Checkbox.TYPE_RADIO));
        panel.add(cb2 = new SlickUI.Element.Checkbox(240,115, SlickUI.Element.Checkbox.TYPE_RADIO));
        panel.add(cb3 = new SlickUI.Element.Checkbox(240,155, SlickUI.Element.Checkbox.TYPE_RADIO));

        panel.add(cb4 = new SlickUI.Element.Checkbox(160,115));
        panel.add(cb5 = new SlickUI.Element.Checkbox(200,115, SlickUI.Element.Checkbox.TYPE_CROSS));
        panel.add(cb6 = new SlickUI.Element.Checkbox(280,115, SlickUI.Element.Checkbox.TYPE_CROSS));
        panel.add(cb7 = new SlickUI.Element.Checkbox(320,115));


        panel.add(cb8 = new SlickUI.Element.Checkbox(200,195));
        panel.add(cb9 = new SlickUI.Element.Checkbox(200,235, SlickUI.Element.Checkbox.TYPE_CROSS));
        panel.add(cb10 = new SlickUI.Element.Checkbox(280,195));
        panel.add(cb11 = new SlickUI.Element.Checkbox(280,235, SlickUI.Element.Checkbox.TYPE_CROSS));


        cb1.events.onInputDown.add(function () {
            if( cb1.checked ) {
                console.log("Helmet");
                health += 20;
                
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
                console.log("No Helmet");
                health -= 20;

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
        }, this);


        cb2.events.onInputDown.add(function () {
            if( cb2.checked ) {
                console.log("Vest");
                health += 20;
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
                console.log("No Vest");
                health -= 20;
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
        }, this);


        cb3.events.onInputDown.add(function () {
            if( cb3.checked ) {
                console.log("Vest");
                health += 20;
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
                console.log("No Vest");
                health -= 20;
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
        }, this);

        cb4.events.onInputDown.add(function () {
            if( cb4.checked ) {
                console.log("Shield");
                health += 20;
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
        }, this);

        cb5.events.onInputDown.add(function () {
            if( cb5.checked ) {
                console.log("Weapon");
                bullet += 10;
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
                console.log("No Weapon");
                bullet -= 10;
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
        }, this);


        cb6.events.onInputDown.add(function () {
            if( cb6.checked ) {
                console.log("Shield");
                health += 20;
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
        }, this);

        cb7.events.onInputDown.add(function () {
            if( cb7.checked ) {
                console.log("Weapon");
                bullet += 10;
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
                console.log("No Weapon");
                bullet -= 10;
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
        }, this);

        cb8.events.onInputDown.add(function () {
            if( cb8.checked ) {
                console.log("Weapon");
                health += 20;
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
                console.log("No Weapon");
                health -= 20;
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
        }, this);

        cb9.events.onInputDown.add(function () {
            if( cb9.checked ) {
                console.log("Boot");
                bullet += 10;
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
                bullet -= 10;
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
        }, this);


        cb10.events.onInputDown.add(function () {
            if( cb10.checked ) {
                console.log("Weapon");
                health += 20;
                var bmd = this.game.add.bitmapData(144, 256);
                bmd.copy('player');
                bmd.copy('player_leftleg');
            
                if (playerhead == 1) { bmd.copy('player_head'); }                
                if (playerbody == 1) { bmd.copy('player_body'); }
                if (playerarm == 1) { bmd.copy('player_leftarm'); }
                if (playerarm == 1) { bmd.copy('player_rightarm'); }              
            
                this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                this.player.loadTexture("player_new", 0, false);                    
                playerleg = 1;
            } else {
                console.log("No Weapon");
                health -= 20;
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
        }, this);

        cb11.events.onInputDown.add(function () {
            if( cb11.checked ) {
                console.log("Boot");
                bullet += 10;
                var bmd = this.game.add.bitmapData(144, 256);
                bmd.copy('player');
                bmd.copy('player_leftleg');
            
                if (playerhead == 1) { bmd.copy('player_head'); }                
                if (playerbody == 1) { bmd.copy('player_body'); }
                if (playerarm == 1) { bmd.copy('player_leftarm'); }
                if (playerarm == 1) { bmd.copy('player_rightarm'); }              
            
                this.game.cache.addSpriteSheet("player_new", null, bmd.canvas, 48, 64);

                this.player.loadTexture("player_new", 0, false);                  
                playerleg = 1;
            } else {
                console.log("No Boot");
                bullet -= 10;
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
        }, this);

        this.KKey = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
        this.LKey = this.game.input.keyboard.addKey(Phaser.Keyboard.L);

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
            console.log(levelObject.current + " " + levelObject.x + " " + levelObject.y + " " + levelObject.next);
            console.log('Change Level');
            console.log('Current worldmap: ' + nworldmap);
            console.log('Next worldmap: ' + levelObject.next);
            this.game.state.start('Game', true, false, cworldmap, levelObject.next, ngametiles, agent, operator, health, bullet)
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

        //create a sprite from an object
        createFromTiledObject: function(element, group) {
            var sprite = group.create(element.x, element.y, element.properties.sprite);

            //copy all properties to the sprite
            Object.keys(element.properties).forEach(function(key){
                sprite[key] = element.properties[key];
            });
        },

        //places sprite in designated area
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

//BULLETS
    //player bullets
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

    //boss bullets
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

    //fire player bullets
        fireBullet: function() {
            if (this.game.time.now > this.playerBulletTime) {
                //  Grab the first bullet we can from the pool
                this.playerBullet = this.playerBullets.getFirstExists(false);
                if (this.playerBullet) {
                    bullet -= 1;
                //  And fire it
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

    //fire boss bullets
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

    //remove enemy from map
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

    //remove player from map
        playerKiller: function(player, enemy) {
            this.xdirection = this.player.body.x - enemy.body.x;
            this.ydirection = enemy.body.y - this.player.body.y;
            this.xbounceVelocity = this.xdirection * 40;
            this.ybounceVelocity = this.ydirection * -40;
            this.player.body.velocity.y = this.ybounceVelocity;
            this.player.body.velocity.x = this.xbounceVelocity;
                if (enemy.key == "blacklordBullet") {
                  player.health -= 1;
                  health -= 1;
                   $('img:last-child').remove();
                }
                if (enemy.key == "guard") {
                  player.health -=1;
                  health -= 1;
                  $('img:last-child').remove();
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

    //animation for death
        createExplosions: function() {
            this.explosions = this.game.add.group();
            this.explosions.createMultiple(30, 'kaboom');
        },

    //remove bullet if offscreen
        resetPlayerBullet: function() {
          this.playerBullet.kill();
        },

    //remove bullet if offscreen
        resetBlacklordBullet: function() {
            this.blacklordBullet.kill();
        },

    //Updates devils animation. First, we search for all devils and put them in array. Then, we see which direction they're moving and set the animation.
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

    //Updates guards animation. First, we search for all guards and put them in array. Then, we see which direction they're moving and set the animation.
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
        //player movement
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
            this.fireBullet();
        }else {
            this.player.animations.stop();
        }

        //Update NPC animations
          this.updateDevilAnimation();
          this.updateGuardAnimation();

        //collision
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.blacklordBullet, this.blockedLayer, this.resetBlacklordBullet, null, this);
        this.game.physics.arcade.collide(this.playerBullet, this.blockedLayer, this.resetPlayerBullet, null, this);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);

        //Player interactions (magic, running into enemies, etc)
        this.game.physics.arcade.overlap(this.playerBullet, this.guard, this.guardKiller, null, this);
        this.game.physics.arcade.overlap(this.player, this.blacklordBullet, this.playerKiller, null, this);
        this.game.physics.arcade.overlap(this.playerBullet, this.enemies.children, this.enemyKiller, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies.children, this.playerKiller, null, this);
        this.game.physics.arcade.overlap(this.playerBullet, this.blacklord, this.enemyKiller, null, this);

    
        t4.setText("Position: " + Math.round(this.player.x) + "/" + Math.round(this.player.y));
        t5.setText("Health: " + health);
        t6.setText("Bullet: " + bullet);
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
                    this.game.state.start('Game', true, false, cworldmap, levelObject.next, ngametiles, agent, operator, health, bullet)
                }
            }
        }

    },
}
