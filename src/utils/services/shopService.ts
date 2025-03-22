import Axios from "../../Axios";

const API_URL = "/shops"; // Change this if needed

export const getShops = async () => Axios.get(API_URL);
export const createShop = async (data: any) => Axios.post(`${API_URL}/create`, data);
export const updateShop = async (id: string, data: any) => Axios.put(`${API_URL}/${id}`, data);
export const deleteShop = async (id: string) => Axios.delete(`${API_URL}/${id}`);
