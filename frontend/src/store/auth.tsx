"use client"
import { createContext, ReactNode, useState } from "react";

interface AuthContextType {
  state: State;
  updateAuth: (status: boolean) => void,
  updateConnection: (ws: WebSocket) => void,
}

export const AuthContext = createContext<AuthContextType>({
  state: {
    auth: false,
    ws: null
  },
  updateAuth: () => { },
  updateConnection: () => { }
})

interface AuthProps {
  children: ReactNode;
}

interface State {
  auth: boolean;
  ws: null | WebSocket;
}

const Auth = ({ children }: AuthProps) => {

  const [state, setState] = useState<State>({
    auth: false,
    ws: null
  })

  const updateAuth = (status: boolean) => {
    setState(prev => ({
      ...prev,
      ["auth"]: status
    }))
  }

  const updateConnection = (ws: WebSocket) => {
    setState(prev => ({
      ...prev,
      ["ws"]: ws
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        state, updateAuth, updateConnection
      }}
    > {children} </AuthContext.Provider>
  )
}

export default Auth;
