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

import com.cragsupplyco.backend.dtos.ProductRequestDto;
import com.cragsupplyco.backend.mappers.ProductMapper;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Views;
import com.cragsupplyco.backend.services.ProductService;
import com.fasterxml.jackson.annotation.JsonView;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = { "http://crag-supply-co-client.s3-website-us-east-1.amazonaws.com", "http://localhost:5173",
        "http://[::1]:5173/" })
public class ProductController {
    private ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping // Get all products (without inventory)
    @JsonView(Views.Public.class)
    public Iterable<Product> findAllProducts() {
        return service.findAll();
    }

    @GetMapping("/detailed") // Get all products (with inventory)
    @JsonView(Views.Internal.class)
    public Iterable<Product> findAllProducts(@RequestParam(required = false) Integer categoryId) {
        if (categoryId != null) {
            return service.findAllByCategoryId(categoryId);
        }
        return service.findAll();
    }

    @PostMapping // Create new product
    @ResponseStatus(code = HttpStatus.CREATED)
    public Product createProduct(@Valid @RequestBody ProductRequestDto productRequestDto) {
        return service.save(productRequestDto);
    }

    @GetMapping("/byProps") // Get product by brand and name (using query params) (without inventory)
    @JsonView(Views.Public.class)
    public ResponseEntity<Product> findProductByBrandAndName(@RequestParam String brand, @RequestParam String name) {
        Optional<Product> product = service.findByBrandAndName(brand, name);
        if (product.isPresent())
            return ResponseEntity.ok(product.get());
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}") // Get product by id (without inventory)
    @JsonView(Views.Public.class)
    public ResponseEntity<Product> findProductById(@PathVariable int id) {
        Optional<Product> product = service.findById(id);
        if (product.isPresent())
            return ResponseEntity.ok(product.get());
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}/detailed") // Get product by id (with inventory)
    @JsonView(Views.Internal.class)
    public ResponseEntity<Product> findProductByIdDetailed(@PathVariable int id) {
        Optional<Product> product = service.findById(id);
        if (product.isPresent())
            return ResponseEntity.ok(product.get());
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}") // Update product by id
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateProductById(@PathVariable int id, @Valid @RequestBody ProductRequestDto productRequestDto) {
        service.updateProductById(id, productRequestDto);
    }

    @DeleteMapping("/{id}") // Delete product by id
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteProductById(@PathVariable int id) {
        service.deleteById(id);
    }

}
