// Factors used to convert from tile coordinates to pixel coordinates
var XFACTOR = 101;
var YFACTOR = 83;
// Used to center vertically in tile
var YADJUST = -35;

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  //ctx.drawImage(Resources.get(this.sprite), this.x * XFACTOR, this.y * YFACTOR + YADJUST);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {

  // Player Sprite
  this.sprite = 'images/char-horn-girl.png';

  // New Player location initalized to bottom central tile
  this.xTile = 2;
  this.yTile = 5;

  // Initialize canvas location variables with canvas
  // coordinate location corresponding to tile numbers.
  this.xCanvas = this.xTile * XFACTOR;
  this.yCanvas = this.yTile * YFACTOR + YADJUST;
};

Player.prototype.update = function (dt) {

	var xCanvasDiff = this.xTile * XFACTOR - this.xCanvas;

	if (Math.abs(xCanvasDiff) >= dt * 32){
		this.xCanvas = this.xCanvas + (dt * 16) * xCanvasDiff;
	} else {
		this.xCanvas = this.xTile * XFACTOR;
	}

	var yCanvasDiff = this.yTile * YFACTOR + YADJUST - this.yCanvas;

	if (Math.abs(yCanvasDiff) >= dt * 32){
		this.yCanvas = this.yCanvas + (dt * 16) * yCanvasDiff;
	} else {
		this.yCanvas = this.yTile * YFACTOR + YADJUST;
	}

	$('#xPlayerCanvas').text(this.xCanvas.toString());
	$('#yPlayerCanvas').text(this.yCanvas.toString());
	$('#dt').text( dt.toString() );
};

//
// Player.prototype.win = function () {
// 	this.x = 2;
//   this.y = 5;
// }
//

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.xCanvas, this.yCanvas);
};

// TODO
// Clear Player head from top rectangle section after reaching sea
// ctx.clearRect(20,20,100,50);

Player.prototype.handleInput = function(keyPress) {
  switch (keyPress) {
    case 'left':
    	if (this.xTile !== 0) this.xTile--;
    	break;
    case 'right':
    	if (this.xTile !== 4) this.xTile++;
    	break;
    case 'up':
    	if (this.yTile !== 0) this.yTile--;
    	break;
    case 'down':
    	if (this.yTile !== 5) this.yTile++;
    	break;
  };
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
// var enemy1 = new Enemy();
// allEnemies.push(enemy1);

// var enemy2 = new Enemy();
// allEnemies.push(enemy2);

// var enemy3 = new Enemy();
// allEnemies.push(enemy3);

// var enemy4 = new Enemy();
// allEnemies.push(enemy4);

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
