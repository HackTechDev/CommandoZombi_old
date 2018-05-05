var CommandoZombi = CommandoZombi || {};

// Title
CommandoZombi.Mission = function(){};

var pworldmap;
var nworldmap;
var ngametiles;
var agent;
var operator;
var health;
var bullet;

CommandoZombi.Mission.prototype = {

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
    	// Show map scrolling in background
    	this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
    	this.background.autoScroll(-20, -20);

    	// Start game
    	// Logo
    	this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    	this.splash.anchor.setTo(0.5);

    	var text = "Kill all Zombis !!";
    	var style = { font: "30px Arial", fill: "#fff", align: "center" };
    	var t = this.game.add.text(this.game.width/2, (this.game.height/2)+75, text, style);
    	t.anchor.set(0.5);

    	buttonMission = this.game.add.button(160, 10, 'buttonMission', this.actionmissionOnClick, this, 0);

    	this.startButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  	},

  	actionmissionOnClick: function() {
    	console.log('button mission');
    	this.game.state.start('Game', true, false, pworldmap, nworldmap, ngametiles, agent, operator, health, bullet, zombi);
  	},

  	update: function() {
    	if(this.startButton.isDown) {
      		this.game.state.start('Game', true, false, pworldmap, nworldmap, ngametiles, agent, operator, health, bullet, zombi);
    	}
  	}
}
