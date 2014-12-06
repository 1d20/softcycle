(function(window) {

    var game;

    var matrix = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ];

    function preload() {

        // game.load.image('rain', 'assets/pics/thalion-rain.png');
        // game.load.image('bubble', 'assets/pics/bubble-on.png');

    }

    var bubble;
    var size = 40;

    function create() {

        game.stage.backgroundColor = '#1abc9c';

        for (var i = 0; i < 6; i++) {
            matrix[i] = [];

            for (var j = 0; j < 6; j++) {
                // x, y, w, h
                // matrix[i][j] = new Phaser.Rectangle(50 + i * 10, 50 + j * 10, 10, 10);

                var rect = game.add.graphics(100 + i * size, 100 + j * size);
                rect.beginFill(0x2C3E50, 1);
                rect.drawRect(100 + i * size, 100 + j * size, size * 2, size * 2);
                rect.beginFill(0x34495E, 1);
                rect.drawRect(100 + i * size + 5, 100 + j * size + 5, size * 2 - 5, size * 2 - 5);
                matrix[i][j] = rect;
            };
        };

        // game.add.tileSprite(0, 0, 800, 600, 'rain');

        // bubble = game.add.image(game.world.centerX, game.world.centerY, 'bubble');
        // bubble.anchor.set(0.5);

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

        game = new Phaser.Game(1024, 780, Phaser.AUTO, 'game', {
            preload: preload,
            create: create,
            update: update,
            render: render
        });
    }

})(window);