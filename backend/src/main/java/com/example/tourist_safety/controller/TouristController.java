package com.example.tourist_safety.controller;

import com.example.tourist_safety.entity.Tourist;
import com.example.tourist_safety.service.TouristService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tourists")
public class TouristController {

    private final TouristService touristService;

    public TouristController(TouristService touristService) {
        this.touristService = touristService;
    }

    @PostMapping
    public Tourist createTourist(@RequestBody Tourist tourist) {
        return touristService.createTourist(tourist);
    }

    @GetMapping
    public List<Tourist> getAllTourists() {
        return touristService.getAllTourists();
    }
}