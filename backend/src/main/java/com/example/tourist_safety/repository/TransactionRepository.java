package com.example.tourist_safety.repository;

import com.example.tourist_safety.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}