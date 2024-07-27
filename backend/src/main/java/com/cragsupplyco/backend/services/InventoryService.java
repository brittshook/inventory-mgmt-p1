package com.cragsupplyco.backend.services;

import java.util.Optional;

import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.repositories.InventoryRepository;

public class InventoryService {
    private InventoryRepository repo;

    public InventoryService(InventoryRepository repo) {
        this.repo = repo;
    }

    public Iterable<Inventory> findAll() {
        return repo.findAll();
    }

    public Optional<Inventory> findById(int id) {
        return repo.findById(id);
    }

    public Inventory save(Inventory inventory) {
        return repo.save(inventory);
    }

    public Inventory updateInventoryById(int id, Inventory inventory) {
        inventory.setId(id);
        return repo.save(inventory);
    }

    public Inventory updateQuantityById(int id, String operation, int value) {
        Optional<Inventory> optionalInventory = repo.findById(id);

        if (optionalInventory.isPresent()) {
            Inventory Inventory = optionalInventory.get();
            if (operation.equals("increment")) {
                Inventory.setQuantity(Inventory.getQuantity() + value);
            } else if (operation.equals("decrement")) {
                Inventory.setQuantity(Inventory.getQuantity() - value);
            } else {
                throw new IllegalArgumentException("Invalid operation: " + operation);
            }

            return repo.save(Inventory);
        } else {
            throw new RuntimeException("Inventory not found with id " + id);
        }
    }

    public void deleteById(int id) {
        repo.deleteById(id);
    }

}
