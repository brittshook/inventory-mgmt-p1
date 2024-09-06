package com.cragsupplyco.backend.services;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.dtos.InventoryRequestDto;
import com.cragsupplyco.backend.mappers.InventoryMapper;
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
    private InventoryMapper inventoryMapper;

    @Mock
    private Warehouse warehouse;

    @BeforeTest
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this); // Initialize mocks before each test

        warehouse.setId(1);
        warehouse.setName("CA1");
        warehouse.setMaxCapacity(100);
    }

    @AfterTest
    public void teardown() throws Exception {
        closeable.close(); // Close any open mocks after test
    }

    /**
     * Test case to verify that findAll() method returns a list of all inventory
     * items from the repository.
     */
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

    /**
     * Test case to verify that using the findById() method with existing id
     * returns the inventory item with specified id from the repository.
     */
    @Test
    public void testFindInventoryByExistingId() {
        int inventoryId = 1;
        Inventory expectedInventory = new Inventory();
        expectedInventory.setId(inventoryId);

        when(inventoryRepository.findById(inventoryId)).thenReturn(Optional.of(expectedInventory));
        Optional<Inventory> result = inventoryService.findById(inventoryId);
        Assert.assertTrue(result.isPresent());
    }

    /**
     * Test case to verify that using the findById() method with non-existent id
     * returns an empty result from the repository.
     */
    @Test
    public void testFindInventoryByNonExistentId() {
        int inventoryId = 2;

        Optional<Inventory> result = inventoryService.findById(inventoryId);
        Assert.assertTrue(result.isEmpty());
    }

    /**
     * Test case to verify that using the save() method with a valid inventory item
     * returns the created inventory item from the repository.
     */
    @Test
    public void testSaveInventory() {
        InventoryRequestDto dto = new InventoryRequestDto();
        dto.setWarehouse(warehouse.getId());
        Inventory expectedInventory = new Inventory();
        expectedInventory.setWarehouse(warehouse);
        when(inventoryMapper.toInventory(dto)).thenReturn(expectedInventory);
        when(inventoryRepository.save(expectedInventory)).thenReturn(expectedInventory);
        when(warehouseRepository.save(warehouse)).thenReturn(warehouse);
        Inventory result = inventoryService.save(dto);
        Assert.assertEquals(result, expectedInventory);
    }

    /**
     * Test case to verify that using the save() method with an inventory
     * item with a quantity that would exceed warehouse capacity throws an
     * IllegalArgumentException.
     */
    @Test
    public void testSaveInventoryExceedsWarehouseCapacity() {
        InventoryRequestDto dto = new InventoryRequestDto();
        dto.setWarehouse(warehouse.getId());
        dto.setQuantity("90");
        dto.setWarehouse(1);

        Inventory inventory = new Inventory();
        inventory.setQuantity(90);
        inventory.setWarehouse(warehouse);

        warehouse.setCurrentCapacity(20);

        when(inventoryMapper.toInventory(dto)).thenReturn(inventory);
        when(inventoryRepository.existsByProductAndWarehouseAndSize(any(Product.class), any(Warehouse.class),
                anyString()))
                .thenReturn(false);

        try {
            inventoryService.save(dto);
            Assert.fail("Expected a IllegalArgumentException to be thrown");
        } catch (IllegalArgumentException e) {
            Assert.assertEquals("Cannot save inventory. It exceeds the warehouse capacity.", e.getMessage());
        }
    }

    /**
     * Test case to verify that using the updateInventoryById() method with a valid
     * inventory item in same warehouse returns the updated inventory item from the
     * repository.
     */
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

        InventoryRequestDto dto = new InventoryRequestDto();
        dto.setWarehouse(warehouse.getId());

        when(inventoryMapper.toInventory(dto)).thenReturn(updatedInventory);
        Inventory result = inventoryService.updateInventoryById(1, dto);

        Assert.assertEquals(result.getQuantity(), 15);
        Assert.assertEquals(result.getSize(), "M");
        Assert.assertEquals(result.getWarehouse(), currentWarehouse);
        verify(warehouseRepository).save(currentWarehouse);
        verify(inventoryRepository).save(existingInventory);
    }

    /**
     * Test case to verify that using the updateInventoryById() method with an
     * inventory item with a quantity that would exceed warehouse capacity throws an
     * IllegalArgumentException.
     */
    @Test
    public void testUpdateInventoryInSameWarehouseExceedsWarehouseCapacity() {
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
        updatedInventory.setQuantity(175);
        updatedInventory.setSize("M");

        when(inventoryRepository.findById(1)).thenReturn(Optional.of(existingInventory));
        when(warehouseRepository.save(any(Warehouse.class))).thenReturn(currentWarehouse);
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(existingInventory);

        InventoryRequestDto dto = new InventoryRequestDto();
        dto.setWarehouse(warehouse.getId());

        when(inventoryMapper.toInventory(dto)).thenReturn(updatedInventory);

        try {
            inventoryService.updateInventoryById(1, dto);
            Assert.fail("Expected a IllegalArgumentException to be thrown");
        } catch (IllegalArgumentException e) {
            Assert.assertEquals("Cannot update inventory. It exceeds the warehouse capacity.", e.getMessage());
        }
    }

    /**
     * Test case to verify that using the updateInventoryById() method with a valid
     * inventory item in different warehouse returns the updated inventory item from
     * the repository.
     */
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

        InventoryRequestDto dto = new InventoryRequestDto();
        dto.setWarehouse(warehouse.getId());

        when(inventoryMapper.toInventory(dto)).thenReturn(updatedInventory);
        Inventory result = inventoryService.updateInventoryById(1, dto);

        Assert.assertEquals(result.getQuantity(), 15);
        Assert.assertEquals(result.getSize(), "M");
        Assert.assertEquals(result.getWarehouse(), newWarehouse);
        verify(warehouseRepository).save(currentWarehouse);
        verify(warehouseRepository).save(newWarehouse);
        verify(inventoryRepository).save(existingInventory);
    }

    /**
     * Test case to verify that using the updateInventoryById() method with an
     * inventory item with a quantity that would exceed warehouse capacity of its
     * new warehouse throws an IllegalArgumentException.
     */
    @Test
    public void testUpdateInventoryInDifferentWarehouseExceedsWarehouseCapacity() {
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
        updatedInventory.setQuantity(175);
        updatedInventory.setSize("M");

        when(inventoryRepository.findById(1)).thenReturn(Optional.of(existingInventory));
        when(warehouseRepository.save(any(Warehouse.class))).thenReturn(newWarehouse);
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(existingInventory);

        InventoryRequestDto dto = new InventoryRequestDto();
        dto.setWarehouse(warehouse.getId());

        when(inventoryMapper.toInventory(dto)).thenReturn(updatedInventory);

        try {
            inventoryService.updateInventoryById(1, dto);
            Assert.fail("Expected a IllegalArgumentException to be thrown");
        } catch (IllegalArgumentException e) {
            Assert.assertEquals("Cannot move inventory. It exceeds the new warehouse capacity.", e.getMessage());
        }
    }

    /**
     * Test case to verify that using the updateQuantityById() method with the valid
     * operation "increment" returns the updated inventory item from the repository.
     */
    @Test
    public void testUpdateQuantityIncrement() {
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

    /**
     * Test case to verify that using the updateQuantityById() method with the valid
     * operation "decrement" returns the updated inventory item from the repository.
     */
    @Test
    public void testUpdateQuantityDecrement() {
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

    /**
     * Test case to verify that using the updateQuantityById() method with an
     * invalid operation throws a RuntimeException.
     */
    @Test
    public void testUpdateQuantityInvalidOperation() {
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

        int value = 5;
        when(inventoryRepository.findById(1)).thenReturn(Optional.of(inventory));
        when(inventoryRepository.save(inventory)).thenReturn(inventory);

        try {
            inventoryService.updateQuantityById(1, "multiply", value);
            Assert.fail("Expected a RuntimeException to be thrown");
        } catch (RuntimeException e) {
            Assert.assertEquals("Invalid operation: multiply", e.getMessage());
        }
    }

    /**
     * Test case to verify that using the updateQuantityById() method with an
     * inventory item that is not found throws a RuntimeException.
     */
    @Test
    public void testUpdateQuantityInventoryNotFound() {
        Warehouse currentWarehouse = new Warehouse();
        currentWarehouse.setId(2);
        currentWarehouse.setName("CA2");
        currentWarehouse.setCurrentCapacity(50);
        currentWarehouse.setMaxCapacity(100);

        int value = 5;
        when(inventoryRepository.findById(1)).thenReturn(Optional.empty());

        try {
            inventoryService.updateQuantityById(1, "increment", value);
            Assert.fail("Expected a RuntimeException to be thrown");
        } catch (RuntimeException e) {
            Assert.assertEquals("Inventory not found with ID: 1", e.getMessage());
        }
    }

    /**
     * Test case to verify that using the deleteById() method with calls the
     * repository deleteById() method.
     */
    @Test
    public void testDeleteInventoryById() {
        int inventoryId = 1;
        inventoryService.deleteById(inventoryId);
        verify(inventoryRepository).deleteById(inventoryId);
    }

}