package com.seva.platform.model;

import jakarta.persistence.*;

@Entity
@Table(name = "daily_worship")
public class DailyWorship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String deityName;
    private String deityNameKa;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionKa;

    private String imageUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeityName() {
        return deityName;
    }

    public void setDeityName(String deityName) {
        this.deityName = deityName;
    }

    public String getDeityNameKa() {
        return deityNameKa;
    }

    public void setDeityNameKa(String deityNameKa) {
        this.deityNameKa = deityNameKa;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public String getDescriptionKa() {
        return descriptionKa;
    }

    public void setDescriptionKa(String descriptionKa) {
        this.descriptionKa = descriptionKa;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
