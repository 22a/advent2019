const rangeStart = 134792
const rangeEnd = 675810

const allDigitsIncrease = digits => {
  for(let i = 1; i < digits.length; i++) {
    if (digits[i - 1] > digits[i]) {
      return false
    }
  }
  return true
}

const atLeastTwoAdjacentDigitsMatch = digits => {
  for(let i = 1; i < digits.length; i++) {
    if (digits[i - 1] === digits[i]) {
      return true
    }
  }
  return false
}

const exactlyTwoAdjacentDigitsMatch = digits => {
  let adjacentDupeCounts = {}
  for(let i = 1; i < digits.length; i++) {
    if (digits[i - 1] === digits[i]) {
      adjacentDupeCounts[digits[i]] = (adjacentDupeCounts[digits[i]] || 0) + 1
    }
  }
  return Object.values(adjacentDupeCounts).includes(1)
}

const base10NumberToDigits = number => {
  return [...number.toString()].map(Number)
}

let part1ViableCount = 0
let part2ViableCount = 0

for (let i = rangeStart; i < rangeEnd; i++) {
  const digits = base10NumberToDigits(i)
  if (allDigitsIncrease(digits)) {
    if (atLeastTwoAdjacentDigitsMatch(digits)) {
      part1ViableCount++;
      if (exactlyTwoAdjacentDigitsMatch(digits)) {
        part2ViableCount++;
      }
    }
  }
}

console.log('Part 1:', part1ViableCount)
console.log('Part 2:', part2ViableCount)
