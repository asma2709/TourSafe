package com.example.tourist_safety.repository;

import com.example.tourist_safety.entity.SosAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SosAlertRepository extends JpaRepository<SosAlert, Long> {

    List<SosAlert> findByStatus(String status);
}