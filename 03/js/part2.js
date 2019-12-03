const fs = require('fs')
const contents = fs.readFileSync('../input.txt', 'utf8').trim()
const wires = contents.split('\n')

const wire0Costs = {}
let cX = 0;
let cY = 0;
let ticks = 0;
wires[0].split(',').forEach(path => {
  const [dir, length] = [path[0], path.slice(1)]
  for(let i = 0; i < length; i++) {
    switch (dir) {
      case 'U':
        cX++
        break
      case 'R':
        cY++
        break
      case 'D':
        cX--
        break
      case 'L':
        cY--
        break
    }
    wire0Costs[`${cX},${cY}`] = ++ticks
  }
})

const intersectionCosts = {}
cX = 0;
cY = 0;
ticks = 0;
wires[1].split(',').forEach(path => {
  const [dir, length] = [path[0], path.slice(1)]
  for(let i = 0; i < length; i++) {
    switch (dir) {
      case 'U':
        cX++
        break
      case 'R':
        cY++
        break
      case 'D':
        cX--
        break
      case 'L':
        cY--
        break
    }
    ticks++;
    const coord = `${cX},${cY}`;
    if (wire0Costs[coord]) {
      intersectionCosts[coord] = wire0Costs[coord] + ticks
    }
  }
})

console.log(Math.min(...Object.values(intersectionCosts)))
