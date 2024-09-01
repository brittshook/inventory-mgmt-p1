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

    public Iterable<Category> findAll() {
        return repo.findAll();
    }

    public Optional<Category> findByName(String name) {
        return repo.findByName(name);
    }

    public Optional<Category> findById(int id) {
        return repo.findById(id);
    }

    public Category save(Category category) {
        if (repo.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category with this name already exists.");
        }

        return repo.save(category);
    }

    public Category updateCategoryById(int id, Category category) {
        category.setId(id);
        Category existingCategory = repo.findById(id).get();

        if (!category.getName().equals(existingCategory.getName()) && repo.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category with this name already exists.");
        }
        return repo.save(category);
    }

    public void deleteById(int id) {
        repo.deleteById(id);
    }

}
