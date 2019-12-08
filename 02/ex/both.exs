defmodule Day02 do
  defp read_input_line(filename) do
    File.read!(filename)
    |> String.trim
  end

  defp apply_setup_mutation([head, _, _ | tail], a, b) do
    [head, a, b | tail]
  end

  defp mutate_memory(memory, address, new_value) do
    {before_target, [_|after_target]} = Enum.split(memory, address)
    before_target ++ [new_value | after_target]
  end

  defp run_program(memory, pc) do
    op_id = Enum.at(memory, pc)
    dest_index = Enum.at(memory, pc + 3)
    arg_0_index = Enum.at(memory, pc + 1)
    arg_0_value = Enum.at(memory, arg_0_index)
    arg_1_index = Enum.at(memory, pc + 2)
    arg_1_value = Enum.at(memory, arg_1_index)
    case op_id do
      99 ->
        memory

      op when op in 1..2 ->
        fun = case op do
          1 -> &+/2
          2 -> &*/2
        end
        new_value = fun.(arg_0_value, arg_1_value)
        memory
        |> mutate_memory(dest_index, new_value)
        |> run_program(pc + 4)

      unknown_op_id ->
        IO.warn "Invalid op_id: (#{unknown_op_id})"
        System.exit(1)
    end
  end

  defp gen_noun_verb_pairs(range_start, range_end) do
    range_start..range_end
    |> Enum.flat_map(
      &Stream.zip(Stream.cycle([&1]), range_start..range_end)
    )
  end

  def part_1 do
    read_input_line("../input.txt")
    |> String.split(",")
    |> Enum.map(&String.to_integer/1)
    |> apply_setup_mutation(12, 2)
    |> run_program(0)
    |> List.first
  end

  def part_2 do
    target_output = 19690720

    memory =
      read_input_line("../input.txt")
      |> String.split(",")
      |> Enum.map(&String.to_integer/1)

    {target_noun, target_verb} =
      gen_noun_verb_pairs(0, 99)
      |> Enum.find(fn {noun, verb} ->
        memory
        |> apply_setup_mutation(noun, verb)
        |> run_program(0)
        |> List.first
        |> (&==/2).(target_output)
      end)

    (target_noun * 100) + target_verb
  end
end

IO.puts "Part 1: #{Day02.part_1}"
IO.puts "Part 2: #{Day02.part_2}"
