package com.example.tourist_safety.controller;

import com.example.tourist_safety.entity.RescueResponse;
import com.example.tourist_safety.service.RescueResponseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rescue-responses")
public class RescueResponseController {

    private final RescueResponseService rescueResponseService;

    public RescueResponseController(RescueResponseService rescueResponseService) {
        this.rescueResponseService = rescueResponseService;
    }

    @PostMapping
    public RescueResponse createResponse(
            @RequestBody RescueResponse response) {

        return rescueResponseService.createResponse(response);
    }

    @GetMapping
    public List<RescueResponse> getAllResponses() {
        return rescueResponseService.getAllResponses();
    }

    @GetMapping("/active")
    public List<RescueResponse> getActiveResponses() {
        return rescueResponseService.getActiveResponses();
    }
}