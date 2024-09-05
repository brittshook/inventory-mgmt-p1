package com.cragsupplyco.backend.controllers;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.cragsupplyco.backend.models.Views;
import com.cragsupplyco.backend.models.Warehouse;
import com.cragsupplyco.backend.services.WarehouseService;
import com.fasterxml.jackson.annotation.JsonView;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/warehouse")
@CrossOrigin(origins = { "http://crag-supply-co-client.s3-website-us-east-1.amazonaws.com", "http://localhost:5173",
        "http://[::1]:5173/" })
public class WarehouseController {
    private WarehouseService service;

    public WarehouseController(WarehouseService service) {
        this.service = service;
    }

    @GetMapping // Get all warehouses (without inventory)
    @JsonView(Views.Public.class)
    public Iterable<Warehouse> findAllWarehouses() {
        return service.findAll();
    }

    @PostMapping // Create new warehouse
    @ResponseStatus(code = HttpStatus.CREATED)
    public Warehouse createWarehouse(@Valid @RequestBody Warehouse warehouse) {
        return service.save(warehouse);
    }

    @GetMapping("/byProps") // Get warehouse by name (using query params) (without inventory)
    @JsonView(Views.Public.class)
    public ResponseEntity<Warehouse> findWarehouseByName(@RequestParam String name) {
        Optional<Warehouse> warehouse = service.findByName(name);
        if (warehouse.isPresent())
            return ResponseEntity.ok(warehouse.get());
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}") // Get warehouse by id (with inventory)
    @JsonView(Views.Internal.class)
    public ResponseEntity<Warehouse> findWarehouseById(@PathVariable int id) {
        Optional<Warehouse> warehouse = service.findById(id);
        if (warehouse.isPresent())
            return ResponseEntity.ok(warehouse.get());
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}") // Update warehouse by id
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateWarehouseById(@PathVariable int id, @Valid @RequestBody Warehouse warehouse) {
        service.updateWarehouseById(id, warehouse);
    }

    @DeleteMapping("/{id}") // Delete warehouse by id
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteWarehouseById(@PathVariable int id) {
        service.deleteById(id);
    }
}
