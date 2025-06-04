import { apiService } from "@/service/api";
import { useEffect } from "react";
export const App = () => {
  const fetchData = async () => {
    const { data, error, isLoading } = await apiService.get("products");
    console.log(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>App</div>
  )
}
