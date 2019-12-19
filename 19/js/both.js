const fs = require('fs');
const contents = fs.readFileSync('../input.txt', 'utf8').trim();
const memory = contents.split(',').map(Number);

// These intcode problems aren't fun anymore
const checkCoord = (x, y) => {
  const scratchMemory = [...memory];
  let pc = 0;
  let relativeBase = 0;
  let inputBuffer = [x, y];

  while (scratchMemory[pc] !== 99) {
    const opcode = scratchMemory[pc] % 100;
    const paramModes = [
      ...Math.floor(scratchMemory[pc] / 100)
        .toString()
        .padStart(3, '0')
    ]
      .reverse()
      .map(Number);

    switch (opcode) {
      case 1:
        scratchMemory[(paramModes[2] === 2 ? relativeBase : 0) + scratchMemory[pc + 3]] =
          (paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]]) +
          (paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : paramModes[1] === 1 ? scratchMemory[pc + 2] : scratchMemory[relativeBase + scratchMemory[pc + 2]]);
        pc += 4;
        break;
      case 2:
        scratchMemory[(paramModes[2] === 2 ? relativeBase : 0) + scratchMemory[pc + 3]] =
          (paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]]) *
          (paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : paramModes[1] === 1 ? scratchMemory[pc + 2] : scratchMemory[relativeBase + scratchMemory[pc + 2]]);
        pc += 4;
        break;
      case 3:
        scratchMemory[(paramModes[0] === 2 ? relativeBase : 0) + scratchMemory[pc + 1]] =
          inputBuffer.shift();
        pc += 2;
        break;
      case 4:
        const output = paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]];

        pc += 2;
        return output
      case 5:
        const condition = paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        if (condition) {
          const branchAddress = paramModes[1] === 0
              ? scratchMemory[scratchMemory[pc + 2]]
              : paramModes[1] === 1 ? scratchMemory[pc + 2] : scratchMemory[relativeBase + scratchMemory[pc + 2]];
          pc = branchAddress;
        } else {
          pc += 3;
        }
        break;
      case 6:
        const shouldBranch = paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        if (!shouldBranch) {
          const branchAddress = paramModes[1] === 0
              ? scratchMemory[scratchMemory[pc + 2]]
              : paramModes[1] === 1 ? scratchMemory[pc + 2] : scratchMemory[relativeBase + scratchMemory[pc + 2]];
          pc = branchAddress;
        } else {
          pc += 3;
        }
        break;
      case 7:
        scratchMemory[(paramModes[2] === 2 ? relativeBase : 0) + scratchMemory[pc + 3]] =
          (paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]]) <
          (paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : paramModes[1] === 1 ? scratchMemory[pc + 2] : scratchMemory[relativeBase + scratchMemory[pc + 2]])
            ? 1 : 0;
        pc += 4;
        break;
      case 8:
        scratchMemory[(paramModes[2] === 2 ? relativeBase : 0) + scratchMemory[pc + 3]] =
          (paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]]) ===
          (paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : paramModes[1] === 1 ? scratchMemory[pc + 2] : scratchMemory[relativeBase + scratchMemory[pc + 2]])
            ? 1 : 0;
        pc += 4;
        break;
      case 9:
        const relativeBaseOffset = paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        relativeBase += relativeBaseOffset;
        pc += 2;
        break;
      default:
        console.log(`Error: bad opcode (${scratchMemory[pc]})`);
    }
  }
}

let gridWidth = 50;
let gridHeight = 50;
let pulledCount = 0;
for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {
    pulledCount += checkCoord(x, y)
  }
}
console.log('Part 1:', pulledCount)

// brute force scatter fill :)
// takes ~1 min on a z1d.large, ~3 on my laptop
gridWidth = 2000;
gridHeight = 1000;
const grid = []
for (let y = 0; y < gridHeight; y++) {
  grid[y] = []
  for (let x = 0; x < gridWidth; x++) {
    grid[y].push(0)
  }
}
let sideLength = 100
let slo = sideLength - 1
for (let y = slo; y < gridHeight; y++) {
  for (let x = slo; x < gridWidth; x++) {
    grid[y][x] = checkCoord(x, y)
  }
}
for (let y = slo; y < gridHeight-slo; y++) {
  for (let x = slo; x < gridWidth-slo; x++) {
    if (grid[y][x+slo] && grid[y+slo][x]) {
      console.log('Part 2:', x * 10000 + y)
      process.exit(0)
    }
  }
}
