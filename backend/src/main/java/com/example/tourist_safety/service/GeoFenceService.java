package com.example.tourist_safety.service;

import com.example.tourist_safety.entity.SafetyZone;
import com.example.tourist_safety.repository.SafetyZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeoFenceService {

    private final SafetyZoneRepository safetyZoneRepository;

    public GeoFenceService(SafetyZoneRepository safetyZoneRepository) {
        this.safetyZoneRepository = safetyZoneRepository;
    }

    public String checkLocation(double touristLatitude, double touristLongitude) {

        List<SafetyZone> zones = safetyZoneRepository.findAll();

        for (SafetyZone zone : zones) {

            if (!"ACTIVE".equalsIgnoreCase(zone.getStatus())) {
                continue;
            }

            double distance = calculateDistance(
                    touristLatitude,
                    touristLongitude,
                    zone.getLatitude(),
                    zone.getLongitude()
            );

            if (distance <= zone.getRadius()) {
                return "WARNING: Tourist is inside " + zone.getZoneName()
                        + ". Distance: " + Math.round(distance) + " meters";
            }
        }

        return "SAFE: Tourist is outside all active danger zones";
    }

    private double calculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final double EARTH_RADIUS = 6371000;

        double latDifference = Math.toRadians(lat2 - lat1);
        double lonDifference = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDifference / 2) * Math.sin(latDifference / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDifference / 2)
                * Math.sin(lonDifference / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }
}