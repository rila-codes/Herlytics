package com.herlytics.service;

import com.herlytics.dto.LifestyleLogRequest;
import com.herlytics.entity.Assessment;
import com.herlytics.entity.AssessmentAnswer;
import com.herlytics.entity.LifestyleLog;
import com.herlytics.entity.User;
import com.herlytics.repository.AssessmentRepository;
import com.herlytics.repository.LifestyleLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class LifestyleLogService {

    @Autowired
    private LifestyleLogRepository lifestyleLogRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Transactional
    public LifestyleLog saveDailyLog(User user, LifestyleLogRequest request) {
        Optional<LifestyleLog> existingLogOpt = lifestyleLogRepository.findByUserAndLogDate(user, request.getLogDate());
        
        LifestyleLog log;
        if (existingLogOpt.isPresent()) {
            log = existingLogOpt.get();
        } else {
            log = new LifestyleLog();
            log.setUser(user);
            log.setLogDate(request.getLogDate());
        }

        if (request.getWaterIntakeMl() != null) {
            log.setWaterIntakeMl(request.getWaterIntakeMl());
        }
        if (request.getSleepDurationHours() != null) {
            log.setSleepDurationHours(request.getSleepDurationHours());
        }
        if (request.getExerciseDurationMinutes() != null) {
            log.setExerciseDurationMinutes(request.getExerciseDurationMinutes());
        }
        if (request.getMood() != null) {
            log.setMood(request.getMood());
        }
        if (request.getWeightKg() != null) {
            log.setWeightKg(request.getWeightKg());
            
            // Try calculating BMI based on height in latest assessment
            try {
                Optional<Assessment> latestAssessment = assessmentRepository.findFirstByUserOrderByCreatedAtDesc(user);
                if (latestAssessment.isPresent()) {
                    List<AssessmentAnswer> answers = latestAssessment.get().getAnswers();
                    Double height = null;
                    for (AssessmentAnswer ans : answers) {
                        if (ans.getQuestionKey().equals("height")) {
                            height = Double.parseDouble(ans.getAnswerValue());
                            break;
                        }
                    }
                    if (height != null) {
                        double heightMeters = height / 100.0;
                        double bmi = request.getWeightKg() / (heightMeters * heightMeters);
                        log.setBmi(Math.round(bmi * 10.0) / 10.0);
                    }
                }
            } catch (Exception e) {
                // Ignore height calculation error
            }
        }

        return lifestyleLogRepository.save(log);
    }

    public List<LifestyleLog> getLogsForRange(User user, LocalDate startDate, LocalDate endDate) {
        return lifestyleLogRepository.findByUserAndLogDateBetweenOrderByLogDateAsc(user, startDate, endDate);
    }

    public Map<String, Object> getSummary(User user, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);
        List<LifestyleLog> logs = lifestyleLogRepository.findByUserAndLogDateBetweenOrderByLogDateAsc(user, startDate, endDate);

        double totalWater = 0;
        double totalSleep = 0;
        double totalExercise = 0;
        int countWater = 0;
        int countSleep = 0;
        int countExercise = 0;

        List<Map<String, Object>> dailyStats = new ArrayList<>();

        for (LifestyleLog log : logs) {
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("date", log.getLogDate().toString());
            dayMap.put("waterIntakeMl", log.getWaterIntakeMl());
            dayMap.put("sleepDurationHours", log.getSleepDurationHours());
            dayMap.put("exerciseDurationMinutes", log.getExerciseDurationMinutes());
            dayMap.put("mood", log.getMood());
            dayMap.put("weightKg", log.getWeightKg());
            dayMap.put("bmi", log.getBmi());
            dailyStats.add(dayMap);

            if (log.getWaterIntakeMl() != null) {
                totalWater += log.getWaterIntakeMl();
                countWater++;
            }
            if (log.getSleepDurationHours() != null) {
                totalSleep += log.getSleepDurationHours();
                countSleep++;
            }
            if (log.getExerciseDurationMinutes() != null) {
                totalExercise += log.getExerciseDurationMinutes();
                countExercise++;
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("avgWaterIntakeMl", countWater > 0 ? Math.round(totalWater / countWater) : 0);
        summary.put("avgSleepDurationHours", countSleep > 0 ? Math.round((totalSleep / countSleep) * 10.0) / 10.0 : 0.0);
        summary.put("avgExerciseDurationMinutes", countExercise > 0 ? Math.round(totalExercise / countExercise) : 0);
        summary.put("dailyStats", dailyStats);

        return summary;
    }
}
