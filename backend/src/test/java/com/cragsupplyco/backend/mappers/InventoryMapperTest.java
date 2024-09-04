package com.cragsupplyco.backend.mappers;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;

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

        Inventory result = inventoryMapper.mapDtoToInventory(inventoryDto);

        assertEquals(1, result.getWarehouse().getId());
        assertEquals(2, result.getProduct().getId());
        assertEquals(10, result.getQuantity());
    }

    @Test
    public void testMapDtoToInventoryButWarehouseNotFound() {
        InventoryRequestDto inventoryDto = new InventoryRequestDto();
        inventoryDto.setWarehouse(1);
        inventoryDto.setProduct(2);
        inventoryDto.setQuantity("10");

        when(warehouseRepo.findById(1)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryMapper.mapDtoToInventory(inventoryDto);
        });

        assertEquals("Warehouse not found with ID: 1", exception.getMessage());
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

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            inventoryMapper.mapDtoToInventory(inventoryDto);
        });

        assertEquals("Product not found with ID: 2", exception.getMessage());
    }
}
