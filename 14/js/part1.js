const fs = require('fs')
const contents = fs.readFileSync('../input.txt', 'utf8').trim()
const lines = contents.split('\n')

const parseLine = line => {
  const [left, right] = line.split('=>')
  const output = right.trim().split(' ')
  output[0] = Number(output[0])
  const inputs = left
    .split(',')
    .map(ingredient =>
      ingredient
        .trim()
        .split(' ')
    )
  return {
    [output[1]]: {
      yield: Number(output[0]),
      constituents: [
        ...inputs.map(input => ({
          name: input[1],
          quantity: Number(input[0]),
        }))
      ]
    }
  }
}

const recipe = lines.map(parseLine).reduce((acc, i) => {
  return {
    ...acc,
    ...i
  }
}, {})

const calculateOreCostWithReserveSeed = (ingredientName, requiredQuantity, reserveSeed) => {
  let reserves = reserveSeed;

  const calculateOreCost = (ingredientName, requiredQuantity) => {
    let oreCost = 0;
    let requiredConversions = Math.ceil(requiredQuantity / recipe[ingredientName].yield);
    let surplus = requiredConversions * recipe[ingredientName].yield

    recipe[ingredientName].constituents.forEach(constituent => {
      let conversionOutput = constituent.quantity * requiredConversions;
      reserves[constituent.name] = reserves[constituent.name] || 0;
      if (reserves[constituent.name] < conversionOutput) {
        if (constituent.name === 'ORE') {
          oreCost += conversionOutput;
        } else {
          oreCost += calculateOreCost(constituent.name, conversionOutput - reserves[constituent.name]);
        }
      }
      reserves[constituent.name] = reserves[constituent.name] - conversionOutput;
    })

    reserves[ingredientName] = (reserves[ingredientName] || 0) + surplus;

    return oreCost;
  }

  return calculateOreCost(ingredientName, requiredQuantity)
}

console.log('Part 1:', calculateOreCostWithReserveSeed('FUEL', 1, {}))

let oneTrillion = 1000000000000
let low = 0
let high = oneTrillion
while (high > low + 1) {
  let midpoint = low + Math.floor((high - low) / 2)
  if (calculateOreCostWithReserveSeed('FUEL', midpoint, {'ORE': oneTrillion}) > 0) {
    high = midpoint
  } else {
    low = midpoint
  }
}

console.log('Part 2:', low)
