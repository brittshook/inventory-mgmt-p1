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

    @BeforeTest
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
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

        Warehouse warehouse = new Warehouse();
        warehouse.setMaxCapacity(1000);
        expectedInventory.setWarehouse(warehouse);

        when(inventoryRepository.save(expectedInventory)).thenReturn(expectedInventory);
        when(warehouseRepository.save(warehouse)).thenReturn(warehouse);
        Inventory result = inventoryService.save(expectedInventory);
        Assert.assertEquals(expectedInventory, result);
    }

    @Test
    public void testUpdateInventoryById() {
        int inventoryId = 1;
        Inventory expectedInventory = new Inventory();
        expectedInventory.setId(inventoryId);

        when(inventoryRepository.save(expectedInventory)).thenReturn(expectedInventory);
        Inventory result = inventoryService.updateInventoryById(inventoryId, expectedInventory);
        Assert.assertEquals(expectedInventory, result);
    }

    @Test
    public void testUpdateQuantityById() {
        int inventoryId = 1;
        String inventoryOperation = "increment";
        int inventoryInitialQuantity = 100;
        int inventoryAddQuantity = 100;
        int inventoryExpectedQuantity = 200;

        Warehouse warehouse = new Warehouse();
        warehouse.setId(1);
        warehouse.setMaxCapacity(1000);

        Inventory initialInventory = new Inventory();
        initialInventory.setId(inventoryId);
        initialInventory.setWarehouse(warehouse);
        initialInventory.setQuantity(inventoryInitialQuantity);

        Inventory updatedInventory = new Inventory();
        updatedInventory.setId(inventoryId);
        updatedInventory.setWarehouse(warehouse);
        updatedInventory.setQuantity(inventoryExpectedQuantity);

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(initialInventory));
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(updatedInventory);

        Inventory result = inventoryService.updateQuantityById(inventoryId, inventoryOperation, inventoryAddQuantity);

        Assert.assertEquals(updatedInventory, result);
    }

    @Test
    public void testDeleteInventoryById() {
        int inventoryId = 1;
        inventoryService.deleteById(inventoryId);
        verify(inventoryRepository).deleteById(inventoryId);
    }

}
