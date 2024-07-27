package com.cragsupplyco.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cragsupplyco.backend.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
