package com.herlytics.controller;

import com.herlytics.dto.AssessmentRequest;
import com.herlytics.dto.AssessmentResponse;
import com.herlytics.entity.Assessment;
import com.herlytics.entity.User;
import com.herlytics.security.UserDetailsImpl;
import com.herlytics.service.AssessmentService;
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
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private UserService userService;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping
    public ResponseEntity<?> submitAssessment(@Valid @RequestBody AssessmentRequest request) {
        User user = getCurrentUser();
        AssessmentResponse response = assessmentService.submitAssessment(user, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getHistory() {
        User user = getCurrentUser();
        List<Assessment> assessments = assessmentService.getAssessmentHistory(user);
        
        List<Map<String, Object>> responseList = new ArrayList<>();
        for (Assessment a : assessments) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("riskPercentage", a.getRiskPercentage());
            map.put("confidenceScore", a.getConfidenceScore());
            map.put("riskCategory", a.getRiskCategory());
            map.put("explanation", a.getExplanation());
            map.put("createdAt", a.getCreatedAt());
            responseList.add(map);
        }
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetails(@PathVariable Long id) {
        User user = getCurrentUser();
        return assessmentService.getAssessmentDetails(id, user)
                .map(a -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", a.getId());
                    map.put("riskPercentage", a.getRiskPercentage());
                    map.put("confidenceScore", a.getConfidenceScore());
                    map.put("riskCategory", a.getRiskCategory());
                    map.put("explanation", a.getExplanation());
                    map.put("createdAt", a.getCreatedAt());
                    
                    List<Map<String, String>> answers = new ArrayList<>();
                    a.getAnswers().forEach(ans -> {
                        Map<String, String> ansMap = new HashMap<>();
                        ansMap.put("key", ans.getQuestionKey());
                        ansMap.put("value", ans.getAnswerValue());
                        answers.add(ansMap);
                    });
                    map.put("answers", answers);
                    return ResponseEntity.ok(map);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
