package com.cragsupplyco.backend.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
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

    @BeforeMethod
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
        MockitoAnnotations.openMocks(this);
    }

    @AfterMethod
    public void teardown() throws Exception {
        if (closeable != null) {
            closeable.close();
        }
    }

    @Test
    public void testFindAllProducts() {
        List<Product> expectedProducts = Arrays.asList(new Product(), new Product());

        when(productService.findAll()).thenReturn(expectedProducts);

        Iterable<Product> result = productController.findAllProducts();

        Assert.assertEquals(result, expectedProducts);
        verify(productService, times(1)).findAll();
    }

    @Test
    public void testFindAllProductsDetailed() {
        List<Product> expectedProducts = Arrays.asList(new Product(), new Product());

        when(productService.findAll()).thenReturn(expectedProducts);

        Iterable<Product> result = productController.findAllProducts(null);

        Assert.assertEquals(result, expectedProducts);
        verify(productService, times(1)).findAll();
    }

    @Test
    public void testFindAllProductsWithCategoryId() {
        int categoryId = 1;
        List<Product> expectedProducts = Arrays.asList(new Product(), new Product(), new Product());
        when(productService.findAllByCategoryId(categoryId)).thenReturn(expectedProducts);

        Iterable<Product> result = productController.findAllProducts(categoryId);

        Assert.assertEquals(result, expectedProducts);
        verify(productService, times(1)).findAllByCategoryId(categoryId);
    }

    @Test
    public void testFindById() {
        Product product1 = new Product();
        product1.setId(1);

        int id = 1;
        when(productService.findById(id)).thenReturn(Optional.of(product1));

        ResponseEntity<Product> response = productController.findProductById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), product1);

        verify(productService, times(1)).findById(id);
    }

    @Test
    public void testFindByNonExistentId() {
        int id = 10;
        when(productService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Product> response = productController.findProductById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        Assert.assertEquals(response.getBody(), null);

        verify(productService, times(1)).findById(id);
    }

    @Test
    public void testFindByIdDetailed() {
        Product product1 = new Product();
        product1.setId(1);
        product1.setName("Climbing Shoes");
        product1.setBrand("PenguinPro");

        int id = 1;
        when(productService.findById(id)).thenReturn(Optional.of(product1));

        ResponseEntity<Product> response = productController.findProductByIdDetailed(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), product1);

        verify(productService, times(1)).findById(id);
    }

    @Test
    public void testFindByNonExistentIdDetailed() {
        int id = 10;
        when(productService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Product> response = productController.findProductByIdDetailed(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        Assert.assertEquals(response.getBody(), null);

        verify(productService, times(1)).findById(id);
    }

    @Test
    public void testFindProductByBrandAndName() {
        Product product1 = new Product();
        product1.setId(1);
        product1.setName("Climbing Shoes");
        product1.setBrand("PenguinPro");

        String brand = "Penguin Pro";
        String name = "Climbing Shoes";
        when(productService.findByBrandAndName(brand, name)).thenReturn(Optional.of(product1));

        ResponseEntity<Product> response = productController.findProductByBrandAndName(brand, name);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), product1);

        verify(productService, times(1)).findByBrandAndName(brand, name);
    }

    @Test
    public void testFindProductByNonExistentBrandAndyNonExistentName() throws Exception {
        String brand = "invalidBrand";
        String name = "invalidName";
        when(productService.findByBrandAndName(brand, name)).thenReturn(Optional.empty());

        ResponseEntity<Product> response = productController.findProductByBrandAndName(brand, name);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        Assert.assertEquals(response.getBody(), null);

        verify(productService, times(1)).findByBrandAndName(brand, name);
    }

    @Test
    public void testCreateValidProduct() {
        Product validProduct = new Product();
        validProduct.setId(4);
        validProduct.setName("Hiking Boots");
        validProduct.setBrand("HikersInc");
        validProduct.setDescription("Durable hiking boots");
        validProduct.setPrice(150.0);
        validProduct.setCategory(new Category());

        when(productService.save(any(Product.class))).thenReturn(validProduct);

        Product result = productController.createProduct(validProduct);

        Assert.assertEquals(result, validProduct);

        verify(productService, times(1)).save(any(Product.class));
    }

    @Test
    public void testCreateInvalidProduct() {
        Product invalidProduct = new Product();
        invalidProduct.setPrice(0.0);
        invalidProduct.setCategory(new Category());

        Product result = productController.createProduct(invalidProduct);

        Assert.assertEquals(result, null);
    }

    @Test
    public void testUpdateProductById() {
        Product validProduct = new Product();
        validProduct.setId(4);
        validProduct.setName("Hiking Boots");
        validProduct.setBrand("HikersInc");
        validProduct.setDescription("Durable hiking boots");
        validProduct.setPrice(150.0);
        validProduct.setCategory(new Category());

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
