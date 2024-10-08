package com.cragsupplyco.backend.models;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.List;
import java.util.Arrays;

public class WarehouseTest {
    private Warehouse warehouse;
    private List<Inventory> inventoryItems;

    @BeforeMethod
    public void setUp() { // Initialize test data before each test
        warehouse = new Warehouse();

        Inventory inventory1 = new Inventory();
        Inventory inventory2 = new Inventory();
        inventoryItems = Arrays.asList(inventory1, inventory2);

        warehouse.setId(1);
        warehouse.setName("Name");
        warehouse.setStreetAddress("Street Address");
        warehouse.setCity("City");
        warehouse.setState("ST");
        warehouse.setZipCode("00000");
        warehouse.setMaxCapacity(1000);
        warehouse.setInventory(inventoryItems);
    }

    @AfterMethod
    public void teardown() { // Clean up test data after each test
        warehouse = null;
        inventoryItems = null;
    }

    /**
     * Test case for validating the getter and setter methods of the Warehouse
     * class. Verifies that expected values are correctly returned by getter
     * methods.
     */
    @Test
    public void testWarehouseGettersAndSetters() {
        Assert.assertEquals(warehouse.getId(), 1);
        Assert.assertEquals(warehouse.getName(), "Name");
        Assert.assertEquals(warehouse.getStreetAddress(), "Street Address");
        Assert.assertEquals(warehouse.getCity(), "City");
        Assert.assertEquals(warehouse.getState(), "ST");
        Assert.assertEquals(warehouse.getZipCode(), "00000");
        Assert.assertEquals(warehouse.getMaxCapacity(), 1000);
        Assert.assertEquals(warehouse.getInventory(), inventoryItems);
    }

    /**
     * Test case for validating the toString() method of the Warehouse class.
     * Verifies that the string representation of the object matches the
     * expected format.
     */
    @Test
    public void testToString() {
        String expectedToString = "Warehouse [id=1, name=Name, maxCapacity=1000, currentCapacity=0, streetAddress=Street Address, city=City, state=ST, zipCode=00000, inventory="
                + inventoryItems + "]";
        Assert.assertEquals(warehouse.toString(), expectedToString);
    }
}
