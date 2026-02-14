package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class QuizQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String question;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    private String correctAnswer; // A, B, C, D

    @Column(length = 2000)
    private String description;

    private String language; // EN, KA
    private String category;
}
