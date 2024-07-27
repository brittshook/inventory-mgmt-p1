package com.cragsupplyco.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cragsupplyco.backend.models.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

}
