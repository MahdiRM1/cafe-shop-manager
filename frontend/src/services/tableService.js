import api from "./api";

export async function getTables() {
  const response = await api.get("/api/tables");
  return response.data;
}

export async function getTable(tableId) {
  const response = await api.get(`/api/tables/${tableId}`);
  return response.data;
}

export async function createTable(payload) {
  const response = await api.post("/api/tables", payload);
  return response.data;
}

export async function updateTable(id, payload) {
  const response = await api.put(`/api/tables/${id}`, payload);
  return response.data;
}

export async function updateTableStatus(id, payload) {
  const response = await api.patch(`/api/tables/${id}/status`, payload);
  return response.data;
}

export async function deleteTable(id) {
  const response = await api.delete(`/api/tables/${id}`);
  return response.data;
}