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

  // Initialize player properties
  this.points = 0;
  this.maxVictoryJumps = 3;
  this.reset();
};

Player.prototype.update = function (dt) {

	if (this.invisible) {
		// Erase sprite at its current location
		ctx.clearRect(0,0, 505, 50);
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
						// this.death = true;
						this.jumpingUp = true;
				}
			}


			$('#yCanvasDiff').text( yCanvasDiff.toFixed(2) ); //BOF
			$('#xPlayerCanvas').text(this.xCanvas.toFixed(2)); //BOF
		  $('#yPlayerCanvas').text(this.yCanvas.toFixed(2));
		  $('#dt').text( dt.toFixed(3) );

		// Death
		} else if (this.death) {
			this.die(dt);

			$('#xPlayerCanvas').text(this.xCanvas.toFixed(2)); //BOF
		  $('#yPlayerCanvas').text(this.yCanvas.toFixed(2));
		  $('#dt').text( dt.toFixed(3) );

		// Victory
		} else if (this.victory) {
			this.jump(dt);

			$('#xPlayerCanvas').text(this.xCanvas.toFixed(2)); //BOF
			$('#yPlayerCanvas').text(this.yCanvas.toFixed(2));
			$('#dt').text( dt.toFixed(3) );
		}
	}
};

Player.prototype.jump = function (dt) {
	var victoryJumpHeight = -20,
			dtFactor = 18,
			yCanvasDiff = 0;
	// Move up phase during jump
	if (this.jumpingUp) {
		// Check if player is beneath top of jump
		if (this.yCanvas > victoryJumpHeight + YADJUST ) {
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
				this.points=+100;
				this.invisible = 2;

			}
		}
	}
	$('#yCanvasDiff').text( yCanvasDiff.toFixed(2) ); //BOF
};

Player.prototype.die = function (dt) {
	var deathJumpHeight = -25,
			dtFactor = 18,
			yCanvasDiff = 0;
	// Move up during jump
	if (this.jumpingUp) {
		if (this.yCanvas > this.yTile * YFACTOR + deathJumpHeight + YADJUST ) {
			yCanvasDiff = this.yTile * YFACTOR + deathJumpHeight + YADJUST - this.yCanvas;
			this.yCanvas = this.yCanvas + (dtFactor * dt) * yCanvasDiff;
			if( (this.yCanvas < this.yTile * YFACTOR + deathJumpHeight + YADJUST) ||
					(dtFactor * dt) > Math.abs(yCanvasDiff) ) {
				this.yCanvas = this.yTile * YFACTOR + deathJumpHeight + YADJUST;
				yCanvasDiff = 0;
				this.jumpingUp = false;
			}
		}

	// Moving down part of jump
	} else {

			yCanvasDiff = 5.5 * YFACTOR + YADJUST - this.yCanvas;
			this.yCanvas = this.yCanvas + (dtFactor * dt) * yCanvasDiff;
			if( (this.yCanvas > 5.5 * YFACTOR + YADJUST) || (dtFactor * dt) > Math.abs(yCanvasDiff) ) {
				this.yCanvas = 5.5 * YFACTOR + YADJUST;
				yCanvasDiff = 0;
				this.jumpingUp = true;
				if (this.points >= 100)	this.points=-100;
				this.invisible = 2;
			}

	}

	$('#yCanvasDiff').text( yCanvasDiff.toFixed(2) ); //BOF
};

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

};

Player.prototype.render = function() {
	// Only render if invisible counter is 0
	if (!this.invisible) ctx.drawImage(Resources.get(this.sprite), this.xCanvas, this.yCanvas);
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
