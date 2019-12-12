const fs = require("fs");
const contents = fs.readFileSync("../input.txt", "utf8").trim();
const lines = contents.split("\n");

const lineToPlanet = line => {
  const [x, y, z] = line
    .slice(1, -1)
    .split(",")
    .map(str => str.split("=")[1])
    .map(Number);
  return {
    x,
    y,
    z,
    vX: 0,
    vY: 0,
    vZ: 0
  };
};

const gcd = (a, b) => {
  if (b === 0) return a;
  return gcd(b, a % b);
};
const lcm2 = (a, b) => {
  if (b === 0) return 0;
  return (a * b) / gcd(a, b);
};

const lcm3 = (a, b, c) => lcm2(a, lcm2(b, c));

const clone = p => JSON.parse(JSON.stringify(p));

const hashDimension = (ps, key) => {
  const velocityKey = `v${key.toUpperCase()}`;
  return ps.map(p => `${p[key]},${p[velocityKey]}`).join(":");
};

const stepPlanets = ps => {
  [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].forEach(([j, k]) => {
    if (ps[j].x < ps[k].x) {
      ps[j].vX++;
      ps[k].vX--;
    } else if (ps[j].x > ps[k].x) {
      ps[j].vX--;
      ps[k].vX++;
    }

    if (ps[j].y < ps[k].y) {
      ps[j].vY++;
      ps[k].vY--;
    } else if (ps[j].y > ps[k].y) {
      ps[j].vY--;
      ps[k].vY++;
    }

    if (ps[j].z < ps[k].z) {
      ps[j].vZ++;
      ps[k].vZ--;
    } else if (ps[j].z > ps[k].z) {
      ps[j].vZ--;
      ps[k].vZ++;
    }
  });

  ps.forEach(planet => {
    planet.x += planet.vX;
    planet.y += planet.vY;
    planet.z += planet.vZ;
  });

  return ps;
};

let planets = lines.map(lineToPlanet);

const iterations = 1000;
let scratchPlanets = clone(planets);
for (let i = 0; i < iterations; i++) {
  scratchPlanets = stepPlanets(scratchPlanets);
}

const sum = arr => arr.reduce((acc, a) => acc + a, 0);

const energyOfPlanet = p =>
  sum([p.x, p.y, p.z].map(Math.abs)) * sum([p.vX, p.vY, p.vZ].map(Math.abs));

console.log(
  "Part 1:",
  scratchPlanets.map(energyOfPlanet).reduce((acc, i) => acc + i, 0)
);

const cycleLength = (p, key) => {
  let i = 1;
  let startHash = hashDimension(p, key);
  let currentSimulationStep = stepPlanets(clone(p));
  while (startHash !== hashDimension(currentSimulationStep, key)) {
    currentSimulationStep = stepPlanets(currentSimulationStep);
    i++;
  }
  return i;
};

let combinedCycleTime = lcm3(
  cycleLength(planets, "x"),
  cycleLength(planets, "y"),
  cycleLength(planets, "z")
);

console.log("Part 2:", combinedCycleTime);
