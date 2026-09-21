import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import type { Recipe } from "../../types";
import { getRecipes } from "../../utils/api";
import AppLayout from "../AppLayout/AppLayout";
import HomePage from "../../pages/HomePage";
import FavoritesPage from "../../pages/FavoritesPage";
import RecipePage from "../../pages/RecipePage";
import NotFoundPage from "../../pages/NotFoundPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import { ProtectedRoute, PublicRoute } from "../ProtectedRoute/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import "./App.css";

/**
 * Componente principal de la aplicación
 * 
 * Responsabilidades:
 * 1. Cargar la lista de recetas al montar
 * 2. Renderizar las rutas protegidas y públicas
 * 3. Gestionar estados de carga y errores
 * 4. Esperar a que AuthProvider verifique el token
 */
function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { isLoading: isAuthLoading } = useAuth();

  /**
   * Cargar recetas cuando la app monta
   * Se ejecuta una sola vez
   */
  useEffect(() => {
    getRecipes()
      .then((data) => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  /**
   * Mostrar contenido de la página de inicio
   * Maneja estados de carga, errores y contenido exitoso
   */
  function homeContent() {
    if (isLoading) return <p className="app__loading">Cargando recetas...</p>;
    if (error) return <p className="app__message">No se pudieron cargar las recetas.</p>;
    return <HomePage recipes={recipes} />;
  }

  /**
   * Esperar a que AuthProvider verifique el token
   * Previene redirecciones durante la carga de autenticación
   */
  if (isAuthLoading) {
    return null;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        
        {/* Rutas protegidas: solo usuarios autenticados */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={homeContent()} />
          <Route 
            path="/favorites" 
            element={<FavoritesPage recipes={recipes} />} 
          />
          <Route 
            path="/recipes/:id" 
            element={<RecipePage recipes={recipes} />} 
          />
        </Route>

        {/* Rutas públicas: solo usuarios NO autenticados */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Página 404: sin protección */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;