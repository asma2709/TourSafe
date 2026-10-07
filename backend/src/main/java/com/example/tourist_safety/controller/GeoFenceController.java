package com.example.tourist_safety.controller;

import com.example.tourist_safety.service.GeoFenceService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/geofence")
public class GeoFenceController {

    private final GeoFenceService geoFenceService;

    public GeoFenceController(GeoFenceService geoFenceService) {
        this.geoFenceService = geoFenceService;
    }

    @PostMapping("/check")
    public String checkLocation(@RequestBody Map<String, Double> location) {

        double latitude = location.get("latitude");
        double longitude = location.get("longitude");

        return geoFenceService.checkLocation(latitude, longitude);
    }
}