package com.example.tourist_safety.repository;

import com.example.tourist_safety.entity.Tourist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TouristRepository extends JpaRepository<Tourist, Long> {
}