const fs = require("fs");
const contents = fs.readFileSync("../wonky.txt", "utf8").trim();
const memory = contents.split(",").map(Number);

for (let _i of [1]) {
  const scratchMemory = [...memory];
  scratchMemory[0] = 2;
  let pc = 0;
  let relativeBase = 0;

  let screenWidth = 44;
  let screenHeight = 20;
  let screen = [];
  for (let y = 0; y < screenHeight; y++) {
    screen.push([]);
    for (let x = 0; x < screenWidth; x++) {
      screen[y].push(0);
    }
  }

  let score = 0;

  let cmdBuffer = [];

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
        scratchMemory[
          (paramModes[2] === 2 ? relativeBase : 0) + scratchMemory[pc + 3]
        ] =
          (paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1
              ? scratchMemory[pc + 1]
              : scratchMemory[relativeBase + scratchMemory[pc + 1]]) +
          (paramModes[1] === 0
            ? scratchMemory[scratchMemory[pc + 2]]
            : paramModes[1] === 1
              ? scratchMemory[pc + 2]
              : scratchMemory[relativeBase + scratchMemory[pc + 2]]);
        pc += 4;
        break;
      case 2:
        scratchMemory[
          (paramModes[2] === 2 ? relativeBase : 0) + scratchMemory[pc + 3]
        ] =
          (paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1
              ? scratchMemory[pc + 1]
              : scratchMemory[relativeBase + scratchMemory[pc + 1]]) *
          (paramModes[1] === 0
            ? scratchMemory[scratchMemory[pc + 2]]
            : paramModes[1] === 1
              ? scratchMemory[pc + 2]
              : scratchMemory[relativeBase + scratchMemory[pc + 2]]);
        pc += 4;
        break;
      case 3:
        scratchMemory[
          (paramModes[0] === 2 ? relativeBase : 0) + scratchMemory[pc + 1]
        ] = 0; // never move the paddle :)
        pc += 2;
        break;
      case 4:
        const output =
          paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1
              ? scratchMemory[pc + 1]
              : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        cmdBuffer.push(output);
        if (cmdBuffer.length === 3) {
          const [x, y, tileId] = cmdBuffer;
          if (x === -1) {
            score = tileId;
            cmdBuffer = [];
          } else {
            screen[y][x] = tileId;
            cmdBuffer = [];
          }
        }
        pc += 2;
        break;
      case 5:
        const condition =
          paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1
              ? scratchMemory[pc + 1]
              : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        if (condition) {
          const branchAddress =
            paramModes[1] === 0
              ? scratchMemory[scratchMemory[pc + 2]]
              : paramModes[1] === 1
                ? scratchMemory[pc + 2]
                : scratchMemory[relativeBase + scratchMemory[pc + 2]];
          pc = branchAddress;
        } else {
          pc += 3;
        }
        break;
      case 6:
        const shouldBranch =
          paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1
              ? scratchMemory[pc + 1]
              : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        if (!shouldBranch) {
          const branchAddress =
            paramModes[1] === 0
              ? scratchMemory[scratchMemory[pc + 2]]
              : paramModes[1] === 1
                ? scratchMemory[pc + 2]
                : scratchMemory[relativeBase + scratchMemory[pc + 2]];
          pc = branchAddress;
        } else {
          pc += 3;
        }
        break;
      case 7:
        scratchMemory[
          (paramModes[2] === 2 ? relativeBase : 0) + scratchMemory[pc + 3]
        ] =
          (paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1
              ? scratchMemory[pc + 1]
              : scratchMemory[relativeBase + scratchMemory[pc + 1]]) <
          (paramModes[1] === 0
            ? scratchMemory[scratchMemory[pc + 2]]
            : paramModes[1] === 1
              ? scratchMemory[pc + 2]
              : scratchMemory[relativeBase + scratchMemory[pc + 2]])
            ? 1
            : 0;
        pc += 4;
        break;
      case 8:
        scratchMemory[
          (paramModes[2] === 2 ? relativeBase : 0) + scratchMemory[pc + 3]
        ] =
          (paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1
              ? scratchMemory[pc + 1]
              : scratchMemory[relativeBase + scratchMemory[pc + 1]]) ===
          (paramModes[1] === 0
            ? scratchMemory[scratchMemory[pc + 2]]
            : paramModes[1] === 1
              ? scratchMemory[pc + 2]
              : scratchMemory[relativeBase + scratchMemory[pc + 2]])
            ? 1
            : 0;
        pc += 4;
        break;
      case 9:
        const relativeBaseOffset =
          paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1
              ? scratchMemory[pc + 1]
              : scratchMemory[relativeBase + scratchMemory[pc + 1]];
        relativeBase += relativeBaseOffset;
        pc += 2;
        break;
      default:
        console.log(`Error: bad opcode (${scratchMemory[pc]})`);
    }
  }
  screen.forEach(row => {
    console.log(row.join("").replace(/0/gi, " "));
  });
  console.log(score);
}
