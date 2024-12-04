import api from "@/services/api";

// Validate Auth
export const getToken = () => {
  return localStorage.getItem("token");
}

export const updateToken = (value: string) => {
  return localStorage.setItem("token", value)
}

// Login
export const login = async (email: string, password: string) => {
  const res = await api.login(email, password)
  console.log("res", res)
  if (res?.status) {
    localStorage.setItem("token", res.data?.token)
  }
  return res
}

// Logout
export const handleLogout = () => {
  return localStorage.clearItem("token")
}

