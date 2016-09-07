var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

function preload() {
    // http://finalbossblues.com/timefantasy/freebies/cats-and-dogs/
    game.load.spritesheet('pets', 'animals.png', 52, 72);
}

var player;
var cursors;
var shiftKey;
var allDogs;

function create() {
    game.world.setBounds(0, 0, 1600, 1200);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#168a14';

    dogGrey = new GreyDog(game, 50, 50);
    dogYellow = new YellowDog(game, 100, 50);
    dogBrown = new BrownDog(game, 150, 50);
    dogTwoTone = new TwoToneDog(game, 200, 50);

    player = dogGrey;
    player.body.immovable = false;
    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    allDogs = game.add.group();
    allDogs.addMultiple([dogGrey, dogYellow, dogBrown, dogTwoTone]);
}

function update() {
    player.body.velocity.set(0);

    if (shiftKey.isDown) {
        player.speed = player.baseMovementSpeed * 1.75;
        player.animations.currentAnim.speed = player.baseAnimationSpeed * 1.75;
    } else {
        player.speed = player.baseMovementSpeed;
        player.animations.currentAnim.speed = player.baseAnimationSpeed;
    }

    if (cursors.left.isUp && cursors.right.isUp && cursors.up.isUp && cursors.down.isUp) {
        player.animations.stop();
    }

    if (cursors.up.isDown) {
        if (cursors.right.isDown) {
            player.body.velocity.x = player.speed;
        } else  if (cursors.left.isDown) {
            player.body.velocity.x = -player.speed;
        }
        player.play('walk-north');
        player.body.velocity.y = -player.speed;
    } else if (cursors.down.isDown) {
        if (cursors.right.isDown) {
            player.body.velocity.x = player.speed;
        } else  if (cursors.left.isDown) {
            player.body.velocity.x = -player.speed;
        }
        player.play('walk-south');
        player.body.velocity.y = player.speed;
    } else if (cursors.left.isDown) {
        player.play('walk-west');
        player.body.velocity.x = -player.speed;
    } else if (cursors.right.isDown) {
        player.play('walk-east');
        player.body.velocity.x = player.speed;
    }

    game.physics.arcade.collide(allDogs);
}

class Dog extends Phaser.Sprite {
    constructor(game, x, y, frame) {
        super(game, x, y, 'pets', frame);
        game.physics.arcade.enable(this);
        this.body.immovable = true;

        this.smoothed = false;
        this.body.collideWorldBounds = true;
        this.body.setSize(30, 36, 10, 35);

        this.animations.add('walk-south', [0, 1, 2, 1], 6, true);
        this.animations.add('walk-west', [12, 13, 14, 13], 6, true);
        this.animations.add('walk-east', [24, 25, 26, 25], 6, true);
        this.animations.add('walk-north', [36, 37, 38, 37], 6, true);

        game.stage.addChild(this);

        this.baseMovementSpeed = 125;
        this.baseAnimationSpeed = 6;
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
