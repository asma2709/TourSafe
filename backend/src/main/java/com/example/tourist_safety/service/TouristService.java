package com.example.tourist_safety.service;

import com.example.tourist_safety.entity.Tourist;
import com.example.tourist_safety.repository.TouristRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TouristService {

    private final TouristRepository touristRepository;

    public TouristService(TouristRepository touristRepository) {
        this.touristRepository = touristRepository;
    }

    public Tourist createTourist(Tourist tourist) {
        return touristRepository.save(tourist);
    }

    public List<Tourist> getAllTourists() {
        return touristRepository.findAll();
    }
}