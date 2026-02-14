package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "places_to_visit")
public class PlaceToVisit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String nameKa;

    @Column(length = 2000)
    private String descriptionEn;

    @Column(length = 2000)
    private String descriptionKa;

    private String imageUrl;
    private String mapUrl;
    private String distance;
}
