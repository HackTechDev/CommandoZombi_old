var CommandoZombi = CommandoZombi || {};

//Title
CommandoZombi.MainMenu = function(){};

CommandoZombi.MainMenu.prototype = {
  create: function() {
    //show map scrolling in background
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
    this.background.autoScroll(-20, -20);

    //Start game
    //logo
    this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);

    /*
    var text = "Press SPACE to hunt";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, (this.game.height/2)+75, text, style);
    t.anchor.set(0.5);
    */

    buttonSniper = this.game.add.button(20, 10, 'buttonSniper', this.actionsniperOnClick, this, 0);
    buttonBreacher = this.game.add.button(144, 10, 'buttonBreacher', this.actionbreacherOnClick, this, 0);
    buttonMedic = this.game.add.button(293, 10, 'buttonMedic', this.actionmedicOnClick, this, 0);

    this.startButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  actionsniperOnClick: function() {
    console.log('button sniper');
    this.game.state.start('Game', true, false, "Sniper");
  },
  actionbreacherOnClick: function() {
    console.log('button breacher');
    this.game.state.start('Game', true, false, "Breacher");
  },
  actionmedicOnClick: function() {
    console.log('button medic');
    this.game.state.start('Game', true, false, "Medic");
  },
  update: function() {
    if(this.startButton.isDown) {
      this.game.state.start('Game', true, true, "Sniper");
    }
  }
}
