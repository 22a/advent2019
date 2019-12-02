const fs = require('fs')
const contents = fs.readFileSync('../input.txt', 'utf8').trim()
const ops = contents.split(',').map(Number)

const targetOutput = 19690720

for(let noun = 0; noun < 100; noun++) {
  for(let verb = 0; verb < 100; verb++) {
    let pc = 0
    const scratch = [...ops]
    scratch[1] = noun
    scratch[2] = verb

    while (scratch[pc] !== 99) {
      switch (scratch[pc]) {
        case 1:
          scratch[scratch[pc+3]] = scratch[scratch[pc+1]] + scratch[scratch[pc+2]]
          break
        case 2:
          scratch[scratch[pc+3]] = scratch[scratch[pc+1]] * scratch[scratch[pc+2]]
          break
        default:
          console.log(`Error: bad opcode (${scratch[pc]})`)
      }
      pc+=4
    }
    if (scratch[0] === targetOutput) {
      console.log({noun, verb, result : (100 * noun) + verb})
    }
  }
}
