import api from "./api";

export async function getReservations() {
  const response = await api.get("/api/reservations");
  return response.data;
}

export async function createReservation(tableId, payload) {
  const response = await api.post(`/api/reservations/${tableId}`, payload);
  return response.data;
}

export async function updateReservation(tableId, payload) {
  const response = await api.put(`/api/reservations/${tableId}`, payload);
  return response.data;
}

export async function cancelReservation(id) {
  const response = await api.patch(`/api/reservations/${id}/cancel`);
  return response.data;
}