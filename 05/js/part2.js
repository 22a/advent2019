const fs = require("fs");
const contents = fs.readFileSync("../input.txt", "utf8").trim();
const memory = contents.split(",").map(Number);

let pc = 0;
let inputBuffer = [5];

while (memory[pc] !== 99) {
  const opcode = memory[pc] % 100;
  const paramModes = [
    ...Math.floor(memory[pc] / 100)
      .toString()
      .padStart(3, "0")
  ]
    .reverse()
    .map(Number);

  switch (opcode) {
    case 1:
      memory[memory[pc + 3]] =
        (paramModes[0] === 0 ? memory[memory[pc + 1]] : memory[pc + 1]) +
        (paramModes[1] === 0 ? memory[memory[pc + 2]] : memory[pc + 2]);
      pc += 4;
      break;
    case 2:
      memory[memory[pc + 3]] =
        (paramModes[0] === 0 ? memory[memory[pc + 1]] : memory[pc + 1]) *
        (paramModes[1] === 0 ? memory[memory[pc + 2]] : memory[pc + 2]);
      pc += 4;
      break;
    case 3:
      memory[memory[pc + 1]] = inputBuffer.shift();
      pc += 2;
      break;
    case 4:
      const output =
        paramModes[0] === 0 ? memory[memory[pc + 1]] : memory[pc + 1];
      if (output) {
        console.log(output);
      }
      pc += 2;
      break;
    case 5:
      const condition =
        paramModes[0] === 0 ? memory[memory[pc + 1]] : memory[pc + 1];
      if (condition) {
        const branchAddress =
          paramModes[1] === 0 ? memory[memory[pc + 2]] : memory[pc + 2];
        pc = branchAddress;
      } else {
        pc += 3;
      }
      break;
    case 6:
      const shouldBranch =
        paramModes[0] === 0 ? memory[memory[pc + 1]] : memory[pc + 1];
      if (!shouldBranch) {
        const branchAddress =
          paramModes[1] === 0 ? memory[memory[pc + 2]] : memory[pc + 2];
        pc = branchAddress;
      } else {
        pc += 3;
      }
      break;
    case 7:
      memory[memory[pc + 3]] =
        (paramModes[0] === 0 ? memory[memory[pc + 1]] : memory[pc + 1]) <
        (paramModes[1] === 0 ? memory[memory[pc + 2]] : memory[pc + 2])
          ? 1
          : 0;
      pc += 4;
      break;
    case 8:
      memory[memory[pc + 3]] =
        (paramModes[0] === 0 ? memory[memory[pc + 1]] : memory[pc + 1]) ===
        (paramModes[1] === 0 ? memory[memory[pc + 2]] : memory[pc + 2])
          ? 1
          : 0;
      pc += 4;
      break;
    default:
      console.log(`Error: bad opcode (${memory[pc]})`);
  }
}
