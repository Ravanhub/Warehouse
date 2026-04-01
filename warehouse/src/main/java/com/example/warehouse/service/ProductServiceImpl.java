package com.example.warehouse.service;

import com.example.warehouse.dto.PageResponse;
import com.example.warehouse.dto.ProductDTO;
import com.example.warehouse.exception.ResourceNotFoundException;
import com.example.warehouse.model.Category;
import com.example.warehouse.model.Product;
import com.example.warehouse.repository.CategoryRepository;
import com.example.warehouse.repository.ProductRepository;
import com.example.warehouse.specification.ProductSpecification;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public PageResponse<ProductDTO> getProductsWithFilters(
        int page,
        int size,
        String sortBy,
        String keyword,
        Double minPrice,
        Double maxPrice,
        Integer minQty,
        Integer maxQty,
        Long categoryId
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        Specification<Product> spec = Specification
            .where(ProductSpecification.hasName(keyword))
            .and(ProductSpecification.priceGreaterThan(minPrice))
            .and(ProductSpecification.priceLessThan(maxPrice))
            .and(ProductSpecification.quantityGreaterThan(minQty))
            .and(ProductSpecification.quantityLessThan(maxQty))
            .and(ProductSpecification.hasCategory(categoryId));

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        List<ProductDTO> content = productPage.getContent().stream().map(this::mapToDTO).toList();

        return new PageResponse<>(
            content,
            productPage.getNumber(),
            productPage.getSize(),
            productPage.getTotalElements(),
            productPage.getTotalPages(),
            productPage.isLast()
        );
    }

    @Override
    public ProductDTO getProductById(Long id) {
        return mapToDTO(productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found")));
    }

    @Override
    public ProductDTO getProductByQrCode(String qrCode) {
        return mapToDTO(productRepository.findByQrCode(qrCode)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found")));
    }

    @Override
    public ProductDTO createProduct(ProductDTO dto) {
        Product product = mapToEntity(dto);
        return mapToDTO(productRepository.save(product));
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setQrCode(dto.getQrCode());
        product.setCategory(resolveCategory(dto.getCategoryId()));

        return mapToDTO(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setQrCode(product.getQrCode());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setCreatedAt(product.getCreatedAt());
        return dto;
    }

    private Product mapToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setQrCode(dto.getQrCode());
        product.setCategory(resolveCategory(dto.getCategoryId()));
        return product;
    }

    private Category resolveCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }
}
