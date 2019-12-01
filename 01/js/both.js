const fs = require('fs')

const sum = arr => arr.reduce((acc, i) => acc + i, 0)
const contents = fs.readFileSync('../input.txt', 'utf8').trim()
const lines = contents.split('\n')

const masses = lines.map(Number)
const massToFuelReq = mass => Math.floor(mass / 3) - 2
const fuelRequirements = masses.map(massToFuelReq)
const totalFuelRequirements = fuelRequirements.map(i => {
  let total = i
  let f = i
  let fPrime = massToFuelReq(f)

  while (fPrime > 0) {
    total += fPrime
    f = fPrime
    fPrime = massToFuelReq(f)
  }
  return total
})

console.log('Part 1:', sum(fuelRequirements))
console.log('Part 2:', sum(totalFuelRequirements))
