import Axios from "../../Axios";

const API_URL = "/purchases"; // Change this if needed

export const getPurchases = async () => Axios.get(API_URL);
export const createPurchase = async (data: any) => Axios.post(`${API_URL}`, data);
export const updatePurchase = async (id: string, data: any) => Axios.put(`${API_URL}/${id}`, data);
export const deletePurchase = async (id: string) => Axios.delete(`${API_URL}/${id}`);