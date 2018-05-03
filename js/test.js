        cb5.events.onInputDown.add(function () {
        
            console.log("Right arm");
            console.log(this.player.inventory.indexOf( "black_sword ));
            if (cb7.checked == true && this.player.inventory.indexOf( "black_sword" ) >= 0 && (this.player.inventory.indexOf("black_sword") == this.player.inventory.lastIndexOf("black_sword"))) {
                console.log("1 sword in inventory, sword is already wear");
                cb5.checked = false;
            } 
            
                    
            if(this.player.inventory.indexOf("black_sword") < 0) {
                console.log("No sword in inventory");
                cb5.checked = false;
            } else {
                if( cb5.checked ) {
                    console.log("sword");
                    if (cb7.checked == true && (this.player.inventory.indexOf("black_sword") != this.player.inventory.lastIndexOf("black_sword"))) {
                        console.log("2 sword in inventory, another 1 sword wear");
                    }

                    if (cb7.checked == false && (this.player.inventory.indexOf("black_sword") == this.player.inventory.lastIndexOf("black_sword"))) {
                        console.log("1 sword in inventory, unique sword wear");
                    } 

                    if (cb7.checked == false && (this.player.inventory.indexOf("black_sword") != this.player.inventory.lastIndexOf("black_sword"))) {
                        console.log("2 sword in inventory, 1 of 2 sword wear");
                    } 
                                                 
                    console.log("Sword");
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
                    console.log("No Sword");
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
             }
        }, this);
