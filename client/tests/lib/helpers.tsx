import { vi } from "vitest";
import type { CurrentUser, Recipe } from "../../src/types";

export const mockUser: CurrentUser = {
  _id: "u1",
  email: "pat@example.com",
};

export const mockRecipes: Recipe[] = [
  {
    id: "r1",
    title: "Spaghetti Carbonara",
    category: "italian",
    description: "A classic Roman pasta",
    image: "",
    content: "Cook the pasta.",
    likes: [],
  },
  {
    id: "r2",
    title: "Chicken Curry",
    category: "indian",
    description: "A fragrant curry",
    image: "",
    content: "Simmer the curry.",
    likes: ["u1"],
  },
];

type RouteValue = unknown | ((options: RequestInit) => unknown);

/**
 * Stubs global fetch with a route-table mock. Keys are "<METHOD> <path>"
 * (e.g. "POST /signin"); each value is the FULL JSON body the endpoint
 * responds with, so the stub mirrors the real API shapes:
 *   "POST /signin"   -> { token }          (bare token, no envelope)
 *   "GET /users/me"  -> { data: user }     (data envelope)
 *   "POST /signup"   -> { data: user }     (data envelope)
 * A value can also be a function of the request options that returns the body.
 * Unmatched requests get a non-ok response. Returns the mock so tests can
 * inspect calls.
 */
export function stubFetch(routes: Record<string, RouteValue> = {}) {
  const mock = vi.fn((input: RequestInfo | URL, options: RequestInit = {}) => {
    const url = String(input);
    const method = (options.method ?? "GET").toUpperCase();
    const path = url.replace(/^https?:\/\/[^/]+/, "");
    // Match a route key whose path is a suffix of the request path, so keys can
    // stay clean ("POST /signin") regardless of the API's base path ("/v1").
    const matchKey = Object.keys(routes).find((k) => {
      const [routeMethod, routePath] = k.split(" ");
      return routeMethod.toUpperCase() === method && path.endsWith(routePath);
    });
    if (matchKey) {
      const value = routes[matchKey];
      const body = typeof value === "function" ? value(options) : value;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(body),
      } as Response);
    }
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: `No mock for ${method} ${path}` }),
    } as Response);
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}
