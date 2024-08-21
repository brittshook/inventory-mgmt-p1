package com.cragsupplyco.backend.models;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.List;
import java.util.Arrays;

public class WarehouseTest {
    private Warehouse warehouse;
    private List<Inventory> inventoryItems;

    @BeforeMethod
    public void setUp() {
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

    @Test
    public void testCategoryGettersAndSetters() {
        assertEquals(warehouse.getId(), 1);
        assertEquals(warehouse.getName(), "Name");
        assertEquals(warehouse.getStreetAddress(), "Street Address");
        assertEquals(warehouse.getCity(), "City");
        assertEquals(warehouse.getState(), "ST");
        assertEquals(warehouse.getZipCode(), "00000");
        assertEquals(warehouse.getMaxCapacity(), 1000);
        assertEquals(warehouse.getInventory(), inventoryItems);
    }

    @Test
    public void testToString() {
        String expectedToString = "Warehouse [id=1, name=Name, maxCapacity=1000, streetAddress=Street Address, city=City, state=ST, zipCode=00000, inventory="
                + inventoryItems + "]";
        assertEquals(warehouse.toString(), expectedToString);
    }
}
