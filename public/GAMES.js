$(document).ready(function(){
  //Initialise canvas global variables
  const map = {
    canvas: document.getElementById('canvas'),
    context: canvas.getContext('2d'),
    width: $('#canvas').width(),
    height: $('#canvas').height(),
    cellWidth: 10,
    maxX: $('#canvas').width() / 10 - 1,
    maxY: $('#canvas').height() / 10 - 1,
    score: 0,
    food: {}
  }

  // Snake object
  let snake = {
    direction: "right",
    length: 5,
    array: []
  }

  // Start the game
  function initialise(){
    snake.direction = "right"
    map.score = 0
    createSnake()
    createFood()

    if (map.gameLoop) {
      clearInterval(map.gameLoop)
    }
    map.gameLoop = setInterval(paint, 60);
  }

  function createSnake(){
    snake.array = []
    for (let i = snake.length-1; i>=0; i--) {
      snake.array.push({x:i, y:0})
    }
  }

  function createFood(){
    map.food.x = Math.round(Math.random() * ( map.width / map.cellWidth ) -1)
    map.food.y = Math.round(Math.random() * ( map.height / map.cellWidth ) -1 )
  }

  function moveFood(){
    const direction = Math.round(Math.random()*4);
    let obj = {}
    switch (direction){
      case 0: // go left
        obj = {
          x: map.food.x - 1,
          y: map.food.y
        }
        break;
      case 1: //go up
        obj = {
          x: map.food.x,
          y: map.food.y - 1
        }
        break;
      case 2: //go right
        obj = {
          x: map.food.x + 1,
          y: map.food.y
        }
        break;
      case 3: //go down
        obj = {
          x: map.food.x,
          y: map.food.y + 1
        }
        break;
    }
    // Check the new food position is still on the map
    if (obj.x >= 0 && obj.x <= map.maxX && obj.y >= 0 && obj.y <= map.maxY && !checkCollision(obj)) {
      map.food.x = obj.x
      map.food.y = obj.y
    }
  }

  //create a generic cell painting function
  function paintCell(cell, color){
    map.context.fillStyle= color
    map.context.fillRect(cell.x * map.cellWidth, cell.y * map.cellWidth, map.cellWidth, map.cellWidth);
    map.context.strokeStyle = "yellow";
    map.context.strokeRect(cell.x * map.cellWidth, cell.y * map.cellWidth, map.cellWidth, map.cellWidth);
  }

  function paint(){
    //First we need to repaint the canvas to avoid a snake trail
    map.context.fillStyle = "white";
    map.context.fillRect(0, 0, map.width, map.height); //Rectangle is the borders of the map
    map.context.strokeStyle = "black";
    map.context.strokeRect(0, 0, map.width, map.height);

    //we'll pop out the tail cell and put it in front of the head
    let newHead = {}
    newHead.x = snake.array[0].x
    newHead.y = snake.array[0].y
    //those are the positions of the head
    //to get new head position we increment based on direction
    switch (snake.direction) {
      case "right":
        newHead.x ++
        break
      case "left":
        newHead.x --
        break
      case "up":
        newHead.y --
        break
      case "down":
        newHead.y ++
        break
    }

    // Check that the new head doesn't collide with anything
    if(newHead.x === -1 || newHead.x === (map.width / map.cellWidth) || newHead.y === -1 || newHead.y === (map.height / map.cellWidth) || checkCollision(newHead)){
      alert("Fucksake fam! You only scored "+map.score)
      initialise()
      return
    }

    //move the food
    moveFood()

    // Check if the snake head is in the same position as the food
    if(newHead.x === map.food.x && newHead.y === map.food.y){
      snake.array.unshift(newHead)
      map.score++
      createFood()
    } else{ //if there's no food, just move the tail to the head
      snake.array.pop()
      snake.array.unshift(newHead)
    }

    // Paint the new snake on the canvas
    for(let i = 0; i < snake.array.length; i++){
      paintCell(snake.array[i], "lime")
    }

    // Paint the food
    paintCell(map.food, "magenta")
    // Write down the score in the corner
    map.context.fillText(`Score: ${map.score}`, 5, map.height-5);
  }


  // Check for an object colliding with the snake somewhere
  function checkCollision(cell){
    for(let i = 0; i< snake.array.length; i++ ){
      if(cell.x === snake.array[i].x && cell.y === snake.array[i].y){
        return true
      }
    }
    return false
  }

  //Keyboard functions
  $(document).keydown(function(e){
    const key = e.which;
    //make sure to prevent reverse gear
    if(key=="37" && snake.direction!="right") snake.direction="left";
    else if(key=="38" && snake.direction!="down") snake.direction="up";
    else if(key=="39" && snake.direction!="left") snake.direction="right";
    else if(key=="40" && snake.direction!="up") snake.direction="down";
  })

  // Start the game
  initialise()
});
