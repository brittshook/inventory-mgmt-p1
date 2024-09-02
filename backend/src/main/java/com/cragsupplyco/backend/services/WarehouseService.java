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

    public Iterable<Warehouse> findAll() {
        return repo.findAll();
    }

    public Optional<Warehouse> findById(int id) {
        return repo.findById(id);
    }

    public Optional<Warehouse> findByName(String name) {
        return repo.findByName(name);
    }

    public Warehouse save(Warehouse warehouse) {
        if (repo.existsByName(warehouse.getName())) {
            throw new IllegalArgumentException("Warehouse with this name already exists.");
        }
        return repo.save(warehouse);
    }

    public Warehouse updateWarehouseById(int id, Warehouse warehouse) {
        warehouse.setId(id);
        Warehouse existingWarehouse = repo.findById(id).get();

        if (!warehouse.getName().equals(existingWarehouse.getName()) && repo.existsByName(warehouse.getName())) {
            throw new IllegalArgumentException("Warehouse with this name already exists.");
        }

        return repo.save(warehouse);
    }

    public void deleteById(int id) {
        repo.deleteById(id);
    }

}
