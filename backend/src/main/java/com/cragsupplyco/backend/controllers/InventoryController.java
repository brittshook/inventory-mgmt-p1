package com.cragsupplyco.backend.controllers;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.cragsupplyco.backend.dtos.UpdateQuantityRequestDto;
import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.services.InventoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://crag-supply-co-frontend.s3-website.us-east-2.amazonaws.com")
public class InventoryController {
    private InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    public Iterable<Inventory> findAllInventory() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public Inventory createInventory(@Valid @RequestBody Inventory inventory) {
        return service.save(inventory);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> findInventoryById(@PathVariable int id) {
        Optional<Inventory> inventory = service.findById(id);
        if (inventory.isPresent())
            return ResponseEntity.ok(inventory.get());
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateInventoryById(@PathVariable int id, @Valid @RequestBody Inventory inventory) {
        service.updateInventoryById(id, inventory);
    }

    @PatchMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void updateInventoryQuantityById(@PathVariable int id,
            @Valid @RequestBody UpdateQuantityRequestDto quantityUpdate) {
        service.updateQuantityById(id, quantityUpdate.getOperation(), quantityUpdate.getValue());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void deleteInventoryById(@PathVariable int id) {
        service.deleteById(id);
    }

}
