massToFuelRequirement :: Integer -> Integer
massToFuelRequirement m = (m `div` 3) - 2

selfAwareMassToFuelRequirement :: Integer -> Integer
selfAwareMassToFuelRequirement m =
  if fuelRequirement > 0
    then fuelRequirement + selfAwareMassToFuelRequirement fuelRequirement
    else 0
      where fuelRequirement = massToFuelRequirement m

main = do
    inputFile <- readFile "../input.txt"
    let masses = map read $ lines inputFile
    print $ sum $ map massToFuelRequirement masses
    print $ sum $ map selfAwareMassToFuelRequirement masses
