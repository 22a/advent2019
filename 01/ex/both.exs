defmodule Day01 do
  defp read_input_lines(filename) do
    File.read!(filename)
    |> String.trim
    |> String.split("\n")
  end

  defp mass_to_fuel_requirement(mass) do
    div(mass, 3) - 2
  end

  defp self_aware_mass_to_fuel_requirement(mass) do
    if (fuel_req = mass_to_fuel_requirement(mass)) > 0 do
      fuel_req + self_aware_mass_to_fuel_requirement(fuel_req)
    else
      0
    end
  end

  def part_1 do
    read_input_lines("../input.txt")
    |> Enum.map(&String.to_integer/1)
    |> Enum.map(&mass_to_fuel_requirement/1)
    |> Enum.sum
  end

  def part_2 do
    read_input_lines("../input.txt")
    |> Enum.map(&String.to_integer/1)
    |> Enum.map(&self_aware_mass_to_fuel_requirement/1)
    |> Enum.sum
  end
end

IO.puts "Part 1: #{Day01.part_1}"
IO.puts "Part 2: #{Day01.part_2}"
