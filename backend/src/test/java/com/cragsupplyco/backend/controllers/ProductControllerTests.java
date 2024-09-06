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

import com.cragsupplyco.backend.dtos.ProductRequestDto;
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
        closeable = MockitoAnnotations.openMocks(this); // Initialize mocks before each test
    }

    @AfterMethod
    public void teardown() throws Exception {
        if (closeable != null) {
            closeable.close(); // Close any open mocks after test
        }
    }

    /**
     * Test case for finding all products using the findAllProducts() method.
     * Validates that the service returns a list of products and the method is
     * called once.
     */
    @Test
    public void testFindAllProducts() {
        List<Product> expectedProducts = Arrays.asList(new Product(), new Product());

        when(productService.findAll()).thenReturn(expectedProducts);

        Iterable<Product> result = productController.findAllProducts();

        Assert.assertEquals(result, expectedProducts);
        verify(productService, times(1)).findAll();
    }

    /**
     * Test case for finding all products with specified category id using the
     * findAllProducts(int categoryId) method. Validates that the service returns a
     * list of products and the method is called once.
     */
    @Test
    public void testFindAllProductsWithCategoryId() {
        int categoryId = 1;
        List<Product> expectedProducts = Arrays.asList(new Product(), new Product(), new Product());
        when(productService.findAllByCategoryId(categoryId)).thenReturn(expectedProducts);

        Iterable<Product> result = productController.findAllProducts(categoryId);

        Assert.assertEquals(result, expectedProducts);
        verify(productService, times(1)).findAllByCategoryId(categoryId);
    }

    /**
     * Test case for finding a product (without inventory) by its id using the
     * findProductById() method. Validates that the correct product is returned for
     * a valid id.
     */
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

    /**
     * Test case for attempting to find a product (without inventory) with a
     * non-existent id. Validates that a 404/Not Found response is returned.
     */
    @Test
    public void testFindByNonExistentId() {
        int id = 10;
        when(productService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Product> response = productController.findProductById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        Assert.assertEquals(response.getBody(), null);

        verify(productService, times(1)).findById(id);
    }

    /**
     * Test case for finding a product (with inventory) by its id using the
     * findProductByIdDetailed() method. Validates that the correct product is
     * returned for a valid id.
     */
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

    /**
     * Test case for attempting to find a product (with inventory) with a
     * non-existent id. Validates that a 404/Not Found response is returned.
     */
    @Test
    public void testFindByNonExistentIdDetailed() {
        int id = 10;
        when(productService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Product> response = productController.findProductByIdDetailed(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        Assert.assertEquals(response.getBody(), null);

        verify(productService, times(1)).findById(id);
    }

    /**
     * Test case for finding a product by its brand and name using the
     * findProductByBrandAndName() method. Validates that the correct product is
     * returned for a valid brand and name.
     */
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

    /**
     * Test case for attempting to find a product with a non-existent brand and
     * name. Validates that a 404/Not Found response is returned.
     */
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

    /**
     * Test case for creating a valid product using the createProduct() method.
     * Validates that the product is saved and returned as expected.
     */
    @Test
    public void testCreateValidProduct() {
        ProductRequestDto validProductRequestDto = new ProductRequestDto();
        validProductRequestDto.setName("Hiking Boots");
        validProductRequestDto.setBrand("HikersInc");
        validProductRequestDto.setDescription("Durable hiking boots");
        validProductRequestDto.setPrice("150.0");
        validProductRequestDto.setCategory(1);

        Category category = new Category();
        category.setId(1);
        category.setName("Climbing Shoes");

        Product validProduct = new Product();
        validProduct.setId(4);
        validProduct.setName("Hiking Boots");
        validProduct.setBrand("HikersInc");
        validProduct.setDescription("Durable hiking boots");
        validProduct.setPrice(150.0);
        validProduct.setCategory(category);

        when(productService.save(any(ProductRequestDto.class))).thenReturn(validProduct);

        Product result = productController.createProduct(validProductRequestDto);

        Assert.assertEquals(result, validProduct);

        verify(productService, times(1)).save(any(ProductRequestDto.class));
    }

    /**
     * Test case for attempting to create an invalid product with missing/incorrect
     * data. Validates that null is returned and the product is not created.
     */
    @Test
    public void testCreateInvalidProduct() {
        ProductRequestDto invalidProductRequestDto = new ProductRequestDto();
        invalidProductRequestDto.setPrice("0.0");
        invalidProductRequestDto.setCategory(1);

        Category category = new Category();
        category.setId(1);
        category.setName("Climbing Shoes");

        Product invalidProduct = new Product();
        invalidProduct.setPrice(0.0);
        invalidProduct.setCategory(category);

        Product result = productController.createProduct(invalidProductRequestDto);

        Assert.assertEquals(result, null);
    }

    /**
     * Test case for updating a product by its id using the updateProductById()
     * method. Verifies that the updateProductById service method is called with
     * the correct parameters.
     */
    @Test
    public void testUpdateProductById() {
        ProductRequestDto validProductRequestDto = new ProductRequestDto();
        validProductRequestDto.setName("Hiking Boots");
        validProductRequestDto.setBrand("HikersInc");
        validProductRequestDto.setDescription("Durable hiking boots");
        validProductRequestDto.setPrice("150.0");
        validProductRequestDto.setCategory(1);

        Category category = new Category();
        category.setId(1);
        category.setName("Climbing Shoes");

        Product validProduct = new Product();
        validProduct.setId(4);
        validProduct.setName("Hiking Boots");
        validProduct.setBrand("HikersInc");
        validProduct.setDescription("Durable hiking boots");
        validProduct.setPrice(150.0);
        validProduct.setCategory(category);

        when(productService.save(any(ProductRequestDto.class))).thenReturn(validProduct);

        productController.updateProductById(4, validProductRequestDto);

        verify(productService, times(1))
                .updateProductById(eq(4), any(ProductRequestDto.class));
    }

    /**
     * Test case for deleting a product by its id using the deleteProductById()
     * method. Verifies that the deleteById service method is called once.
     */
    @Test
    public void testDeleteProductById() {
        productController.deleteProductById(4);

        verify(productService, times(1))
                .deleteById(4);
    }
}
