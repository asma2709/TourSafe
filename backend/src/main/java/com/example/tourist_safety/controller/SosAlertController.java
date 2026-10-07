package com.example.tourist_safety.controller;

import com.example.tourist_safety.entity.SosAlert;
import com.example.tourist_safety.service.SosAlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tourists")
public class SosAlertController {

    private final SosAlertService sosAlertService;

    public SosAlertController(SosAlertService sosAlertService) {
        this.sosAlertService = sosAlertService;
    }

    @PostMapping("/sos")
    public SosAlert triggerSOS(@RequestBody SosAlert alert) {
        return sosAlertService.createSosAlert(alert);
    }

    @GetMapping("/active-sos")
    public List<SosAlert> getActiveSOS() {
        return sosAlertService.getActiveAlerts();
    }
}