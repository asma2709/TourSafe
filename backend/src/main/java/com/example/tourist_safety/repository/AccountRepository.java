package com.example.tourist_safety.repository;

import com.example.tourist_safety.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}