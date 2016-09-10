var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

function preload() {
    // http://finalbossblues.com/timefantasy/freebies/cats-and-dogs/
    game.load.spritesheet('pets', 'animals.png', 52, 72);

    // Original scenery spritesheet by Lanea Zimmerman; repack by Grimfist
    // http://opengameart.org/content/tiny-16-basic#comment-28830
    game.load.spritesheet('scenery', 'scenery.png', 32, 32);

    game.load.image('bark', 'bark.png');

    // https://freesound.org/people/Princess6537/sounds/144885/
    game.load.audio('bark', 'bark.mp3');
}

var player;
var cursors;
var keys;

function create() {
    game.world.setBounds(0, 0, 1600, 1200);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#6fa936';

    for (var i = 1; i <= 50; i++) {
        new GrassThick(game, game.world.randomX, game.world.randomY);
        new GrassThin(game, game.world.randomX, game.world.randomY);
        new Flowers(game, game.world.randomX, game.world.randomY);
    }

    for (var i = 1; i <= 10; i++) {
        new Bush(game, game.world.randomX, game.world.randomY);
        new RoundTree(game, game.world.randomX, game.world.randomY);
        new PineTree(game, game.world.randomX, game.world.randomY);
    }

    dogGrey = new GreyDog(game, 50, 50);
    dogYellow = new YellowDog(game, 100, 50);
    dogBrown = new BrownDog(game, 150, 50);
    dogTwoTone = new TwoToneDog(game, 200, 50);

    player = dogGrey;
    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    keys = game.input.keyboard.addKeys({run: Phaser.Keyboard.SHIFT, bark: Phaser.Keyboard.SPACEBAR});
    keys.bark.onDown.add(() => player.bark());
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

        this.weapon = game.add.weapon(1, 'bark');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        this.weapon.bulletKillDistance = 15;
        this.weapon.bulletAngleOffset = 90;
        this.weapon.bulletSpeed = 200;
        this.weapon.trackSprite(this);

        if (!Dog.all) {
            Dog.all = game.add.group();
        }
        Dog.all.add(this);

        this.baseMovementSpeed = 125;
        this.baseAnimationSpeed = 6;
        this.isRunning = false;
        this.facing = Phaser.ANGLE_DOWN;
    }

    bark() {
        var bark = game.add.audio('bark');
        bark.play();
        this.weapon.fireAngle = this.facing;

        if (this.facing === Phaser.ANGLE_UP) {
            this.weapon.trackOffset.x = this.body.offset.x + this.body.halfWidth;
            this.weapon.trackOffset.y = this.body.height;
        } else if (this.facing === Phaser.ANGLE_DOWN) {
            this.weapon.trackOffset.x = this.body.offset.x + this.body.halfWidth;
            this.weapon.trackOffset.y = this.height;
        } else if (this.facing === Phaser.ANGLE_LEFT) {
            this.weapon.trackOffset.x = this.body.offset.x;
            this.weapon.trackOffset.y = this.body.offset.y + this.body.halfHeight;
        } else if (this.facing === Phaser.ANGLE_RIGHT) {
            this.weapon.trackOffset.x = this.body.width + this.body.offset.x;
            this.weapon.trackOffset.y = this.body.offset.y + this.body.halfHeight;
        }

        this.weapon.fire();
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
            this.facing = Phaser.ANGLE_UP;
            this.body.velocity.y = -this.speed;
        } else if (this.isMovingSouth) {
            if (this.isMovingEast) {
                this.body.velocity.x = this.speed;
            } else  if (this.isMovingWest) {
                this.body.velocity.x = -this.speed;
            }
            this.play('walk-south');
            this.facing = Phaser.ANGLE_DOWN;
            this.body.velocity.y = this.speed;
        } else if (this.isMovingWest) {
            this.play('walk-west');
            this.facing = Phaser.ANGLE_LEFT;
            this.body.velocity.x = -this.speed;
        } else if (this.isMovingEast) {
            this.play('walk-east');
            this.facing = Phaser.ANGLE_RIGHT;
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

class Scenery extends Phaser.Sprite {
    constructor(game, x, y, frame) {
        super(game, x, y, 'scenery', frame);
        game.physics.arcade.enable(this);
        this.body.immovable = true;

        this.smoothed = false;
        if (!Scenery.all) {
            Scenery.all = game.add.group();
        }
        Scenery.all.add(this);
    }

    update() {
        game.physics.arcade.collide(this, Dog.all);
    }
}

class Bush extends Scenery {
    constructor(game, x, y) {
        super(game, x, y, 40);
    }
}


class RoundTree extends Scenery {
    constructor(game, x, y) {
        super(game, x, y, 24);
    }
}

class PineTree extends Scenery {
    constructor(game, x, y) {
        super(game, x, y, 25);
    }
}

class GrassThick extends Scenery {
    constructor(game, x, y) {
        super(game, x, y, 31);
        delete this.body;
    }
}

class GrassThin extends Scenery {
    constructor(game, x, y) {
        super(game, x, y, 46);
        delete this.body;
    }
}

class Flowers extends Scenery {
    constructor(game, x, y) {
        super(game, x, y, 47);
        delete this.body;
    }
}
