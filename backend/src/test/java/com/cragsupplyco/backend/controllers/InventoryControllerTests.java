package com.cragsupplyco.backend.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.dtos.UpdateQuantityRequestDto;
import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.services.InventoryService;

public class InventoryControllerTests {

    private MockMvc mockMvc;

    @Mock
    private InventoryService inventoryService;

    @InjectMocks
    private InventoryController inventoryController;
    private AutoCloseable closeable;

    private Inventory inventory1;
    private Inventory inventory2;
    private Inventory validInventory;
    private Inventory invalidInventory;

    private Product product1;
    private Warehouse warehouse1;

    @BeforeMethod
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(inventoryController)
                .setValidator(new LocalValidatorFactoryBean())
                .build();

        product1 = new Product();
        product1.setId(1);
        product1.setName("Climbing Shoes");

        warehouse1 = new Warehouse();
        warehouse1.setId(1);
        warehouse1.setName("Central Warehouse");

        inventory1 = new Inventory();
        inventory1.setId(1);
        inventory1.setProduct(product1);
        inventory1.setWarehouse(warehouse1);
        inventory1.setSize("Large");
        inventory1.setQuantity(50);

        inventory2 = new Inventory();
        inventory2.setId(2);
        inventory2.setProduct(product1);
        inventory2.setWarehouse(warehouse1);
        inventory2.setSize("Medium");
        inventory2.setQuantity(30);

        validInventory = new Inventory();
        validInventory.setId(3);
        validInventory.setProduct(product1);
        validInventory.setWarehouse(warehouse1);
        validInventory.setSize("Small");
        validInventory.setQuantity(10);

        invalidInventory = new Inventory();
        invalidInventory.setProduct(null);
        invalidInventory.setWarehouse(warehouse1);
        invalidInventory.setSize("Extra Large");
        invalidInventory.setQuantity(0);
    }

    @AfterTest
    public void teardown() throws Exception {
        if (closeable != null) {
            closeable.close();
        }
    }

    @Test
    public void testFindAllInventory() {
        List<Inventory> expectedInventory = Arrays.asList(inventory1, inventory2);

        when(inventoryService.findAll()).thenReturn(expectedInventory);

        Iterable<Inventory> result = inventoryController.findAllInventory();

        assertEquals(result, expectedInventory);
        verify(inventoryService, times(1)).findAll();
    }

    @Test
    public void testFindInventoryById() {
        int id = inventory1.getId();
        when(inventoryService.findById(id)).thenReturn(Optional.of(inventory1));

        ResponseEntity<Inventory> response = inventoryController.findInventoryById(id);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody(), inventory1);
        verify(inventoryService, times(1)).findById(id);
    }

    @Test
    public void testFindInventoryByIdNotFound() {
        int id = 999;
        when(inventoryService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Inventory> response = inventoryController.findInventoryById(id);

        assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        verify(inventoryService, times(1)).findById(id);
    }

    @Test
    public void testCreateValidInventory() {
        when(inventoryService.save(any(Inventory.class))).thenReturn(validInventory);

        Inventory result = inventoryController.createInventory(validInventory);

        assertEquals(result, validInventory);
        verify(inventoryService, times(1)).save(any(Inventory.class));
    }

    @Test
    public void testCreateInvalidInventory() {
        Inventory result = inventoryController.createInventory(inventory1);

        assertEquals(result, null);
    }

    @Test
    public void testUpdateInventoryById() {
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
