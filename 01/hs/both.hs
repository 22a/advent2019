massToFuelRequirement :: Integer -> Integer
massToFuelRequirement m = (m `div` 3) - 2

selfAwareMassToFuelRequirement :: Integer -> Integer
selfAwareMassToFuelRequirement m
  | fuelRequirement > 0 = fuelRequirement + selfAwareMassToFuelRequirement fuelRequirement
  | otherwise = 0
  where fuelRequirement = massToFuelRequirement m

main = do
    inputFile <- readFile "../input.txt"
    let masses = map read $ lines inputFile
    print $ foldr (+) 0 (map massToFuelRequirement masses)
    print $ foldr (+) 0 (map selfAwareMassToFuelRequirement masses)
