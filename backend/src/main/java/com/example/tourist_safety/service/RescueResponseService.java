package com.example.tourist_safety.service;

import com.example.tourist_safety.entity.RescueResponse;
import com.example.tourist_safety.repository.RescueResponseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RescueResponseService {

    private final RescueResponseRepository rescueResponseRepository;

    public RescueResponseService(RescueResponseRepository rescueResponseRepository) {
        this.rescueResponseRepository = rescueResponseRepository;
    }

    public RescueResponse createResponse(RescueResponse response) {

        response.setStatus("DISPATCHED");
        response.setCreatedAt(LocalDateTime.now());

        return rescueResponseRepository.save(response);
    }

    public List<RescueResponse> getAllResponses() {
        return rescueResponseRepository.findAll();
    }

    public List<RescueResponse> getActiveResponses() {
        return rescueResponseRepository.findByStatus("DISPATCHED");
    }
}