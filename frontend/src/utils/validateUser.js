import { decodeToken } from "./decode_token";

export const validateUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = decodeToken(token);
    if (decoded) {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        return user || null;
    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
    }
}