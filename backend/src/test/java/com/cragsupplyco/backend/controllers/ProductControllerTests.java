package com.cragsupplyco.backend.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.models.Category;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.services.ProductService;

public class ProductControllerTests {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;
    private AutoCloseable closeable;

    private Product product1;
    private Product product2;

    private Product validProduct;
    private Product invalidProduct;

    @BeforeMethod
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
        MockitoAnnotations.openMocks(this);

        Category category1 = new Category();
        category1.setId(1);
        category1.setName("Climbing Gear");

        product1 = new Product();
        product1.setId(1);
        product1.setName("Climbing Shoes");
        product1.setBrand("PenguinPro");
        product1.setDescription("Durable climbing shoes");
        product1.setPrice(150.0);
        product1.setCategory(category1);

        product2 = new Product();
        product2.setId(2);
        product2.setName("Rope");
        product2.setBrand("EverStrong");
        product2.setDescription("Tough climbing rope");
        product2.setPrice(80.0);
        product2.setCategory(category1);


        validProduct = new Product();
        validProduct.setId(4);
        validProduct.setName("Hiking Boots");
        validProduct.setBrand("HikersInc");
        validProduct.setDescription("Durable hiking boots");
        validProduct.setPrice(150.0);
        validProduct.setCategory(category1);

        invalidProduct = new Product();
        invalidProduct.setPrice(0.0);
        invalidProduct.setCategory(category1);
    }

    @AfterTest
    public void teardown() throws Exception{
        closeable.close();
    }

    @Test
    public void testFindAllProducts() {
        List<Product> expectedProducts = Arrays.asList(product1, product2);

        when(productService.findAll()).thenReturn(expectedProducts);

        Iterable<Product> result = productController.findAllProducts();

        assertEquals(result, expectedProducts);
        verify(productService, times(1)).findAll();
    }

    @Test
    public void testFindAllProductsWithCategoryId() {
        int categoryId = 1;
        List<Product> expectedProducts = Arrays.asList(product1, product2, validProduct);
        when(productService.findAllByCategoryId(categoryId)).thenReturn(expectedProducts);

        Iterable<Product> result = productController.findAllProducts(categoryId);

        assertEquals(result, expectedProducts);

        verify(productService, times(1)).findAllByCategoryId(categoryId);
    }

    @Test
    public void testFindById() {
        int id = product1.getId();
        when(productService.findById(id)).thenReturn(Optional.of(product1));

        ResponseEntity<Product> response = productController.findProductById(id);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody(), product1);

        verify(productService, times(1)).findById(id);
    }

    @Test
    public void testFindByIdDetailed() {
        int id = product1.getId();
        when(productService.findById(id)).thenReturn(Optional.of(product1));
        
        ResponseEntity<Product> response = productController.findProductByIdDetailed(id);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody(), product1);

        verify(productService, times(1)).findById(id);
    }

    @Test
    public void testFindProductByBrandAndName() {
        String brand = product1.getBrand();
        String name = product1.getName();
        when(productService.findByBrandAndName(brand, name)).thenReturn(Optional.of(product1));

        ResponseEntity<Product> response = productController.findProductByBrandAndName(brand, name);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody(), product1);

        verify(productService, times(1)).findByBrandAndName(brand, name);
    }

    @Test
    public void testCreateValidProduct() {
        when(productService.save(any(Product.class))).thenReturn(validProduct);

        Product result = productController.createProduct(validProduct);

        assertEquals(result, validProduct);

        verify(productService, times(1)).save(any(Product.class));
    }

    @Test
    public void testCreateInvalidProduct() {
        Product result = productController.createProduct(invalidProduct);

        assertEquals(result, null);
    }

    @Test
    public void testUpdateProductById() {
        productController.updateProductById(4, validProduct);

        verify(productService, times(1))
        .updateProductById(eq(4), any(Product.class));
    }

    @Test
    public void testDeleteProductById() {
        productController.deleteProductById(4);

        verify(productService, times(1))
        .deleteById(4);
    }
}
