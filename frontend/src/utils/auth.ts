import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedPayload = jwtDecode<{
      exp?: number;
    }>(token);

    if (!decodedPayload.exp) {
      return true; 
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < currentTime;
  } catch (error) {
    return true;
  }
};
