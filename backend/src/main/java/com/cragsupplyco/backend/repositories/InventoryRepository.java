package com.cragsupplyco.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Warehouse;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    Optional<Inventory> findByProductAndWarehouseAndSize(Product product, Warehouse warehouse, String size);

    boolean existsByProductAndWarehouseAndSize(Product product, Warehouse warehouse, String size);

}
