(function(window) {

    var game;

    var matrix = [];

    function preload() {

        // game.load.image('rain', 'assets/pics/thalion-rain.png');
        // game.load.image('bubble', 'assets/pics/bubble-on.png');

    }

    var bubble;
    var field;

    var margins = {
        left: 100,
        top: 100
    };

    var size = 80;

    function create() {
        console.log(game.world.centerX);
        console.log(game.world.centerY);

        margins.left = game.world.centerX - 2.5 * size;
        margins.top = game.world.centerY - 2.5 * size;

        console.log(margins);

        game.stage.backgroundColor = '#1ABC9C';

        field = game.add.graphics(0, 0);
        field.beginFill(0x2C3E50, 1);
        field.drawRoundedRect(margins.left, margins.top, 5 * size + 5, 5 * size + 5, 5);


        for (var i = 0; i < 5; i++) {
            matrix[i] = [];

            for (var j = 0; j < 5; j++) {
                var rect = game.add.graphics(0, 0);
                rect.beginFill(0x34495E, 1);
                rect.drawRoundedRect(margins.left + i * size + 5, margins.top + j * size + 5, size - 5, size - 5, 5);
                matrix[i][j] = rect;
            };
        };
    }

    function update() {

        if (game.input.activePointer.withinGame) {
            // bubble.alpha = 1;
        } else {
            // bubble.alpha = 0.3;
        }

    }

    function render() {

        game.debug.inputInfo(32, 32);
        game.debug.pointer(game.input.activePointer);

    }

    window['GameStage6'] = function DesignGame() {

        game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game', {
            preload: preload,
            create: create,
            update: update,
            render: render
        });
    }

})(window);