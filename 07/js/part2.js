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

for(let proposedPhaseConfig of permutator([5,6,7,8,9])) {
  const ampMemories = []
  const pcs = []
  const inputBuffers = []
  for (let i = 0; i < proposedPhaseConfig.length; i++) {
    ampMemories[i] = [...memory]
    pcs[i] = 0
    inputBuffers[i] = []
    inputBuffers[i].push(proposedPhaseConfig[i])
  }

  inputBuffers[0].push(0)

  let lastAmpHasHalted = false
  while(!lastAmpHasHalted) {
    for (let i = 0; i < proposedPhaseConfig.length; i++) {
      let ampHasGivenOutput = false
      while (ampMemories[i][pcs[i]] !== 99 && !ampHasGivenOutput) {
        const opcode = ampMemories[i][pcs[i]] % 100
        const paramModes = [
          ...Math.floor(ampMemories[i][pcs[i]] / 100)
            .toString()
            .padStart(3, "0")
        ]
          .reverse()
          .map(Number)

        switch (opcode) {
          case 1:
            ampMemories[i][ampMemories[i][pcs[i] + 3]] =
              (paramModes[0] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 1]] : ampMemories[i][pcs[i] + 1]) +
              (paramModes[1] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 2]] : ampMemories[i][pcs[i] + 2])
            pcs[i] += 4
            break
          case 2:
            ampMemories[i][ampMemories[i][pcs[i] + 3]] =
              (paramModes[0] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 1]] : ampMemories[i][pcs[i] + 1]) *
              (paramModes[1] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 2]] : ampMemories[i][pcs[i] + 2])
            pcs[i] += 4
            break
          case 3:
            ampMemories[i][ampMemories[i][pcs[i] + 1]] = inputBuffers[i].shift()
            pcs[i] += 2
            break
          case 4:
            const output =
              paramModes[0] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 1]] : ampMemories[i][pcs[i] + 1]
            if (output) {
              inputBuffers[(i + 1) % 5].push(output)
              ampHasGivenOutput = true
            }
            pcs[i] += 2
            break
          case 5:
            const condition =
              paramModes[0] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 1]] : ampMemories[i][pcs[i] + 1]
            if (condition) {
              const branchAddress =
                paramModes[1] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 2]] : ampMemories[i][pcs[i] + 2]
              pcs[i] = branchAddress
            } else {
              pcs[i] += 3
            }
            break
          case 6:
            const shouldBranch =
              paramModes[0] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 1]] : ampMemories[i][pcs[i] + 1]
            if (!shouldBranch) {
              const branchAddress =
                paramModes[1] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 2]] : ampMemories[i][pcs[i] + 2]
              pcs[i] = branchAddress
            } else {
              pcs[i] += 3
            }
            break
          case 7:
            ampMemories[i][ampMemories[i][pcs[i] + 3]] =
              (paramModes[0] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 1]] : ampMemories[i][pcs[i] + 1]) <
              (paramModes[1] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 2]] : ampMemories[i][pcs[i] + 2])
                ? 1
                : 0
            pcs[i] += 4
            break
          case 8:
            ampMemories[i][ampMemories[i][pcs[i] + 3]] =
              (paramModes[0] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 1]] : ampMemories[i][pcs[i] + 1]) ===
              (paramModes[1] === 0 ? ampMemories[i][ampMemories[i][pcs[i] + 2]] : ampMemories[i][pcs[i] + 2])
                ? 1
                : 0
            pcs[i] += 4
            break
          default:
            console.log(`Error: bad opcode (${ampMemories[i][pcs[i]]})`)
        }
      }
      ampHasGivenOutput = false
      if (ampMemories[4][pcs[4]] === 99) {
        lastAmpHasHalted = true
      }
    }
  }
  if (inputBuffers[0][0]) {
    phaseConfigOutputs.push(inputBuffers[0][0])
  }
}

console.log(Math.max(...phaseConfigOutputs))
