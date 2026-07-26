package com.herlytics.controller;

import com.herlytics.dto.LifestyleLogRequest;
import com.herlytics.entity.LifestyleLog;
import com.herlytics.entity.User;
import com.herlytics.security.UserDetailsImpl;
import com.herlytics.service.LifestyleLogService;
import com.herlytics.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lifestyle")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LifestyleLogController {

    @Autowired
    private LifestyleLogService lifestyleLogService;

    @Autowired
    private UserService userService;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping("/logs")
    public ResponseEntity<?> saveLog(@Valid @RequestBody LifestyleLogRequest request) {
        User user = getCurrentUser();
        LifestyleLog log = lifestyleLogService.saveDailyLog(user, request);
        return ResponseEntity.ok(log);
    }

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        User user = getCurrentUser();
        List<LifestyleLog> logs = lifestyleLogService.getLogsForRange(user, startDate, endDate);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestParam(defaultValue = "7") int days) {
        User user = getCurrentUser();
        Map<String, Object> summary = lifestyleLogService.getSummary(user, days);
        return ResponseEntity.ok(summary);
    }
}
