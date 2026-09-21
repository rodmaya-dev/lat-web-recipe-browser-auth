import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { CurrentUser } from "../types";
import { getCurrentUser } from "../utils/api";

/**
 * Tipo que define el valor del contexto de autenticación
 */
type AuthContextValue = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean; // ← Nuevo: indica si se está verificando el token
  login: (token: string, user: CurrentUser) => void;
  logout: () => void;
};

/**
 * Contexto de autenticación con valores por defecto
 */
const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
});

/**
 * Proveedor de contexto de autenticación
 * Gestiona: login, logout, restauración de sesión, verificación de token
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ← Nuevo

  /**
   * Restaurar sesión si hay token guardado en localStorage
   * Se ejecuta una sola vez al montar el componente
   */
  useEffect(() => {
    // Paso 1: Buscar token en localStorage
    const token = localStorage.getItem("auth-token");
    
    // Si no hay token, no hay nada que restaurar
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Paso 2: Si hay token, verificar si sigue siendo válido
    getCurrentUser(token)
      .then((user) => {
        // Token válido: restaurar sesión
        setCurrentUser(user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        // Token inválido (expirado o manipulado): limpiar
        localStorage.removeItem("auth-token");
      })
      .finally(() => {
        // Fin de la verificación, dejar de cargar
        setIsLoading(false);
      });
  }, []); // Array vacío = ejecutar solo una vez al montar

  /**
   * Guardar token y datos del usuario cuando inicia sesión
   * @param token - JWT token de autenticación
   * @param user - Datos del usuario autenticado
   */
  function login(token: string, user: CurrentUser) {
    // Guardar token en localStorage
    localStorage.setItem("auth-token", token);

    // Actualizar estado
    setCurrentUser(user);
    setIsAuthenticated(true);
  }

  /**
   * Limpiar estado y eliminar token cuando cierra sesión
   */
  function logout() {
    // Eliminar token de localStorage
    localStorage.removeItem("auth-token");

    // Limpiar estado
    setCurrentUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar el contexto de autenticación
 * @returns Objeto con currentUser, isAuthenticated, isLoading, login, logout
 */
export function useAuth() {
  return useContext(AuthContext);
}