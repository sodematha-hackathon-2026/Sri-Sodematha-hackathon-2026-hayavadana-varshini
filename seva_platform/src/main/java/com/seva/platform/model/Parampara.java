package com.seva.platform.model;

import jakarta.persistence.*;

@Entity
@Table(name = "parampara")
public class Parampara {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String period;
    private String guru;
    private String shishya;
    private String vrindavanaLocation;
    private String vrindavanaUrl;
    private String photoUrl;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionKa;

    @Lob
    private byte[] image;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getGuru() {
        return guru;
    }

    public void setGuru(String guru) {
        this.guru = guru;
    }

    public String getShishya() {
        return shishya;
    }

    public void setShishya(String shishya) {
        this.shishya = shishya;
    }

    public String getVrindavanaLocation() {
        return vrindavanaLocation;
    }

    public void setVrindavanaLocation(String vrindavanaLocation) {
        this.vrindavanaLocation = vrindavanaLocation;
    }

    public String getVrindavanaUrl() {
        return vrindavanaUrl;
    }

    public void setVrindavanaUrl(String vrindavanaUrl) {
        this.vrindavanaUrl = vrindavanaUrl;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
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

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}
