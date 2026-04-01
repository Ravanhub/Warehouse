export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  username: string;
}

export interface UserSession {
  accessToken: string;
  refreshToken: string;
  role: 'ROLE_ADMIN' | 'ROLE_USER';
  username: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  qrCode: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
