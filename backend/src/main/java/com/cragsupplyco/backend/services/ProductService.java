package com.cragsupplyco.backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cragsupplyco.backend.dtos.ProductRequestDto;
import com.cragsupplyco.backend.mappers.ProductMapper;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.repositories.ProductRepository;

@Service
public class ProductService {
    private ProductRepository repo;
    private ProductMapper mapper;

    public ProductService(ProductRepository repo, ProductMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public Iterable<Product> findAll() { // Returns all products
        return repo.findAll();
    }

    public Iterable<Product> findAllByCategoryId(int categoryId) { // Returns all products with specified category id
        return repo.findByCategoryId(categoryId);
    }

    public Optional<Product> findById(int id) { // Returns product by id
        return repo.findById(id);
    }

    public Optional<Product> findByBrandAndName(String brand, String name) { // Returns product by brand and name
        return repo.findByBrandAndName(brand, name);
    }

    public Product save(ProductRequestDto productRequestDto) { // Saves new product
        return repo.save(mapper.toProduct(productRequestDto)); // Map from DTO to Product obj then saves
    }

    public Product updateProductById(int id, ProductRequestDto productRequestDto) { // Update product by id
        Product product = mapper.toProduct(productRequestDto); // Map from DTO to Product obj
        product.setId(id);
        return repo.save(product);
    }

    public void deleteById(int id) { // Delete product by id
        repo.deleteById(id);
    }

}
