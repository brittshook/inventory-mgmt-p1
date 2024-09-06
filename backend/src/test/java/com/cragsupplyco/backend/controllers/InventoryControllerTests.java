package com.cragsupplyco.backend.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.dtos.InventoryRequestDto;
import com.cragsupplyco.backend.dtos.UpdateQuantityRequestDto;
import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.services.InventoryService;

public class InventoryControllerTests {

    @Mock
    private InventoryService inventoryService;

    @InjectMocks
    private InventoryController inventoryController;
    private AutoCloseable closeable;

    @BeforeTest
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this); // Initialize mocks before each test
    }

    @AfterTest
    public void teardown() throws Exception {
        if (closeable != null) {
            closeable.close(); // Close any open mocks after test
        }
    }

    /**
     * Test case for finding all inventory items using the findAllInventory()
     * method. Validates that the service returns a list of inventory items and the
     * method is called once.
     */
    @Test
    public void testFindAllInventory() {
        List<Inventory> expectedInventory = Arrays.asList(new Inventory(), new Inventory());

        when(inventoryService.findAll()).thenReturn(expectedInventory);

        Iterable<Inventory> result = inventoryController.findAllInventory();

        Assert.assertEquals(result, expectedInventory);
        verify(inventoryService, times(1)).findAll();
    }

    /**
     * Test case for finding an inventory item by its id using the
     * findInventoryById() method. Validates that the correct inventory item is
     * returned for a valid id.
     */
    @Test
    public void testFindInventoryById() {
        Inventory inventory1 = new Inventory();
        inventory1.setId(1);

        Product newProduct = new Product();
        newProduct.setId(1);
        newProduct.setBrand("Brand");
        newProduct.setName("Name");
        newProduct.setDescription("Description");
        inventory1.setProduct(newProduct);

        Warehouse newWarehouse = new Warehouse();
        newWarehouse.setId(1);
        newWarehouse.setName("CA1");
        newWarehouse.setMaxCapacity(1000);
        newWarehouse.setCity("Fresno");
        newWarehouse.setState("CA");
        newWarehouse.setZipCode("83942");
        inventory1.setWarehouse(newWarehouse);

        inventory1.setQuantity(50);

        int id = inventory1.getId();
        when(inventoryService.findById(id)).thenReturn(Optional.of(inventory1));

        ResponseEntity<Inventory> response = inventoryController.findInventoryById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), inventory1);
        verify(inventoryService, times(1)).findById(id);
    }

    /**
     * Test case for attempting to find an inventory item with a non-existent id.
     * Validates that a 404/Not Found response is returned.
     */
    @Test
    public void testFindInventoryByyNonExistentId() {
        int id = 999;
        when(inventoryService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Inventory> response = inventoryController.findInventoryById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        verify(inventoryService, times(1)).findById(id);
    }

    /**
     * Test case for creating a valid inventory item using the createInventory()
     * method. Validates that the inventory item is saved and returned as expected.
     */
    @Test
    public void testCreateValidInventory() {
        Inventory validInventory = new Inventory();
        validInventory.setId(3);

        Product newProduct = new Product();
        newProduct.setId(1);
        newProduct.setBrand("Brand");
        newProduct.setName("Name");
        newProduct.setDescription("Description");
        validInventory.setProduct(newProduct);

        Warehouse newWarehouse = new Warehouse();
        newWarehouse.setId(1);
        newWarehouse.setName("CA1");
        newWarehouse.setMaxCapacity(1000);
        newWarehouse.setCity("Fresno");
        newWarehouse.setState("CA");
        newWarehouse.setZipCode("83942");
        validInventory.setWarehouse(newWarehouse);

        validInventory.setSize("Small");
        validInventory.setQuantity(10);

        InventoryRequestDto validInventoryDto = new InventoryRequestDto();
        validInventoryDto.setProduct(newProduct.getId());
        validInventoryDto.setWarehouse(newWarehouse.getId());
        validInventoryDto.setSize(validInventory.getSize());
        validInventoryDto.setQuantity(Integer.toString(validInventory.getQuantity()));

        when(inventoryService.save(any(InventoryRequestDto.class))).thenReturn(validInventory);

        Inventory result = inventoryController.createInventory(validInventoryDto);

        Assert.assertEquals(result, validInventory);
        verify(inventoryService, times(1)).save(validInventoryDto);
    }

    /**
     * Test case for attempting to create an invalid inventory item with incorrect
     * data. Validates that null is returned and the inventory item is not
     * created.
     */
    @Test
    public void testCreateInvalidInventory() {
        Inventory invalidInventory = new Inventory();
        invalidInventory.setId(1);

        Product newProduct = new Product();
        newProduct.setId(1);
        newProduct.setBrand("Brand");
        newProduct.setName("Name");
        newProduct.setDescription("Description");
        invalidInventory.setProduct(newProduct);

        Warehouse newWarehouse = new Warehouse();
        newWarehouse.setId(1);
        newWarehouse.setName("CA1");
        newWarehouse.setMaxCapacity(1000);
        newWarehouse.setCity("Fresno");
        newWarehouse.setState("CA");
        newWarehouse.setZipCode("83942");
        invalidInventory.setWarehouse(newWarehouse);

        invalidInventory.setQuantity(-1);

        InventoryRequestDto invalidInventoryDto = new InventoryRequestDto();
        invalidInventoryDto.setProduct(newProduct.getId());
        invalidInventoryDto.setWarehouse(newWarehouse.getId());
        invalidInventoryDto.setSize(invalidInventory.getSize());
        invalidInventoryDto.setQuantity(Integer.toString(invalidInventory.getQuantity()));

        Inventory result = inventoryController.createInventory(invalidInventoryDto);

        Assert.assertEquals(result, null);
    }

    /**
     * Test case for updating an inventory item by its id using the
     * updateInventoryById() method. Verifies that the updateInventoryById service
     * method is called with the correct parameters.
     */
    @Test
    public void testUpdateInventoryById() {
        Inventory validInventory = new Inventory();
        validInventory.setId(3);

        Product newProduct = new Product();
        newProduct.setId(1);
        newProduct.setBrand("Brand");
        newProduct.setName("Name");
        newProduct.setDescription("Description");
        validInventory.setProduct(newProduct);

        Warehouse newWarehouse = new Warehouse();
        newWarehouse.setId(1);
        newWarehouse.setName("CA1");
        newWarehouse.setMaxCapacity(1000);
        newWarehouse.setCity("Fresno");
        newWarehouse.setState("CA");
        newWarehouse.setZipCode("83942");
        validInventory.setWarehouse(newWarehouse);

        validInventory.setSize("Small");
        validInventory.setQuantity(10);

        InventoryRequestDto validInventoryDto = new InventoryRequestDto();
        validInventoryDto.setProduct(newProduct.getId());
        validInventoryDto.setWarehouse(newWarehouse.getId());
        validInventoryDto.setSize(validInventory.getSize());
        validInventoryDto.setQuantity(Integer.toString(validInventory.getQuantity()));

        inventoryController.updateInventoryById(3, validInventoryDto);

        verify(inventoryService, times(1)).updateInventoryById(eq(3), any(InventoryRequestDto.class));
    }

    /**
     * Test case for updating the quantity of an inventory item by its id using the
     * updateQuantityById() method. Verifies that the updateQuantityById service
     * method is called with the correct parameters.
     */
    @Test
    public void testUpdateInventoryQuantityById() {
        UpdateQuantityRequestDto dto = new UpdateQuantityRequestDto();
        dto.setOperation("increment");
        dto.setValue(10);

        inventoryController.updateInventoryQuantityById(3, dto);

        verify(inventoryService, times(1)).updateQuantityById(eq(3), eq("increment"), eq(10));
    }

    /**
     * Test case for deleting an inventory item by its id using the
     * deleteInventoryById() method. Verifies that the deleteById service method is
     * called once.
     */
    @Test
    public void testDeleteInventoryById() {
        inventoryController.deleteInventoryById(3);

        verify(inventoryService, times(1)).deleteById(3);
    }
}
