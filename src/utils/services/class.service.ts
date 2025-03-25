import Axios from "../../Axios";

export const getClasses = async () => {
  try {
    const response = await Axios.get("/classes");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch classes:", error);
  }
};
