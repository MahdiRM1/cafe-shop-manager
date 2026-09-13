import api from "./api";

export async function getCurrentShift() {
  const response = await api.get("/api/shifts/current");
  return response.data;
}

export async function openShift(payload) {
  const response = await api.post("/api/shifts/open", payload);
  return response.data;
}

export async function closeShift(payload) {
  const response = await api.post("/api/shifts/close", payload);
  return response.data;
}

export async function getShiftReport(id) {
  const response = await api.get(`/api/shifts/${id}/report`);
  return response.data;
}

export async function getAllShifts() {
  const response = await api.get("/api/shifts");
  return response.data;
}