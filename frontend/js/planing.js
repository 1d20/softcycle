(function(window) {
    var $scope;
    var game;
    var gameFinished;
    var Config = {
        gravity: 400,
        timerMax: 10000, //60sec
        maxCount: {
            budget: 10,
            time: 10,
            staff: 10,
            problem:10
        },
        got: {
            budget: 0,
            time: 0,
            staff: 0,
            problem:0
        }
    };

    var GameState = function(game) {};

    // Load images and sounds
    GameState.prototype.preload = function() {
        this.game.load.image('ground', '/static/frontend/images/games/planing/ground.png');
        this.game.load.spritesheet('explosion', '/static/frontend/images/games/planing/explode.png', 64, 64, 4);
        this.game.load.spritesheet('bullet', '/static/frontend/images/games/planing/bullet.png', 80, 80, 4);
        this.game.load.spritesheet('cannon', '/static/frontend/images/games/planing/cannon.png', 122, 80, 5);
        this.game.load.spritesheet('budget', '/static/frontend/images/games/planing/budget.png', 33,33, 4);
        this.game.load.spritesheet('time', '/static/frontend/images/games/planing/time.png', 40, 60, 4);
        this.game.load.spritesheet('staff', '/static/frontend/images/games/planing/staff.png', 64, 64, 4);
        this.game.load.spritesheet('problem', '/static/frontend/images/games/planing/problem.png', 32, 32, 3);
        this.game.load.image('background', '/static/frontend/images/games/planing/background.png');
    };

    // Setup the example
    GameState.prototype.create = function() {
        //game = this.game; 
        // Set stage background color
        this.game.stage.backgroundColor = 0x4488cc;

        this.game.add.sprite(0,0, 'background');
        this.budgetTimer = 0;
        this.timeTimer = 0;
        this.staffTimer = 0;
        this.problemTimer = 0;
        

        // Define constants
        this.SHOT_DELAY = 300; // milliseconds (10 bullets/3 seconds)
        this.BULLET_SPEED = 800; // pixels/second
        this.NUMBER_OF_BULLETS = 20;
        this.GRAVITY = Config.gravity; // pixels/second/second

        // Create an object representing our gun
        this.gun = this.game.add.sprite(40, this.game.height / 2 - 20, 'cannon');

        this.gun.animations.add('shoot');
        // Set the pivot point to the center of the gun
        this.gun.anchor.setTo(0.5, 0.5);

        // Create an object pool of bullets
        this.bulletPool = this.game.add.group();


        //  Create our Timer
        this.timer = game.time.create(true);

        //  Set a TimerEvent to occur after 2 seconds
        this.timer.loop(Config.timerMax, timeIsOut, this);

        //  Start the timer running - this is important!
        //  It won't start automatically, allowing you to hook it to button events and the like.
        this.timer.start();
        


        for (var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
            // Create each bullet and add it to the group.
            var bullet = this.game.add.sprite(-64, -64, 'bullet');

            bullet.animations.add('fly');

            this.bulletPool.add(bullet);
            //animation.killOnComplete = true;
            // Set its pivot point to the center of the bullet
            bullet.anchor.setTo(0.5, 0.5);

            // Enable physics on the bullet
            this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

            // Set its initial state to "dead".
            bullet.kill();
        }

        // Turn on gravity
        game.physics.arcade.gravity.y = this.GRAVITY;

        // Create some ground
        this.ground = this.game.add.group();
        for (var x = 0; x < this.game.width; x += 32) {
            // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height, 'ground');
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }

        this.problemGroup = this.game.add.group();
        
        for (var i = 0; i < Config.maxCount.problem; i++) {
            var problem = this.game.add.sprite(Math.random() * (this.game.width - 200) + 200, -100,  'problem');
            problem.animations.add('fly_problem');
            problem.animations.play('fly_problem', 5888, true);
            this.problemGroup.add(problem);
            this.game.physics.enable(problem, Phaser.Physics.ARCADE);
            problem.kill();
        }
        
        this.budgetGroup = this.game.add.group();
        
        for (var i = 0; i < Config.maxCount.budget; i++) {
            var budget = this.game.add.sprite(Math.random() * (this.game.width - 200) + 200, -100,  'budget');
            budget.animations.add('fly_budget');
            budget.animations.play('fly_budget', 20, true);
            this.budgetGroup.add(budget);
            this.game.physics.enable(budget, Phaser.Physics.ARCADE);
            budget.kill();
        }

        this.timeGroup = this.game.add.group();
        
        for (var i = 0; i < Config.maxCount.time; i++) {
            var time = this.game.add.sprite(Math.random() * (this.game.width - 200) + 200, -100,  'time');
            time.animations.add('fly_time');
            time.animations.play('fly_time', 20, true);
            this.timeGroup.add(time);
            this.game.physics.enable(time, Phaser.Physics.ARCADE);
            time.kill();
        }


        this.staffGroup = this.game.add.group();
        
        for (var i = 0; i < Config.maxCount.staff; i++) {
            var staff = this.game.add.sprite(Math.random() * (this.game.width - 200) + 200, -100,  'staff');
            staff.animations.add('fly_staff');
            staff.animations.play('fly_staff', 20, true);
            this.staffGroup.add(staff);
            this.game.physics.enable(staff, Phaser.Physics.ARCADE);
            staff.kill();
        }



        //this.budgetGroup.createMultiple(Config.maxCount.budget, 'monster', 0);

        // Create a group for explosions
        this.explosionGroup = this.game.add.group();

        // Simulate a pointer click/tap input at the center of the stage
        // when the example begins running.
        this.game.input.activePointer.x = this.game.width / 2;
        this.game.input.activePointer.y = this.game.height / 2 - 100;

        // Show FPS
        this.game.time.advancedTiming = true;
        /*this.fpsText = this.game.add.text(
            20, 20, '', {
                font: '16px Arial',
                fill: '#ffffff'
            }
        );*/

        this.highscoreText = this.game.add.text(
            this.game.width - 240, 20, '', {
                font: '16px Arial',
                fill: '#777'
            }
        );

        this.timerText = this.game.add.text(
            20, 20, '', {
                font: '16px Arial',
                fill: '#777'
            }
        );
        this.stateText = game.add.text(game.world.centerX/2, game.world.centerY/4, ' ', {
            font: '84px Arial',
            fill: '#222'
        });
        this.stateText.visible = false;

    };

    function timeIsOut() {
        window['GameStage3'].game.score = Config.got.budget + Config.got.time + Config.got.staff - Config.got.problem;
        window['GameStage3'].game.finished = true;
        $scope.$digest();

        gameFinished();
        
        this.stateText.text = " Time is up!\n Your Highscore: " +"\n Budget: " + Config.got.budget + "\n Time: " + Config.got.time + "\n Staff: " + Config.got.staff+"\n Problems: " + Config.got.problem;
        this.stateText.visible = true;
        game.paused = true;
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

    GameState.prototype.shootBullet = function() {
       
        //console.log(this.gun);
        this.gun.animations.play('shoot', 20, false);
        // Enforce a short delay between shots by recording
        // the time that each bullet is shot and testing if
        // the amount of time since the last shot is more than
        // the required delay.
        if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
        if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
        this.lastBulletShotAt = this.game.time.now;

        // Get a dead bullet from the pool
        var bullet = this.bulletPool.getFirstDead();

        // If there aren't any bullets available then don't shoot
        if (bullet === null || bullet === undefined) return;

        // Revive the bullet
        // This makes the bullet "alive"
        bullet.revive();

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;

        // Set the bullet position to the gun position.
        bullet.reset(this.gun.x, this.gun.y);
        bullet.rotation = this.gun.rotation;

        // Shoot it in the right direction
        bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
        bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;

        bullet.animations.play('fly', 10, true);
    };



    // The update() method is called every frame
    GameState.prototype.update = function() {
        if(this.highscoreText)
            this.highscoreText.setText("Budget: " + Config.got.budget + "\nTime: " + Config.got.time + "\nStaff: " + Config.got.staff + "\nProblem: " + Config.got.problem);
        if(this.timerText)
            updateTimer(this);

        this.budgetTimer -= this.game.time.elapsed;
        if (this.budgetTimer <= 0) {
            this.budgetTimer = this.game.rnd.integerInRange(150, 500);
            this.createNewBudget();

        }

        this.timeTimer -= this.game.time.elapsed;
        if (this.timeTimer <= 0) {
            this.timeTimer = this.game.rnd.integerInRange(150, 500);
            this.createNewTime();

        }

        this.staffTimer -= this.game.time.elapsed;
        if (this.staffTimer <= 0) {
            this.staffTimer = this.game.rnd.integerInRange(150, 500);
            this.createNewStaff();

        }

        this.problemTimer -= this.game.time.elapsed;
        if (this.problemTimer <= 0) {
            this.problemTimer = this.game.rnd.integerInRange(150, 500);
            this.createNewProblem();

        }

        /*if (this.game.time.fps !== 0) {
            this.fpsText.setText(this.game.time.fps + ' FPS');
        }*/

        // Check if bullets have collided with the ground
        this.game.physics.arcade.collide(this.bulletPool, this.ground, function(bullet, ground) {
            // Create an explosion
            this.getExplosion(bullet.x, bullet.y);

            // Kill the bullet
            bullet.kill();
        }, null, this);

        

        this.game.physics.arcade.collide(this.bulletPool, this.budgetGroup, function(bullet, budget) {
            // Create an explosion
            this.getExplosion(bullet.x, bullet.y);

            Config.got.budget++;
            // Kill the bullet
            bullet.kill();
            budget.kill();
        }, null, this);

        this.game.physics.arcade.collide(this.bulletPool, this.timeGroup, function(bullet, time) {
            // Create an explosion
            this.getExplosion(bullet.x, bullet.y);
            Config.got.time++;
            // Kill the bullet
            bullet.kill();
            time.kill();
        }, null, this);

        this.game.physics.arcade.collide(this.bulletPool, this.staffGroup, function(bullet, staff) {
            // Create an explosion
            this.getExplosion(bullet.x, bullet.y);
            Config.got.staff++;
            // Kill the bullet
            bullet.kill();
            staff.kill();
        }, null, this);

        this.game.physics.arcade.collide(this.bulletPool, this.problemGroup, function(bullet, problem) {
            // Create an explosion
            this.getExplosion(bullet.x, bullet.y);

            Config.got.problem++;
            // Kill the bullet
            bullet.kill();
            problem.kill();
        }, null, this);


        this.staffGroup.forEachAlive(function(staff) {
            if (staff.x < -64) {
                staff.kill();
            }
            if (staff.y > this.game.height) {
                staff.kill();
            }
        }, this);

        this.problemGroup.forEachAlive(function(problem) {
            if (problem.x < -64) {
                problem.kill();
            }
            if (problem.y > this.game.height) {
                problem.kill();
            }
        }, this);

        this.budgetGroup.forEachAlive(function(budget) {
            if (budget.x < -64) {
                budget.kill();
            }
            if (budget.y > this.game.height) {
                budget.kill();
            }
        }, this);

        this.timeGroup.forEachAlive(function(time) {
            if (time.x < -64) {
                time.kill();
            }
            if (time.y > this.game.height) {
                time.kill();
            }
        }, this);

        // Rotate all living bullets to match their trajectory
        this.bulletPool.forEachAlive(function(bullet) {
            bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
        }, this);

        // Aim the gun at the pointer.
        // All this function does is calculate the angle using
        // Math.atan2(yPointer-yGun, xPointer-xGun)
        this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);

        // Shoot a bullet
        if (this.game.input.activePointer.isDown) {
            this.shootBullet();
        }
    };

    GameState.prototype.createNewProblem = function() {
        var problem = this.problemGroup.getFirstDead(); // Recycle a dead problem
        if (problem) {
            problem.reset(Math.random() * (this.game.width - 200) + 200, -100); // Position on ground
            problem.revive(); // Set "alive"
            problem.animations.add('fly_problem');
            problem.animations.play('fly_problem', 5, true);
        }
    };

    GameState.prototype.createNewBudget = function() {
        var budget = this.budgetGroup.getFirstDead(); // Recycle a dead budget
        if (budget) {
            budget.reset(Math.random() * (this.game.width - 200) + 200, -100); // Position on ground
            budget.revive(); // Set "alive"
            budget.animations.add('fly_budget');
            budget.animations.play('fly_budget', 5, true);
        }
    };

    GameState.prototype.createNewTime = function() {
        var time = this.timeGroup.getFirstDead(); // Recycle a dead time
        if (time) {
            time.reset(Math.random() * (this.game.width - 200) + 200, -100); // Position on ground
            time.revive(); // Set "alive"
            time.animations.add('fly_time');
            time.animations.play('fly_time', 5, true);
        }
    };

    GameState.prototype.createNewStaff = function() {
        var staff = this.staffGroup.getFirstDead(); // Recycle a dead staff
        if (staff) {
            staff.reset(Math.random() * (this.game.width - 200) + 200, -100); // Position on ground
            staff.revive(); // Set "alive"
            staff.animations.add('fly_staff');
            staff.animations.play('fly_staff', 5, true);
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

    // Setup game
    window['GameStage3'] = {
        init: function GameStage3(scope, finish) {
            game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game');
            game.state.add('game', GameState, true);
            $scope = scope;
            gameFinished = finish;
        },
        destroy: function destroy(){},
        game: {
            score: 0,
            finished: false
        },
        rules: "You have to find some staff, money and time!! But there are some problems...."
    };

})(window);