package com.example.warehouse.service;

import com.example.warehouse.dto.CategoryDTO;
import java.util.List;

public interface CategoryService {

    CategoryDTO createCategory(CategoryDTO dto);

    List<CategoryDTO> getAllCategories();

    CategoryDTO getCategoryById(Long id);

    CategoryDTO updateCategory(Long id, CategoryDTO dto);

    void deleteCategory(Long id);
}