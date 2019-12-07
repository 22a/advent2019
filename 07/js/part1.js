const fs = require("fs")
const contents = fs.readFileSync("../input.txt", "utf8").trim()
const memory = contents.split(",").map(Number)

const permutator = (inputArr) => {
  let result = []
  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice()
        let next = curr.splice(i, 1)
        permute(curr.slice(), m.concat(next))
     }
   }
 }
 permute(inputArr)
 return result
}

const phaseConfigOutputs = []

for(let proposedPhaseConfig of permutator([0,1,2,3,4])) {
  let previousStageOutputVoltage = 0

  for (let phase of proposedPhaseConfig) {
    let pc = 0
    let inputBuffer = [phase, previousStageOutputVoltage]
    let scratchMemory = [...memory]

    while (scratchMemory[pc] !== 99) {
      const opcode = scratchMemory[pc] % 100
      const paramModes = [
        ...Math.floor(scratchMemory[pc] / 100)
          .toString()
          .padStart(3, "0")
      ]
        .reverse()
        .map(Number)

      switch (opcode) {
        case 1:
          scratchMemory[scratchMemory[pc + 3]] =
            (paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : scratchMemory[pc + 1]) +
            (paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : scratchMemory[pc + 2])
          pc += 4
          break
        case 2:
          scratchMemory[scratchMemory[pc + 3]] =
            (paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : scratchMemory[pc + 1]) *
            (paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : scratchMemory[pc + 2])
          pc += 4
          break
        case 3:
          scratchMemory[scratchMemory[pc + 1]] = inputBuffer.shift()
          pc += 2
          break
        case 4:
          const output =
            paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : scratchMemory[pc + 1]
          if (output) {
            previousStageOutputVoltage = output
          }
          pc += 2
          break
        case 5:
          const condition =
            paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : scratchMemory[pc + 1]
          if (condition) {
            const branchAddress =
              paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : scratchMemory[pc + 2]
            pc = branchAddress
          } else {
            pc += 3
          }
          break
        case 6:
          const shouldBranch =
            paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : scratchMemory[pc + 1]
          if (!shouldBranch) {
            const branchAddress =
              paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : scratchMemory[pc + 2]
            pc = branchAddress
          } else {
            pc += 3
          }
          break
        case 7:
          scratchMemory[scratchMemory[pc + 3]] =
            (paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : scratchMemory[pc + 1]) <
            (paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : scratchMemory[pc + 2])
              ? 1
              : 0
          pc += 4
          break
        case 8:
          scratchMemory[scratchMemory[pc + 3]] =
            (paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : scratchMemory[pc + 1]) ===
            (paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : scratchMemory[pc + 2])
              ? 1
              : 0
          pc += 4
          break
        default:
          console.log(`Error: bad opcode (${scratchMemory[pc]})`)
      }
    }
  }
  phaseConfigOutputs.push(previousStageOutputVoltage)
}

console.log(Math.max(...phaseConfigOutputs))
