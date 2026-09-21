import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * ProtectedRoute: Solo usuarios autenticados pueden acceder
 * 
 * Lógica:
 * 1. Mientras isLoading = true: devuelve null (espera a verificar token)
 * 2. Si isLoading = false Y isAuthenticated = true: muestra contenido
 * 3. Si isLoading = false Y isAuthenticated = false: redirige a /login
 * 
 * El null evita el parpadeo de redirección mientras verifica el token
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras se verifica el token, no mostrar nada
  if (isLoading) {
    return null;
  }

  // Una vez verificado, permitir acceso o redirigir
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

/**
 * PublicRoute: Solo usuarios NO autenticados pueden acceder
 * 
 * Lógica:
 * 1. Mientras isLoading = true: devuelve null (espera a verificar token)
 * 2. Si isLoading = false Y isAuthenticated = false: muestra contenido
 * 3. Si isLoading = false Y isAuthenticated = true: redirige a /
 * 
 * El null evita intentar acceder a /login si el usuario ya está autenticado
 */
export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras se verifica el token, no mostrar nada
  if (isLoading) {
    return null;
  }

  // Una vez verificado, permitir acceso a rutas públicas o redirigir a home
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}