import { post, get } from "./client";
import type { AuthResponse, UserProfile, RegisterBody, LoginBody } from "@eathigh/shared";

export async function registerUser(body: RegisterBody) {
  return post<AuthResponse>("/auth/register", body);
}

export async function loginUser(body: LoginBody) {
  return post<AuthResponse>("/auth/login", body);
}

export async function getMe() {
  return get<UserProfile>("/auth/me");
}
