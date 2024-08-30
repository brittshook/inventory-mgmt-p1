package com.cragsupplyco.backend.models;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.List;
import java.util.Arrays;

public class ProductTest {
    private Product product;
    private Category category;
    private List<Inventory> inventoryItems;

    @BeforeMethod
    public void setUp() {
        product = new Product();

        category = new Category();
        category.setName("Category");

        Inventory inventory1 = new Inventory();
        Inventory inventory2 = new Inventory();
        inventoryItems = Arrays.asList(inventory1, inventory2);

        product.setId(1);
        product.setBrand("Brand");
        product.setName("Name");
        product.setDescription("Description");
        product.setPrice(2.00);
        product.setCategory(category);
        product.setInventory(inventoryItems);
    }

    @Test
    public void testCategoryGettersAndSetters() {
        Assert.assertEquals(product.getId(), 1);
        Assert.assertEquals(product.getBrand(), "Brand");
        Assert.assertEquals(product.getName(), "Name");
        Assert.assertEquals(product.getDescription(), "Description");
        Assert.assertEquals(product.getPrice(), 2.0);
        Assert.assertEquals(product.getCategory(), category);
        Assert.assertEquals(product.getInventory(), inventoryItems);
    }

    @Test
    public void testToString() {
        String expectedToString = "Product [id=1, brand=Brand, name=Name, description=Description, price=2.0, category="
                + category + ", inventory=" + inventoryItems + "]";
        Assert.assertEquals(product.toString(), expectedToString);
    }

}
