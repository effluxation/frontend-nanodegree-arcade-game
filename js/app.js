// Global variables = Factors used to convert from tile coordinates to pixel coordinates
var XFACTOR = 101;
var YFACTOR = 83;
	// Used to center sprite vertically inside tile
var YADJUST = -35;

// Enemies our player must avoid
var Enemy = function(enemyRow) {
	// Row on which enemy will appear
  this.yTile = enemyRow;
  this.xMax = 506;
  this.xMin = -101;
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  // Variables that determine the area used for collision calculations

  // Set remaining enemy settings
  this.reset();
};

Enemy.prototype.reset = function () {
	// Set speed and wait time before start
	this.speed = getRandom( 150, getRandom(300, 800));
	this.startCountdown = getRandom(0.5, 4);
	this.frozen = false;

// Initialize canvas location variables with canvas
// coordinate location corresponding to tile numbers.
// Render uses these variables
  this.yCanvas = this.yTile * YFACTOR + YADJUST;
  this.xCanvas = this.xMin;

  // Returns a random integer between min and max
  function getRandom (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // Move enemy only if not frozen and not counting down to start
  if (!this.frozen && !this.startCountdown) {
  	this.xCanvas = this.xCanvas + this.speed * dt;
  	if (this.xCanvas >= this.xMax) this.reset();

  // Check if counting down to start, if yes, decrement countdown
  } else if (this.startCountdown > 0 && !this.frozen) {
  	this.startCountdown = this.startCountdown - dt;
  	if (this.startCountdown < 0) this.startCountdown = 0;
  }
};

Enemy.prototype.freeze = function () {
	this.frozen = true;
};

Enemy.prototype.unfreeze = function () {
	this.frozen = false;
};

Enemy.prototype.bounds = function () {
	return {
		left: this.xCanvas + 5,
  	right: this.xCanvas + 5 + 52,
  	top: this.yCanvas + 85,
  	bottom: this.yCanvas + 85 + 90
	};
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.xCanvas , this.yCanvas);
  ctx.strokeRect(this.xCanvas + 5, this.yCanvas + 85, 90 , 52);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
  // Player Sprite
  this.sprite = 'images/char-horn-girl.png';

  // Initialize player properties
  this.points = 0;
  this.maxVictoryJumps = 3;
  this.reset();
};

Player.prototype.bounds = function () {
	return {
		left: this.xCanvas + XFACTOR/5,
  	right: this.xCanvas + XFACTOR*3/5,
  	top: this.yCanvas + 100,
  	bottom: this.yCanvas + 100 + XFACTOR*2/5
	};
};

Player.prototype.update = function (dt) {
	if (this.invisible) {
		// If sprite is invisible, reduce the invisibility counter
		this.invisible = Math.abs(this.invisible) - this.invisible * 8 * dt;
		// Once counter approach 0, make it 0 and reset player
		if (this.invisible <= 2 * dt){
			this.invisible = 0;
			this.reset();
		}
	}	else {
		// Calculate difference between desired tile location and
		// current canvas coordinate position of sprite
		var yCanvasDiff,
				xCanvasDiff;

		// Regular player movement
		if (!this.death && !this.victory) {

			// X coordinate: Moving towards desired tile
			xCanvasDiff = this.xTile * XFACTOR - this.xCanvas;
			if (Math.abs(xCanvasDiff) >= dt * 32){
				// If further away from destination than dt * 32, calculate new
				// canvas location by a factor of dt and xCanvasDiff
				this.xCanvas = this.xCanvas + (dt * 16) * xCanvasDiff;
			} else {
				// Got close enough to desired tile, 'teleport' sprite to the
				// exact spot
				this.xCanvas = this.xTile * XFACTOR;
			}

			// Y coordinate: Moving towards desired tile
			yCanvasDiff = this.yTile * YFACTOR + YADJUST - this.yCanvas;
			if (Math.abs(yCanvasDiff) >= dt * 32){
				this.yCanvas = this.yCanvas + (dt * 16) * yCanvasDiff;
			} else {
				this.yCanvas = this.yTile * YFACTOR + YADJUST;

				// Initiate victory sequence if reached top blue tile
				if (this.yCanvas === YADJUST){
						this.victory = true;
						this.jumpingUp = true;
				}
			}

		// Death
		} else if (this.death) {
			this.dying(dt);

		// Victory
		} else if (this.victory) {
			this.jump(dt);
		}
	}
};

