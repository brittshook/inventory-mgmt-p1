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
        int productId = inventoryDto.getProduct();
        int warehouseId = inventoryDto.getWarehouse();
        
        Optional<Warehouse> optionalWarehouse = warehouseRepo.findById(warehouseId);
        if (optionalWarehouse.isEmpty()) {
            throw new RuntimeException("Warehouse not found with ID: " + warehouseId);
        }
        Warehouse warehouse = optionalWarehouse.get();
        Optional<Product> optionalProduct = productRepo.findById(productId);
        if (optionalProduct.isEmpty()) {
            throw new RuntimeException("Product not found with ID: " + productId);
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