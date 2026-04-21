import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { apiUrl } from "@/constants/apiUrl";
import { SignupPayload } from "@/app/signup/page";

interface ProfilePayload {
  id: string;
  name: string;
  email: string;
  mobile: string;
  bio: string;
}

const isStoredTokenExpired = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const rawData = localStorage.getItem("userDetails");
    if (!rawData) {
      return true;
    }

    const parsedData = JSON.parse(rawData) as { token?: string };
    const token = parsedData?.token;

    if (!token) {
      return true;
    }

    const decodedPayload = jwtDecode<{
      exp?: number;
    }>(token);

    if (!decodedPayload.exp) {
      return true;
    }

    return decodedPayload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

class Api {
  private url: string;
  constructor() {
    this.url = process.env.NEXT_PUBLIC_HTTP_HOST || "http://localhost:5000";
  }
  login(email: string, password: string) {
    return axios.post(this.url + "/" + apiUrl.login, {
      email, password
    })
  }
  signup(payload: SignupPayload) {
    return axios.post(this.url + "/" + apiUrl.signup, { ...payload })
  }
  profile(payload: ProfilePayload) {
    if (isStoredTokenExpired()) {
      return Promise.reject(new Error("Session expired. Please log in again."));
    }
    return axios.post(`${this.url}/${apiUrl.users}/${payload.id}`, payload)
  }
}

const api = new Api();

export default api;
