const fs = require("fs");
const contents = fs.readFileSync("../input.txt", "utf8").trim();
const memory = contents.split(",").map(Number);

for (let part of [1, 2]) {
  const scratchMemory = [...memory];
  let pc = 0;
  let relativeBase = 0;
  let inputBuffer = []
  let outputBuffer = []

  let x = 0
  let y = 0
  let robotX = 0
  let robotY = 0
  let map = []
  const mapHeight = 1000
  const mapWidth = 1000
  for (let i = 0; i < mapHeight; i++) {
    map.push([])
    for (let j = 0; j < mapWidth; j++) {
      map[i].push(0)
    }
  }

  if (part === 2) {
    scratchMemory[0] = 2
    // 'R,8,L,10,L,12,R,4,R,8,L,12,R,4,R,4,R,8,L,10,L,12,R,4,R,8,L,10,R,8,R,8,L,10,L,12,R,4,R,8,L,12,R,4,R,4,R,8,L,10,R,8,R,8,L,12,R,4,R,4,R,8,L,10,R,8,R,8,L,12,R,4,R,4,'
    // ['R,8,L,10,L,12,R,4,', 'R,8,L,12,R,4,R,4,', 'R,8,L,10,R,8,']
    // ABACABCBCB
    let main = 'A,B,A,C,A,B,C,B,C,B\n'
    let routineA = 'R,8,L,10,L,12,R,4\n'
    let routineB = 'R,8,L,12,R,4,R,4\n'
    let routineC = 'R,8,L,10,R,8\n'
    let continuousVideoFeed = 'n\n'
    inputBuffer = [
      ...(main + routineA + routineB + routineC + continuousVideoFeed)
        .split('')
        .map(c => c.charCodeAt())
    ];
  }

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
        scratchMemory[(paramModes[0] === 2 ? relativeBase : 0) + scratchMemory[pc + 1]] =
          inputBuffer.shift();
        pc += 2;
        break;
      case 4:
        const output = paramModes[0] === 0
            ? scratchMemory[scratchMemory[pc + 1]]
            : paramModes[0] === 1 ? scratchMemory[pc + 1] : scratchMemory[relativeBase + scratchMemory[pc + 1]];

        if (output) {
          if (output === 10) {
            y++
            x = 0
          } else {
            map[y][x] = String.fromCharCode(output)
            if (['^','v','>','<'].includes(map[y][x])) {
              robotX = x
              robotY = y
            }
            x++
          }
        }
        outputBuffer.push(output)
        pc += 2;
        break;
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
  // lol this is way over complicated, here we traverse the scaffold
  // instead of simply analysing neighbour counts in the map
  if (part === 1) {
    let movements = []
    let direction;
    if (map[robotY][robotX+1] === '#') {
      direction = 'right';
      movements.push('R')
    } else if (map[robotY][robotX-1] === '#') {
      direction = 'left';
      movements.push('L')
    } else if (map[robotY + 1][robotX] === '#') {
      direction = 'up';
    } else if (map[robotY - 1][robotX] === '#') {
      direction = 'down';
    } else {
      console.log('Couldn\'t seed initial robot direction')
      process.exit(1)
    }

    let done = false
    let seen = new Set()
    let intersections = []
    while(!done) {
      let shouldSeek = false
      switch (direction) {
        case 'right':
          if (map[robotY][robotX+1] === '#') {
            robotX++
          } else {
            shouldSeek = true;
          }
          break
        case 'left':
          if (map[robotY][robotX-1] === '#') {
            robotX--
          } else {
            shouldSeek = true;
          }
          break
        case 'up':
          if (map[robotY+1][robotX] === '#') {
            robotY++
          } else {
            shouldSeek = true;
          }
          break
        case 'down':
          if (map[robotY-1] && map[robotY-1][robotX] === '#') {
            robotY--
          } else {
            shouldSeek = true;
          }
          break
        default:
          console.log(`Error invalid direction ${direction}`)
          process.exit(1)
      }
      if (shouldSeek) {
        switch (direction) {
          case 'right':
          case 'left':
            if (map[robotY + 1][robotX] === '#') {
              direction = 'up';
              robotY++
            } else if (map[robotY - 1] && map[robotY - 1][robotX] === '#') {
              direction = 'down';
              robotY--
            } else {
              done = true
            }
            break
          case 'up':
          case 'down':
            if (map[robotY][robotX+1] === '#') {
              direction = 'right';
              robotX++
            } else if (map[robotY][robotX-1] === '#') {
              direction = 'left';
              robotX--
            } else {
              done = true
            }
            break
        }
      }
      if (!done && seen.has(`${robotX},${robotY}`)) {
        intersections.push(`${robotX},${robotY}`)
      } else {
        seen.add(`${robotX},${robotY}`)
      }
    }
    let alignmentParamatersSum = intersections.reduce((acc, i) => {
      let [a, b] = i.split(',').map(Number)
      return acc + (a * b)
    }, 0)
    console.log('Part 1:', alignmentParamatersSum);
  } else {
    console.log('Part 2:', outputBuffer[outputBuffer.length-1]);
  }
}
