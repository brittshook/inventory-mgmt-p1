package com.cragsupplyco.backend.mappers;

import java.util.Optional;

import org.springframework.context.annotation.Configuration;

import com.cragsupplyco.backend.dtos.InventoryRequestDto;
import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.repositories.ProductRepository;
import com.cragsupplyco.backend.repositories.WarehouseRepository;

@Configuration
public class InventoryMapper {
    private WarehouseRepository warehouseRepo;
    private ProductRepository productRepo;

    public InventoryMapper(WarehouseRepository warehouseRepo, ProductRepository productRepo) {
        this.warehouseRepo = warehouseRepo;
        this.productRepo = productRepo;
    }

    public Inventory mapDtoToInventory(InventoryRequestDto inventoryDto) {
        Inventory inventory = new Inventory();
        
        Optional<Warehouse> optionalWarehouse = warehouseRepo.findById(inventoryDto.getWarehouse());
        if (optionalWarehouse.isEmpty()) {
            throw new RuntimeException("Cannot save inventory. Associated warehouse was not found.");
        }
        Warehouse warehouse = optionalWarehouse.get();
        Optional<Product> optionalProduct = productRepo.findById(inventoryDto.getWarehouse());
        if (optionalProduct.isEmpty()) {
            throw new RuntimeException("Cannot save inventory. Associated product was not found.");
        }
        Product product = optionalProduct.get();
        int newQuantity = Integer.parseInt(inventoryDto.getQuantity());
        inventory.setQuantity(newQuantity);
        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);
        return inventory;
    }

}