package com.example.tourist_safety.controller;

import com.example.tourist_safety.entity.Transaction;
import com.example.tourist_safety.repository.TransactionRepository;
import com.example.tourist_safety.repository.BudgetRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public ReportController(TransactionRepository transactionRepository,
                            BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
    }

    @GetMapping("/financial")
    public Map<String, Object> getFinancialReport() {

        List<Transaction> transactions = transactionRepository.findAll();

        double income = transactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double expense = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalBudget = budgetRepository.findAll()
                .stream()
                .mapToDouble(b -> b.getAmount())
                .sum();

        Map<String, Object> report = new HashMap<>();

        report.put("totalIncome", income);
        report.put("totalExpense", expense);
        report.put("netBalance", income - expense);
        report.put("totalBudget", totalBudget);

        return report;
    }
}