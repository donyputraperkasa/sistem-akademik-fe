import { api } from './api';

export const loginRequest = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    return res.data; // { access_token, user }
};

export const logoutRequest = async () => {
  // kalau nanti mau logout ke backend
    return Promise.resolve(true);
};
