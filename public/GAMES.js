$(document).ready(function(){
	//CANVAS BANTER
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var width = $("#canvas").width();
	var height = $("#canvas").height();

	//Other important variables
	var cw = 10; //save cell width
	var direction; //snakes direction
	var food; //The food
	var score; //the users score

	//The snake is an array of cells
	var snakeArray;

	function initialise(){
		direction = "right";
		createSnake();
		createFood();
		score=0;

		if(typeof gameLoop != "undefined") clearInterval(gameLoop);
		gameLoop = setInterval(paint, 60);
	}
	initialise();

	function createSnake(){
		var length = 5;
		snakeArray = [];
		for(var i = length-1;i>=0;i--){
			snakeArray.push({x:i, y:0});
		}
	}

	function createFood(){
		food = {
			x: Math.round(Math.random()*(width-cw)/cw),
			y: Math.round(Math.random()*(height-cw)/cw)
		};
	}

	function moveFood(food){
		var d = Math.round(Math.random()*7);
		switch (d){
			case 0: //go left
				if(food.x!=0) food.x--;
				break;
			case 1: //go up
				if(food.y!=0) food.y--;
				break;
			case 2: //go right
				if(food.x!=(width/cw)-1) food.x++;
				break;
			case 3: //go down
				if(food.y != (height/cw)-1) food.y++;
				break;
			default:
				break;
		}
	}

	function paint(){
		//First we need to repaint the canvas to avoid a snake trail
		context.fillStyle = "white";
		context.fillRect(0,0,width,height); //Rectangle is the borders of the map
		context.strokeStyle = "black";
		context.strokeRect(0,0,width,height);

		//we'll pop out the tail cell and put it in front of the head
		var newX = snakeArray[0].x;
		var newY = snakeArray[0].y;
		//those are the positions of the head
		//to get new head position we increment based on direction
		if(direction=="right") newX++;
		else if(direction=="down") newY++;
		else if(direction=="left") newX--;
		else if(direction=="up") newY--;

		//Checkin fo' collisionnssss
		if(newX==-1 || newX==width/cw || newY==-1 || newY == height/cw || checkCollision(newX, newY)){
			alert("Fucksake fam! You only scored "+score);
			initialise();
			return;
		}

		//move the food, coz why the fuck not??
		moveFood(food);

		//when the little nigga eats some food, it goes straight to his thighs
		if(newX==food.x && newY==food.y){
			var newTail={x:newX, y:newY};
			score++;
			createFood();
		} else{ //if there's no food, just move the tail to the head
			var newTail = snakeArray.pop();
			newTail.x = newX;
			newTail.y = newY;
		}

		//puts the tail at the head
		snakeArray.unshift(newTail);

		for(var i=0;i<snakeArray.length;i++){
			var c = snakeArray[i];
			paintCell(c);
		}

		paintCell(food);
		var scoreText = "Score: "+score;
		context.fillText(scoreText, 5, height-5);
	}

	//create a generic cell painting function
	function paintCell(cell){
		context.fillStyle="lime";
		context.fillRect(cell.x*cw, cell.y*cw,cw,cw);
		context.strokeStyle = "yellow";
		context.strokeRect(cell.x*cw, cell.y*cw,cw,cw);
	}

	function checkCollision(x, y){
		var result = false;
		for(var i=0;i<snakeArray.length;i++){
			if(snakeArray[i].x==x && snakeArray[i].y==y){
				result = true;
				break;
			}
		}
		return result;
	}

	//Keyboard functions
	$(document).keydown(function(e){
		var key = e.which;
		//make sure to prevent reverse gear
		if(key=="37" && direction!="right") direction="left";
		else if(key=="38" && direction!="down") direction="up";
		else if(key=="39" && direction!="left") direction="right";
		else if(key=="40" && direction!="up") direction="down";
	})

});