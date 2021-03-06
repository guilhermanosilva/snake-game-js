/*DOM elements*/
let canvas = document.getElementById('snake')
let documentPoint = document.getElementById('point')
let context = canvas.getContext("2d")
let gameOverLayer = document.getElementById("gameOver")
let difficulty = document.querySelectorAll('.difficulty')

		console.log(difficulty[1])


/*Variable*/
let box = 32;
let timer = 200
let countFood = 0
let direction = 'right'
let points = 0
let pointMutiples = 1
let play = null
let game = JSON.parse(localStorage.getItem('game')) || []
let numberGame = 1
let snake = []
let food = {
	x: Math.floor(Math.random() * 15 + 1) * box,
	y: Math.floor(Math.random() * 15 + 1) * box
}

snake[0] = {
	x: 8 * box,
	y: 8 * box,
}

if(game.length > 0){
	numberGame = game[game.length - 1].numberGame + 1
}

play = setInterval(playGame, timer)	

/*
	Drawing functions
*/
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

/*
	Events
*/
document.addEventListener('keydown', update)

window.addEventListener('load', listPoints)

document.getElementById('clearPoints').addEventListener('click', () => {
	localStorage.clear()
	window.location.reload(true)
})

// Selected difficulty
for(let level of difficulty){
	level.addEventListener('click',(e)=>{
		clearDifficulty()
		
		if(level.classList[1] != 'selected-difficulty'){
			level.classList.add('selected-difficulty')

			if(e.target.id == 'hard'){
				clearInterval(play)
				timer = 150
				play = setInterval(playGame, timer)
			}

			if(e.target.id == 'normal'){
				clearInterval(play)
				timer = 200
				play = setInterval(playGame, timer)
			}
			
			if(e.target.id == 'easy'){
				clearInterval(play)
				timer = 300
				play = setInterval(playGame, timer)
			}
		}
	})
}

/*
	Functions
*/

function clearDifficulty(){
	for(let div of difficulty){
		div.classList.remove('selected-difficulty')
	}
}

function addPoint(){
	let restPoints = points % 5
	if(points > 0 && restPoints == 0){
		pointMutiples++
	}

	points = points + pointMutiples 
}

function speed(){
	let restCountFood = countFood % 5
	if(countFood > 0 && restCountFood == 0){
		clearInterval(play)
		timer = timer - 10
		play = setInterval(playGame, timer)
		console.log(timer)
	}
}

// Update direction
function update(event) {
	if(event.keyCode == 37 && direction != 'right') direction = 'left'
	if(event.keyCode == 38 && direction != 'down') direction = 'up'
	if(event.keyCode == 39 && direction != 'left') direction = 'right'
	if(event.keyCode == 40 && direction != 'up') direction = 'down'
}

function radomFood(){
	food.x = Math.floor(Math.random() * 15 + 1) * box
	food.y = Math.floor(Math.random() * 15 + 1) * box
}

function listPoints() {
	let punctuation = document.getElementById('punctuation')
	punctuation.innerHTML = ''

	for(let viewPoint of game){
		let p = document.createElement('p')
		p.classList = 'point-list'
		p.innerHTML = `<span class='number-game'>#${viewPoint.numberGame}:</span> <span>${viewPoint.points} pts</span>`
		punctuation.appendChild(p)
	}
}

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
			clearInterval(play)
		}
	}

	// check if you ate the food
	if(snakeX != food.x || snakeY != food.y){
		snake.pop()
	}
	else{
		radomFood()

		// changes the position of the food if it is on the snake
		for(let i = 0; i < snake.length; i++){
			while(food.x == snake[i].x && food.y == snake[i].y){
				// uncommon to see the food on top of the snake
				/*
				context.fillStyle = 'orange'
				context.fillRect(food.x, food.y, box, box)
				*/
				radomFood()
			}
		}

		addPoint()
		
		countFood += 1
		speed()

		documentPoint.innerText = points
		document.getElementById('multiple').innerText = `${pointMutiples} X`
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
		let gameOverLayer = document.getElementById("gameOver")
		gameOverLayer.style.visibility = "visible"

		let currentGame = {
			game,
			points
		}
	}
}

// check if it will play again
function newGame(element) {
	if(element.id == "sim") {
		let gamePlay = {
			numberGame,
			points
		}

		game.push(gamePlay)

		localStorage.setItem(`game`, JSON.stringify(game))

		gameOverLayer.style.visibility = "hidden"

		listPoints()
		clearDifficulty()

		snake.splice(0)
		direction = 'right'
		countFood = 0
		points = 0
		pointMutiples = 1
		timer = 200
		difficulty[1].classList.add('selected-difficulty')
		numberGame++

		documentPoint.innerText = points
		document.getElementById('multiple').innerText = `${pointMutiples} x`

		snake[0] = {
			x: 8 * box,
			y: 8 * box,
		}

		food.x = Math.floor(Math.random() * 15 + 1) * box
		food.y = Math.floor(Math.random() * 15 + 1) * box
		
		play = setInterval(playGame, timer)
	}
	else{
		alert('Obrigado por jogar. Volte outra hora.')
	}
}
