package com.cragsupplyco.backend.models;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class InventoryTest {

    private Inventory inventory;
    private Product product;
    private Warehouse warehouse;

    @BeforeMethod
    public void setUp() {
        inventory = new Inventory();

        product = new Product();
        product.setName("Product");

        warehouse = new Warehouse();
        warehouse.setName("Warehouse");

        inventory.setId(1);
        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);
        inventory.setSize("S");
        inventory.setQuantity(100);

    }

    @Test
    public void testCategoryGettersAndSetters() {
        Assert.assertEquals(inventory.getId(), 1);
        Assert.assertEquals(inventory.getProduct(), product);
        Assert.assertEquals(inventory.getWarehouse(), warehouse);
        Assert.assertEquals(inventory.getSize(), "S");
        Assert.assertEquals(inventory.getQuantity(), 100);
    }

    @Test
    public void testToString() {
        String expectedToString = "Inventory [id=1, product=" + product + ", warehouse=" + warehouse
                + ", size=S, quantity=100]";
        Assert.assertEquals(inventory.toString(), expectedToString);
    }

}
