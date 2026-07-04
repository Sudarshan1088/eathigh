/** Generic API response wrapper used by all endpoints. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Paginated list response. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Scan history entry stored per user. */
export interface ScanHistoryEntry {
  barcode: string;
  productName: string;
  brands: string;
  healthScore: number;
  imageUrl: string;
  scannedAt: string;
}
