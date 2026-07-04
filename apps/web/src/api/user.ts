import { get, put } from "./client";
import type {
  UserProfile,
  UpdateProfileBody,
  PaginatedResponse,
  ScanHistoryEntry,
} from "@eathigh/shared";

export async function getProfile() {
  return get<UserProfile>("/user/profile");
}

export async function updateProfile(body: UpdateProfileBody) {
  return put<UserProfile>("/user/profile", body);
}

export async function getScanHistory(page = 1, limit = 10) {
  return get<PaginatedResponse<ScanHistoryEntry>>(
    `/user/history?page=${page}&limit=${limit}`
  );
}
