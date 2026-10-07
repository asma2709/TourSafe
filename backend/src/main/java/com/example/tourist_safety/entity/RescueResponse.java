package com.example.tourist_safety.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rescue_responses")
public class RescueResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sosAlertId;

    private String rescueTeam;

    private String status;

    private Double latitude;

    private Double longitude;

    private Double estimatedCost;

    private LocalDateTime createdAt;

    public RescueResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSosAlertId() {
        return sosAlertId;
    }

    public void setSosAlertId(Long sosAlertId) {
        this.sosAlertId = sosAlertId;
    }

    public String getRescueTeam() {
        return rescueTeam;
    }

    public void setRescueTeam(String rescueTeam) {
        this.rescueTeam = rescueTeam;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Double estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}