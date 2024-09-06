package com.cragsupplyco.backend.models;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.List;

public class CategoryTest {

    private Category category;
    private List<Product> products;

    @BeforeMethod
    public void setUp() { // Initialize test data before each test
        category = new Category();

        Product product1 = new Product();
        product1.setName("Product 1");

        Product product2 = new Product();
        product2.setName("Product 2");

        products = Arrays.asList(product1, product2);

        category.setId(1);
        category.setName("Name");
        category.setProducts(products);
    }

    @AfterMethod
    public void teardown() { // Clean up test data after each test
        category = null;
        products = null;
    }

    /**
     * Test case for validating the getter and setter methods of the Category class.
     * Verifies that expected values are correctly returned by getter methods.
     */
    @Test
    public void testCategoryGettersAndSetters() {
        Assert.assertEquals(category.getId(), 1);
        Assert.assertEquals(category.getName(), "Name");
        Assert.assertEquals(category.getProducts(), products);
    }

    /**
     * Test case for validating the toString() method of the Category class.
     * Verifies that the string representation of the object matches the
     * expected format.
     */
    @Test
    public void testToString() {
        String expectedToString = "Category [id=1, name=Name, products=" + products + "]";
        Assert.assertEquals(category.toString(), expectedToString);
    }
}
