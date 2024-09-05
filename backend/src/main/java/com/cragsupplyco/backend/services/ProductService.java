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

    public Product save(ProductRequestDto productRequestDto) {
        return repo.save(mapper.toProduct(productRequestDto));
    }

    public Product updateProductById(int id, ProductRequestDto productRequestDto) {
        Product product = mapper.toProduct(productRequestDto);
        product.setId(id);
        return repo.save(product);
    }

    public void deleteById(int id) {
        repo.deleteById(id);
    }

}
