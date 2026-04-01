package com.example.warehouse.controller;

import com.example.warehouse.dto.ApiResponse;
import com.example.warehouse.dto.CategoryDTO;
import com.example.warehouse.service.CategoryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping
    public ApiResponse<List<CategoryDTO>> getAll() {
        return new ApiResponse<>(true, "Categories fetched", categoryService.getAllCategories());
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<CategoryDTO> getById(@PathVariable Long id) {
        return new ApiResponse<>(true, "Category fetched", categoryService.getCategoryById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<CategoryDTO> create(@Valid @RequestBody CategoryDTO dto) {
        return new ApiResponse<>(true, "Category created", categoryService.createCategory(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<CategoryDTO> update(@PathVariable Long id, @Valid @RequestBody CategoryDTO dto) {
        return new ApiResponse<>(true, "Category updated", categoryService.updateCategory(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return new ApiResponse<>(true, "Category deleted", null);
    }
}