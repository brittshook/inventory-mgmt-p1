package com.cragsupplyco.backend.controllers;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.services.WarehouseService;

import jakarta.validation.Valid;

public class WarehouseController {
    private WarehouseService service;

    public WarehouseController(WarehouseService service) {
        this.service = service;
    }

    @GetMapping
    public Iterable<Warehouse> findAllCategories() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public Warehouse createWarehouse(@Valid @RequestBody Warehouse warehouse) {
        return service.save(warehouse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> findWarehouseById(@PathVariable int id) {
        Optional<Warehouse> warehouse = service.findById(id);
        if (warehouse.isPresent())
            return ResponseEntity.ok(warehouse.get());
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateWarehouseById(@PathVariable int id, @Valid @RequestBody Warehouse warehouse) {
        service.updateWarehouseById(id, warehouse);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteWarehouseById(@PathVariable int id) {
        service.deleteById(id);
    }
}
