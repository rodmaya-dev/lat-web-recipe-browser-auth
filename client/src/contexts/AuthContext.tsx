import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CurrentUser } from "../types";

type AuthContextValue = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: CurrentUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function login(token: string, user: CurrentUser) {
    // 1. Guardar el token en localStorage
    localStorage.setItem("auth-token", token);
    
    // 2. Actualizar el estado del usuario actual
    setCurrentUser(user);
    
    // 3. Marcar como autenticado
    setIsAuthenticated(true);
  }

  function logout() {
    // 1. Eliminar el token de localStorage
    localStorage.removeItem("auth-token");
    
    // 2. Limpiar el usuario actual
    setCurrentUser(null);
    
    // 3. Marcar como no autenticado
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}