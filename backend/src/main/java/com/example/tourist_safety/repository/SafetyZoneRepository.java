package com.example.tourist_safety.repository;

import com.example.tourist_safety.entity.SafetyZone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SafetyZoneRepository extends JpaRepository<SafetyZone, Long> {
}