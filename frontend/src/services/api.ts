import axios from "axios";

import { apiUrl } from "@/constants/apiUrl";
import { SignupPayload } from "@/app/signup/page";

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
  login(email: string, password: string) {
    return axios.post(this.url + "/" + apiUrl.login, {
      email, password
    })
  }
  signup(payload: SignupPayload) {
    return axios.post(this.url + "/" + apiUrl.signup, { ...payload })
  }
  profile(payload: ProfilePayload) {
    return axios.post(`${this.url}/${apiUrl.users}/${payload.id}`, payload)
  }
}

const api = new Api();

export default api;
