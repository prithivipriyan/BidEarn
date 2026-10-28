package com.bidearn.bidearn.repository;

import com.bidearn.bidearn.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
}