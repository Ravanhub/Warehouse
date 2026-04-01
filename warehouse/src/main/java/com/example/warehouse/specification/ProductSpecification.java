package com.example.warehouse.specification;

import com.example.warehouse.model.Product;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> hasName(String keyword) {
        return (root, query, cb) -> keyword == null || keyword.isBlank()
            ? null
            : cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
    }

    public static Specification<Product> hasCategory(Long categoryId) {
        return (root, query, cb) -> categoryId == null
            ? null
            : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> priceGreaterThan(Double minPrice) {
        return (root, query, cb) -> minPrice == null
            ? null
            : cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Product> priceLessThan(Double maxPrice) {
        return (root, query, cb) -> maxPrice == null
            ? null
            : cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Product> quantityGreaterThan(Integer minQty) {
        return (root, query, cb) -> minQty == null
            ? null
            : cb.greaterThanOrEqualTo(root.get("quantity"), minQty);
    }

    public static Specification<Product> quantityLessThan(Integer maxQty) {
        return (root, query, cb) -> maxQty == null
            ? null
            : cb.lessThanOrEqualTo(root.get("quantity"), maxQty);
    }
}