var CommandoZombi = CommandoZombi || {};

CommandoZombi.game = new Phaser.Game(450, 450, Phaser.CANVAS, 'game');

CommandoZombi.game.state.add('Boot', CommandoZombi.Boot);
CommandoZombi.game.state.add('Preload', CommandoZombi.Preload);
CommandoZombi.game.state.add('MainMenu', CommandoZombi.MainMenu);
CommandoZombi.game.state.add('Mission', CommandoZombi.Mission);
CommandoZombi.game.state.add('Game', CommandoZombi.Game);
CommandoZombi.game.state.add('Option', CommandoZombi.Option);
CommandoZombi.game.state.add('Help', CommandoZombi.Help);
CommandoZombi.game.state.add('About', CommandoZombi.About);

CommandoZombi.game.state.start('Boot');

// Utilities
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
