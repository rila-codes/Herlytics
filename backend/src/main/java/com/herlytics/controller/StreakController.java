package com.herlytics.controller;

import com.herlytics.entity.User;
import com.herlytics.security.UserDetailsImpl;
import com.herlytics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/streak")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StreakController {

    @Autowired
    private UserService userService;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<?> getStreakInfo() {
        User user = getCurrentUser();
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("today", LocalDate.now().toString());
        response.put("status", "active");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/activity")
    public ResponseEntity<?> recordActivity(@RequestBody Map<String, String> payload) {
        User user = getCurrentUser();
        String activityType = payload.getOrDefault("activityType", "checkin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        response.put("activityType", activityType);
        response.put("loggedDate", LocalDate.now().toString());
        response.put("status", "recorded");

        return ResponseEntity.ok(response);
    }
}
