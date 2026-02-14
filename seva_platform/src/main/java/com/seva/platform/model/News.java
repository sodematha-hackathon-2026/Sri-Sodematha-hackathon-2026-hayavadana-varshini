package com.seva.platform.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 5000)
    private String content;

    @Column
    private String titleKa;

    @Column(length = 5000)
    private String contentKa;

    private String imageUrl; // For now, we store URL. Later S3 link.

    @JsonProperty("flashUpdate")
    private boolean flashUpdate; // If true, shows in Carousel

    private LocalDateTime publishedAt;

    @PrePersist
    protected void onCreate() {
        publishedAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitleKa() {
        return titleKa;
    }

    public void setTitleKa(String titleKa) {
        this.titleKa = titleKa;
    }

    public String getContentKa() {
        return contentKa;
    }

    public void setContentKa(String contentKa) {
        this.contentKa = contentKa;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isFlashUpdate() {
        return flashUpdate;
    }

    public void setFlashUpdate(boolean flashUpdate) {
        this.flashUpdate = flashUpdate;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
}
