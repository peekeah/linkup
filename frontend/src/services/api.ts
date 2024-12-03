import axios from "axios";

import { apiUrl } from "@/constants/apiUrl";

class Api {
  private url: string;
  constructor() {
    this.url = process.env.NEXT_PUBLIC_HTTP_HOST || "http://localhost:5000";
  }
  async login(email: string, password: string) {
    const res = await axios.post(this.url + "/" + apiUrl.login, {
      email, password
    })
    return res
  }
}

const api = new Api();

export default api;
