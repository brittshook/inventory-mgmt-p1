package com.cragsupplyco.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cragsupplyco.backend.models.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
        Iterable<Product> findByCategoryId(Integer categoryId);

        Optional<Product> findByBrandAndName(String brand, String name);

}
