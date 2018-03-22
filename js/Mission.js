var CommandoZombi = CommandoZombi || {};

//Title
CommandoZombi.Mission = function(){};

    var pworldmap;
    var nworldmap;
    var ngametiles;
    var agent;
    var operator;
    var health;

CommandoZombi.Mission.prototype = {

    init: function(param1, param2, param3, param4, param5, param6) {
        console.log('Mission state');
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
      this.game.state.start('Game', true, false, pworldmap, nworldmap, ngametiles, agent, operator, health);
    }
  }
}
