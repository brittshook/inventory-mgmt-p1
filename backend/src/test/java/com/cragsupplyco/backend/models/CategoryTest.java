package com.cragsupplyco.backend.models;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.List;

public class CategoryTest {

    private Category category;
    private List<Product> products;

    @BeforeMethod
    public void setUp() {
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

    @Test
    public void testCategoryGettersAndSetters() {
        Assert.assertEquals(category.getId(), 1);
        Assert.assertEquals(category.getName(), "Name");
        Assert.assertEquals(category.getProducts(), products);
    }

    @Test
    public void testToString() {
        String expectedToString = "Category [id=1, name=Name, products=" + products + "]";
        Assert.assertEquals(category.toString(), expectedToString);
    }
}