// Victory jump animation
Player.prototype.jump = function (dt) {
	var victoryJumpHeight = -20,
			dtFactor = 18,
			yCanvasDiff = 0;
	// Move up phase during jump
	if (this.jumpingUp) {
		// Check if player is beneath top of jump

		yCanvasDiff = victoryJumpHeight + YADJUST - this.yCanvas;
		// Adjust sprite location by a factor of dt
		this.yCanvas = this.yCanvas + (dtFactor * dt) * yCanvasDiff;

		// Check if conditions for reaching top of jump fulfilled
		if( (this.yCanvas < victoryJumpHeight + YADJUST) ||
				(dtFactor * dt) > Math.abs(yCanvasDiff) ) {
			this.yCanvas = victoryJumpHeight + YADJUST;
			yCanvasDiff = 0;
			// Next update() cycle will move on to down phase of jump
			this.jumpingUp = false;
		}

	// Moving down phase of jump
	} else {
		yCanvasDiff = YADJUST - this.yCanvas;

		// Adjust sprite vertical locatin based on factor of dt
		this.yCanvas = this.yCanvas + (dtFactor * dt) * yCanvasDiff;

		// Check if conditions for finishing jump are true
		if( (this.yCanvas > YADJUST) || (dtFactor * dt) > Math.abs(yCanvasDiff) ) {
			this.yCanvas = YADJUST;
			yCanvasDiff = 0;
			// Reseet initial direction of jump to up next time jump occurs
			this.jumpingUp = true;
			this.currentJumps++;
			if( this.currentJumps === this.maxVictoryJumps) {
				//Finished jumps, add points and make invisible
				this.points = this.points + 100;
				this.invisible = 2;

			}
		}
	}
	$('#yCanvasDiff').text( yCanvasDiff.toFixed(2) ); //BOF
};

Player.prototype.die = function () {
	this.death = true;
};

// Death animation
Player.prototype.dying = function (dt) {
	var deathJumpHeight = -30,
			dtFactor = 18,
			yCanvasDiff = 0;
	// Move up during death sequence
	if (this.jumpingUp) {

			yCanvasDiff = this.yTile * YFACTOR + deathJumpHeight + YADJUST - this.yCanvas;
			// Adjust sprite position based on dt factor
			this.yCanvas = this.yCanvas + (dtFactor * dt) * yCanvasDiff;
			// Check if reach top of jump
			if( (this.yCanvas < this.yTile * YFACTOR + deathJumpHeight + YADJUST) ||
					(dtFactor * dt) > Math.abs(yCanvasDiff) ) {
				this.yCanvas = this.yTile * YFACTOR + deathJumpHeight + YADJUST;
				yCanvasDiff = 0;
				// Will begin descent sequence
				this.jumpingUp = false;
			}

	// Moving down part of death fall
	} else {
			yCanvasDiff = 5.5 * YFACTOR + YADJUST - this.yCanvas;
			// Adjust sprite position during fall.
			this.yCanvas = this.yCanvas + (dtFactor * dt) * yCanvasDiff;
			// Check if reached bottom of fall
			if( (this.yCanvas > 5.5 * YFACTOR + YADJUST) || (dtFactor * dt) > Math.abs(yCanvasDiff) ) {
				this.yCanvas = 5.5 * YFACTOR + YADJUST;
				yCanvasDiff = 0;
				this.jumpingUp = true;
				// Subtract points and make invisible
				if (this.points < 100){
					this.points = 0;
				}else {
					this.points = this.points - 100;
				}
				this.invisible = 2.3;
			}
	}

	$('#yCanvasDiff').text( yCanvasDiff.toFixed(2) ); //BOF
};

Player.prototype.getScore = function () {
	return this.points;
};

Player.prototype.isDead = function () {
	return this.death;
}

// Reset player to starting positiong after death or victory
Player.prototype.reset = function () {
	this.death = false;
  this.victory = false;
  this.jumpingUp = true;
  this.currentJumps = 0;
  this.invisible = 0;

// New Player location initalized to bottom central tile
  this.xTile = 2;
  this.yTile = 5;

// Initialize canvas location variables with canvas
// coordinate location corresponding to tile numbers.
// Render uses these variables
  this.xCanvas = this.xTile * XFACTOR;
  this.yCanvas = this.yTile * YFACTOR + YADJUST;

  for (var i = 0; i < allEnemies.length; i++) {
  	allEnemies[i].unfreeze();
  }

};

Player.prototype.render = function() {
	// Only render if invisible counter is 0
	if (!this.invisible)
		ctx.drawImage(Resources.get(this.sprite), this.xCanvas, this.yCanvas);
  ctx.lineWidth = 1;
  ctx.strokeRect(this.xCanvas + XFACTOR/5, this.yCanvas + 100, XFACTOR * 3/5, XFACTOR * 2/5);
};

Player.prototype.handleInput = function(keyPress) {
  if (!this.victory && !this.death) {
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
  	}
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemy1 = new Enemy(1);
allEnemies.push(enemy1);

var enemy2 = new Enemy(1);
allEnemies.push(enemy2);

var enemy3 = new Enemy(2);
allEnemies.push(enemy3);

var enemy4 = new Enemy(2);
allEnemies.push(enemy4);

var enemy5 = new Enemy(3);
allEnemies.push(enemy5);

var enemy6 = new Enemy(3);
allEnemies.push(enemy6);

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