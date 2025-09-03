import { jwtDecode } from 'jwt-decode';

export function decodeToken(token) {
    try {
        const decoded = jwtDecode(token);

        // Check token expiration
        const currentTime = Date.now() / 1000; // in seconds
        if (decoded.exp < currentTime) {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}
