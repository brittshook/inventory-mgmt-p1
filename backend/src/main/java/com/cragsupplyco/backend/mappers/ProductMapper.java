package com.cragsupplyco.backend.mappers;

import java.util.Optional;

import org.springframework.context.annotation.Configuration;

import com.cragsupplyco.backend.dtos.ProductRequestDto;
import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.services.CategoryService;

@Configuration
public class ProductMapper {
    private CategoryService categoryService;

    public ProductMapper(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Maps product request DTO to product (needs to translate category id to
    // category object to do so)
    public Product toProduct(ProductRequestDto productRequestDto) {
        Product product = new Product();
        product.setBrand(productRequestDto.getBrand());
        product.setName(productRequestDto.getName());
        product.setDescription(productRequestDto.getDescription());
        product.setPrice(Double.parseDouble(productRequestDto.getPrice()));

        Optional<Category> optionalCategory = categoryService
                .findById(productRequestDto.getCategory());

        if (optionalCategory.isPresent()) {
            Category category = optionalCategory.get();
            product.setCategory(category);
        } else {
            throw new RuntimeException("Category not found with ID: " + productRequestDto.getCategory());
        }

        return product;
    }

}
