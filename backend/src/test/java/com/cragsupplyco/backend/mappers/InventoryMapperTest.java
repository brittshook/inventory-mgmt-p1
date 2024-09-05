package com.cragsupplyco.backend.mappers;

import java.util.Optional;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.cragsupplyco.backend.dtos.InventoryRequestDto;
import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.repositories.ProductRepository;
import com.cragsupplyco.backend.repositories.WarehouseRepository;

public class InventoryMapperTest {

    @Mock
    private WarehouseRepository warehouseRepo;

    @Mock
    private ProductRepository productRepo;

    @InjectMocks
    private InventoryMapper inventoryMapper;
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
    public void testMapDtoToInventory() {
        InventoryRequestDto inventoryDto = new InventoryRequestDto();
        inventoryDto.setWarehouse(1);
        inventoryDto.setProduct(2);
        inventoryDto.setQuantity("10");

        Warehouse warehouse = new Warehouse();
        warehouse.setId(1);

        Product product = new Product();
        product.setId(2);

        when(warehouseRepo.findById(1)).thenReturn(Optional.of(warehouse));
        when(productRepo.findById(2)).thenReturn(Optional.of(product));

        Inventory result = inventoryMapper.toInventory(inventoryDto);

        Assert.assertEquals(1, result.getWarehouse().getId());
        Assert.assertEquals(2, result.getProduct().getId());
        Assert.assertEquals(10, result.getQuantity());
    }

    @Test
    public void testMapDtoToInventoryButWarehouseNotFound() {
        InventoryRequestDto inventoryDto = new InventoryRequestDto();
        inventoryDto.setWarehouse(1);
        inventoryDto.setProduct(2);
        inventoryDto.setQuantity("10");

        when(warehouseRepo.findById(1)).thenReturn(Optional.empty());

        try {
            inventoryMapper.toInventory(inventoryDto);
            Assert.fail("Expected a RuntimeException to be thrown");
        } catch (RuntimeException e) {
            Assert.assertEquals("Warehouse not found with ID: 1", e.getMessage());
        }
    }

    @Test
    public void testMapDtoToInventoryButProductNotFound() {
        InventoryRequestDto inventoryDto = new InventoryRequestDto();
        inventoryDto.setWarehouse(1);
        inventoryDto.setProduct(2);
        inventoryDto.setQuantity("10");

        Warehouse warehouse = new Warehouse();
        warehouse.setId(1);

        when(warehouseRepo.findById(1)).thenReturn(Optional.of(warehouse));
        when(productRepo.findById(2)).thenReturn(Optional.empty());

        try {
            inventoryMapper.toInventory(inventoryDto);
            Assert.fail("Expected a RuntimeException to be thrown");
        } catch (RuntimeException e) {
            Assert.assertEquals("Product not found with ID: 2", e.getMessage());
        }

    }
}
