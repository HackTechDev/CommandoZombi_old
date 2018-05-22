var CommandoZombi = CommandoZombi || {};

// Title
CommandoZombi.Help = function(){};

CommandoZombi.Help.prototype = {

    init: function() {
    },

    create: function() {
        // Show map scrolling in background
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
        this.background.autoScroll(-20, -20);

        // Start game
        // Logo
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.splash.anchor.setTo(0.5);

        var text = "- In console, type 'inv'\nto show the inventory\n- Type 'rem <gear id>\n to remove a gear";
        var style = { font: "30px Arial", fill: "#000", align: "center" };
        var ts = this.game.add.text( (this.game.width/2) + 2, (this.game.height/2) + 2, text, style);
        ts.anchor.set(0.5);
        var style = { font: "30px Arial", fill: "#005400", align: "center" };
        var t = this.game.add.text(this.game.width/2, (this.game.height/2), text, style);
        t.anchor.set(0.5);

        buttonMainMenu = this.game.add.button(160, 10, 'buttonMainMenu', this.actionmainmenuOnClick, this, 0);

    },

    actionmainmenuOnClick: function() {
        console.log('button Main Manu');
        this.game.state.start('MainMenu');
    },

}
