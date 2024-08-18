package com.cragsupplyco.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.cragsupplyco.backend.models.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);

    // reset the PSQL id incrementing sequence for the sake of test data and facilitating tests
    @Modifying
    @Transactional
    @Query(value = "ALTER SEQUENCE category_id_seq RESTART WITH 1", nativeQuery = true)
    void resetIdSequence();
}
