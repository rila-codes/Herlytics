package com.herlytics.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.herlytics.dto.MenstrualLogRequest;
import com.herlytics.entity.MenstrualLog;
import com.herlytics.entity.User;
import com.herlytics.repository.MenstrualLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class MenstrualLogService {

    @Autowired
    private MenstrualLogRepository menstrualLogRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public MenstrualLog saveLog(User user, MenstrualLogRequest request) {
        String symptomsJson = "";
        try {
            if (request.getSymptoms() != null) {
                symptomsJson = objectMapper.writeValueAsString(request.getSymptoms());
            }
        } catch (Exception e) {
            // Ignore mapping error
        }

        MenstrualLog log = MenstrualLog.builder()
                .user(user)
                .logDate(request.getLogDate())
                .cycleLength(request.getCycleLength() != null ? request.getCycleLength() : 28)
                .periodDuration(request.getPeriodDuration() != null ? request.getPeriodDuration() : 5)
                .symptoms(symptomsJson)
                .mood(request.getMood())
                .build();

        return menstrualLogRepository.save(log);
    }

    public List<MenstrualLog> getLogs(User user) {
        return menstrualLogRepository.findByUserOrderByLogDateDesc(user);
    }

    public Map<String, Object> getPrediction(User user) {
        Optional<MenstrualLog> latestLogOpt = menstrualLogRepository.findFirstByUserOrderByLogDateDesc(user);
        
        Map<String, Object> response = new HashMap<>();
        if (latestLogOpt.isEmpty()) {
            response.put("hasLogs", false);
            return response;
        }

        MenstrualLog latestLog = latestLogOpt.get();
        LocalDate lastPeriodStart = latestLog.getLogDate();
        int cycleLength = latestLog.getCycleLength() != null ? latestLog.getCycleLength() : 28;
        int duration = latestLog.getPeriodDuration() != null ? latestLog.getPeriodDuration() : 5;

        LocalDate nextPeriodStart = lastPeriodStart.plusDays(cycleLength);
        LocalDate nextPeriodEnd = nextPeriodStart.plusDays(duration - 1);
        
        // Ovulation is usually 14 days before the next period starts
        LocalDate ovulationDate = nextPeriodStart.minusDays(14);
        
        // Fertile window is 5 days before ovulation and the day of ovulation
        LocalDate fertileStart = ovulationDate.minusDays(5);
        LocalDate fertileEnd = ovulationDate;

        response.put("hasLogs", true);
        response.put("lastPeriodStart", lastPeriodStart.toString());
        response.put("cycleLength", cycleLength);
        response.put("periodDuration", duration);
        response.put("predictedNextPeriodStart", nextPeriodStart.toString());
        response.put("predictedNextPeriodEnd", nextPeriodEnd.toString());
        response.put("predictedOvulationDate", ovulationDate.toString());
        response.put("fertileWindowStart", fertileStart.toString());
        response.put("fertileWindowEnd", fertileEnd.toString());
        
        // Days until next period
        long daysUntilNextPeriod = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), nextPeriodStart);
        response.put("daysUntilNextPeriod", Math.max(0, daysUntilNextPeriod));

        return response;
    }

    public List<String> deserializeSymptoms(String symptomsJson) {
        if (symptomsJson == null || symptomsJson.isEmpty()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(symptomsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
