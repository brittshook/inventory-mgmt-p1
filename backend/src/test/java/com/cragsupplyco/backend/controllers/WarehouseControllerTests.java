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
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.services.WarehouseService;

public class WarehouseControllerTests {

    @Mock
    private WarehouseService warehouseService;

    @InjectMocks
    private WarehouseController warehouseController;
    private AutoCloseable closeable;

    private Warehouse warehouse1;
    private Warehouse warehouse2;

    private Warehouse validWarehouse;
    private Warehouse invalidWarehouse;

    @BeforeMethod
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);

        // Creating mock warehouse data
        warehouse1 = new Warehouse();
        warehouse1.setId(1);
        warehouse1.setName("Central Warehouse");
        warehouse1.setMaxCapacity(5000);
        warehouse1.setStreetAddress("123 Main St");
        warehouse1.setCity("Downtown");
        warehouse1.setState("CA");
        warehouse1.setZipCode("12345");

        warehouse2 = new Warehouse();
        warehouse2.setId(2);
        warehouse2.setName("North Warehouse");
        warehouse2.setMaxCapacity(3000);
        warehouse2.setStreetAddress("456 Elm St");
        warehouse2.setCity("Uptown");
        warehouse2.setState("CA");
        warehouse2.setZipCode("67890");

        validWarehouse = new Warehouse();
        validWarehouse.setId(3);
        validWarehouse.setName("East Warehouse");
        validWarehouse.setMaxCapacity(2000);
        validWarehouse.setStreetAddress("789 Oak St");
        validWarehouse.setCity("Eastside");
        validWarehouse.setState("CA");
        validWarehouse.setZipCode("54321");

        invalidWarehouse = new Warehouse();
        invalidWarehouse.setName("");
        invalidWarehouse.setMaxCapacity(0);
        invalidWarehouse.setStreetAddress("Unknown St");
        invalidWarehouse.setCity("Unknown");
        invalidWarehouse.setState("XX");
        invalidWarehouse.setZipCode("00000");
    }

    @AfterTest
    public void teardown() throws Exception {
        closeable.close();
    }

    @Test
    public void testFindAllWarehouses() {
        List<Warehouse> expectedWarehouses = Arrays.asList(warehouse1, warehouse2);

        when(warehouseService.findAll()).thenReturn(expectedWarehouses);

        Iterable<Warehouse> result = warehouseController.findAllWarehouses();

        assertEquals(result, expectedWarehouses);
        verify(warehouseService, times(1)).findAll();
    }

    @Test
    public void testFindWarehouseById() {
        int id = warehouse1.getId();
        when(warehouseService.findById(id)).thenReturn(Optional.of(warehouse1));

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseById(id);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody(), warehouse1);

        verify(warehouseService, times(1)).findById(id);
    }

    @Test
    public void testFindWarehouseByName() {
        String name = warehouse1.getName();
        when(warehouseService.findByName(name)).thenReturn(Optional.of(warehouse1));

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseByName(name);

        assertEquals(response.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getBody(), warehouse1);

        verify(warehouseService, times(1)).findByName(name);
    }

    @Test
    public void testCreateValidWarehouse() {
        when(warehouseService.save(any(Warehouse.class))).thenReturn(validWarehouse);

        Warehouse result = warehouseController.createWarehouse(validWarehouse);

        assertEquals(result, validWarehouse);
        verify(warehouseService, times(1)).save(any(Warehouse.class));
    }

    @Test
    public void testCreateInvalidWarehouse() {
        Warehouse result = warehouseController.createWarehouse(invalidWarehouse);
        assertEquals(result, null);
    }

    @Test
    public void testUpdateWarehouseById() {
        warehouseController.updateWarehouseById(3, validWarehouse);

        verify(warehouseService, times(1)).updateWarehouseById(eq(3), any(Warehouse.class));
    }

    @Test
    public void testDeleteWarehouseById() {
        warehouseController.deleteWarehouseById(3);

        verify(warehouseService, times(1)).deleteById(3);
    }
}
