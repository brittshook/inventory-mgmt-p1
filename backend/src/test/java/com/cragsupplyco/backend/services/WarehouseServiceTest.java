package com.cragsupplyco.backend.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
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

import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.repositories.WarehouseRepository;

public class WarehouseServiceTest {

    @InjectMocks
    private WarehouseService warehouseService;
    private AutoCloseable closeable;

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
        List<Warehouse> exepctedCategories = Arrays.asList(new Warehouse(), new Warehouse());

        when(warehouseRepository.findAll()).thenReturn(exepctedCategories);
        Iterable<Warehouse> result = warehouseService.findAll();

        int count = 0;
        for (Warehouse warehouse : result) {
            count++;
        }

        Assert.assertTrue(count == exepctedCategories.size());
    }

    @Test
    public void testFindByExistingName() {
        String warehouseName = "CA1";
        Warehouse expectedWarehouse = new Warehouse();
        expectedWarehouse.setName(warehouseName);

        when(warehouseRepository.findByName(warehouseName)).thenReturn(Optional.of(expectedWarehouse));
        Optional<Warehouse> result = warehouseService.findByName(warehouseName);
        Assert.assertTrue(result.isPresent());
    }

    @Test
    public void testFindByNonExistentName() {
        String warehouseName = "ST1";

        Optional<Warehouse> result = warehouseService.findByName(warehouseName);
        Assert.assertTrue(result.isEmpty());
    }

    @Test
    public void testFindWarehouseByExistingId() {
        int warehouseId = 1;
        Warehouse expectedWarehouse = new Warehouse();
        expectedWarehouse.setId(warehouseId);

        when(warehouseRepository.findById(warehouseId)).thenReturn(Optional.of(expectedWarehouse));
        Optional<Warehouse> result = warehouseService.findById(warehouseId);
        Assert.assertTrue(result.isPresent());
    }

    @Test
    public void testFindWarehouseByNonExistentId() {
        int warehouseId = 2;

        Optional<Warehouse> result = warehouseService.findById(warehouseId);
        assertTrue(result.isEmpty());
    }

    @Test
    public void testSaveWarehouse() {
        int warehouseId = 4;
        Warehouse expectedWarehouse = new Warehouse();
        expectedWarehouse.setId(warehouseId);

        when(warehouseRepository.save(expectedWarehouse)).thenReturn(expectedWarehouse);
        Warehouse result = warehouseService.save(expectedWarehouse);
        assertEquals(expectedWarehouse, result);
    }

    @Test
    public void testUpdateWarehouseById() {
        int warehouseId = 1;
        Warehouse expectedWarehouse = new Warehouse();
        expectedWarehouse.setId(warehouseId);

        when(warehouseRepository.save(expectedWarehouse)).thenReturn(expectedWarehouse);
        Warehouse result = warehouseService.updateWarehouseById(warehouseId, expectedWarehouse);
        assertEquals(expectedWarehouse, result);
    }

    @Test
    public void testDeleteWarehouseById() {
        int warehouseId = 1;
        warehouseService.deleteById(warehouseId);
        verify(warehouseRepository).deleteById(warehouseId);
    }

}
