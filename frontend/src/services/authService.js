import api from './api'

export async function login(username, password) {
    try {
        const response = await api.post('/auth/login', {username, password});
        const { username:returnedUsername, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        return { username: returnedUsername, token };
    } catch (error) {
        return error.response.data;
    }
}

export async function getCurrentUser() {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        return null;
    }
}


export async function logout() {
    localStorage.removeItem('token');
    return "ok";
}