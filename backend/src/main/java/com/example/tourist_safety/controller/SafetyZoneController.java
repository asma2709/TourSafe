package com.example.tourist_safety.controller;

import com.example.tourist_safety.entity.SafetyZone;
import com.example.tourist_safety.service.SafetyZoneService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/safety-zones")
public class SafetyZoneController {

    private final SafetyZoneService safetyZoneService;

    public SafetyZoneController(SafetyZoneService safetyZoneService) {
        this.safetyZoneService = safetyZoneService;
    }

    @PostMapping
    public SafetyZone createZone(@RequestBody SafetyZone zone) {
        return safetyZoneService.createZone(zone);
    }

    @GetMapping
    public List<SafetyZone> getAllZones() {
        return safetyZoneService.getAllZones();
    }
}