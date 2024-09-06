package com.cragsupplyco.backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.repositories.WarehouseRepository;

@Service
public class WarehouseService {
    private WarehouseRepository repo;

    public WarehouseService(WarehouseRepository repo) {
        this.repo = repo;
    }

    public Iterable<Warehouse> findAll() { // Returns all warehouses
        return repo.findAll();
    }

    public Optional<Warehouse> findById(int id) { // Return warehouse by id
        return repo.findById(id);
    }

    public Optional<Warehouse> findByName(String name) { // Return warehouse by name
        return repo.findByName(name);
    }

    public Warehouse save(Warehouse warehouse) { // Saves warehouse
        if (repo.existsByName(warehouse.getName())) { // Checks if warehouse exists with the intended name (as warehouse
                                                      // name have unique names)
            throw new IllegalArgumentException("Warehouse with this name already exists.");
        }
        return repo.save(warehouse);
    }

    public Warehouse updateWarehouseById(int id, Warehouse warehouse) { // Update warehouse by id
        warehouse.setId(id);
        Warehouse existingWarehouse = repo.findById(id).get();

        // Checks whether warehouse name is being updated to a new value and checks if
        // warehouse exists with the intended name (as warehouses must have
        // unique names)
        if (!warehouse.getName().equals(existingWarehouse.getName()) && repo.existsByName(warehouse.getName())) {
            throw new IllegalArgumentException("Warehouse with this name already exists.");
        }

        return repo.save(warehouse);
    }

    public void deleteById(int id) { // Delete warehouse by id
        repo.deleteById(id);
    }
}
