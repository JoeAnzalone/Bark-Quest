var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

function preload() {
    // http://finalbossblues.com/timefantasy/freebies/cats-and-dogs/
    game.load.spritesheet('pets', 'animals.png', 52, 72);

    // https://freesound.org/people/Princess6537/sounds/144885/
    game.load.audio('bark', 'bark.mp3');
}

var player;
var cursors;
var keys;

function create() {
    game.world.setBounds(0, 0, 1600, 1200);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#168a14';

    dogGrey = new GreyDog(game, 50, 50);
    dogYellow = new YellowDog(game, 100, 50);
    dogBrown = new BrownDog(game, 150, 50);
    dogTwoTone = new TwoToneDog(game, 200, 50);

    player = dogGrey;
    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    keys = game.input.keyboard.addKeys({run: Phaser.Keyboard.SHIFT, bark: Phaser.Keyboard.SPACEBAR});
    keys.bark.onDown.add(player.bark);
}

function update() {
    player.isRunning = keys.run.isDown;
    player.isMovingWest = cursors.left.isDown;
    player.isMovingEast = cursors.right.isDown;
    player.isMovingNorth = cursors.up.isDown;
    player.isMovingSouth = cursors.down.isDown;
}

class Dog extends Phaser.Sprite {
    constructor(game, x, y, frame) {
        super(game, x, y, 'pets', frame);
        game.physics.arcade.enable(this);

        this.smoothed = false;
        this.body.collideWorldBounds = true;
        this.body.setSize(30, 36, 10, 35);

        this.animations.add('walk-south', [0, 1, 2, 1], 6, true);
        this.animations.add('walk-west', [12, 13, 14, 13], 6, true);
        this.animations.add('walk-east', [24, 25, 26, 25], 6, true);
        this.animations.add('walk-north', [36, 37, 38, 37], 6, true);

        game.stage.addChild(this);
        if (!Dog.all) {
            Dog.all = game.add.group();
        }
        Dog.all.add(this);

        this.baseMovementSpeed = 125;
        this.baseAnimationSpeed = 6;
        this.isRunning = false;
    }

    bark() {
        var bark = game.add.audio('bark');
        bark.play();
    }

    update() {
        this.body.velocity.set(0);

        this.speed = this.isRunning ? this.baseMovementSpeed * 1.75 : this.baseMovementSpeed;
        this.animations.currentAnim.speed = this.isRunning ? this.baseAnimationSpeed * 1.75 : this.baseAnimationSpeed;

        if (!this.isMovingWest && !this.isMovingEast && !this.isMovingNorth && !this.isMovingSouth) {
            this.animations.stop();
        }

        if (this.isMovingNorth) {
            if (this.isMovingEast) {
                this.body.velocity.x = this.speed;
            } else  if (this.isMovingWest) {
                this.body.velocity.x = -this.speed;
            }
            this.play('walk-north');
            this.body.velocity.y = -this.speed;
        } else if (this.isMovingSouth) {
            if (this.isMovingEast) {
                this.body.velocity.x = this.speed;
            } else  if (this.isMovingWest) {
                this.body.velocity.x = -this.speed;
            }
            this.play('walk-south');
            this.body.velocity.y = this.speed;
        } else if (this.isMovingWest) {
            this.play('walk-west');
            this.body.velocity.x = -this.speed;
        } else if (this.isMovingEast) {
            this.play('walk-east');
            this.body.velocity.x = this.speed;
        }

        game.physics.arcade.collide(Dog.all);
    }
}

class GreyDog extends Dog {
    constructor(game, x, y) {
        super(game, x, y, 0);
        this.animations.add('walk-south', [0, 1, 2, 1], 6, true);
        this.animations.add('walk-west', [12, 13, 14, 13], 6, true);
        this.animations.add('walk-east', [24, 25, 26, 25], 6, true);
        this.animations.add('walk-north', [36, 37, 38, 37], 6, true);
    }
}

class YellowDog extends Dog {
    constructor(game, x, y) {
        super(game, x, y, 3);
        this.animations.add('walk-south', [3, 4 , 5, 4], 6, true);
        this.animations.add('walk-west', [15, 16, 17, 16], 6, true);
        this.animations.add('walk-east', [27, 28, 29, 28], 6, true);
        this.animations.add('walk-north', [39, 40, 41, 40], 6, true);
    }
}

class BrownDog extends Dog {
    constructor(game, x, y) {
        super(game, x, y, 6);
        this.animations.add('walk-south', [6, 7, 8, 7], 6, true);
        this.animations.add('walk-west', [18, 19, 20 ,19], 6, true);
        this.animations.add('walk-east', [30, 31, 32, 31], 6, true);
        this.animations.add('walk-north', [42, 43, 44, 43], 6, true);
    }
}

class TwoToneDog extends Dog {
    constructor(game, x, y) {
        super(game, x, y, 9);
        this.animations.add('walk-south', [9, 10, 11, 10], 6, true);
        this.animations.add('walk-west', [21, 22, 23, 22], 6, true);
        this.animations.add('walk-east', [33, 34, 35, 34], 6, true);
        this.animations.add('walk-north', [45, 46, 47, 46], 6, true);
    }
}
