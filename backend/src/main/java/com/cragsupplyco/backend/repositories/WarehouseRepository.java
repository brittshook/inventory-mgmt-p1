package com.cragsupplyco.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.cragsupplyco.backend.models.Warehouse;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Integer> {
    Optional<Warehouse> findByName(String name);

    boolean existsByName(String name);

    // reset the PSQL id incrementing sequence for the sake of test data and
    // facilitating tests
    @Modifying
    @Transactional
    @Query(value = "ALTER SEQUENCE warehouse_id_seq RESTART WITH 1", nativeQuery = true)
    void resetIdSequence();
}
