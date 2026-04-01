import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, PageResponse, Product } from '../models/api.models';
import { environment } from '../../../environments/environment';

export interface ProductFilters {
  page?: number;
  size?: number;
  sortBy?: string;
  keyword?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  minQty?: number | null;
  maxQty?: number | null;
  categoryId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(filters: ProductFilters) {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 6)
      .set('sortBy', filters.sortBy ?? 'id');

    if (filters.keyword) params = params.set('keyword', filters.keyword);
    if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice);
    if (filters.minQty != null) params = params.set('minQty', filters.minQty);
    if (filters.maxQty != null) params = params.set('maxQty', filters.maxQty);
    if (filters.categoryId != null) params = params.set('categoryId', filters.categoryId);

    return this.http.get<ApiResponse<PageResponse<Product>>>(`${environment.apiUrl}/products`, { params });
  }

  getProductByQrCode(qrCode: string) {
    const params = new HttpParams().set('qrCode', qrCode);
    return this.http.get<ApiResponse<Product>>(`${environment.apiUrl}/products/lookup/by-qr`, { params });
  }

  createProduct(payload: Omit<Product, 'id' | 'categoryName' | 'createdAt'>) {
    return this.http.post<ApiResponse<Product>>(`${environment.apiUrl}/products`, payload);
  }

  updateProduct(id: number, payload: Omit<Product, 'id' | 'categoryName' | 'createdAt'>) {
    return this.http.put<ApiResponse<Product>>(`${environment.apiUrl}/products/${id}`, payload);
  }

  deleteProduct(id: number) {
    return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/products/${id}`);
  }
}
