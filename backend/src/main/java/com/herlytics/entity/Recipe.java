package com.herlytics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "cooking_time_minutes", nullable = false)
    private Integer cookingTimeMinutes;

    @Column(nullable = false)
    private String difficulty; // Easy, Medium, Hard

    @Column(name = "nutrition", columnDefinition = "TEXT")
    private String nutrition; // JSON: {"calories": 350, "protein": 20, "carbs": 30, "fat": 15}

    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients; // JSON Array of strings

    @Column(name = "steps", columnDefinition = "TEXT")
    private String steps; // JSON Array of strings

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // JSON Array of tags, e.g., ["Vegetarian", "PCOS Friendly"]

    @Column(name = "is_pcos_friendly")
    @Builder.Default
    private Boolean isPcosFriendly = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
