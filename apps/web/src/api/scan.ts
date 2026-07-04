import { post } from "./client";
import type { ScanResult } from "@eathigh/shared";

export async function scanBarcode(barcode: string) {
  return post<ScanResult>(`/scan/${barcode}`);
}
