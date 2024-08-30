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

import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.services.WarehouseService;

public class WarehouseControllerTests {

    @Mock
    private WarehouseService warehouseService;

    @InjectMocks
    private WarehouseController warehouseController;
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
    public void testFindAllWarehouses() {
        List<Warehouse> expectedWarehouses = Arrays.asList(new Warehouse(), new Warehouse());

        when(warehouseService.findAll()).thenReturn(expectedWarehouses);

        Iterable<Warehouse> result = warehouseController.findAllWarehouses();

        Assert.assertEquals(expectedWarehouses, result);
        verify(warehouseService, times(1)).findAll();
    }

    @Test
    public void testFindWarehouseById() {
        Warehouse warehouse1 = new Warehouse();
        warehouse1.setId(1);

        int id = 1;
        when(warehouseService.findById(id)).thenReturn(Optional.of(warehouse1));

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseById(id);

        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assert.assertEquals(warehouse1, response.getBody());

        verify(warehouseService, times(1)).findById(id);
    }

    @Test
    public void testFindWarehouseByNonExistentId() {
        int id = 10;
        when(warehouseService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseById(id);

        Assert.assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        Assert.assertEquals(null, response.getBody());

        verify(warehouseService, times(1)).findById(id);
    }

    @Test
    public void testFindWarehouseByName() {
        Warehouse warehouse1 = new Warehouse();
        warehouse1.setId(1);
        warehouse1.setName("CA1");

        String name = "CA1";
        when(warehouseService.findByName(name)).thenReturn(Optional.of(warehouse1));

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseByName(name);

        Assert.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assert.assertEquals(warehouse1, response.getBody());

        verify(warehouseService, times(1)).findByName(name);
    }

    @Test
    public void testFindWarehouseByNonExistentName() {
        String name = "invalidName";
        when(warehouseService.findByName(name)).thenReturn(Optional.empty());

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseByName(name);

        Assert.assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        Assert.assertEquals(null, response.getBody());

        verify(warehouseService, times(1)).findByName(name);
    }

    @Test
    public void testCreateValidWarehouse() {
        Warehouse validWarehouse = new Warehouse();
        validWarehouse.setId(3);
        validWarehouse.setName("CA3");
        validWarehouse.setMaxCapacity(2000);
        validWarehouse.setStreetAddress("789 Oak St");
        validWarehouse.setCity("Eastside");
        validWarehouse.setState("CA");
        validWarehouse.setZipCode("54321");

        when(warehouseService.save(any(Warehouse.class))).thenReturn(validWarehouse);

        Warehouse result = warehouseController.createWarehouse(validWarehouse);

        Assert.assertEquals(validWarehouse, result);
        verify(warehouseService, times(1)).save(validWarehouse);
    }

    @Test
    public void testCreateInvalidWarehouse() {
        Warehouse invalidWarehouse = new Warehouse();
        invalidWarehouse.setName("");
        invalidWarehouse.setMaxCapacity(0);
        invalidWarehouse.setStreetAddress("");
        invalidWarehouse.setCity("");
        invalidWarehouse.setState("");
        invalidWarehouse.setZipCode("");

        Warehouse result = warehouseController.createWarehouse(invalidWarehouse);
        Assert.assertEquals(null, result);
    }

    @Test
    public void testUpdateWarehouseById() {
        Warehouse validWarehouse = new Warehouse();
        validWarehouse.setId(3);
        validWarehouse.setName("CA3");
        validWarehouse.setMaxCapacity(2000);
        validWarehouse.setStreetAddress("789 Oak St");
        validWarehouse.setCity("Eastside");
        validWarehouse.setState("CA");
        validWarehouse.setZipCode("54321");

        warehouseController.updateWarehouseById(3, validWarehouse);

        verify(warehouseService, times(1)).updateWarehouseById(eq(3), any(Warehouse.class));
    }

    @Test
    public void testDeleteWarehouseById() {
        warehouseController.deleteWarehouseById(3);

        verify(warehouseService, times(1)).deleteById(3);
    }
}
