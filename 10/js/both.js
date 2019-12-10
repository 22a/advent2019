const fs = require('fs')
const contents = fs.readFileSync('../input.txt', 'utf8').trim()
const lines = contents.split('\n')

const asteroids = []
lines.forEach((line, i) => {
  [...line].forEach((coord, j) => {
    if (coord === '#') {
      asteroids.push({x: j, y: i})
    }
  })
})

const angleBetween = (p1, p2) => {
  const deltaY = (p1.y - p2.y)
  const deltaX = (p2.x - p1.x)
  return (Math.atan2(deltaY, deltaX) * 180 / Math.PI) - 90
}

const coordCanSeeCoord = (p0, p1, alreadyConsumed) => {
  let angleBetweenCoords = angleBetween(p0, p1)
  return [!alreadyConsumed.includes(angleBetweenCoords), angleBetweenCoords]
}

let mostVisibleSoFar = -Infinity
let mostVisibleItems
let monitoringStationCoord

asteroids.forEach(asteroid => {
  let visibleThisTime = []
  let alreadyConsumed = []
  const sortedOther = [...asteroids].sort((a, b) => {
    let aManhattan = Math.abs(a.x - asteroid.x) + Math.abs(a.y - asteroid.y)
    let bManhattan = Math.abs(b.x - asteroid.x) + Math.abs(b.y - asteroid.y)
    return aManhattan < bManhattan ? -1 : 1;
  })
  sortedOther.forEach(otherAsteroid => {
    const [canSee, angle] = coordCanSeeCoord(asteroid, otherAsteroid, alreadyConsumed)
    if (canSee) {
      visibleThisTime.push(otherAsteroid)
      alreadyConsumed.push(angle)
    }
  })
  if (mostVisibleSoFar < visibleThisTime.length) {
    monitoringStationCoord = {...asteroid}
    mostVisibleSoFar = visibleThisTime.length
    mostVisibleItems = visibleThisTime
  }
})

console.log('Part 1:', mostVisibleSoFar)

let after = []
let before = []
mostVisibleItems
  .sort((a, b) => {
    return angleBetween(monitoringStationCoord, a) < angleBetween(monitoringStationCoord, b) ? 1 : -1;
  })
  .forEach(asteroid => {
    if (angleBetween(monitoringStationCoord, asteroid) > 0) {
      after.push(asteroid)
    } else {
      before.push(asteroid)
    }
  })
const spliced = before.concat(after)
const twoHundredthPlantToBeZapped = spliced[199]

console.log('Part 2:', twoHundredthPlantToBeZapped.x * 100 + twoHundredthPlantToBeZapped.y)
