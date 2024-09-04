package com.cragsupplyco.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cragsupplyco.backend.models.Product;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
        Iterable<Product> findByCategoryId(Integer categoryId);

        Optional<Product> findByBrandAndName(String brand, String name);

        // reset the PSQL id incrementing sequence for the sake of test data and
        // facilitating tests
        @Modifying
        @Transactional
        @Query(value = "ALTER SEQUENCE product_id_seq RESTART WITH 1", nativeQuery = true)
        void resetIdSequence();
}
