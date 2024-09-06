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
        closeable = MockitoAnnotations.openMocks(this); // Initialize mocks before each test
    }

    @AfterTest
    public void teardown() throws Exception {
        if (closeable != null) {
            closeable.close(); // Close any open mocks after test
        }
    }

    /**
     * Test case for finding all warehouses using the findAllWarehouses() method.
     * Validates that the service returns a list of warehouses and the method is
     * called once.
     */
    @Test
    public void testFindAllWarehouses() {
        List<Warehouse> expectedWarehouses = Arrays.asList(new Warehouse(), new Warehouse());

        when(warehouseService.findAll()).thenReturn(expectedWarehouses);

        Iterable<Warehouse> result = warehouseController.findAllWarehouses();

        Assert.assertEquals(result, expectedWarehouses);
        verify(warehouseService, times(1)).findAll();
    }

    /**
     * Test case for finding a warehouse by its id using the findWarehouseById()
     * method. Validates that the correct warehouse is returned for a valid id.
     */
    @Test
    public void testFindWarehouseById() {
        Warehouse warehouse1 = new Warehouse();
        warehouse1.setId(1);

        int id = 1;
        when(warehouseService.findById(id)).thenReturn(Optional.of(warehouse1));

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), warehouse1);

        verify(warehouseService, times(1)).findById(id);
    }

    /**
     * Test case for attempting to find a warehouse with a non-existent id.
     * Validates that a 404/Not Found response is returned.
     */
    @Test
    public void testFindWarehouseByNonExistentId() {
        int id = 10;
        when(warehouseService.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseById(id);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        Assert.assertEquals(response.getBody(), null);

        verify(warehouseService, times(1)).findById(id);
    }

    /**
     * Test case for finding a warehouse by its name using the findWarehouseByName()
     * method. Validates that the correct warehouse is returned for a valid name.
     */
    @Test
    public void testFindWarehouseByName() {
        Warehouse warehouse1 = new Warehouse();
        warehouse1.setId(1);
        warehouse1.setName("CA1");

        String name = "CA1";
        when(warehouseService.findByName(name)).thenReturn(Optional.of(warehouse1));

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseByName(name);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertEquals(response.getBody(), warehouse1);

        verify(warehouseService, times(1)).findByName(name);
    }

    /**
     * Test case for attempting to find a warehouse with a non-existent name.
     * Validates that a 404/Not Found response is returned.
     */
    @Test
    public void testFindWarehouseByNonExistentName() {
        String name = "invalidName";
        when(warehouseService.findByName(name)).thenReturn(Optional.empty());

        ResponseEntity<Warehouse> response = warehouseController.findWarehouseByName(name);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
        Assert.assertEquals(response.getBody(), null);

        verify(warehouseService, times(1)).findByName(name);
    }

    /**
     * Test case for creating a valid warehouse using the createWarehouse() method.
     * Validates that the warehouse is saved and returned as expected.
     */
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

        Assert.assertEquals(result, validWarehouse);
        verify(warehouseService, times(1)).save(validWarehouse);
    }

    /**
     * Test case for attempting to create an invalid warehouse with missing /
     * incorrect data. Validates that null is returned and the warehouse is
     * not created.
     */
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
        Assert.assertEquals(result, null);
    }

    /**
     * Test case for updating a warehouse by its id using the updateWarehouseById()
     * method. Verifies that the updateWarehouseById service method is called with
     * the correct parameters.
     */
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

    /**
     * Test case for deleting a warehouse by its id using the deleteWarehouseById()
     * method. Verifies that the deleteById service method is called once.
     */
    @Test
    public void testDeleteWarehouseById() {
        warehouseController.deleteWarehouseById(3);

        verify(warehouseService, times(1)).deleteById(3);
    }
}
