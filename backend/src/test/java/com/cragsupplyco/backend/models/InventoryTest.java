package com.cragsupplyco.backend.models;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class InventoryTest {

    private Inventory inventory;
    private Product product;
    private Warehouse warehouse;

    @BeforeMethod
    public void setUp() { // Initialize test data before each test
        inventory = new Inventory();

        product = new Product();
        product.setName("Product");

        warehouse = new Warehouse();
        warehouse.setName("Warehouse");
        warehouse.setMaxCapacity(1000);

        inventory.setId(1);
        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);
        inventory.setSize("S");
        inventory.setQuantity(100);

    }

    @AfterMethod
    public void teardown() { // Clean up test data after each test
        inventory = null;
        product = null;
        warehouse = null;
    }

    /**
     * Test case for validating the getter and setter methods of the Inventory
     * class. Verifies that expected values are correctly returned by getter
     * methods.
     */
    @Test
    public void testInventoryGettersAndSetters() {
        Assert.assertEquals(inventory.getId(), 1);
        Assert.assertEquals(inventory.getProduct(), product);
        Assert.assertEquals(inventory.getWarehouse(), warehouse);
        Assert.assertEquals(inventory.getSize(), "S");
        Assert.assertEquals(inventory.getQuantity(), 100);
    }

    /**
     * Test case for validating the toString() method of the Inventory class.
     * Verifies that the string representation of the object matches the
     * expected format.
     */
    @Test
    public void testToString() {
        String expectedToString = "Inventory [id=1, product=" + product + ", warehouse=" + warehouse
                + ", size=S, quantity=100]";
        Assert.assertEquals(inventory.toString(), expectedToString);
    }

}
