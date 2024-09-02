package com.cragsupplyco.backend.services;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.repositories.InventoryRepository;
import com.cragsupplyco.backend.repositories.WarehouseRepository;

public class InventoryServiceTest {

    @InjectMocks
    private InventoryService inventoryService;
    private AutoCloseable closeable;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private Warehouse warehouse;

    @BeforeTest
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);

        warehouse.setId(1);
        warehouse.setName("CA1");
        warehouse.setMaxCapacity(100);
    }

    @AfterTest
    public void teardown() throws Exception {
        closeable.close();
    }

    @Test
    public void testFindAll() {
        Inventory inventory1 = new Inventory();
        Inventory inventory2 = new Inventory();
        Inventory inventory3 = new Inventory();
        List<Inventory> exepctedCategories = Arrays.asList(inventory1, inventory2, inventory3);

        when(inventoryRepository.findAll()).thenReturn(exepctedCategories);
        Iterable<Inventory> result = inventoryService.findAll();

        int count = 0;
        for (Inventory inventory : result) {
            count++;
        }

        Assert.assertTrue(count == exepctedCategories.size());
    }

    @Test
    public void testFindInventoryByExistingId() {
        int inventoryId = 1;
        Inventory expectedInventory = new Inventory();
        expectedInventory.setId(inventoryId);

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(expectedInventory));
        Optional<Inventory> result = inventoryService.findById(inventoryId);
        Assert.assertTrue(result.isPresent());
    }

    @Test
    public void testFindInventoryByNonExistentId() {
        int inventoryId = 2;

        Optional<Inventory> result = inventoryService.findById(inventoryId);
        Assert.assertTrue(result.isEmpty());
    }

    @Test
    public void testSaveInventory() {
        int inventoryId = 4;
        Inventory expectedInventory = new Inventory();
        expectedInventory.setId(inventoryId);
        expectedInventory.setWarehouse(warehouse);

        when(inventoryRepository.save(expectedInventory)).thenReturn(expectedInventory);
        when(warehouseRepository.save(warehouse)).thenReturn(warehouse);
        Inventory result = inventoryService.save(expectedInventory);
        Assert.assertEquals(result, expectedInventory);
    }

    @Test
    public void testUpdateInventoryInSameWarehouse() {
        Warehouse currentWarehouse = new Warehouse();
        currentWarehouse.setId(2);
        currentWarehouse.setName("CA2");
        currentWarehouse.setCurrentCapacity(50);
        currentWarehouse.setMaxCapacity(100);

        Inventory existingInventory = new Inventory();
        existingInventory.setId(1);
        existingInventory.setProduct(new Product());
        existingInventory.setWarehouse(currentWarehouse);
        existingInventory.setQuantity(10);
        existingInventory.setSize("M");

        Inventory updatedInventory = new Inventory();
        updatedInventory.setId(1);
        updatedInventory.setProduct(new Product());
        updatedInventory.setWarehouse(currentWarehouse);
        updatedInventory.setQuantity(15);
        updatedInventory.setSize("M");

        when(inventoryRepository.findById(1)).thenReturn(Optional.of(existingInventory));
        when(warehouseRepository.save(any(Warehouse.class))).thenReturn(currentWarehouse);
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(existingInventory);

        Inventory result = inventoryService.updateInventoryById(1, updatedInventory);

        Assert.assertEquals(result.getQuantity(), 15);
        Assert.assertEquals(result.getSize(), "M");
        Assert.assertEquals(result.getWarehouse(), currentWarehouse);
        verify(warehouseRepository).save(currentWarehouse);
        verify(inventoryRepository).save(existingInventory);
    }

    @Test
    public void testUpdateInventoryInDifferentWarehouse() {
        Warehouse currentWarehouse = new Warehouse();
        currentWarehouse.setId(2);
        currentWarehouse.setName("CA2");
        currentWarehouse.setCurrentCapacity(50);
        currentWarehouse.setMaxCapacity(100);

        Warehouse newWarehouse = new Warehouse();
        newWarehouse.setId(3);
        currentWarehouse.setName("NY1");
        newWarehouse.setCurrentCapacity(30);
        newWarehouse.setMaxCapacity(200);

        Inventory existingInventory = new Inventory();
        existingInventory.setId(1);
        existingInventory.setProduct(new Product());
        existingInventory.setWarehouse(currentWarehouse);
        existingInventory.setQuantity(10);
        existingInventory.setSize("M");

        Inventory updatedInventory = new Inventory();
        updatedInventory.setId(1);
        updatedInventory.setProduct(new Product());
        updatedInventory.setWarehouse(newWarehouse);
        updatedInventory.setQuantity(15);
        updatedInventory.setSize("M");

        when(inventoryRepository.findById(1)).thenReturn(Optional.of(existingInventory));
        when(warehouseRepository.save(any(Warehouse.class))).thenReturn(newWarehouse);
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(existingInventory);

        Inventory result = inventoryService.updateInventoryById(1, updatedInventory);

        Assert.assertEquals(result.getQuantity(), 15);
        Assert.assertEquals(result.getSize(), "M");
        Assert.assertEquals(result.getWarehouse(), newWarehouse);
        verify(warehouseRepository).save(currentWarehouse);
        verify(warehouseRepository).save(newWarehouse);
        verify(inventoryRepository).save(existingInventory);
    }

    @Test
    public void testIncrementQuantity() {
        Warehouse currentWarehouse = new Warehouse();
        currentWarehouse.setId(2);
        currentWarehouse.setName("CA2");
        currentWarehouse.setCurrentCapacity(50);
        currentWarehouse.setMaxCapacity(100);

        Inventory inventory = new Inventory();
        inventory.setId(1);
        inventory.setProduct(new Product());
        inventory.setWarehouse(currentWarehouse);
        inventory.setQuantity(10);
        inventory.setSize("M");

        int incrementValue = 20;
        when(inventoryRepository.findById(1)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(inventory)).thenReturn(inventory);

        Inventory result = inventoryService.updateQuantityById(1, "increment", incrementValue);

        Assert.assertEquals(result.getQuantity(), 30);
        verify(inventoryRepository).save(result);
    }

    @Test
    public void testDecrementQuantity() {
        Warehouse currentWarehouse = new Warehouse();
        currentWarehouse.setId(2);
        currentWarehouse.setName("CA2");
        currentWarehouse.setCurrentCapacity(50);
        currentWarehouse.setMaxCapacity(100);

        Inventory inventory = new Inventory();
        inventory.setId(1);
        inventory.setProduct(new Product());
        inventory.setWarehouse(currentWarehouse);
        inventory.setQuantity(10);
        inventory.setSize("M");

        int decrementValue = 5;
        when(inventoryRepository.findById(1)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(inventory)).thenReturn(inventory);

        Inventory result = inventoryService.updateQuantityById(1, "decrement", decrementValue);

        Assert.assertEquals(result.getQuantity(), 5);
        verify(inventoryRepository).save(result);
    }

    @Test
    public void testDeleteInventoryById() {
        int inventoryId = 1;
        inventoryService.deleteById(inventoryId);
        verify(inventoryRepository).deleteById(inventoryId);
    }

}
