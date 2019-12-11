const fs = require("fs");
const contents = fs.readFileSync("../input.txt", "utf8").trim();
const memory = contents.split(",").map(Number);
for (let i = 0; i < 1000; i++) {
  memory.push(0);
}

for(let i of [0, 1]) {
  let canvasHeight = i === 0 ? 1000 : 10
  let canvasWidth = i === 0 ? 1000 : 10
  let canvas = []
  for (let yi = 0; yi < canvasHeight; yi++) {
    canvas[yi] = []
    for (let xi = 0; xi < canvasWidth; xi++) {
      canvas[yi][xi] = 0
    }
  }
  let x = canvasWidth/2
  let y = canvasHeight/2
  canvas[y][x] = i
  let direction = 'up'
  let scratchMemory = [...memory]
  let pc = 0;
  let relativeBase = 0;
  let outputMode = 0
  let paintedCoords = new Set()

  while (scratchMemory[pc] !== 99) {
    const opcode = scratchMemory[pc] % 100;
    const paramModes = [
      ...Math.floor(scratchMemory[pc] / 100)
        .toString()
        .padStart(3, "0")
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
        scratchMemory[(paramModes[0] === 2 ? relativeBase : 0) + scratchMemory[pc + 1]] = canvas[y][x]
        pc += 2;
        break;
      case 4:
        const output =
          paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]] : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        if (outputMode === 0) {
          canvas[y][x] = output
          paintedCoords.add(`${x},${y}`)
        } else {
          switch(direction) {
            case 'up':
              direction = output ? 'right' : 'left'
              break
            case 'down':
              direction = output ? 'left' : 'right'
              break
            case 'left':
              direction = output ? 'up' : 'down'
              break
            case 'right':
              direction = output ? 'down' : 'up'
              break
          }
          switch(direction) {
            case 'up':
              y++
              break
            case 'down':
              y--
              break
            case 'left':
              x--
              break
            case 'right':
              x++
              break
          }
        }
        outputMode = outputMode === 1 ? 0 : 1
        pc += 2;
        break;
      case 5:
        const condition =
          paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        if (condition) {
          const branchAddress =
            paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : paramModes[1] === 1 ? scratchMemory[pc + 2] : scratchMemory[relativeBase + scratchMemory[pc + 2]];
          pc = branchAddress;
        } else {
          pc += 3;
        }
        break;
      case 6:
        const shouldBranch =
          paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        if (!shouldBranch) {
          const branchAddress =
            paramModes[1] === 0 ? scratchMemory[scratchMemory[pc + 2]] : paramModes[1] === 1 ? scratchMemory[pc + 2] : scratchMemory[relativeBase + scratchMemory[pc + 2]];
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
        const relativeBaseOffset =
          paramModes[0] === 0 ? scratchMemory[scratchMemory[pc + 1]] : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        relativeBase += relativeBaseOffset;
        pc += 2;
        break;
      default:
        console.log(`Error: bad opcode (${scratchMemory[pc]})`);
    }
  }

  if (i === 0) {
    console.log('Part 1:', paintedCoords.size)
  } else {
    console.log('Part 2:')
    canvas
      .reverse()
      .forEach(row =>
        console.log(
          row
          .join('')
          .replace(/0/gi, ' ')
          .replace(/1/gi, '#')
        )
      )
  }
}
