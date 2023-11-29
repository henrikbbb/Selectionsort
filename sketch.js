let blocks = []
let block_width = 50
let block_height_min = 50
let block_height_max = 300
let index_current
let index_fill
let index_lowest
let timer
let mode
let sliderSpeed, sliderAmount
let n

function setup() {
	createCanvas(1000, 400)

	sliderSpeed = createSlider(200, 1000, 1000, 100)
	createSpan('Pause zwischen den Schritten')
	createElement('br')
	sliderAmount = createSlider(10, 100, 10, 1)
	createSpan('Anzahl')

	createElement('br')

	let button = createButton('restart')
	button.mousePressed(() => {
		setupArray()
	})

	setupArray()
}

function setupArray() {
	for (let i = blocks.length - 1; i >= 0; i--) {
		blocks[i].remove()
	}

	n = sliderAmount.value()

	block_width = width/n

	index_current = 0
	index_fill = 0
	index_lowest = 0

	let sizes = []
	for (let i = 0; i < n; i++) {
		let size = map(i, 0, n-1, block_height_min, block_height_max)
		sizes.push(size)
	}
	sizes = sizes.sort(() => Math.random() - 0.5)
	sizes = sizes.sort(() => Math.random() - 0.5)
	sizes = sizes.sort(() => Math.random() - 0.5)

	blocks = []
	for (let i = 0; i < n; i++) {
		let h = sizes[i]
		let block = new Sprite(block_width/2 + i*block_width, block_height_max - h/2, block_width, h, 'kinematic')
		block.color = 'gray'
		blocks.push(block)
	}

	mode = 'mark'
	timer = millis()
}

function draw() {
	clear()

	if (index_fill >= blocks.length) {
		return
	}


	if (millis() - timer > sliderSpeed.value()) {
		timer = millis()
		if (mode == 'mark') {
			if (blocks[index_current].h < blocks[index_lowest].h) {
				index_lowest = index_current
			}
			mark()
			index_current++
			if (index_current == blocks.length) {
				mode = 'swap'
			}
		} else if (mode == 'swap') {
			if (index_fill != index_lowest) {
				swap(index_fill, index_lowest)
			}
			mode = 'mark'
			index_fill++
			index_current = index_fill
			index_lowest = index_fill
		}
	}
}

function swap(i, j) {
	// move
	let speed = 0.07 * block_width * abs(i-j)
	blocks[i].moveTo(blocks[j].x, blocks[i].y, speed);
	blocks[j].moveTo(blocks[i].x, blocks[j].y, speed);

	// edit array
	let temp = blocks[i]
	blocks[i] = blocks[j]
	blocks[j] = temp
}

function mark() {
	for (let i = 0; i < blocks.length; i++) {
		let block = blocks[i]
		block.color = 'gray'
		block.stroke = 'black'
	}
	blocks[index_lowest].stroke = 'blue'
	blocks[index_lowest].color = 'blue'
	blocks[index_current].color = 'red'
	blocks[index_fill].color = 'yellow'
}