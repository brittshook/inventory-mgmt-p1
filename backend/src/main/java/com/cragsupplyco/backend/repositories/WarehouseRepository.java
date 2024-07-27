package com.cragsupplyco.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cragsupplyco.backend.models.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Integer> {

}
