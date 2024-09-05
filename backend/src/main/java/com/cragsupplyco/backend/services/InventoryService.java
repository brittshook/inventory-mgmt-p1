package com.cragsupplyco.backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cragsupplyco.backend.dtos.InventoryRequestDto;
import com.cragsupplyco.backend.mappers.InventoryMapper;
import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.repositories.InventoryRepository;
import com.cragsupplyco.backend.repositories.WarehouseRepository;

@Service
public class InventoryService {
    private InventoryMapper mapper;
    private InventoryRepository repo;
    private WarehouseRepository warehouseRepo;

    public InventoryService(InventoryRepository repo, WarehouseRepository warehouseRepo, InventoryMapper mapper) {
        this.repo = repo;
        this.warehouseRepo = warehouseRepo;
        this.mapper = mapper;
    }

    public Iterable<Inventory> findAll() { // Returns all inventory items
        return repo.findAll();
    }

    public Optional<Inventory> findById(int id) { // Returns inventory item by id
        return repo.findById(id);
    }

    public Inventory save(InventoryRequestDto inventoryDto) { // Saves new inventory item
        Inventory inventory = mapper.toInventory(inventoryDto); // Map from DTO to Inventory obj
        Product product = inventory.getProduct();
        Warehouse warehouse = inventory.getWarehouse();
        int newQuantity = inventory.getQuantity();

        // Checks whether inventory item already exists, and if so increments the
        // existing item by specified quantity
        if (repo.existsByProductAndWarehouseAndSize(product, warehouse, inventory.getSize())) {
            Inventory existingInventory = repo.findByProductAndWarehouseAndSize(product,
                    warehouse, inventory.getSize()).get();
            return updateQuantityById(existingInventory.getId(), "increment", newQuantity);
        }

        int currentQuantity = warehouse.getCurrentCapacity();
        int updatedCapacity = currentQuantity + newQuantity;

        // Checks whether the potential capacity would exceed max capacity of warehouse
        if (updatedCapacity > warehouse.getMaxCapacity()) {
            throw new IllegalArgumentException("Cannot save inventory. It exceeds the warehouse capacity.");
        }

        // If not, then saves item and updates warehouse's current capacity
        warehouse.setCurrentCapacity(updatedCapacity);
        warehouseRepo.save(warehouse);

        return repo.save(inventory);
    }

    public Inventory updateInventoryById(int id, InventoryRequestDto updatedInventoryDto) { // Update inventory item
                                                                                            // by id
        Optional<Inventory> optionalInventory = repo.findById(id);
        Inventory updatedInventory = mapper.toInventory(updatedInventoryDto); // Map from DTO to Inventory obj

        if (optionalInventory.isPresent()) { // If inventory item already exists, update its fields
            Inventory existingInventory = optionalInventory.get();
            Warehouse currentWarehouse = existingInventory.getWarehouse();
            Warehouse newWarehouse = updatedInventory.getWarehouse();

            int oldQuantity = existingInventory.getQuantity();
            int newQuantity = updatedInventory.getQuantity();
            int quantityDifference = newQuantity - oldQuantity;

            if (!currentWarehouse.equals(newWarehouse)) { // If the warehouse changes, update both old and new
                                                          // warehouses
                // Calculate capacity of the current warehouse
                int currentCapacity = currentWarehouse.getCurrentCapacity();
                int updatedCapacity = currentCapacity - oldQuantity;

                // Calculate capacity of the new warehouse
                int newWarehouseCurrentCapacity = newWarehouse.getCurrentCapacity();
                int newWarehouseCapacity = newWarehouseCurrentCapacity + newQuantity;

                // Check whether the potential capacity would exceed max capacity of new
                // warehouse
                if (newWarehouseCapacity > newWarehouse.getMaxCapacity()) {
                    throw new IllegalArgumentException("Cannot move inventory. It exceeds the new warehouse capacity.");
                }

                // If not, update warehouses' capacity and update warehouse on inventory item
                currentWarehouse.setCurrentCapacity(updatedCapacity);
                warehouseRepo.save(currentWarehouse);

                newWarehouse.setCurrentCapacity(newWarehouseCapacity);
                warehouseRepo.save(newWarehouse);

                existingInventory.setWarehouse(newWarehouse);
            } else { // If warehouse does not change, update warehouse capacity based on the change
                     // in quantity
                int currentCapacity = currentWarehouse.getCurrentCapacity();
                int updatedCapacity = currentCapacity + quantityDifference;

                // Check whether the potential capacity would exceed max capacity of the
                // warehouse
                if (updatedCapacity > currentWarehouse.getMaxCapacity()) {
                    throw new IllegalArgumentException("Cannot update inventory. It exceeds the warehouse capacity.");
                }

                // If not, update warehouse capacity
                currentWarehouse.setCurrentCapacity(updatedCapacity);
                warehouseRepo.save(currentWarehouse);
            }

            // Update inventory details
            existingInventory.setQuantity(newQuantity);
            existingInventory.setProduct(updatedInventory.getProduct());
            existingInventory.setSize(updatedInventory.getSize());
            return repo.save(existingInventory);
        } else { // If inventory item does not exist, create a new ones
            updatedInventory.setId(id);

            Warehouse warehouse = updatedInventory.getWarehouse();
            int newQuantity = updatedInventory.getQuantity();
            int currentQuantity = warehouse.getCurrentCapacity();
            int updatedCapacity = currentQuantity + newQuantity;

            if (updatedCapacity > warehouse.getMaxCapacity()) {
                throw new IllegalArgumentException("Cannot save inventory. It exceeds the warehouse capacity.");
            }

            warehouse.setCurrentCapacity(updatedCapacity);
            warehouseRepo.save(warehouse);

            return repo.save(updatedInventory);
        }
    }

    public Inventory updateQuantityById(int id, String operation, int value) { // Update quantity of inventory item by
                                                                               // id
        Optional<Inventory> optionalInventory = repo.findById(id);

        if (optionalInventory.isPresent()) { // Check whether inventory item exists
            Inventory inventory = optionalInventory.get();
            Warehouse warehouse = inventory.getWarehouse();
            int currentCapacity = warehouse.getCurrentCapacity();

            if (operation.equals("increment")) {
                int updatedCapacity = currentCapacity + value; // Add quantity if operation is increment

                if (updatedCapacity > warehouse.getMaxCapacity()) {
                    throw new IllegalArgumentException("Cannot update inventory. It exceeds the warehouse capacity.");
                }

                inventory.setQuantity(inventory.getQuantity() + value);
                warehouse.setCurrentCapacity(updatedCapacity);
            } else if (operation.equals("decrement")) {
                int updatedCapacity = currentCapacity - value; // Subtract quantity if operation is decrement

                if (updatedCapacity > warehouse.getMaxCapacity()) {
                    throw new IllegalArgumentException("Cannot update inventory. It exceeds the warehouse capacity.");
                }

                inventory.setQuantity(inventory.getQuantity() - value);
                warehouse.setCurrentCapacity(updatedCapacity);
            } else {
                throw new RuntimeException("Invalid operation: " + operation); // Otherwise, throw error for
                                                                               // invalid operations
            }

            return repo.save(inventory);
        } else { // Throw error if inventory item not found
            throw new RuntimeException("Inventory not found with id " + id);
        }
    }

    public void deleteById(int id) { // Delete inventory item by id
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
