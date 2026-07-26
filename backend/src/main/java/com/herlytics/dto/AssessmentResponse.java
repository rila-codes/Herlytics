package com.herlytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentResponse {
    private Long id;
    private Double riskPercentage;
    private Double confidenceScore;
    private String riskCategory;
    private String explanation;
    private List<Map<String, Object>> keyFactors;
    private List<Map<String, Object>> recommendations;
    private String disclaimer;
    private LocalDateTime createdAt;
}
