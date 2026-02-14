package com.seva.platform.model;

import jakarta.persistence.*;

@Entity
@Table(name = "history_content")
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String contentEn;

    @Column(columnDefinition = "TEXT")
    private String contentKa;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContentEn() {
        return contentEn;
    }

    public void setContentEn(String contentEn) {
        this.contentEn = contentEn;
    }

    public String getContentKa() {
        return contentKa;
    }

    public void setContentKa(String contentKa) {
        this.contentKa = contentKa;
    }
}
