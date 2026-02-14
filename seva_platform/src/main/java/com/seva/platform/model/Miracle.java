package com.seva.platform.model;

import jakarta.persistence.*;

@Entity
public class Miracle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String titleKa;

    @Column(length = 2000)
    private String descriptionEn;

    @Column(length = 2000)
    private String descriptionKa;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitleKa() {
        return titleKa;
    }

    public void setTitleKa(String titleKa) {
        this.titleKa = titleKa;
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
}
