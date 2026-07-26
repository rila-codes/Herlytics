package com.herlytics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "menstrual_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenstrualLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "cycle_length")
    private Integer cycleLength;

    @Column(name = "period_duration")
    private Integer periodDuration;

    @Column(name = "symptoms", columnDefinition = "TEXT")
    private String symptoms; // JSON string or comma-separated list

    @Column(name = "mood")
    private String mood;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
