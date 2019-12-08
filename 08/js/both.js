const fs = require("fs")
const contents = fs.readFileSync("../input.txt", "utf8").trim()
const pixelValues = [...contents].map(Number)

const imageWidth = 25
const imageHeight = 6

const imageToLayers = ( imagePixelValues, width, height ) => {
  const layerLength = width * height
  const layers = []
  for (let i = 0; i < imagePixelValues.length; i+=layerLength) {
      layers.push(imagePixelValues.slice(i,i+layerLength))
  }
  return layers
}

const layers = imageToLayers(pixelValues, imageWidth, imageHeight)

const membershipCount = (layer, targetValue) =>
  layer.filter(pixelValues => pixelValues === targetValue).length

const layerWithLeastZeros = layers.reduce((acc, layer) => {
  const currentLayerTargetCount = membershipCount(layer, 0)
  if (currentLayerTargetCount < acc.currentMin) {
    return {currentMin: currentLayerTargetCount, currentMinLayer: layer}
  }
  return acc
}, {currentMin: Infinity, currentMinLayer: null}).currentMinLayer

console.log('Part 1:', membershipCount(layerWithLeastZeros, 1) * membershipCount(layerWithLeastZeros, 2))

const composite = [...layers[0]]
for (let i = 0; i < composite.length; i++) {
  let scratch = composite[i]
  let searchDepth = 0
  while(scratch === 2) {
    searchDepth++;
    scratch = layers[searchDepth][i]
    if (scratch === undefined) {
      break
    }
  }
  composite[i] = scratch
}

console.log('Part 2:')
imageToLayers(composite, imageWidth, 1).forEach(row =>
  console.log(
    row
    .join('')
    .replace(/0/gi, ' ')
    .replace(/1/gi, '#')
  )
)
