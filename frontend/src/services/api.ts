import axios from "axios";

import { apiUrl } from "@/constants/apiUrl";

interface ProfilePayload {
  id: string;
  name: string;
  email: string;
  mobile: string;
  bio: string;
}

class Api {
  private url: string;
  constructor() {
    this.url = process.env.NEXT_PUBLIC_HTTP_HOST || "http://localhost:5000";
  }

  getProfile(id: string, token: string) {
    return axios.get(`${this.url}/${apiUrl.users}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  profile(payload: ProfilePayload, token: string) {
    return axios.post(`${this.url}/${apiUrl.users}/${payload.id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

const api = new Api();

export default api;
