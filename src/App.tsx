import { Button } from "./components/atoms/button/button";
import { Input } from "./components/atoms/input/input";

export const App = () => {
  return (
    <div className="flex items-center gap-5 w-full ">
      <Input
        id="wer"
        value=""
        label="Input"
        onChange={() => {}}
        required
        placeholder="placeholder"
        size="lg"
        fullWidth
        
      />
      <Button variant="contained" color="error" startIcon={"1"} endIcon="2" >
        rtwet
      </Button>
    </div>
  );
};
