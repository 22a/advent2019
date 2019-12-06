const fs = require('fs');
const contents = fs.readFileSync('../input.txt', 'utf8').trim();
const lines = contents.split('\n')

const graph = lines.reduce((acc, line) => {
  const [parent, child] = line.split(')');
  if (acc[parent]) {
    acc[parent].push(child)
  } else {
    acc[parent] = [child]
  }
  return acc
}, {})

const countEdges = (graph, key, acc) => {
  let localTotal = 0
  if (graph[key]) {
    graph[key].forEach(node => {
      localTotal += countEdges(graph, node, acc+1)
    })
  }
  return acc + localTotal
}

console.log('Part 1:', countEdges(graph, 'COM', 0))

const nodeConnectedTo = (graph, key, searchKey) => {
  if (key === searchKey) {
    return true
  }
  if (graph[key]) {
    return graph[key].some(node => {
      if (nodeConnectedTo(graph, node, searchKey)) {
        return true
      }
    })
  }
  return false
}

const costToChild = (graph, key, searchKey, acc) => {
  if(key === searchKey) {
    return acc
  }
  if (!nodeConnectedTo(graph, key, searchKey)) {
    return Infinity
  }
  return Math.min(...graph[key].map(node => {
    return costToChild(graph, node, searchKey, acc+1)
  }))
}

const searchKey = 'SAN'
let currentPlanet = 'YOU'
let backtracks = 0;
while(!nodeConnectedTo(graph, currentPlanet, searchKey)) {
  currentPlanet = Object.keys(graph).find(key => graph[key] && graph[key].includes(currentPlanet))
  backtracks++
}
console.log('Part 2:', costToChild(graph, currentPlanet, searchKey, backtracks) - 2)
