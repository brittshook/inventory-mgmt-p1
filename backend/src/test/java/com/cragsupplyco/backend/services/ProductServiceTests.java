package com.cragsupplyco.backend.services;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.testng.Assert.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.repositories.ProductRepository;
import com.cragsupplyco.backend.services.ProductService;

public class ProductServiceTests {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    private Product product1;

    private Product product2;

    private Product savedProduct;

    @BeforeMethod
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        this.product1 = new Product();
        this.product1.setName("Climbing shoes");
        this.product1.setBrand("PenguinPro");
        this.product1.setId(1);
        this.product2 = new Product();
        this.product2.setName("Climbing shoesz");
        this.product2.setBrand("PenguinProz");
        this.product2.setId(2);
    }

    @Test
    public void testFindAll() {
        List<Product> products = Arrays.asList(product1, product2);
        when(productRepository.findAll()).thenReturn(products);

        Iterable<Product> result = productService.findAll();

        int count = 0;
        for (Product Product : result) {
            count++;
        }

        assertTrue(count == products.size());
    }

    @Test
    public void testFindProductByExistingId() {
        when(productRepository.findById(product1.getId())).thenReturn(Optional.of(product1));
        Optional<Product> result = productService.findById(product1.getId());
        assertTrue(result.isPresent());
    }

    @Test
    public void testFindProductByNonExistentId() {
        Optional<Product> result = productService.findById(1);
        assertTrue(result.isEmpty());
    }

    @Test
    public void testFindByBrandAndName() {
        when(productRepository.findByBrandAndName(product1.getBrand(), product1.getName())).thenReturn(Optional.of(product1));
        Optional<Product> result = productService.findByBrandAndName(product1.getBrand(), product1.getName());
        assertTrue(result.isPresent());
    }

    @Test
    public void testFindByBrandAndNonExistentName() {
        Optional<Product> result = productService.findByBrandAndName(product1.getBrand(), "");
        assertFalse(result.isPresent());
    }

    @Test
    public void testSaveProduct() {
        Product savedProduct = new Product();
        savedProduct.setId(3);
        savedProduct.setName("newProduct");
        when(productRepository.save(savedProduct)).thenReturn(savedProduct);
        Product result = productService.save(savedProduct);
        assertTrue(result.equals(savedProduct));
    }

    @Test
    public void testUpdateProductById() {
        int productId = 1; 
        Product updatedProduct = new Product();
        updatedProduct.setId(productId);  // Ensure the id is correctly set
        updatedProduct.setName("updatedProduct");
        when(productRepository.save(updatedProduct)).thenReturn(updatedProduct);
        Product result = productService.updateProductById(productId, updatedProduct);
        assertNotNull(result);
        assertEquals(result, updatedProduct);
        verify(productRepository, times(1)).save(updatedProduct);
    }

    @Test
    public void testDeleteById() {
        int productId = 1;
        productService.deleteById(productId);
        verify(productRepository, times(1)).deleteById(productId);
    }
}
