package com.cragsupplyco.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cragsupplyco.backend.models.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
}
