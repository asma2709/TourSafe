package com.example.tourist_safety.service;

import com.example.tourist_safety.entity.SafetyZone;
import com.example.tourist_safety.repository.SafetyZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SafetyZoneService {

    private final SafetyZoneRepository safetyZoneRepository;

    public SafetyZoneService(SafetyZoneRepository safetyZoneRepository) {
        this.safetyZoneRepository = safetyZoneRepository;
    }

    public SafetyZone createZone(SafetyZone zone) {
        return safetyZoneRepository.save(zone);
    }

    public List<SafetyZone> getAllZones() {
        return safetyZoneRepository.findAll();
    }
}