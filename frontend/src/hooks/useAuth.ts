import { AuthContext, AuthState } from "@/store/auth"
import { ChatContext } from "@/store/chat";
import { useCallback, useContext } from "react"
import { isTokenExpired } from "@/utils/auth";

const useAuth = () => {
  const { state, updateAuth, clearAuthStore, reconnectEnabledRef } = useContext(AuthContext);
  const { clearChatStore } = useContext(ChatContext);

  const getAuthStatus = useCallback(() => {
    try {
      const rawData = localStorage?.getItem("userDetails");

      if (!rawData) {
        return false;
      }

      const userData = JSON.parse(rawData) as AuthState;
      if (isTokenExpired(userData?.token)) {
        localStorage.removeItem("userDetails");
        clearChatStore();
        clearAuthStore();
        return false;
      }

      reconnectEnabledRef.current = true;
      if (state.token !== userData.token) {
        updateAuth(userData);
      }
      return true;
    } catch (err) {
      console.log("error while parsing data", err);
      return false;
    }
  }, [clearAuthStore, clearChatStore, reconnectEnabledRef, state.token, updateAuth])

  const handleLogin = useCallback((payload: AuthState) => {
    reconnectEnabledRef.current = true;
    localStorage.setItem("userDetails", JSON.stringify(payload))
    updateAuth(payload)
  }, [reconnectEnabledRef, updateAuth])

  const handleLogout = useCallback(() => {
    localStorage.removeItem("userDetails")
    clearChatStore();
    clearAuthStore();
  }, [clearAuthStore, clearChatStore])

  return { getAuthStatus, handleLogin, handleLogout }
}

export default useAuth;
