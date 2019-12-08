defmodule Day04 do
  @range 134792..675810

  defp list_is_in_ascending_order(list) do
    list == Enum.sort(list)
  end

  defp list_has_at_least_two_matching_adjacent_entries(list) do
    length(list) > length(Enum.dedup(list))
  end

  defp list_has_exactly_two_matching_adjacent_entries(list) do
    {adj_dupe_counts, _} = Enum.reduce(list, {Map.new, nil}, fn digit, {adj_dupe_counts, last} ->
      if digit == last do
        {Map.put(adj_dupe_counts, digit, Map.get(adj_dupe_counts, digit, 0) + 1), digit}
      else
        {adj_dupe_counts, digit}
      end
    end)
    adj_dupe_counts
    |> Map.values
    |> Enum.any?(&(&1 == 1))
  end


  def part_1 do
    @range
    |> Enum.filter(fn number ->
      digits = Integer.digits(number)
      list_is_in_ascending_order(digits) && list_has_at_least_two_matching_adjacent_entries(digits)
    end)
    |> length
  end

  def part_2 do
    @range
    |> Enum.filter(fn number ->
      digits = Integer.digits(number)
      list_is_in_ascending_order(digits) && list_has_exactly_two_matching_adjacent_entries(digits)
    end)
    |> length
  end
end

IO.puts "Part 1: #{Day04.part_1}"
IO.puts "Part 2: #{Day04.part_2}"
