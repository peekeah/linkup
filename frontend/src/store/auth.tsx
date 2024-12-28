"use client"
import { createContext, ReactNode, useState } from "react";

interface AuthContextType {
  state: AuthState;
  updateAuth: (payload: AuthState) => void,
  updateConnection: (ws: WebSocket | null) => void,
  clearAuth: () => void,
}

export const AuthContext = createContext<AuthContextType>({
  state: {
    userId: "",
    userName: "",
    email: "",
    mobile: "",
    bio: "",
    token: "",
    ws: null
  },
  updateAuth: () => { },
  updateConnection: () => { },
  clearAuth: () => { }
})

interface AuthProps {
  children: ReactNode;
}

export interface AuthState {
  userId: string;
  userName: string;
  email: string;
  mobile: string;
  bio: string,
  token: string;
  ws?: null | WebSocket;
}

const Auth = ({ children }: AuthProps) => {

  const initialValues = {
    userId: "",
    userName: "",
    token: "",
    email: "",
    mobile: "",
    bio: "",
    ws: null
  }

  const [state, setState] = useState<AuthState>(initialValues)

  const updateAuth = (payload: AuthState) => {
    setState((prev) => ({
      ws: prev?.ws || state?.ws,
      ...payload
    }))
  }

  const updateConnection = (ws: WebSocket | null) => {
    setState(prev => ({
      ...prev,
      ["ws"]: ws
    }))
  }

  const clearAuth = () => {
    setState(() => initialValues)
  }

  return (
    <AuthContext.Provider
      value={{
        state, updateAuth, updateConnection, clearAuth
      }}
    > {children} </AuthContext.Provider>
  )
}

export default Auth;
