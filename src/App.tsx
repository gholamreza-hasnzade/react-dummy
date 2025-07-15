import { useState } from "react";
/* import { Button } from "./components/atoms/button/button";
import { Input } from "./components/atoms/input/input"; */
import { Select } from "./components/atoms/select/select";

export const App = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  return (
    <div className="flex items-center gap-5 w-full ">
      {/*  <Input
        id="wer"
        value=""
        label="Input"
        onChange={() => {}}
        required
        placeholder="placeholder"
        size="lg"
        fullWidth
      />
      <Button variant="text" color="info" startIcon={"1"} endIcon="2" disabled>
        test
      </Button> */}
      <Select
        apiUrl="https://dummyjson.com/products"
        /* options={[
          {
            id: 1,
            title: "test",
          },
          {
            id: 2,
            title: "test2",
          },
          {
            id: 3,
            title: "test3",
          },
          {
            id: 4,
            title: "test4",
          },
        ]} */
        valueKey="id"
        titleKey="title"
        /*  urlParams={{
          sortBy: "title",
          order: 'desc',
        }}  */
        variant="outlined"
        color="primary"
        multiple={false}
        value={selectedValues}
        onChange={(values) => setSelectedValues(values as string[])}
        label="Choose Category"
        /*  error="This field is required"
        required */
        id="test-select"
      />
    </div>
  );
};
