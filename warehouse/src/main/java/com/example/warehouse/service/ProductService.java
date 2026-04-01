package com.example.warehouse.service;

import com.example.warehouse.dto.PageResponse;
import com.example.warehouse.dto.ProductDTO;

public interface ProductService {

    PageResponse<ProductDTO> getProductsWithFilters(
        int page,
        int size,
        String sortBy,
        String keyword,
        Double minPrice,
        Double maxPrice,
        Integer minQty,
        Integer maxQty,
        Long categoryId
    );

    ProductDTO getProductById(Long id);

    ProductDTO getProductByQrCode(String qrCode);

    ProductDTO createProduct(ProductDTO productDTO);

    ProductDTO updateProduct(Long id, ProductDTO productDTO);

    void deleteProduct(Long id);
}
