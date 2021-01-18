let canvas = document.getElementById('snake')
let context = canvas.getContext("2d")
let box = 32
let snake = []
let direction = 'right'
let timer = 200
let countFood = 0

let points = 0
let pointMutiples = 1

let food = {
	x: Math.floor(Math.random() * 15 + 1) * box,
	y: Math.floor(Math.random() * 15 + 1) * box
}

snake[0] = {
	x: 8 * box,
	y: 8 * box,
}

function createBg() {
	context.fillStyle = '#101020'
	context.fillRect(0, 0, 16 * box, 16 * box)
}

function createSnake() {
	for(let i = 0; i < snake.length; i++) {
		context.fillStyle = '#4bc3b5'
		context.fillRect(snake[i].x, snake[i].y, box, box)
	}
}

function drawFood() {
	context.fillStyle = '#d175b7'
	context.fillRect(food.x, food.y, box, box)
}

document.addEventListener('keydown', update)

// Adds points
function addPoint(){
	if(points >=  5) pointMutiples = 2 
	if(points >= 15) pointMutiples = 3
	if(points >= 30) pointMutiples = 4
	if(points >= 50) pointMutiples = 5
	if(points >= 75) pointMutiples = 6
	if(points >= 105) pointMutiples = 7
	if(points >= 140) pointMutiples = 8
	if(points >= 180) pointMutiples = 9
	if(points >= 225) pointMutiples = 10

	points = points + pointMutiples 
	console.log(points)
}


// Update direction
function update(event) {
	if(event.keyCode == 37 && direction != 'right') direction = 'left'
	if(event.keyCode == 38 && direction != 'down') direction = 'up'
	if(event.keyCode == 39 && direction != 'left') direction = 'right'
	if(event.keyCode == 40 && direction != 'up') direction = 'down'
}
let jogo = setInterval(playGame, timer)

function playGame() {

	// Adds directional movement
	let snakeX = snake[0].x
	let snakeY = snake[0].y

	if(direction == 'right') snakeX += box;
	if(direction == 'left') snakeX -= box;
	if(direction == 'up') snakeY -= box;
	if(direction == 'down') snakeY += box;

	if(snakeX > 15 * box && direction == 'right') snakeX = 0
	if(snakeY > 15 * box && direction == 'down') snakeY = 0
	if(snakeX < 0 * box && direction == 'left') snakeX = 15 * box
	if(snakeY < 0 * box && direction == 'up') snakeY = 15 * box

	createBg()
	createSnake()
	drawFood()

	// checks for hears collision
	for(let i = 1; i < snake.length; i++) {
		if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
			gameOver(true)
			clearInterval(jogo)
		}
	}

	// check if you ate the food
	if(snakeX != food.x || snakeY != food.y){
		snake.pop()
	}
	else{
		// moviment food
		food.x = Math.floor(Math.random() * 15 + 1) * box
		food.y = Math.floor(Math.random() * 15 + 1) * box

		addPoint()
		countFood += 1
		document.getElementById('point').innerText = points
		document.getElementById('multiple').innerText = `${pointMutiples} x`
	}

	let newHead = {
		x: snakeX,
		y: snakeY
	}

	snake.unshift(newHead)

}

// checks if you lost the match
function gameOver(gamOver){
	if(gameOver){
		let telaGameOver = document.getElementById("gameOver")
		telaGameOver.style.visibility = "visible"
	}
}

// check if it will play again
function newGame(element) {
	if(element.id == "sim") {
		let telaGameOver = document.getElementById("gameOver")
		telaGameOver.style.visibility = "hidden"

		snake.splice(0)
		direction = 'right'
		countFood = 0
		points = 0
		pointMutiples = 1

		document.getElementById('point').innerText = points
		document.getElementById('multiple').innerText = `${pointMutiples} x`

		snake[0] = {
			x: 8 * box,
			y: 8 * box,
		}


		food.x = Math.floor(Math.random() * 15 + 1) * box
		food.y = Math.floor(Math.random() * 15 + 1) * box
		
		jogo = setInterval(playGame, timer)
	}
	else{
		alert('Obrigado por jogar. Volte outra hora.')
	}
}
