import { createContext, ReactNode, useState } from "react"

interface AuthContextType {
  auth: boolean;
  updateAuth: (status: boolean) => void
}
export const AuthContext = createContext<AuthContextType>({
  auth: false,
  updateAuth: () => { }
})

interface AuthProps {
  children: ReactNode;
}

const Auth = ({ children }: AuthProps) => {
  const [auth, setAuth] = useState(false);

  const updateAuth = (status: boolean) => {
    setAuth(status)
  }

  return (
    <AuthContext.Provider
      value={{
        auth, updateAuth
      }}
    > {children} </AuthContext.Provider>
  )
}

export default Auth;
