package com.cragsupplyco.backend.services;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
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
        Assert.assertEquals(result, expectedInventory);
    }

    @Test
    public void testSaveInventoryButExceedsWarehouseCapacity() {
        int inventoryId = 4;

        // inventory has quantity 10
        Inventory inventory = new Inventory();
        inventory.setId(inventoryId);
        inventory.setQuantity(10);

        // but warehouse is already at capacity
        Warehouse warehouse = new Warehouse();
        warehouse.setCurrentCapacity(1000);
        warehouse.setMaxCapacity(1000);
        inventory.setWarehouse(warehouse);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.save(inventory);
        });

        assertEquals("Cannot save inventory. It exceeds the warehouse capacity.", exception.getMessage());
    }

    @Test
    public void testUpdateInventoryById() {
        int inventoryId = 1;

        Warehouse warehouse = new Warehouse();
        warehouse.setId(1);
        warehouse.setMaxCapacity(1000);

        Inventory existingInventory = new Inventory();
        existingInventory.setId(inventoryId);
        existingInventory.setProduct(new Product());
        existingInventory.setWarehouse(warehouse);
        existingInventory.setSize("S");
        existingInventory.setQuantity(100);

        Inventory updatedInventory = new Inventory();
        updatedInventory.setId(inventoryId);
        updatedInventory.setProduct(new Product());
        updatedInventory.setWarehouse(warehouse);
        updatedInventory.setSize("M");
        updatedInventory.setQuantity(100);

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(existingInventory));
        when(inventoryRepository.save(updatedInventory)).thenReturn(updatedInventory);
        when(warehouseRepository.save(warehouse)).thenReturn(warehouse);
        Inventory result = inventoryService.updateInventoryById(inventoryId, updatedInventory);
        Assert.assertEquals(result, updatedInventory);
    }

    @Test
    public void testUpdateInventoryByIdButExceedsCapacity() {
        int inventoryId = 4;

        Inventory inventory = new Inventory();
        inventory.setId(inventoryId);
        inventory.setQuantity(10);

        Warehouse warehouse = new Warehouse();
        warehouse.setCurrentCapacity(1000);
        warehouse.setMaxCapacity(1000);
        inventory.setWarehouse(warehouse);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.save(inventory);
        });

        assertEquals("Cannot save inventory. It exceeds the warehouse capacity.", exception.getMessage());
    }

    public void testUpdateInventoryByIdButExceedsCapacityInSameWarehouse() {
        int inventoryId = 4;

        Warehouse warehouse = new Warehouse();
        warehouse.setCurrentCapacity(990);
        warehouse.setMaxCapacity(1000);

        Inventory existingInventory = new Inventory();
        existingInventory.setId(inventoryId);
        existingInventory.setWarehouse(warehouse);

        Inventory updatedInventory = new Inventory();
        // over by 10
        updatedInventory.setQuantity(20); 

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(existingInventory));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.updateInventoryById(inventoryId, updatedInventory);
        });

        assertEquals("Cannot update inventory. It exceeds the warehouse capacity.", exception.getMessage());
    }

    @Test
    public void testUpdateInventoryByIdButExceedsCapacityInNewWarehouse() {
        int inventoryId = 4;

        Warehouse currentWarehouse = new Warehouse();
        currentWarehouse.setCurrentCapacity(990);
        currentWarehouse.setMaxCapacity(1000);

        Warehouse newWarehouse = new Warehouse();
        // new warehouse doesn't have the capacity
        newWarehouse.setCurrentCapacity(995);
        newWarehouse.setMaxCapacity(1000);

        Inventory existingInventory = new Inventory();
        existingInventory.setId(inventoryId);
        existingInventory.setQuantity(10);
        existingInventory.setWarehouse(currentWarehouse);

        Inventory updatedInventory = new Inventory();
        updatedInventory.setQuantity(10);
        updatedInventory.setWarehouse(newWarehouse);

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(existingInventory));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.updateInventoryById(inventoryId, updatedInventory);
        });

        assertEquals("Cannot move inventory. It exceeds the new warehouse capacity.", exception.getMessage());
    }

    @Test
    public void testUpdateInventoryByIdButExceedsCapacityAfterQuantityChange() {
        int inventoryId = 4;

        Warehouse warehouse = new Warehouse();
        warehouse.setCurrentCapacity(1000);
        warehouse.setMaxCapacity(1000);

        Inventory existingInventory = new Inventory();
        existingInventory.setId(inventoryId);
        existingInventory.setQuantity(10);
        existingInventory.setWarehouse(warehouse);

        Inventory updatedInventory = new Inventory();
        updatedInventory.setQuantity(15);
        updatedInventory.setWarehouse(warehouse);

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(existingInventory));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.updateInventoryById(inventoryId, updatedInventory);
        });

        assertEquals("Cannot update inventory. It exceeds the warehouse capacity.", exception.getMessage());
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

        Assert.assertEquals(result, updatedInventory);
    }

    @Test
    public void testIncrementQuantityByIdButExceedsCapacity() {
        int inventoryId = 4;

        Warehouse warehouse = new Warehouse();
        warehouse.setCurrentCapacity(1000);
        warehouse.setMaxCapacity(1000);

        Inventory inventory = new Inventory();
        inventory.setId(inventoryId);
        inventory.setQuantity(10);
        inventory.setWarehouse(warehouse);

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(inventory));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.updateQuantityById(inventoryId, "increment", 10);
        });

        assertEquals("Cannot update inventory. It exceeds the warehouse capacity.", exception.getMessage());
    }

    @Test
    public void testDecrementQuantityByIdButExceedsCapacity() {
        int inventoryId = 4;

        Warehouse warehouse = new Warehouse();
        warehouse.setCurrentCapacity(1000);
        warehouse.setMaxCapacity(900);

        Inventory inventory = new Inventory();
        inventory.setId(inventoryId);
        inventory.setQuantity(10);
        inventory.setWarehouse(warehouse);

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(inventory));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.updateQuantityById(inventoryId, "decrement", 10);
        });

        assertEquals("Cannot update inventory. It exceeds the warehouse capacity.", exception.getMessage());
    }

    @Test
    public void testDecrementQuantityByIdButNotFound() {
        int id = 33;
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryService.updateQuantityById(id, "increment", 10);
        });

        assertEquals("Inventory not found with id " + id, exception.getMessage());
    }

    @Test
    public void testDeleteInventoryById() {
        int inventoryId = 1;
        inventoryService.deleteById(inventoryId);
        verify(inventoryRepository).deleteById(inventoryId);
    }

}
