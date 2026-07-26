package com.herlytics.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LifestyleLogRequest {

    @NotNull(message = "Log date is required")
    private LocalDate logDate;

    @Min(0) @Max(10000)
    private Integer waterIntakeMl;

    @Min(0) @Max(24)
    private Double sleepDurationHours;

    @Min(0) @Max(1440)
    private Integer exerciseDurationMinutes;

    private String mood;

    @Min(10) @Max(300)
    private Double weightKg;
}
