package com.example.tourist_safety.repository;

import com.example.tourist_safety.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}