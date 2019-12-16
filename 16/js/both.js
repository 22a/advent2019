const fs = require('fs');
const contents = fs.readFileSync('../input.txt', 'utf8').trim();
let inputDigits = contents.split('').map(Number);

const buildSine = (frequency, length) => {
  let baseSine = [0, 1, 0, -1]
  let elongatedSine = []
  for (i = 0; i < baseSine.length; i++) {
    for(j = 0; j < frequency; j++) {
      elongatedSine.push(baseSine[i])
    }
  }
  elongatedSine.push(elongatedSine.shift())
  let cyclesRequired = Math.ceil(length / elongatedSine.length) + 1
  let outputSine = []
  for(let i = 0; i <= cyclesRequired; i++) {
    outputSine = outputSine.concat(elongatedSine)
  }
  return outputSine.slice(0, length)
}

let digitsCopy = [...inputDigits]
for(let iter = 0; iter < 100; iter++) {
  let newDigits = []
  for(let i = 0; i < digitsCopy.length; i++) {
    let sine = buildSine(i + 1, digitsCopy.length)
    let out = 0
    for(let j = 0; j < digitsCopy.length; j++) {
      out += digitsCopy[j] * sine[j]
    }
    newDigits.push(Math.abs(out) % 10)
  }
  digitsCopy = newDigits
}

console.log('Part 1:', digitsCopy.slice(0, 8).join(''))

// Naïve:
//
// for(let iter = 0; iter < 100; iter++) {
//   let newDigits = []
//   for(let i = 0; i < bigDigits.length; i++) {
//     let sine = buildSine(i + 1, bigDigits.length)
//     let out = 0
//     for(let j = 0; j < bigDigits.length; j++) {
//       out += bigDigits[j] * sine[j]
//     }
//     newDigits.push(Math.abs(out) % 10)
//   }
//   bigDigits = newDigits
// }
// let outputMessage = bigDigits.slice(offset, offset + 8).join('')
// console.log('Part 2:', outputMessage)

let offset = Number(inputDigits.slice(0, 7).join(''))
let bigDigits = []
for (let i = 0; i < 10000; i++) {
  bigDigits.push(...inputDigits)
}

// Tricksy hobbitses:
//
// We can make this gross simplification because our "sine wave"
// for the latter half of bigDigits would be of the form:
//   11111111
//   01111111
//   00111111
//   00011111
//   00001111
//   00000111
//   00000011
//   00000001
bigDigits = bigDigits.slice(offset);
for (let iter = 0; iter < 100; iter++) {
  for (let i = bigDigits.length - 1; i >= 0; i--) {
    bigDigits[i] = Math.abs((bigDigits[i + 1] || 0) + bigDigits[i]) % 10;
  }
}
console.log('Part 2:', bigDigits.slice(0, 8).join(''));
