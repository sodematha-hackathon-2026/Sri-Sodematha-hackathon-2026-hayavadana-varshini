package com.seva.platform.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String mobileNumber;

    private String name;

    @Column(unique = true, nullable = true)
    private String email;

    private String address;

    @JsonProperty("volunteer")
    private boolean volunteer;

    @Enumerated(EnumType.STRING)
    private VolunteerStatus volunteerStatus; // PENDING, APPROVED, REJECTED

    private LocalDateTime volunteerApprovalDate;

    // Privacy Consents
    @JsonProperty("consentDataStorage")
    private boolean consentDataStorage;
    @JsonProperty("consentCommunications")
    private boolean consentCommunications;

    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String deviceToken;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (role == null)
            role = Role.USER;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Role {
        USER, ADMIN, VOLUNTEER
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public boolean isVolunteer() {
        return volunteer;
    }

    public void setVolunteer(boolean volunteer) {
        this.volunteer = volunteer;
    }

    public boolean isConsentDataStorage() {
        return consentDataStorage;
    }

    public void setConsentDataStorage(boolean consentDataStorage) {
        this.consentDataStorage = consentDataStorage;
    }

    public boolean isConsentCommunications() {
        return consentCommunications;
    }

    public void setConsentCommunications(boolean consentCommunications) {
        this.consentCommunications = consentCommunications;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getDeviceToken() {
        return deviceToken;
    }

    public void setDeviceToken(String deviceToken) {
        this.deviceToken = deviceToken;
    }

    public enum VolunteerStatus {
        PENDING, APPROVED, REJECTED
    }

    public VolunteerStatus getVolunteerStatus() {
        return volunteerStatus;
    }

    public void setVolunteerStatus(VolunteerStatus volunteerStatus) {
        this.volunteerStatus = volunteerStatus;
    }

    public LocalDateTime getVolunteerApprovalDate() {
        return volunteerApprovalDate;
    }

    public void setVolunteerApprovalDate(LocalDateTime volunteerApprovalDate) {
        this.volunteerApprovalDate = volunteerApprovalDate;
    }
}
