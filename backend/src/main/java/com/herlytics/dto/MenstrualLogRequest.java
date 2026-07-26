package com.herlytics.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MenstrualLogRequest {

    @NotNull(message = "Log date is required")
    private LocalDate logDate;

    @Min(15) @Max(120)
    private Integer cycleLength;

    @Min(1) @Max(15)
    private Integer periodDuration;

    private List<String> symptoms;

    private String mood;
}
