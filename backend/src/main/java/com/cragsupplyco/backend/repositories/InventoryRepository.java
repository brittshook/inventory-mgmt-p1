package com.cragsupplyco.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cragsupplyco.backend.models.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

}
