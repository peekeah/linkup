import { AuthContext, AuthState } from "@/store/auth"
import { ChatContext } from "@/store/chat";
import { useContext } from "react"

const useAuth = () => {
  const { updateAuth, clearAuthStore } = useContext(AuthContext);
  const { clearChatStore } = useContext(ChatContext);

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
    localStorage.removeItem("userDetails")
    clearChatStore();
    clearAuthStore();
  }

  return { getAuthStatus, handleLogin, handleLogout }
}

export default useAuth;
