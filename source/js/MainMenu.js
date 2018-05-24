var CommandoZombi = CommandoZombi || {};

// Title
CommandoZombi.MainMenu = function(){};

CommandoZombi.MainMenu.prototype = {

    preload: function() {

        //  Phaser can load JSON files.
        //  It does this using an XMLHttpRequest.
        //  If loading a file from outside of the domain in which the game is running 
        //  a 'Access-Control-Allow-Origin' header must be present on the server.

        this.game.load.json('version', 'version.json');

    },

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


        var phaserJSON = this.game.cache.getJSON('version');

        var text = this.game.add.text(20, 360, "Current Phaser version: " + phaserJSON.version, { font: "10px Arial", fill: '#ffffff' });
        text.setShadow(2, 2, 'rgba(0,0,0,0.5)', 0);

        var text2 = this.game.add.text(20, 370, "Name: " + phaserJSON.name, { font: "10px Arial", fill: '#ffffff' });
        text2.setShadow(2, 2, 'rgba(0,0,0,0.5)', 0);

        var text3 = this.game.add.text(20, 380, "Released: " + phaserJSON.released, { font: "10px Arial", fill: '#ffffff' });
        text3.setShadow(2, 2, 'rgba(0,0,0,0.5)', 0);

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
        this.game.state.start('Option');
    },

    actionhelpOnClick: function() {
        console.log('button help');
        this.game.state.start('Help');
    },

    actionaboutOnClick: function() {
        console.log('button about');
        this.game.state.start('About');
    },


}
