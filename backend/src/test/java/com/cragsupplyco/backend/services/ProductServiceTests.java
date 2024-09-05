package com.cragsupplyco.backend.services;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.dtos.ProductRequestDto;
import com.cragsupplyco.backend.mappers.ProductMapper;
import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.repositories.ProductRepository;

public class ProductServiceTests {

    @InjectMocks
    private ProductService productService;
    private AutoCloseable closeable;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @BeforeTest
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterTest
    public void teardown() throws Exception {
        closeable.close();
    }

    @Test
    public void testFindAll() {
        List<Product> products = Arrays.asList(new Product(), new Product());
        when(productRepository.findAll()).thenReturn(products);

        Iterable<Product> result = productService.findAll();

        int count = 0;
        for (Product Product : result) {
            count++;
        }

        Assert.assertTrue(count == products.size());
    }

    @Test
    public void testFindProductByExistingId() {
        Product product1 = new Product();
        product1.setId(1);

        when(productRepository.findById(product1.getId())).thenReturn(Optional.of(product1));
        Optional<Product> result = productService.findById(product1.getId());
        Assert.assertTrue(result.isPresent());
    }

    @Test
    public void testFindProductByNonExistentId() {
        when(productRepository.findById(1)).thenReturn(Optional.empty());

        Optional<Product> result = productService.findById(1);
        Assert.assertTrue(result.isEmpty());
    }

    @Test
    public void testFindByBrandAndName() {
        Product product1 = new Product();
        product1.setName("Climbing Shoes");
        product1.setBrand("PenguinPro");
        product1.setId(1);

        String brand = "PenguinPro";
        String name = "Climbing Shoes";

        when(productRepository.findByBrandAndName(brand, name)).thenReturn(Optional.of(product1));
        Optional<Product> result = productService.findByBrandAndName(brand, name);
        Assert.assertTrue(result.isPresent());
    }

    @Test
    public void testFindByBrandAndNonExistentName() {
        String brand = "Unknown Brand";
        String name = "Unknown Name";

        when(productRepository.findByBrandAndName(brand, name)).thenReturn(Optional.empty());

        Optional<Product> result = productService.findByBrandAndName(brand, name);
        Assert.assertFalse(result.isPresent());
    }

    @Test
    public void testSaveProduct() {
        ProductRequestDto savedProductRequestDto = new ProductRequestDto();
        savedProductRequestDto.setName("Hiking Boots");
        savedProductRequestDto.setBrand("HikersInc");
        savedProductRequestDto.setDescription("Durable hiking boots");
        savedProductRequestDto.setPrice("150.0");
        savedProductRequestDto.setCategory(1);

        Category category = new Category();
        category.setId(1);
        category.setName("Climbing Shoes");

        Product savedProduct = new Product();
        savedProduct.setId(3);
        savedProduct.setName("Hiking Boots");
        savedProduct.setBrand("HikersInc");
        savedProduct.setDescription("Durable hiking boots");
        savedProduct.setPrice(150.0);
        savedProduct.setCategory(category);

        when(productMapper.toProduct(any(ProductRequestDto.class))).thenReturn(savedProduct);
        when(productRepository.save(savedProduct)).thenReturn(savedProduct);

        Product result = productService.save(savedProductRequestDto);
        Assert.assertTrue(result.equals(savedProduct));
    }

    @Test
    public void testUpdateProductById() {
        ProductRequestDto updatedProductRequestDto = new ProductRequestDto();
        updatedProductRequestDto.setName("Hiking Boots");
        updatedProductRequestDto.setBrand("HikersInc");
        updatedProductRequestDto.setDescription("Durable hiking boots");
        updatedProductRequestDto.setPrice("150.0");
        updatedProductRequestDto.setCategory(1);

        Category category = new Category();
        category.setId(1);
        category.setName("Climbing Shoes");

        Product updatedProduct = new Product();
        updatedProduct.setId(4);
        updatedProduct.setName("Hiking Boots");
        updatedProduct.setBrand("HikersInc");
        updatedProduct.setDescription("Durable hiking boots");
        updatedProduct.setPrice(150.0);
        updatedProduct.setCategory(category);

        when(productMapper.toProduct(any(ProductRequestDto.class))).thenReturn(updatedProduct);
        when(productRepository.save(updatedProduct)).thenReturn(updatedProduct);

        Product result = productService.updateProductById(4, updatedProductRequestDto);
        Assert.assertNotNull(result);
        Assert.assertEquals(result, updatedProduct);
        verify(productRepository, times(1)).save(updatedProduct);
    }

    @Test
    public void testDeleteById() {
        int productId = 1;
        productService.deleteById(productId);
        verify(productRepository, times(1)).deleteById(productId);
    }
}
