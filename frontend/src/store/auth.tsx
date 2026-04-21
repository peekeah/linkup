"use client"
import { createContext, MutableRefObject, ReactNode, useCallback, useRef, useState } from "react";

interface AuthContextType {
  state: AuthState;
  wsRef: MutableRefObject<WebSocket | null>;
  reconnectEnabledRef: MutableRefObject<boolean>;
  updateAuth: (payload: AuthState) => void;
  updateConnection: (ws: WebSocket | null) => void;
  clearAuthStore: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  state: {
    userId: "",
    userName: "",
    email: "",
    mobile: "",
    bio: "",
  },
  wsRef: { current: null },
  reconnectEnabledRef: { current: true },
  updateAuth: () => { },
  updateConnection: () => { },
  clearAuthStore: () => { }
})

interface AuthProps {
  children: ReactNode;
}

export interface AuthState {
  userId: string;
  userName: string;
  email: string;
  mobile: string;
  bio: string;
}

const INITIAL_AUTH_STATE: AuthState = {
  userId: "",
  userName: "",
  email: "",
  mobile: "",
  bio: ""
};

const Auth = ({ children }: AuthProps) => {
  const [state, setState] = useState<AuthState>(INITIAL_AUTH_STATE);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectEnabledRef = useRef(true);

  const updateAuth = useCallback((payload: AuthState) => {
    setState(payload);
  }, []);

  const updateConnection = useCallback((ws: WebSocket | null) => {
    wsRef.current = ws;
  }, []);

  const clearAuthStore = useCallback(() => {
    reconnectEnabledRef.current = false;
    const ws = wsRef.current;
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close(1000, "User logged out");
      }
    }
    wsRef.current = null;
    setState(INITIAL_AUTH_STATE);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        wsRef,
        reconnectEnabledRef,
        updateAuth,
        updateConnection,
        clearAuthStore
      }}
    > {children} </AuthContext.Provider>
  );
};

export default Auth;
