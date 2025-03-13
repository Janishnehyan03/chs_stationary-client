import Axios from "../../Axios";

export const fetchTeachers = async () => {
  const response = await Axios.get("/teachers");
  return response.data;
};

export const addTeacher = async (teacher: {
  name: string;
  email: string;
  phone: string;
}) => {
  const response = await Axios.post("/teachers", teacher);
  return response.data;
};
