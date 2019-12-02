const fs = require('fs')
const contents = fs.readFileSync('../input.txt', 'utf8').trim()
const ops = contents.split(',').map(Number)

// Initial memory overrides
ops[1] = 12
ops[2] = 2

let pc = 0

while (ops[pc] !== 99) {
  switch (ops[pc]) {
    case 1:
      ops[ops[pc+3]] = ops[ops[pc+1]] + ops[ops[pc+2]]
      break
    case 2:
      ops[ops[pc+3]] = ops[ops[pc+1]] * ops[ops[pc+2]]
      break
    default:
      console.log(`Error: bad opcode (${ops[pc]})`)
  }
  pc+=4
}

console.log(ops[0])
