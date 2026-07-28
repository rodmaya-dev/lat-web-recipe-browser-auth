import type { Recipe } from "../types";

const RECIPES_URL = "http://localhost:3001";

function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => Promise.reject(new Error(err.message || "Error en la solicitud")));
      }
      return res.json();
    })
    .then((body) => body.data);
}

export function getRecipes(): Promise<Recipe[]> {
  return request<Recipe[]>(`${RECIPES_URL}/recipes`);
}

export function getRecipe(id: string): Promise<Recipe> {
  return request<Recipe>(`${RECIPES_URL}/recipes/${id}`);
}

export function toggleLike(id: string, userId: string): Promise<Recipe> {
  return request<Recipe>(`${RECIPES_URL}/recipes/${id}/likes`, {
    method: "PUT",
    body: JSON.stringify({ userId }),
  });
}
