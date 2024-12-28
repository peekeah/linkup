import { AuthContext, AuthState } from "@/store/auth"
import { useContext } from "react"

const useAuth = () => {
  const { state, updateAuth, clearAuth } = useContext(AuthContext);

  const getAuthStatus = () => {
    return new Promise((resolve, reject) => {
      try {
        const rawData = localStorage?.getItem("userDetails");

        if (!rawData) return false;

        const userData = JSON.parse(rawData)
        updateAuth(userData)
        resolve(true)
        return true
      } catch (err) {
        console.log("error while parsing data", err)
        reject(err)
      }
    })
  }

  const handleLogin = (payload: AuthState) => {
    localStorage.setItem("userDetails", JSON.stringify(payload))
    updateAuth(payload)
  }

  const handleLogout = () => {

    // #TODO: Reset Auth and connection
    if (state?.ws) {
      state?.ws.close();
    }

    localStorage.removeItem("token")
    clearAuth();
  }

  return { getAuthStatus, handleLogin, handleLogout }

}

export default useAuth;
