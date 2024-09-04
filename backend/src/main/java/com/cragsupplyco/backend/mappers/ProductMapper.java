package com.cragsupplyco.backend.mappers;

import java.util.Optional;

import com.cragsupplyco.backend.dtos.ProductRequestDto;
import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.services.CategoryService;

import jakarta.persistence.EntityNotFoundException;

public class ProductMapper {
    private CategoryService categoryService;

    // Maps product request DTO to product (needs to translate category id to
    // category object to do so)
    public Product toProduct(ProductRequestDto productRequestDto) {
        Product product = new Product();
        product.setBrand(productRequestDto.getBrand());
        product.setName(productRequestDto.getName());
        product.setDescription(productRequestDto.getDescription());
        product.setPrice(productRequestDto.getPrice());

        Optional<Category> optionalCategory = categoryService.findById(productRequestDto.getCategory());

        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            product.setCategory(category);
        } else {
            throw new EntityNotFoundException("Category not found with ID: " + productRequestDto.getCategory());
        }

        return product;
    }

}
