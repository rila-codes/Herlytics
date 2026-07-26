package com.herlytics.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssessmentRequest {

    @NotNull(message = "Age is required")
    @Min(10) @Max(100)
    private Integer age;

    @NotNull(message = "Height is required")
    @Min(100) @Max(250)
    private Double height;

    @NotNull(message = "Weight is required")
    @Min(30) @Max(200)
    private Double weight;

    @NotNull(message = "Cycle regularity is required")
    @Min(0) @Max(2)
    private Integer cycleRegularity;

    @NotNull(message = "Cycle length is required")
    @Min(15) @Max(120)
    private Integer cycleLength;

    @NotNull(message = "Heavy bleeding status is required")
    @Min(0) @Max(1)
    private Integer heavyBleeding;

    @NotNull(message = "Acne status is required")
    @Min(0) @Max(1)
    private Integer acne;

    @NotNull(message = "Hair loss status is required")
    @Min(0) @Max(1)
    private Integer hairLoss;

    @NotNull(message = "Facial hair status is required")
    @Min(0) @Max(1)
    private Integer facialHair;

    @NotNull(message = "Weight gain status is required")
    @Min(0) @Max(1)
    private Integer weightGain;

    @NotNull(message = "Exercise frequency is required")
    @Min(0) @Max(7)
    private Integer exerciseDays;

    @NotNull(message = "Stress level is required")
    @Min(0) @Max(2)
    private Integer stressLevel;

    @NotNull(message = "Sleep hours are required")
    @Min(2) @Max(16)
    private Double sleepHours;

    @NotNull(message = "Water intake is required")
    @Min(0) @Max(30)
    private Integer waterIntake;

    @NotNull(message = "Sugar consumption level is required")
    @Min(0) @Max(2)
    private Integer sugarConsumption;

    @NotNull(message = "Insulin resistance status is required")
    @Min(0) @Max(1)
    private Integer insulinResistance;

    @NotNull(message = "Family history of PCOS is required")
    @Min(0) @Max(1)
    private Integer familyHistory;

    @NotNull(message = "Mood swings status is required")
    @Min(0) @Max(1)
    private Integer moodSwings;

    @NotNull(message = "Physical activity level is required")
    @Min(0) @Max(2)
    private Integer physicalActivity;
}
