var CommandoZombi = CommandoZombi || {};

// Title
CommandoZombi.MainMenu = function(){};

CommandoZombi.MainMenu.prototype = {
  	create: function() {
    	// Show map scrolling in background
    	this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
    	this.background.autoScroll(-20, -20);

    	// Start game
    	// Logo
    	this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    	this.splash.anchor.setTo(0.5);

    	buttonSniper = this.game.add.button(20, 10, 'buttonSniper', this.actionsniperOnClick, this, 0);
    	buttonBreacher = this.game.add.button(144, 10, 'buttonBreacher', this.actionbreacherOnClick, this, 0);
    	buttonMedic = this.game.add.button(293, 10, 'buttonMedic', this.actionmedicOnClick, this, 0);

    	buttonOption = this.game.add.button(20, 400, 'buttonOption', this.actionoptionOnClick, this, 0);
    	buttonHelp = this.game.add.button(170, 400, 'buttonHelp', this.actionhelpOnClick, this, 0);
		buttonAbout = this.game.add.button(293, 400, 'buttonAbout', this.actionaboutOnClick, this, 0);

    	this.startButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  	},

  	actionsniperOnClick: function() {
    	console.log('button sniper');
    	this.game.state.start('Mission', true, false, "intro", "worldmap1", "gameTiles", "Lucien", "Sniper", 100, 80, 0);
  	},

  	actionbreacherOnClick: function() {
    	console.log('button breacher');
    	this.game.state.start('Mission', true, false, "intro", "worldmap1", "gameTiles", "Marcel", "Breacher", 100, 60, 0);
  	},

  	actionmedicOnClick: function() {
    	console.log('button medic');
    	this.game.state.start('Mission', true, false, "intro", "worldmap1", "gameTiles", "Rene", "Medic", 100, 40, 0);
  	},

  	actionoptionOnClick: function() {
    	console.log('button option');
  	},

  	actionhelpOnClick: function() {
    	console.log('button help');
  	},

  	actionaboutOnClick: function() {
    	console.log('button about');
  	},


}
