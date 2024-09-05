package com.cragsupplyco.backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.repositories.CategoryRepository;

@Service
public class CategoryService {
    private CategoryRepository repo;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public Iterable<Category> findAll() { // Returns all product categories
        return repo.findAll();
    }

    public Optional<Category> findByName(String name) { // Returns product category by name
        return repo.findByName(name);
    }

    public Optional<Category> findById(int id) { // Returns product category by id
        return repo.findById(id);
    }

    public Category save(Category category) { // Saves new product category
        if (repo.existsByName(category.getName())) { // Checks if product category exists with the intended name (as
                                                     // categories must have unique names)
            throw new IllegalArgumentException("Category with this name already exists.");
        }

        return repo.save(category);
    }

    public Category updateCategoryById(int id, Category category) { // Update product category by id
        category.setId(id);
        Category existingCategory = repo.findById(id).get();

        // Checks whether category name is being updated to a new value and checks if
        // product category exists with the intended name (as categories must have
        // unique names)
        if (!category.getName().equals(existingCategory.getName()) && repo.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category with this name already exists.");
        }
        return repo.save(category);
    }

    public void deleteById(int id) { // Delete product category by id
        repo.deleteById(id);
    }

}
