package com.herlytics.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assessment_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(name = "question_key", nullable = false)
    private String questionKey;

    @Column(name = "answer_value", columnDefinition = "TEXT", nullable = false)
    private String answerValue;
}
