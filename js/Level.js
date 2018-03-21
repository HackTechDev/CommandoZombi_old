var CommandoZombi = CommandoZombi || {};

//Title
CommandoZombi.Level = function(){};

    var agent;
    var worldmap;
    var gametiles;


CommandoZombi.Level.prototype = {

    init: function(param1, param2, param3) {
        console.log('Level state');
        console.log('worldmap: ' + param1);
        console.log('gametiles: ' + param2);
        console.log('agent: ' + param3);
        worldmap = param1;
        gametiles = param2;
        agent = param3;
    },


  create: function() {
    //show map scrolling in background
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
    this.background.autoScroll(-20, -20);

    //Start game
    //logo
    this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);

    var text = "Press SPACE to hunt";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, (this.game.height/2)+75, text, style);
    t.anchor.set(0.5);

    this.startButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  update: function() {
    if(this.startButton.isDown) {
      this.game.state.start('Game', true, false, worldmap, gametiles, agent);
    }
  }
}
