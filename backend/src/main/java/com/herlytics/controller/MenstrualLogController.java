package com.herlytics.controller;

import com.herlytics.dto.MenstrualLogRequest;
import com.herlytics.entity.MenstrualLog;
import com.herlytics.entity.User;
import com.herlytics.security.UserDetailsImpl;
import com.herlytics.service.MenstrualLogService;
import com.herlytics.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menstrual")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MenstrualLogController {

    @Autowired
    private MenstrualLogService menstrualLogService;

    @Autowired
    private UserService userService;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping("/logs")
    public ResponseEntity<?> saveLog(@Valid @RequestBody MenstrualLogRequest request) {
        User user = getCurrentUser();
        MenstrualLog log = menstrualLogService.saveLog(user, request);
        return ResponseEntity.ok(log);
    }

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs() {
        User user = getCurrentUser();
        List<MenstrualLog> logs = menstrualLogService.getLogs(user);
        
        List<Map<String, Object>> responseList = new ArrayList<>();
        for (MenstrualLog log : logs) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", log.getId());
            map.put("logDate", log.getLogDate().toString());
            map.put("cycleLength", log.getCycleLength());
            map.put("periodDuration", log.getPeriodDuration());
            map.put("mood", log.getMood());
            map.put("symptoms", menstrualLogService.deserializeSymptoms(log.getSymptoms()));
            map.put("createdAt", log.getCreatedAt());
            responseList.add(map);
        }
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/predict")
    public ResponseEntity<?> getPrediction() {
        User user = getCurrentUser();
        Map<String, Object> prediction = menstrualLogService.getPrediction(user);
        return ResponseEntity.ok(prediction);
    }
}
