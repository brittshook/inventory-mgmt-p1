package com.cragsupplyco.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cragsupplyco.backend.models.Inventory;
import com.cragsupplyco.backend.models.Product;
import com.cragsupplyco.backend.models.Warehouse;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    Optional<Inventory> findByProductAndWarehouseAndSize(Product product, Warehouse warehouse, String size);

    boolean existsByProductAndWarehouseAndSize(Product product, Warehouse warehouse, String size);

    // reset the PSQL id incrementing sequence for the sake of test data and
    // facilitating tests
    @Modifying
    @Transactional
    @Query(value = "ALTER SEQUENCE inventory_id_seq RESTART WITH 1", nativeQuery = true)
    void resetIdSequence();
}
