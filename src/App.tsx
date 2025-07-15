
import { Select } from "./components/atoms/select/select";

export const App = () => {
  return (
    <div className="flex items-center gap-5 w-full ">

      <Select
        apiUrl="https://dummyjson.com/products"
   /*       options={[
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
        multiple={true}
        onChange={(values) => console.log('Selected values:', values)}
        label="Choose Category"
        defaultValue={["2"]} // Pre-selected values
        /*  error="This field is required"
        required */
        id="test-select"
        editMode={true}
        
      />
    </div>
  );
};
