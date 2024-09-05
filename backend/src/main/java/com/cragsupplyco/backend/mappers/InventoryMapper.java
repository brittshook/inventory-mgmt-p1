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

    public Inventory toInventory(InventoryRequestDto inventoryDto) {
        Inventory inventory = new Inventory();
        
        Optional<Warehouse> optionalWarehouse = warehouseRepo.findById(inventoryDto.getWarehouse());
        if (optionalWarehouse.isEmpty()) {
            throw new RuntimeException("Warehouse not found with ID: " + inventoryDto.getWarehouse());
        }
        Warehouse warehouse = optionalWarehouse.get();
        Optional<Product> optionalProduct = productRepo.findById(inventoryDto.getProduct());
        if (optionalProduct.isEmpty()) {
            throw new RuntimeException("Product not found with ID: " + inventoryDto.getProduct());
        }
        Product product = optionalProduct.get();
        int newQuantity = Integer.parseInt(inventoryDto.getQuantity());
        inventory.setSize(inventoryDto.getSize());
        inventory.setQuantity(newQuantity);
        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);
        return inventory;
    }

}