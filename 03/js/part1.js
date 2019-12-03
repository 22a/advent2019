const fs = require('fs')
const contents = fs.readFileSync('../input.txt', 'utf8').trim()
const wires = contents.split('\n')

const wirePath0 = new Set()
let cX = 0;
let cY = 0;
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
    wirePath0.add(`${cX},${cY}`)
  }
})

const intersections = new Set()
cX = 0;
cY = 0;
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
    const coord = `${cX},${cY}`;
    if (wirePath0.has(coord)) {
      intersections.add(coord)
    }
  }
})

let intersectionManhattans = Array.from(intersections)
  .map(coord =>
    coord.split(',')
    .map(Number)
    .map(Math.abs)
    .reduce((acc, i) => acc + i, 0)
  )

console.log(Math.min(...intersectionManhattans))
