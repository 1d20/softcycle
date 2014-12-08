(function(window) {
    var game;
    var $scope;
    var finished;
    var finishGame;

    function setGlobalRating() {
        return {
            Rate_Bad: 0,
            Rate_Good: 0,
            MISSLE_SPEED: 250
        }
    }

    var GlobalRating;

    var stateText;

    var GameState = function(game) {
        this.MAX_MISSILES_GOOD = 0.7; // number of missiles
        this.MAX_MISSILES_BAD = 0.7; // number of missiles
        this.MAX_MISSILES = 20;
        this.TIMER_MAX = 60000; //60 sec?
        this.TIMER_NOW = 0;
    };

    // Load images and sounds
    GameState.prototype.preload = function() {
        this.game.load.image('good_rocket', '/static/frontend/images/games/risks/r2.png');
        this.game.load.image('bad_rocket', '/static/frontend/images/games/risks/r1.png');
        this.game.load.image('smoke', '/static/frontend/images/games/risks/ss.png');
        this.game.load.audio('sfx', '/static/frontend/sounds/risks/explode2.wav');

        this.game.load.spritesheet('explosion', '/static/frontend/images/games/risks/explode.png', 64, 64);
    };

    // Setup the example
    GameState.prototype.create = function() {
        // Set stage background to something sky colored
        this.game.stage.backgroundColor = 0x4488cc;

        fx = game.add.audio('sfx');
        fx.allowMultiple = true;

        fx.addMarker('explode', 1, 1.0);
        // Create a group to hold the missile
        this.missileGroup = this.game.add.group();
        //console.log(this.missileGroup);
        // Create a group for explosions
        this.explosionGroup = this.game.add.group();

        // Simulate a pointer click/tap input at the center of the stage
        // when the example begins running.
        this.game.input.activePointer.x = this.game.width / 2;
        this.game.input.activePointer.y = this.game.height / 2 - 100;

        // Add FPS
        this.game.time.advancedTiming = true;
        this.fpsText = this.game.add.text(20, 20, '', {
            font: '16px Arial',
            fill: '#ffffff'
        });

        this.timerText = this.game.add.text(this.game.width - 200, 20, '', {
            font: '16px Arial',
            fill: '#ffffff'
        });

        //  Create our Timer
        this.timer = game.time.create(true);

        //  Set a TimerEvent to occur after 2 seconds
        this.timer.loop(this.TIMER_MAX, timeIsOut, this);

        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        this.timer.start();

        this.timerGamif = game.time.create(true);
        this.timerGamif.loop(this.TIMER_MAX / 6, timeUpd, this);
        this.timerGamif.start();

        stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
            font: '84px Arial',
            fill: '#fff'
        });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;

    };

    function timeIsOut() {
        window['GameStage2'].game.score = GlobalRating.Rate_Good - GlobalRating.Rate_Bad;
        window['GameStage2'].game.finished = true;

        $scope.$digest();

        finishGame();

        stateText.text = " Time is up!\n Your Highscore: " + window['GameStage2'].game.score;
        stateText.visible = true;
        this.game.paused = true;
    }

    function timeUpd() {
        GlobalRating.MISSLE_SPEED *= 1.2;
    }

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

    // The update() method is called every frame
    GameState.prototype.update = function() {
        if (this.game.time.fps !== 0) {
            var rate = GlobalRating.Rate_Good - GlobalRating.Rate_Bad;
            //console.log(GlobalRating.Rate_Good, GlobalRating.Rate_Bad);
            this.fpsText.setText('Highscore: ' + rate);
            updateTimer(this);
        }

        // If there are fewer than MAX_MISSILES, launch a new one
        if (this.missileGroup.countLiving() < this.MAX_MISSILES) {
            // Set the launch point to a random location below the bottom edge
            // of the stage
            var missele_good_count = 0;
            var missele_bad_count = 0;
            this.missileGroup.forEachAlive(function(m) {
                m.type ? missele_good_count++ : missele_bad_count++
            });
            var type = null;
            if (missele_bad_count < Math.round(this.MAX_MISSILES * this.MAX_MISSILES_BAD))
                type = false;
            this.launchMissile(this.game.rnd.integerInRange(50, this.game.width - 50),
                this.game.height + 50, type);
            if (missele_good_count < Math.round(this.MAX_MISSILES * this.MAX_MISSILES_GOOD))
                type = true;
            this.launchMissile(this.game.rnd.integerInRange(50, this.game.width - 50),
                this.game.height + 50, type);
        }

        // If any missile is within a certain distance of the mouse pointer, blow it up
        this.missileGroup.forEachAlive(function(m) {
            var distance = this.game.math.distance(m.x, m.y,
                this.game.input.activePointer.x, this.game.input.activePointer.y);
            if (distance < 50) {
                m.kill();
                this.getExplosion(m.x, m.y);
                if (m.is_good)
                    GlobalRating.Rate_Good++;
                else
                    GlobalRating.Rate_Bad++;
                fx.play('explode');
                //console.log('forEachAlive', GlobalRating.Rate_Good, GlobalRating.Rate_Bad);
            }
        }, this);

        if (stateText.visible == true)
            game.destroy();
    };

    // Try to get a missile from the missileGroup
    // If a missile isn't available, create a new one and add it to the group.
    GameState.prototype.launchMissile = function(x, y, _type) {
        // // Get the first dead missile from the missileGroup
        this.missileGroup.remove(this.missileGroup.getFirstDead());
        var missile = null;
        var type = Math.round(Math.random() % 1) == 1 ? true : false;
        if (_type != null)
            type = _type;
        //console.log('launchMissile',type);
        // If there aren't any available, create a new one
        if (missile === null) {
            missile = new Missile(this.game, type);
            this.missileGroup.add(missile);
        }

        // Revive the missile (set it's alive property to true)
        // You can also define a onRevived event handler in your explosion objects
        // to do stuff when they are revived.
        missile.revive();

        // Move the missile to the given coordinates
        missile.x = x;
        missile.y = y;

        return missile;
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
            // animation is complete
            var animation = explosion.animations.add('boom', [0, 1, 2, 3], 64, false);
            animation.killOnComplete = true;

            // Add the explosion sprite to the group
            this.explosionGroup.add(explosion);
        }

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

    // Missile constructor
    var Missile = function(game, type, x, y) {
        this.game = game;
        this.is_good = type;
        //console.log('Missile', this.is_good);
        if (this.is_good) {
            Phaser.Sprite.call(this, game, x, y, 'good_rocket');
        } else {
            Phaser.Sprite.call(this, game, x, y, 'bad_rocket');
        }
        // Set the pivot point for this sprite to the center
        this.anchor.setTo(0.5, 0.5);

        // Enable physics on the missile
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        // Define constants that affect motion
        this.SPEED = GlobalRating.MISSLE_SPEED; // missile speed pixels/second
        this.TURN_RATE = 5; // turn rate in degrees/frame
        this.WOBBLE_LIMIT = 15; // degrees
        this.WOBBLE_SPEED = 250; // milliseconds
        this.SMOKE_LIFETIME = 6000; // milliseconds
        this.AVOID_DISTANCE = 60; // pixels

        // Create a variable called wobble that tweens back and forth between
        // -this.WOBBLE_LIMIT and +this.WOBBLE_LIMIT forever
        this.wobble = this.WOBBLE_LIMIT;
        this.game.add.tween(this)
            .to({
                    wobble: -this.WOBBLE_LIMIT
                },
                this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0,
                Number.POSITIVE_INFINITY, true
        );

        // Add a smoke emitter with 100 particles positioned relative to the
        // bottom center of this missile
        this.smokeEmitter = this.game.add.emitter(0, 0, 100);

        // Set motion parameters for the emitted particles
        this.smokeEmitter.gravity = 0;
        this.smokeEmitter.setXSpeed(0, 0);
        this.smokeEmitter.setYSpeed(-80, -50); // make smoke drift upwards

        // Make particles fade out after 1000ms
        this.smokeEmitter.setAlpha(1, 0, this.SMOKE_LIFETIME,
            Phaser.Easing.Linear.InOut);

        // Create the actual particles
        this.smokeEmitter.makeParticles('smoke');

        // Start emitting smoke particles one at a time (explode=false) with a
        // lifespan of this.SMOKE_LIFETIME at 50ms intervals
        this.smokeEmitter.start(false, this.SMOKE_LIFETIME, 50);

        // Create a point object to hold the position of the smoke emitter relative
        // to the center of the missile. See update() below.
        this.smokePosition = new Phaser.Point(this.width / 2, 0);
    };

    // Missiles are a type of Phaser.Sprite
    Missile.prototype = Object.create(Phaser.Sprite.prototype);
    Missile.prototype.constructor = Missile;

    Missile.prototype.update = function() {
        // If this missile is dead, don't do any of these calculations
        // Also, turn off the smoke emitter
        if (!this.alive) {
            this.smokeEmitter.on = false;
            return;
        } else {
            this.smokeEmitter.on = true;
        }

        // Rotate the point representing the relative position of the emitter around
        // the center of the missile.
        var p = this.smokePosition.rotate(0, 0, this.rotation);

        // Position the smoke emitter at the new coordinates relative to the center
        // of the missile

        this.smokeEmitter.x = this.x - p.x;
        this.smokeEmitter.y = this.y - p.y;

        // Calculate the angle from the missile to the mouse cursor game.input.x
        // and game.input.y are the mouse position; substitute with whatever
        // target coordinates you need.
        var targetAngle = this.game.math.angleBetween(
            this.x, this.y,
            this.game.input.activePointer.x, this.game.input.activePointer.y
        );

        // Add our "wobble" factor to the targetAngle to make the missile wobble
        // Remember that this.wobble is tweening (above)
        targetAngle += this.game.math.degToRad(this.wobble);


        // Make each missile steer away from other missiles.
        // Each missile knows the group that it belongs to (missileGroup).
        // It can calculate its distance from all other missiles in the group and
        // steer away from any that are too close. This avoidance behavior prevents
        // all of the missiles from bunching up too tightly and following the
        // same track.
        var avoidAngle = 0;
        this.parent.forEachAlive(function(m) {
            // Don't calculate anything if the other missile is me
            if (this == m) return;

            // Already found an avoidAngle so skip the rest
            if (avoidAngle !== 0) return;

            // Calculate the distance between me and the other missile
            var distance = this.game.math.distance(this.x, this.y, m.x, m.y);

            // If the missile is too close...
            if (distance < this.AVOID_DISTANCE) {
                // Chose an avoidance angle of 90 or -90 (in radians)
                avoidAngle = Math.PI / 2; // zig
                if (this.game.math.chanceRoll(50)) avoidAngle *= -1; // zag
            }
        }, this);

        // Add the avoidance angle to steer clear of other missiles
        targetAngle += avoidAngle;

        // Gradually (this.TURN_RATE) aim the missile towards the target angle
        if (this.rotation !== targetAngle) {
            // Calculate difference between the current angle and targetAngle
            var delta = targetAngle - this.rotation;

            // Keep it in range from -180 to 180 to make the most efficient turns.
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;

            if (delta > 0) {
                // Turn clockwise
                this.angle += this.TURN_RATE;
            } else {
                // Turn counter-clockwise
                this.angle -= this.TURN_RATE;
            }

            // Just set angle to target angle if they are close
            if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
                this.rotation = targetAngle;
            }
        }

        // Calculate velocity vector based on this.rotation and this.SPEED
        this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
        this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;


    };

    function init(scope, finish) {
        destroy();

        GlobalRating = setGlobalRating();
        game = new Phaser.Game(900, 600, Phaser.AUTO, 'game');
        game.state.add('game', GameState, true);

        $scope = scope;
        finishGame = finish;
    };

    function destroy() {
        if (game) {
            game.destroy();
        };
    }

    window['GameStage2'] = {
        init: init,
        game: {
            score: 0,
            finished: 0
        },
        destroy: destroy,
        rules: "Try to stay away from risks! And don't forget to pick up some benefits =)"
    };

})(window);