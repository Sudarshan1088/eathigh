import type { ApiResponse } from "@eathigh/shared";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

let authToken: string | null =
  typeof window !== "undefined" ? localStorage.getItem("eathigh_token") : null;

export function setToken(token: string | null): void {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("eathigh_token", token);
    } else {
      localStorage.removeItem("eathigh_token");
    }
  }
}

export function getToken(): string | null {
  return authToken;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (authToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json();
  return data;
}

export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: "GET" });
}

export async function post<T>(
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function put<T>(
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}
