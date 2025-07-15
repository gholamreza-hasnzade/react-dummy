import { useState, useMemo } from "react";
import { Select } from "./components/atoms/select/select";

// Example: two independent lists
const firstOptions = [
  { id: 1, title: "yellow", group: "A" },
  { id: 2, title: "blue", group: "A" },
  { id: 3, title: "green", group: "B" },
  { id: 4, title: "red", group: "B" },
];

const secondOptions = [
  { id: 10, title: "banana", group: "A" },
  { id: 11, title: "sky", group: "A" },
  { id: 12, title: "grass", group: "B" },
  { id: 13, title: "apple", group: "B" },
];

export const App = () => {
  const [selectedFirst, setSelectedFirst] = useState<typeof firstOptions[0] | undefined>(undefined);
  const [selectedSecond, setSelectedSecond] = useState<typeof secondOptions[0] | undefined>(undefined);

  // Filter second select options based on first selection's group
  const filteredSecondOptions = useMemo(() => {
    if (!selectedFirst) return secondOptions;
    return secondOptions.filter(opt => opt.group === selectedFirst.group);
  }, [selectedFirst]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Select
        options={firstOptions}
        valueKey="id"
        titleKey="title"
        variant="outlined"
        color="primary"
        multiple={false}
        value={selectedFirst}
        onChange={value => {
          setSelectedFirst(value);
          setSelectedSecond(undefined); // Reset second select
        }}
        label="First Select"
        id="first-select"
        editMode={false}
      />

      <Select
        key={selectedFirst?.id}
        options={filteredSecondOptions}
        valueKey="id"
        titleKey="title"
        variant="outlined"
        color="primary"
        multiple={false}
        value={selectedSecond}
        onChange={value => setSelectedSecond(value)}
        label="Second Select"
        id="second-select"
        editMode={false}
      />
    </div>
  );
};
