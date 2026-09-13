import api from "./api";

export async function getUsers() {
  const response = await api.get("/api/users");
  return response.data;
}

export async function createUser(payload) {
  const response = await api.post("/api/users", payload);
  return response.data;
}

export async function updateUser(id, payload) {
  const response = await api.patch(`/api/users/${id}/update-information`, payload);
  return response.data;
}

export async function updateUserPassword(id) {
  const response = await api.patch(`/api/users/${id}/manager-update-password`);
  return response.data;
}

export async function toggleUserStatus(id) {
  const response = await api.patch(`/api/users/${id}/toggle-status`);
  return response.data;
}

export async function deactivate(id) {
  const response = await api.patch(`/api/users/${id}/toggle-status`);
  return response.data;
}

export async function deleteUser(id) {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
}