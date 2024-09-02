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

        if (repo.existsByProductAndWarehouseAndSize(inventory.getProduct(), warehouse, inventory.getSize())) {
            Inventory existingInventory = repo.findByProductAndWarehouseAndSize(inventory.getProduct(),
                    warehouse, inventory.getSize()).get();
            return updateQuantityById(existingInventory.getId(), "increment", newQuantity);
        }

        int currentQuantity = warehouse.getCurrentCapacity();
        int updatedCapacity = currentQuantity + newQuantity;

        if (updatedCapacity > warehouse.getMaxCapacity()) {
            throw new RuntimeException("Cannot save inventory. It exceeds the warehouse capacity.");
        }

        warehouse.setCurrentCapacity(updatedCapacity);
        warehouseRepo.save(warehouse);

        return repo.save(inventory);
    }

    public Inventory updateInventoryById(int id, Inventory updatedInventory) {
        Optional<Inventory> optionalInventory = repo.findById(id);

        if (optionalInventory.isPresent()) {
            Inventory existingInventory = optionalInventory.get();
            Warehouse currentWarehouse = existingInventory.getWarehouse();
            Warehouse newWarehouse = updatedInventory.getWarehouse();

            int oldQuantity = existingInventory.getQuantity();
            int newQuantity = updatedInventory.getQuantity();
            int quantityDifference = newQuantity - oldQuantity;

            // If the warehouse changes, update both old and new warehouses
            if (!currentWarehouse.equals(newWarehouse)) {
                // Update capacity of the current warehouse
                int currentCapacity = currentWarehouse.getCurrentCapacity();
                int updatedCapacity = currentCapacity - oldQuantity + newQuantity;

                if (updatedCapacity > currentWarehouse.getMaxCapacity()) {
                    throw new RuntimeException("Cannot update inventory. It exceeds the current warehouse capacity.");
                }

                int newWarehouseCurrentCapacity = newWarehouse.getCurrentCapacity();
                int newWarehouseCapacity = newWarehouseCurrentCapacity + newQuantity;

                if (newWarehouseCapacity > newWarehouse.getMaxCapacity()) {
                    throw new RuntimeException("Cannot move inventory. It exceeds the new warehouse capacity.");
                }

                currentWarehouse.setCurrentCapacity(updatedCapacity);
                warehouseRepo.save(currentWarehouse);

                newWarehouse.setCurrentCapacity(newWarehouseCapacity);
                warehouseRepo.save(newWarehouse);

                existingInventory.setWarehouse(newWarehouse);
            } else {
                // Update warehouse capacity based on the change in quantity
                int currentCapacity = currentWarehouse.getCurrentCapacity();
                int updatedCapacity = currentCapacity + quantityDifference;

                if (updatedCapacity > currentWarehouse.getMaxCapacity()) {
                    throw new RuntimeException("Cannot update inventory. It exceeds the warehouse capacity.");
                }

                currentWarehouse.setCurrentCapacity(updatedCapacity);
                warehouseRepo.save(currentWarehouse);
            }

            // Update inventory details
            existingInventory.setQuantity(newQuantity);
            existingInventory.setProduct(updatedInventory.getProduct());
            existingInventory.setSize(updatedInventory.getSize());
            return repo.save(existingInventory);
        } else {
            updatedInventory.setId(id);

            Warehouse warehouse = updatedInventory.getWarehouse();
            int newQuantity = updatedInventory.getQuantity();
            int currentQuantity = warehouse.getCurrentCapacity();
            int updatedCapacity = currentQuantity + newQuantity;

            if (updatedCapacity > warehouse.getMaxCapacity()) {
                throw new RuntimeException("Cannot save inventory. It exceeds the warehouse capacity.");
            }

            warehouse.setCurrentCapacity(updatedCapacity);
            warehouseRepo.save(warehouse);

            return repo.save(updatedInventory);
        }
    }

    public Inventory updateQuantityById(int id, String operation, int value) {
        Optional<Inventory> optionalInventory = repo.findById(id);

        if (optionalInventory.isPresent()) {
            Inventory inventory = optionalInventory.get();
            Warehouse warehouse = inventory.getWarehouse();
            int currentCapacity = warehouse.getCurrentCapacity();

            if (operation.equals("increment")) {
                int updatedCapacity = currentCapacity + value;

                if (updatedCapacity > warehouse.getMaxCapacity()) {
                    throw new RuntimeException("Cannot update inventory. It exceeds the warehouse capacity.");
                }

                inventory.setQuantity(inventory.getQuantity() + value);
                warehouse.setCurrentCapacity(updatedCapacity);
            } else if (operation.equals("decrement")) {
                int updatedCapacity = currentCapacity - value;

                if (updatedCapacity > warehouse.getMaxCapacity()) {
                    throw new RuntimeException("Cannot update inventory. It exceeds the warehouse capacity.");
                }

                inventory.setQuantity(inventory.getQuantity() - value);
                warehouse.setCurrentCapacity(updatedCapacity);
            } else {
                throw new IllegalArgumentException("Invalid operation: " + operation);
            }

            return repo.save(inventory);
        } else {
            throw new RuntimeException("Inventory not found with id " + id);
        }
    }

    public void deleteById(int id) {
        Optional<Inventory> optionalInventory = repo.findById(id);

        if (optionalInventory.isPresent()) {
            Inventory inventory = optionalInventory.get();
            Warehouse warehouse = inventory.getWarehouse();
            int quantity = inventory.getQuantity();
            int currentCapacity = warehouse.getCurrentCapacity();
            int updatedCapacity = currentCapacity - quantity;

            warehouse.setCurrentCapacity(updatedCapacity);
            warehouseRepo.save(warehouse);
        }
        repo.deleteById(id);
    }

}
