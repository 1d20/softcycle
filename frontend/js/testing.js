(function(window) {
    var game;
    var res;
    var $scope;
    var finishGame;

    var Config = {
        cooldown: 1000, //milisec
        pathed: {
            bugs: 0,
            code: 0
        },
        killed: {
            bugs: 0,
            code: 0
        }

    };

    var GameState = function(game) {
        this.TIMER_MAX = 60000 //60 sec
    };

    // Load images and sounds
    GameState.prototype.preload = function() {
        this.game.load.image('cloud', '/static/frontend/images/games/tests/cloud.png');
        this.game.load.image('ground', '/static/frontend/images/games/tests/ground.png');
        this.game.load.spritesheet('bug', '/static/frontend/images/games/tests/bug_sprite_sheet.png', 32, 45, 3);
        this.game.load.spritesheet('monster', '/static/frontend/images/games/tests/monster_img.png', 64, 64, 3);
        this.game.load.spritesheet('explosion', '/static/frontend/images/games/tests/explosion.png', 128, 128);

    };

    // Setup the example
    GameState.prototype.create = function() {
        // Set stage background color
        this.game.stage.backgroundColor = 0x4488cc;

        // Let's make some clouds
        for (var x = -56; x < this.game.width; x += 80) {
            var cloud = this.game.add.image(x, -80, 'cloud');
            cloud.scale.setTo(2, 2); // Make the clouds big
            cloud.tint = 0xcccccc; // Make the clouds dark
            cloud.smoothed = false; // Keeps the sprite pixelated
        }

        // Create some ground
        for (x = 0; x < this.game.width; x += 32) {
            this.game.add.image(x, this.game.height - 32, 'ground');
        }

        // Create a pool of cyclopes
        var MONSTERS = 10;
        this.monsterGroup = this.game.add.group();
        this.monsterGroup.enableBody = true;
        this.monsterGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.monsterGroup.createMultiple(MONSTERS, 'monster', 0);

        // Create a pool of bugs
        var BAGS = 50;
        this.bugGroup = this.game.add.group();
        this.bugGroup.enableBody = true;
        this.bugGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bugGroup.createMultiple(BAGS, 'bug', 0);

        // Create a timer for spawning a new monster
        this.monsterTimer = 0;

        // Create a timer for spawning a new monster
        this.bugTimer = 0;

        // Create a group for explosions
        this.explosionGroup = this.game.add.group();

        // Create a bitmap for the lightning bolt texture
        this.lightningBitmap = this.game.add.bitmapData(200, 1000);

        // Create a sprite to hold the lightning bolt texture
        this.lightning = this.game.add.image(this.game.width / 2, 80, this.lightningBitmap);

        // This adds what is called a "fragment shader" to the lightning sprite.
        // See the fragment shader code below for more information.
        // This is an WebGL feature. Because it runs in your web browser, you need
        // a browser that support WebGL for this to work.
        this.lightning.filters = [this.game.add.filter('Glow')];

        // Set the anchor point of the sprite to center of the top edge
        // This allows us to position the lightning by simply specifiying the
        // x and y coordinate of where we want the lightning to appear from.
        this.lightning.anchor.setTo(0.5, 0);

        // Create a white rectangle that we'll use to represent the flash
        this.flash = this.game.add.graphics(0, 0);
        this.flash.beginFill(0xffffff, 1);
        this.flash.drawRect(0, 0, this.game.width, this.game.height);
        this.flash.endFill();
        this.flash.alpha = 0;

        // Make the world a bit bigger than the stage so we can shake the camera
        this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);

        // Show FPS
        this.game.time.advancedTiming = true;

        this.highscoreText = this.game.add.text(
            this.game.width - 240, 20, '', {
                font: '16px Arial',
                fill: '#ffffff'
            }
        );

        this.timerText = this.game.add.text(20, 20, '', {
            font: '16px Arial',
            fill: '#ffffff'
        });

        this.cooldownText = this.game.add.text(200, 20, '', {
            font: '16px Arial',
            fill: '#ffffff'
        });

        //  Create our Timer
        this.cooldownTimer = game.time.create(true);

        //  Set a TimerEvent to occur after 2 seconds
        this.cooldownTimer.loop(Config.cooldown, timeCooldownFn, this);


        //this.cooldownTimer.start();

        //  Create our Timer
        this.timer = game.time.create(true);

        //  Set a TimerEvent to occur after 2 seconds
        this.timer.loop(this.TIMER_MAX, timeIsOut, this);

        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        this.timer.start();

        stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
            font: '84px Arial',
            fill: '#fff'
        });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
    };

    function timeCooldownFn() {
        this.cooldownTimer.paused = true;
        //cooldownText    
    }

    function timeIsOut() {
        var codestat = Config.pathed.code;
        var bugstat = Config.killed.bugs - Config.pathed.bugs;;
        stateText.text = " Time is up!\n Pathed Code: " + codestat.toString() + "\n Catched Buds: " + bugstat.toString();
        stateText.visible = true;
        this.game.paused = true;

        window["GameStage7"].game.score = codestat + bugstat;
        window["GameStage7"].game.finished = true;

        $scope.$digest();
        finishGame();
    };


    function updateTimer(game) {

        minutes = Math.floor(game.timer.duration.toFixed(0) / 60000) % 60;

        seconds = Math.floor(game.timer.duration.toFixed(0) / 1000) % 60;

        milliseconds = Math.floor(game.timer.duration.toFixed(0)) % 100;

        //If any of the digits becomes a single digit number, pad it with a zero
        if (milliseconds < 10)
            milliseconds = '0' + milliseconds;

        if (seconds < 10)
            seconds = '0' + seconds;

        if (minutes < 10)
            minutes = '0' + minutes;

        game.timerText.setText('Time last: ' + minutes + ':' + seconds + ':' + milliseconds);

    }

    function updateCooldown(game) {
        minutes = Math.floor(game.cooldownTimer.duration.toFixed(0) / 60000) % 60;

        seconds = Math.floor(game.cooldownTimer.duration.toFixed(0) / 1000) % 60;

        milliseconds = Math.floor(game.cooldownTimer.duration.toFixed(0)) % 100;

        //If any of the digits becomes a single digit number, pad it with a zero
        if (milliseconds < 10)
            milliseconds = '0' + milliseconds;

        if (seconds < 10)
            seconds = '0' + seconds;

        if (minutes < 10)
            minutes = '0' + minutes;

        game.cooldownText.setText('Cooldown: ' + minutes + ':' + seconds + ':' + milliseconds);
    }


    // The update() method is called every frame
    GameState.prototype.update = function() {

        updateTimer(this);

        updateCooldown(this);

        var codestat = Config.pathed.code;
        var bugstat = Config.killed.bugs - Config.pathed.bugs;
        this.highscoreText.setText("Highscore: bugs catched: " + bugstat + '\n            code saved: ' + codestat);

        //this.cooldownText.setText("Cooldown");


        // Spawn a new monster
        this.monsterTimer -= this.game.time.elapsed;
        if (this.monsterTimer <= 0) {
            this.monsterTimer = this.game.rnd.integerInRange(150, 500);
            this.createNewMonster();

        }

        // Spawn a new bug
        this.bugTimer -= this.game.time.elapsed;
        if (this.bugTimer <= 0) {
            this.bugTimer = this.game.rnd.integerInRange(150, 500);
            this.createNewBug();
        }

        // Kill monsters when they go off screen
        this.monsterGroup.forEachAlive(function(monster) {
            //this.monsterTimer -= this.game.time.elapsed;
            /*if (this.monsterTimer <= 0) {
                this.monsterTimer = this.game.rnd.integerInRange(150, 500);
                if(monster.frame == 0) monster.frame = 1
                else monster.frame = 0;
            }*/
            if (monster.x < -64) {
                if (monster.frame != 2) Config.pathed.code++;
                monster.kill();
            }
            if (monster.y > this.game.height) {
                monster.kill();
            }
        }, this);



        this.bugGroup.forEachAlive(function(bug) {
            /*this.bugTimer -= this.game.time.elapsed;
            if (this.bugTimer <= 0) {
                this.bugTimer = this.game.rnd.integerInRange(150, 500);
                if(bug.frame == 0) bug.frame = 1
                else bug.frame = 0;
            }*/
            if (bug.x < -64) {
                if (bug.frame != 2) Config.pathed.bugs++;
                bug.kill();
            }
            if (bug.y > this.game.height) {
                bug.kill();
            }

        }, this);

        // Create lightning
        if (this.game.input.activePointer.justPressed(20) && (!this.cooldownTimer.running || this.cooldownTimer.paused)) {
            if (!this.cooldownTimer.running)
                this.cooldownTimer.start();
            if (this.cooldownTimer.paused)
                this.cooldownTimer.paused = false;
            // Kill monsters within 64 pixels of the strike
            this.monsterGroup.forEachAlive(function(monster) {
                if (this.game.math.distance(
                    this.game.input.activePointer.x, this.game.input.activePointer.y,
                    monster.x, monster.y) < 64) {
                    monster.frame = 2; // Show the "dead" texture
                    monster.body.velocity.y = this.game.rnd.integerInRange(-600, -1200);
                    monster.body.velocity.x = this.game.rnd.integerInRange(-500, 500);
                    monster.body.acceleration.y = 3000;
                    monster.angle = 180;
                    Config.killed.code++;
                    // Create an explosion
                    this.getExplosion(monster.x, monster.y);
                }
            }, this);

            this.bugGroup.forEachAlive(function(bug) {
                if (this.game.math.distance(
                    this.game.input.activePointer.x, this.game.input.activePointer.y,
                    bug.x, bug.y) < 64) {
                    bug.frame = 2; // Show the "dead" texture
                    bug.body.velocity.y = this.game.rnd.integerInRange(-600, -1200);
                    bug.body.velocity.x = this.game.rnd.integerInRange(-500, 500);
                    bug.body.acceleration.y = 3000;
                    bug.angle = 180;

                    Config.killed.bugs++;
                    // Create an explosion
                    this.getExplosion(bug.x, bug.y);
                }
            }, this);

            // Rotate the lightning sprite so it goes in the
            // direction of the pointer
            this.lightning.rotation =
                this.game.math.angleBetween(
                    this.lightning.x, this.lightning.y,
                    this.game.input.activePointer.x, this.game.input.activePointer.y
            ) - Math.PI / 2;

            // Calculate the distance from the lightning source to the pointer
            var distance = this.game.math.distance(
                this.lightning.x, this.lightning.y,
                this.game.input.activePointer.x, this.game.input.activePointer.y
            );

            // Create the lightning texture
            this.createLightningTexture(this.lightningBitmap.width / 2, 0, 20, 3, false, distance);

            // Make the lightning sprite visible
            this.lightning.alpha = 1;

            // Fade out the lightning sprite using a tween on the alpha property.
            // Check out the "Easing function" examples for more info.
            this.game.add.tween(this.lightning)
                .to({
                    alpha: 0.5
                }, 100, Phaser.Easing.Bounce.Out)
                .to({
                    alpha: 1.0
                }, 100, Phaser.Easing.Bounce.Out)
                .to({
                    alpha: 0.5
                }, 100, Phaser.Easing.Bounce.Out)
                .to({
                    alpha: 1.0
                }, 100, Phaser.Easing.Bounce.Out)
                .to({
                    alpha: 0
                }, 250, Phaser.Easing.Cubic.In)
                .start();

            // Create the flash
            this.flash.alpha = 1;
            this.game.add.tween(this.flash)
                .to({
                    alpha: 0
                }, 100, Phaser.Easing.Cubic.In)
                .start();

            // Shake the camera by moving it up and down 5 times really fast
            this.game.camera.y = 0;
            this.game.add.tween(this.game.camera)
                .to({
                    y: -10
                }, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
                .start();
        }
    };

    GameState.prototype.createNewMonster = function() {
        var monster = this.monsterGroup.getFirstDead(); // Recycle a dead monster
        if (monster) {
            monster.reset(this.game.width + 100, this.game.height - 48); // Position on ground
            monster.revive(); // Set "alive"
            monster.body.velocity.setTo(0, 0); // Stop moving
            monster.body.acceleration.setTo(0, 0); // Stop accelerating
            monster.body.velocity.x = -100; // Move left
            monster.rotation = 0; // Reset rotation
            monster.frame = 0; // Set animation frame to 0
            monster.anchor.setTo(0.5, 0.5); // Center texture
            monster.animations.add('walk', [0, 1], 2);
            monster.animations.play('walk', 6, true);
        }
    };

    GameState.prototype.createNewBug = function() {
        var bug = this.bugGroup.getFirstDead(); // Recycle a dead monster
        if (bug) {
            //this.game.width +
            var ground_x = this.game.width + Math.round(Math.random() * this.game.width);
            //console.log('ground_x', ground_x);
            bug.reset(ground_x, this.game.height - 48); // Position on ground
            bug.revive(); // Set "alive"
            bug.body.velocity.setTo(0, 0); // Stop moving
            bug.body.acceleration.setTo(0, 0); // Stop accelerating
            bug.body.velocity.x = -300; // Move left
            bug.rotation = 0; // Reset rotation
            bug.frame = 0; // Set animation frame to 0
            bug.anchor.setTo(0.5, 0.5); // Center texture
            bug.animations.add('walk', [0, 1]);
            bug.animations.play('walk', 6, true);
        }
    };




    // Try to get a used explosion from the explosionGroup.
    // If an explosion isn't available, create a new one and add it to the group.
    // Setup new explosions so that they animate and kill themselves when the
    // animation is complete.
    GameState.prototype.getExplosion = function(x, y) {
        // Get the first dead explosion from the explosionGroup
        var explosion = this.explosionGroup.getFirstDead();

        // If there aren't any available, create a new one
        if (explosion === null) {
            explosion = this.game.add.sprite(0, 0, 'explosion');
            explosion.anchor.setTo(0.5, 0.5);

            // Add an animation for the explosion that kills the sprite when the
            // animation is complete. Plays the first frame several times to make the
            // explosion more visible after the screen flash.
            var animation = explosion.animations.add('boom', [0, 0, 0, 0, 1, 2, 3], 60, false);
            animation.killOnComplete = true;

            // Add the explosion sprite to the group
            this.explosionGroup.add(explosion);
        }

        //console.log('boom');

        // Revive the explosion (set it's alive property to true)
        // You can also define a onRevived event handler in your explosion objects
        // to do stuff when they are revived.
        explosion.revive();

        // Move the explosion to the given coordinates
        explosion.x = x;
        explosion.y = y;

        // Set rotation of the explosion at random for a little variety
        explosion.angle = this.game.rnd.integerInRange(0, 360);

        // Play the animation
        explosion.animations.play('boom');

        // Return the explosion itself in case we want to do anything else with it
        return explosion;
    };

    // This function creates a texture that looks like a lightning bolt
    GameState.prototype.createLightningTexture = function(x, y, segments, boltWidth, branch, distance) {
        // Get the canvas drawing context for the lightningBitmap
        var ctx = this.lightningBitmap.context;
        var width = this.lightningBitmap.width;
        var height = this.lightningBitmap.height;

        // Our lightning will be made up of several line segments starting at
        // the center of the top edge of the bitmap and ending at the target.

        // Clear the canvas
        if (!branch) ctx.clearRect(0, 0, width, height);

        // Draw each of the segments
        for (var i = 0; i < segments; i++) {
            // Set the lightning color and bolt width
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            ctx.lineWidth = boltWidth;

            ctx.beginPath();
            ctx.moveTo(x, y);

            // Calculate an x offset from the end of the last line segment and
            // keep it within the bounds of the bitmap
            if (branch) {
                // For a branch
                x += this.game.rnd.integerInRange(-10, 10);
            } else {
                // For the main bolt
                x += this.game.rnd.integerInRange(-30, 30);
            }
            if (x <= 10) x = 10;
            if (x >= width - 10) x = width - 10;

            // Calculate a y offset from the end of the last line segment.
            // When we've reached the target or there are no more segments left,
            // set the y position to the distance to the target. For branches, we
            // don't care if they reach the target so don't set the last coordinate
            // to the target if it's hanging in the air.
            if (branch) {
                // For a branch
                y += this.game.rnd.integerInRange(10, 20);
            } else {
                // For the main bolt
                y += this.game.rnd.integerInRange(20, distance / segments);
            }
            if ((!branch && i == segments - 1) || y > distance) {
                // This causes the bolt to always terminate at the center
                // lightning bolt bounding box at the correct distance to
                // the target. Because of the way the lightning sprite is
                // rotated, this causes this point to be exactly where the
                // player clicked or tapped.
                y = distance;
                if (!branch) x = width / 2;
            }

            // Draw the line segment
            ctx.lineTo(x, y);
            ctx.stroke();

            // Quit when we've reached the target
            if (y >= distance) break;

            // Draw a branch 20% of the time off the main bolt only
            if (!branch) {
                if (this.game.math.chanceRoll(20)) {
                    // Draws another, thinner, bolt starting from this position
                    this.createLightningTexture(x, y, 10, 1, true, distance);
                }
            }
        }

        // This just tells the engine it should update the texture cache
        this.lightningBitmap.dirty = true;
    };

    // Fragment shaders are small programs that run on the graphics card and alter
    // the pixels of a texture. Every framework implements shaders differently but
    // the concept is the same. This shader takes the lightning texture and alters
    // the pixels so that it appears to be glowing. Shader programming itself is
    // beyond the scope of this tutorial.
    //
    // There are a ton of good resources out there to learn it. Odds are that your
    // framework already includes many of the most popular shaders out of the box.
    //
    // This is an OpenGL/WebGL feature. Because it runs in your web browser
    // you need a browser that support WebGL for this to work.
    Phaser.Filter.Glow = function(game) {
        Phaser.Filter.call(this, game);

        this.fragmentSrc = [
            "precision lowp float;",
            "varying vec2 vTextureCoord;",
            "varying vec4 vColor;",
            'uniform sampler2D uSampler;',

            'void main() {',
            'vec4 sum = vec4(0);',
            'vec2 texcoord = vTextureCoord;',
            'for(int xx = -4; xx <= 4; xx++) {',
            'for(int yy = -3; yy <= 3; yy++) {',
            'float dist = sqrt(float(xx*xx) + float(yy*yy));',
            'float factor = 0.0;',
            'if (dist == 0.0) {',
            'factor = 2.0;',
            '} else {',
            'factor = 2.0/abs(float(dist));',
            '}',
            'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
            '}',
            '}',
            'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord);',
            '}'
        ];
    };

    Phaser.Filter.Glow.prototype = Object.create(Phaser.Filter.prototype);
    Phaser.Filter.Glow.prototype.constructor = Phaser.Filter.Glow;

    function init(scope, finish) {
        game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game');
        game.state.add('game', GameState, true);

        $scope = scope;
        finishGame = finish;
    };

    function destroy() {}

    // Setup game
    window['GameStage7'] = {
        init: init,
        destroy: destroy,
        game: {
            score: 0,
            finished: false
        },
        rules: "Kill that irritating bugs! KILL!!! And don't touch qute ponnies, they are your code =)"
    };

    res = window['GameStage7'].game;
})(window);