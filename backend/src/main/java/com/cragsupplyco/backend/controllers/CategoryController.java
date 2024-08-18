package com.cragsupplyco.backend.controllers;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.models.Views;
import com.cragsupplyco.backend.services.CategoryService;
import com.fasterxml.jackson.annotation.JsonView;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = "http://crag-supply-co-client.s3-website-us-east-1.amazonaws.com")
public class CategoryController {
    private CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    @JsonView(Views.Public.class)
    public Iterable<Category> findAllCategories() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public Category createCategory(@Valid @RequestBody Category category) {
        return service.save(category);
    }

    @GetMapping("/byProps")
    @JsonView(Views.Public.class)
    public ResponseEntity<Category> findCategoryByName(@RequestParam String name) {
        Optional<Category> category = service.findByName(name);
        if (category.isPresent())
            return ResponseEntity.ok(category.get());
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    @JsonView(Views.Public.class)
    public ResponseEntity<Category> findCategoryById(@PathVariable int id) {
        Optional<Category> category = service.findById(id);
        if (category.isPresent())
            return ResponseEntity.ok(category.get());
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateCategoryById(@PathVariable int id, @Valid @RequestBody Category category) {
        service.updateCategoryById(id, category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteCategoryById(@PathVariable int id) {
        service.deleteById(id);
    }

}
