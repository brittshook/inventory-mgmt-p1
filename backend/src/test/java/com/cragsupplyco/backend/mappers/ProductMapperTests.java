package com.cragsupplyco.backend.mappers;

import static org.mockito.Mockito.*;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.cragsupplyco.backend.dtos.ProductRequestDto;
import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.services.CategoryService;

import java.util.Optional;

public class ProductMapperTests {

    @InjectMocks
    private ProductMapper productMapper;
    private AutoCloseable closeable;

    @Mock
    private CategoryService categoryService;

    @BeforeTest
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterTest
    public void teardown() throws Exception {
        closeable.close();
    }

    @Test
    public void testToProduct() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Hiking Boots");
        dto.setBrand("HikersInc");
        dto.setDescription("Durable hiking boots");
        dto.setPrice("150.0");
        dto.setCategory(1);

        Category category = new Category();
        category.setId(1);
        category.setName("Climbing Shoes");

        when(categoryService.findById(1)).thenReturn(Optional.of(category));

        Product product = productMapper.toProduct(dto);

        Assert.assertNotNull(product);
        Assert.assertEquals(product.getBrand(), "HikersInc");
        Assert.assertEquals(product.getName(), "Hiking Boots");
        Assert.assertEquals(product.getDescription(), "Durable hiking boots");
        Assert.assertEquals(product.getPrice(), 150.0);
        Assert.assertNotNull(product.getCategory());
        Assert.assertEquals(product.getCategory().getId(), 1);
    }

    @Test
    public void testToProductCategoryNotFound() {
        ProductRequestDto dto = new ProductRequestDto();
        dto.setName("Hiking Boots");
        dto.setBrand("HikersInc");
        dto.setDescription("Durable hiking boots");
        dto.setPrice("150.0");
        dto.setCategory(1);

        when(categoryService.findById(1)).thenReturn(Optional.empty());

        try {
            productMapper.toProduct(dto);
            Assert.fail("Expected a RuntimeException to be thrown");
        } catch (RuntimeException exception) {
            Assert.assertEquals(exception.getMessage(), "Category not found with ID: 1");
        }
    }
}
