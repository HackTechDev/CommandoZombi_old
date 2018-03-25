var CommandoZombi = CommandoZombi || {};

//title screen
CommandoZombi.Game = function(){};

    var music;
    var playerSpellSound;

    var pworldmap;
    var nworldmap;
    var ngametiles;
    var agent;
    var operator;
    var health;

    var t1;
    var t2;
    var t3;

    var panel;
    var textField;
    var button;
    var menuButton;

//create game instance
CommandoZombi.Game.prototype = {

    init: function(param1, param2, param3, param4, param5, param6) {
        console.log('Level state');
        console.log('previous worldmap: ' + param1);
        console.log('next worldmap: ' + param2);
        console.log('next gametiles: ' + param3);
        console.log('agent: ' + param4);
        console.log('operator: ' + param5);
        console.log('health: ' + param6);

        pworldmap= param1;
        nworldmap = param2;
        ngametiles = param3;
        agent = param4;
        operator = param5;
        health = param6;
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
   

    // UI
        this.world.add(slickUI.container.displayGroup);
        slickUI.add(panel = new SlickUI.Element.Panel(16, 8, 380, this.game.height - 170));


        textField = panel.add(new SlickUI.Element.TextField(10,30, 300, 40));
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
            console.log('Clicked save game');
        });

        button.add(new SlickUI.Element.Text(0,0, "Save game")).center();

        panel.add(button = new SlickUI.Element.Button(0, 220, 140, 40));
        button.add(new SlickUI.Element.Text(0,0, "Close")).center();

        panel.visible = false;
        var basePosition = panel.x;

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
            /*
            this.game.add.tween(panel).to( {x: basePosition + 156}, 500, Phaser.Easing.Exponential.Out, true).onComplete.add(function () {
                panel.visible = false;
                panel.x -= 156;
            });*/
            panel.visible = false;
            menuButton.visible = true;
        });

        var cb1, cb2;
        panel.add(cb1 = new SlickUI.Element.Checkbox(0,100, SlickUI.Element.Checkbox.TYPE_RADIO));
        cb1.events.onInputDown.add(function () {
            if(cb1.checked && cb2.checked) {
                cb2.checked = false;
            }
            if(!cb1.checked && !cb2.checked) {
                cb1.checked = true;
            }
        }, this);

        panel.add(cb2 = new SlickUI.Element.Checkbox(50,100, SlickUI.Element.Checkbox.TYPE_RADIO));
        cb2.events.onInputDown.add(function () {
            if(cb1.checked && cb2.checked) {
                cb1.checked = false;
            }
            if(!cb1.checked && !cb2.checked) {
                cb2.checked = true;
            }
        }, this);

        panel.add(new SlickUI.Element.Checkbox(100,100));





        this.KKey = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
        this.LKey = this.game.input.keyboard.addKey(Phaser.Keyboard.L);

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

                enemy.kill();
            } else if (enemy.key == "guard") {
                enemy.health -=1;
                this.playerBullet.kill();

                if(enemy.health <= 0){
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
                  player.health -=1;
                  health -=1;
                   $('img:last-child').remove();
                }
                if (enemy.key == "guard") {
                  player.health -=1;
                  health -=1;
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

        if(this.cursors.up.isDown) {
            this.player.facing = "up";
            this.player.body.velocity.y -= 175;
            this.player.animations.play('up');

        } else if(this.cursors.down.isDown) {
            this.player.facing = "down";
            this.player.body.velocity.y += 175;
            this.player.animations.play('down');

        } else if(this.cursors.left.isDown) {
            this.player.facing = "left";
            this.player.body.velocity.x -= 175;
            this.player.animations.play('left');

        } else if(this.cursors.right.isDown) {
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


        if(this.KKey.isDown) {
            console.log('Change Level');
            console.log('Current worldmap: ' + nworldmap);
            cworldmap = nworldmap;
            if(cworldmap === "worldmap1") {
                nworldmap = "worldmap3";
            }
            if(cworldmap === "worldmap2") {
                nworldmap = "worldmap1";
            }            
            if(cworldmap === "worldmap3") {
                nworldmap = "worldmap2";
            }

            console.log('Next worldmap: ' + nworldmap);
            this.game.state.start('Game', true, false, cworldmap, nworldmap, ngametiles, agent, operator, health);
        }

        if(this.LKey.isDown) {
            console.log('Change Level');
            console.log('Current worldmap: ' + nworldmap);
            cworldmap = nworldmap;
            if(cworldmap === "worldmap1") {
                nworldmap = "worldmap2";
            }
            if(cworldmap === "worldmap2") {
                nworldmap = "worldmap3";
            }            
            if(cworldmap === "worldmap3") {
                nworldmap = "worldmap1";
            }

            console.log('Next worldmap: ' + nworldmap);
            this.game.state.start('Game', true, false, cworldmap, nworldmap, ngametiles, agent, operator, health);
        }

    },
}
