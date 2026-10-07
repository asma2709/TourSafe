package com.example.tourist_safety.service;

import com.example.tourist_safety.entity.SosAlert;
import com.example.tourist_safety.repository.SosAlertRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SosAlertService {

    private final SosAlertRepository sosAlertRepository;

    public SosAlertService(SosAlertRepository sosAlertRepository) {
        this.sosAlertRepository = sosAlertRepository;
    }

    public SosAlert createSosAlert(SosAlert alert) {
        alert.setStatus("ACTIVE");
        alert.setCreatedAt(LocalDateTime.now());

        return sosAlertRepository.save(alert);
    }

    public List<SosAlert> getActiveAlerts() {
        return sosAlertRepository.findByStatus("ACTIVE");
    }
}