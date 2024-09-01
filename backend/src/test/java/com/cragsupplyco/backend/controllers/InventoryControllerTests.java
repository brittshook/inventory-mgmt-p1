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
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterTest
    public void teardown() throws Exception {
        if (closeable != null) {
            closeable.close();
        }
    }

    @Test
    public void testFindAllInventory() {
        List<Inventory> expectedInventory = Arrays.asList(new Inventory(), new Inventory());

        when(inventoryService.findAll()).thenReturn(expectedInventory);

        Iterable<Inventory> result = inventoryController.findAllInventory();

        Assert.assertEquals(result, expectedInventory);
        verify(inventoryService, times(1)).findAll();
    }

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

    @Test
    public void testFindInventoryByyNonExistentId() {
        int id = 999;
        when(inventoryService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Inventory> response = inventoryController.findInventoryById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        verify(inventoryService, times(1)).findById(id);
    }

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

        when(inventoryService.save(any(Inventory.class))).thenReturn(validInventory);

        Inventory result = inventoryController.createInventory(validInventory);

        Assert.assertEquals(result, validInventory);
        verify(inventoryService, times(1)).save(validInventory);
    }

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

        Inventory result = inventoryController.createInventory(invalidInventory);

        Assert.assertEquals(result, null);
    }

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

        inventoryController.updateInventoryById(3, validInventory);

        verify(inventoryService, times(1)).updateInventoryById(eq(3), any(Inventory.class));
    }

    @Test
    public void testUpdateInventoryQuantityById() {
        UpdateQuantityRequestDto dto = new UpdateQuantityRequestDto();
        dto.setOperation("add");
        dto.setValue(10);

        inventoryController.updateInventoryQuantityById(3, dto);

        verify(inventoryService, times(1)).updateQuantityById(eq(3), eq("add"), eq(10));
    }

    @Test
    public void testDeleteInventoryById() {
        inventoryController.deleteInventoryById(3);

        verify(inventoryService, times(1)).deleteById(3);
    }
}
