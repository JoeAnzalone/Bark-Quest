var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

function preload() {
    // http://finalbossblues.com/timefantasy/freebies/cats-and-dogs/
    game.load.spritesheet('pets', 'animals.png', 52, 72);
}

var player;
var cursors;
var shiftKey;

function create() {
    game.world.setBounds(0, 0, 1600, 1200);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#168a14';

    dogGrey = game.add.sprite(50, 50, 'pets', 0);
    dogGrey.smoothed = false;
    game.physics.arcade.enable(dogGrey);
    dogGrey.body.collideWorldBounds = true;
    dogGrey.body.setSize(30, 36, 10, 35);
    dogGrey.animations.add('walk-south', [0, 1, 2, 1], 6, true);
    dogGrey.animations.add('walk-west', [12, 13, 14, 13], 6, true);
    dogGrey.animations.add('walk-east', [24, 25, 26, 25], 6, true);
    dogGrey.animations.add('walk-north', [36, 37, 38, 37], 6, true);


    dogYellow = game.add.sprite(100, 50, 'pets', 3);
    dogYellow.smoothed = false;
    game.physics.arcade.enable(dogYellow);
    dogYellow.body.collideWorldBounds = true;
    dogYellow.body.setSize(30, 36, 10, 35);
    dogYellow.animations.add('walk-south', [3, 4 , 5, 4], 6, true);
    dogYellow.animations.add('walk-west', [15, 16, 17, 16], 6, true);
    dogYellow.animations.add('walk-east', [27, 28, 29, 28], 6, true);
    dogYellow.animations.add('walk-north', [39, 40, 41, 40], 6, true);

    dogBrown = game.add.sprite(150, 50, 'pets', 6);
    dogBrown.smoothed = false;
    game.physics.arcade.enable(dogBrown);
    dogBrown.body.collideWorldBounds = true;
    dogBrown.body.setSize(30, 36, 10, 35);
    dogBrown.animations.add('walk-south', [6, 7, 8, 7], 6, true);
    dogBrown.animations.add('walk-west', [18, 19, 20 ,19], 6, true);
    dogBrown.animations.add('walk-east', [30, 31, 32, 31], 6, true);
    dogBrown.animations.add('walk-north', [42, 43, 44, 43], 6, true);

    dogTwoTone = game.add.sprite(200, 50, 'pets', 9);
    dogTwoTone.smoothed = false;
    game.physics.arcade.enable(dogTwoTone);
    dogTwoTone.body.collideWorldBounds = true;
    dogTwoTone.body.setSize(30, 36, 10, 35);
    dogTwoTone.animations.add('walk-south', [9, 10, 11, 10], 6, true);
    dogTwoTone.animations.add('walk-west', [21, 22, 23, 22], 6, true);
    dogTwoTone.animations.add('walk-east', [33, 34, 35, 34], 6, true);
    dogTwoTone.animations.add('walk-north', [45, 46, 47, 46], 6, true);

    player = dogGrey;
    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
}

function update() {
    player.body.velocity.set(0);

    if (shiftKey.isDown) {
        player.animations.currentAnim.speed = 12;
        player.speed = 200;
    } else {
        player.speed = 100;
        player.animations.currentAnim.speed = 6;
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

}
