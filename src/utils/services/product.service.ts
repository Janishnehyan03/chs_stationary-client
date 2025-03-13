import Axios from "../../Axios";

export const fetchProducts = async () => {
  const response = await Axios.get("/products");
  return response.data;
};
