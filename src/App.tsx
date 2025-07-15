import { useState, useMemo } from "react";
import { Select } from "./components/atoms/select/select";

// Option type for select items
interface Option {
  id: number;
  title: string;
  color: string;
  group: string;
}

export const App = () => {
  const [selectedFirst, setSelectedFirst] = useState<Option | null>(null);
  const [selectedSecond, setSelectedSecond] = useState<Option | null>(null);

  // Example static options with a group property
  const options: Option[] = [
    { id: 1, title: "yellow", color: "yellow", group: "A" },
    { id: 2, title: "blue", color: "blue", group: "A" },
    { id: 3, title: "green", color: "green", group: "B" },
    { id: 4, title: "red", color: "red", group: "B" },
  ];

  // Filter second select options based on first selection
  const filteredOptions = useMemo(() => {
    if (!selectedFirst) return options;
    return options.filter(opt => opt.group === selectedFirst.group && opt.id !== selectedFirst.id);
  }, [selectedFirst, options]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Select
        options={options}
        valueKey="id"
        titleKey="title"
        variant="outlined"
        color="primary"
        multiple={false}
        value={selectedFirst}
        onChange={value => {
          setSelectedFirst(value as Option);
          setSelectedSecond(null); // Completely reset second select
        }}
        label="First Select"
        id="first-select"
        editMode={false}
      />

      <Select
        options={filteredOptions}
        valueKey="id"
        titleKey="title"
        variant="outlined"
        color="primary"
        multiple={false}
        value={selectedSecond}
        onChange={value => setSelectedSecond(value as Option)}
        label="Second Select"
        id="second-select"
        editMode={false}
      />
    </div>
  );
};
