import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

export const getPuestos = async (params = {}) =>
  (await api.get("/puestos", { params })).data;
export const createPuesto = async (puesto) =>
  (await api.post("/puestos", puesto)).data;
export const updatePuesto = async (id, puesto) =>
  (await api.put(`/puestos/${id}`, puesto)).data;
export const deletePuesto = async (id) =>
  (await api.delete(`/puestos/${id}`)).data;

export default api;
