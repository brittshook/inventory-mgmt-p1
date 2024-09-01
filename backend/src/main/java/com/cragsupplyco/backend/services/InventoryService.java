package com.cragsupplyco.backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.repositories.InventoryRepository;
import com.cragsupplyco.backend.repositories.WarehouseRepository;

@Service
public class InventoryService {
    private InventoryRepository repo;
    private WarehouseRepository warehouseRepo;

    public InventoryService(InventoryRepository repo, WarehouseRepository warehouseRepo) {
        this.repo = repo;
        this.warehouseRepo = warehouseRepo;
    }

    public Iterable<Inventory> findAll() {
        return repo.findAll();
    }

    public Optional<Inventory> findById(int id) {
        return repo.findById(id);
    }

    public Inventory save(Inventory inventory) {
        Warehouse warehouse = inventory.getWarehouse();
        int newQuantity = inventory.getQuantity();
        int currentQuantity = warehouse.getCurrentCapacity();
        int potentialQuantity = currentQuantity + newQuantity;

        if (potentialQuantity > warehouse.getMaxCapacity()) {
            throw new RuntimeException("Cannot save inventory. It exceeds the warehouse capacity.");
        }

        warehouse.setCurrentCapacity(potentialQuantity);
        warehouseRepo.save(warehouse);

        return repo.save(inventory);
    }

    public Inventory updateInventoryById(int id, Inventory inventory) {
        inventory.setId(id);
        return repo.save(inventory);
    }

    public Inventory updateQuantityById(int id, String operation, int value) {
        Optional<Inventory> optionalInventory = repo.findById(id);

        if (optionalInventory.isPresent()) {
            Inventory inventory = optionalInventory.get();
            if (operation.equals("increment")) {
                inventory.setQuantity(inventory.getQuantity() + value);
            } else if (operation.equals("decrement")) {
                inventory.setQuantity(inventory.getQuantity() - value);
            } else {
                throw new IllegalArgumentException("Invalid operation: " + operation);
            }

            return repo.save(inventory);
        } else {
            throw new RuntimeException("Inventory not found with id " + id);
        }
    }

    public void deleteById(int id) {
        repo.deleteById(id);
    }

}
