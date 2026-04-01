package com.example.warehouse.controller;

import com.example.warehouse.dto.ApiResponse;
import com.example.warehouse.dto.PageResponse;
import com.example.warehouse.dto.ProductDTO;
import com.example.warehouse.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping
    public ApiResponse<PageResponse<ProductDTO>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "6") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(required = false) Integer minQty,
        @RequestParam(required = false) Integer maxQty,
        @RequestParam(required = false) Long categoryId
    ) {
        return new ApiResponse<>(
            true,
            "Products fetched successfully",
            productService.getProductsWithFilters(page, size, sortBy, keyword, minPrice, maxPrice, minQty, maxQty, categoryId)
        );
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<ProductDTO> getProductById(@PathVariable Long id) {
        return new ApiResponse<>(true, "Product fetched successfully", productService.getProductById(id));
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/lookup/by-qr")
    public ApiResponse<ProductDTO> getProductByQrCode(@RequestParam String qrCode) {
        return new ApiResponse<>(true, "Product fetched successfully", productService.getProductByQrCode(qrCode));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        return new ApiResponse<>(true, "Product created successfully", productService.createProduct(productDTO));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        return new ApiResponse<>(true, "Product updated successfully", productService.updateProduct(id, productDTO));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return new ApiResponse<>(true, "Product deleted successfully", null);
    }
}
