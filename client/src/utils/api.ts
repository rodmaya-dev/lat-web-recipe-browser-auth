import type { Recipe } from "../types";
import type { CurrentUser } from "../types";

// URL base de la API de recetas (servidor local)
const RECIPES_URL = "http://localhost:3001";

// URL base de la API de autenticación (servidor externo de TripleTen)
const AUTH_URL = "https://se-register-api.en.tripleten-services.com/v1";

/**
 * Función auxiliar genérica para hacer solicitudes HTTP
 * @param url - URL completa donde hacer la solicitud
 * @param options - Opciones adicionales de fetch (método, body, headers, etc.)
 * @returns Promise con los datos de la respuesta
 * 
 * Esta función:
 * 1. Envía la solicitud con headers JSON por defecto
 * 2. Verifica si la respuesta fue exitosa (res.ok)
 * 3. Si hay error, extrae el mensaje de error y lo lanza
 * 4. Si es exitosa, extrae la propiedad "data" del JSON
 */
function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
    // Procesar la respuesta
    .then((res) => {
      if (!res.ok) {
        // Si hay error, convertir a JSON y lanzar error
        return res.json().then((err) => Promise.reject(new Error(err.message || "Error en la solicitud")));
      }
      // Si es exitosa, convertir a JSON
      return res.json();
    })
    // Extraer solo la propiedad "data" de la respuesta
    .then((body) => body.data);
}

/**
 * Obtener todas las recetas disponibles
 * @returns Promise con array de recetas
 */
export function getRecipes(): Promise<Recipe[]> {
  return request<Recipe[]>(`${RECIPES_URL}/recipes`);
}

/**
 * Obtener una receta específica por ID
 * @param id - ID de la receta a obtener
 * @returns Promise con los datos de la receta
 */
export function getRecipe(id: string): Promise<Recipe> {
  return request<Recipe>(`${RECIPES_URL}/recipes/${id}`);
}

/**
 * Alternar "me gusta" en una receta (agregar o quitar like)
 * @param id - ID de la receta
 * @param userId - ID del usuario que da like
 * @returns Promise con los datos de la receta actualizada
 */
export function toggleLike(id: string, userId: string): Promise<Recipe> {
  return request<Recipe>(`${RECIPES_URL}/recipes/${id}/likes`, {
    method: "PUT",
    body: JSON.stringify({ userId }),
  });
}

/**
 * Función auxiliar para solicitudes de autenticación
 * @param path - Ruta del endpoint de autenticación (ej: /signin, /signup, /users/me)
 * @param options - Opciones adicionales de fetch
 * @returns Promise con la respuesta JSON
 * 
 * Esta función:
 * 1. Realiza la solicitud a la API de autenticación
 * 2. Añade headers JSON automáticamente
 * 3. Verifica si la respuesta fue exitosa
 * 4. Si hay error, extrae el mensaje y lo lanza
 * 5. Si es exitosa, devuelve el JSON completo (no extrae "data")
 */
async function authRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${AUTH_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  
  // Si la respuesta no es exitosa
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || error.message || "Error de autenticación");
  }
  
  // Si es exitosa, devolver el JSON
  return res.json();
}

/**
 * Obtener información del usuario autenticado actualmente
 * @param token - JWT token de autenticación
 * @returns Promise con los datos del usuario (id y email)
 * 
 * Requiere token válido en el header Authorization
 */
export async function getCurrentUser(token: string): Promise<CurrentUser> {
  // Realizar solicitud GET a /users/me con el token en el header
  const { data } = await authRequest("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/**
 * Iniciar sesión con email y contraseña
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns Promise con token JWT y datos del usuario
 * 
 * Flujo:
 * 1. Enviar credenciales a POST /signin
 * 2. Recibir token JWT
 * 3. Usar el token para obtener datos del usuario con getCurrentUser()
 * 4. Devolver ambos (token y user)
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<{ token: string; user: CurrentUser }> {
  // Paso 1: Enviar credenciales y recibir token
  const { token } = await authRequest("/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  
  // Paso 2: Usar el token para obtener datos del usuario
  const user = await getCurrentUser(token);
  
  // Paso 3: Devolver ambos
  return { token, user };
}

/**
 * Registrar un nuevo usuario
 * @param email - Email del nuevo usuario
 * @param password - Contraseña del nuevo usuario
 * @returns Promise con los datos del usuario creado
 * 
 * Nota: El registro solo crea la cuenta, no devuelve token.
 * El usuario debe iniciar sesión después con loginUser()
 */
export async function registerUser(
  email: string,
  password: string,
): Promise<CurrentUser> {
  // Enviar credenciales a POST /signup
  const { data } = await authRequest("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  
  // Devolver solo los datos del usuario
  return data;
}