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

    public Optional<Category> findById(int id) {
        return repo.findById(id);
    }

    public Category save(Category category) {
        return repo.save(category);
    }

    public Category updateCategoryById(int id, Category category) {
        category.setId(id);
        return repo.save(category);
    }

    public void deleteById(int id) {
        repo.deleteById(id);
    }

}
