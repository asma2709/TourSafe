package com.example.tourist_safety.repository;

import com.example.tourist_safety.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
}