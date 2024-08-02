package com.cragsupplyco.backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.repositories.ProductRepository;

@Service
public class ProductService {
    private ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public Iterable<Product> findAll() {
        return repo.findAll();
    }

    public Iterable<Product> findAllByCategoryId(int categoryId) {
        return repo.findByCategoryId(categoryId);
    }

    public Optional<Product> findById(int id) {
        return repo.findById(id);
    }

    public Optional<Product> findByBrandAndName(String brand, String name) {
        return repo.findByBrandAndName(brand, name);
    }

    public Product save(Product product) {
        return repo.save(product);
    }

    public Product updateProductById(int id, Product product) {
        product.setId(id);
        return repo.save(product);
    }

    public void deleteById(int id) {
        repo.deleteById(id);
    }

}
