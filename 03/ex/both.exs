defmodule Day03 do
  @origin {0,0}

  defp read_input_lines(filename) do
    File.read!(filename)
    |> String.trim
    |> String.split("\n")
  end

  defp parse_path(path_string) do
    {dir_string, dist_string} = path_string
                                |> String.split_at(1)
    {String.to_atom(dir_string), String.to_integer(dist_string)}
  end

  defp wire_path_to_coord_costs({direction, distance}, {starting_x, starting_y}, starting_cost) do
    {xs, ys, new_x, new_y} = case {direction, distance} do
      {:U, dist} ->
        new_y = starting_y + dist
        {
          Stream.cycle([starting_x]),
          starting_y..new_y,
          starting_x,
          new_y
        }

      {:D, dist} ->
        new_y = starting_y - dist
        {
          Stream.cycle([starting_x]),
          starting_y..new_y,
          starting_x,
          new_y
        }

      {:L, dist} ->
        new_x = starting_x - dist
        {
          starting_x..new_x,
          Stream.cycle([starting_y]),
          new_x,
          starting_y
        }

      {:R, dist} ->
        new_x = starting_x + dist
        {
          starting_x..new_x,
          Stream.cycle([starting_y]),
          new_x,
          starting_y
        }
    end
    end_cost = starting_cost + distance
    cost_range = starting_cost..end_cost
    wire_coord_costs = Enum.zip(xs, ys)
                       |> Enum.zip(cost_range)
                       |> Enum.into(Map.new)
    {wire_coord_costs, {new_x, new_y}, end_cost}
  end

  defp wire_to_coord_costs([wire|tail], coords, starting_cost) do
    {wire_coords, next_coords, new_cost} =
      wire_path_to_coord_costs(wire, coords, starting_cost)
    Map.merge(wire_coords, wire_to_coord_costs(tail, next_coords, new_cost))
  end
  defp wire_to_coord_costs([], _coords, _cost) do
    Map.new
  end

  def part_1 do
    [wire_0, wire_1] =
      read_input_lines("../input.txt")
      |> Enum.map(fn wire_paths_string ->
        wire_paths_string
        |> String.split(",")
        |> Enum.map(&parse_path/1)
      end)

    MapSet.intersection(
      wire_to_coord_costs(wire_0, @origin, 0)
      |> Map.keys
      |> MapSet.new,
      wire_to_coord_costs(wire_1, @origin, 0)
      |> Map.keys
      |> MapSet.new
    )
    |> MapSet.delete(@origin)
    |> MapSet.to_list
    |> Enum.map(fn {x, y} -> x + y end)
    |> Enum.min
  end

  def part_2 do
    [wire_costs_0, wire_costs_1] =
      read_input_lines("../input.txt")
      |> Enum.map(fn wire_paths_string ->
        wire_paths_string
        |> String.split(",")
        |> Enum.map(&parse_path/1)
      end)
      |> Enum.map(&wire_to_coord_costs(&1, @origin, 0))
      |> Enum.map(&Map.delete(&1, @origin))

    MapSet.intersection(
      wire_costs_0 |> Map.keys |> MapSet.new,
      wire_costs_1 |> Map.keys |> MapSet.new
    )
    |> Enum.map(fn coords ->
      Map.fetch!(wire_costs_0, coords) + Map.fetch!(wire_costs_1, coords)
    end)
    |> Enum.min
  end
end

IO.puts "Part 1: #{Day03.part_1}"
IO.puts "Part 2: #{Day03.part_2}"
