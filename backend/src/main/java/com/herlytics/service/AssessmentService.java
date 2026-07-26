package com.herlytics.service;

import com.herlytics.dto.AssessmentRequest;
import com.herlytics.dto.AssessmentResponse;
import com.herlytics.entity.Assessment;
import com.herlytics.entity.AssessmentAnswer;
import com.herlytics.entity.User;
import com.herlytics.repository.AssessmentAnswerRepository;
import com.herlytics.repository.AssessmentRepository;
import com.herlytics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private AssessmentAnswerRepository assessmentAnswerRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public AssessmentResponse submitAssessment(User user, AssessmentRequest request) {
        AssessmentResponse aiResponse = null;

        // Try calling the FastAPI AI Service
        try {
            String endpoint = aiServiceUrl + "/predict";
            ResponseEntity<AssessmentResponse> response = restTemplate.postForEntity(endpoint, request, AssessmentResponse.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                aiResponse = response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Failed to connect to AI Service. Using fallback assessment engine. Error: " + e.getMessage());
        }

        // Fallback rule-based calculation if AI Service is unreachable
        if (aiResponse == null) {
            aiResponse = calculateFallback(request);
        }

        // Save Assessment to Database
        Assessment assessment = Assessment.builder()
                .user(user)
                .riskPercentage(aiResponse.getRiskPercentage())
                .confidenceScore(aiResponse.getConfidenceScore())
                .riskCategory(aiResponse.getRiskCategory())
                .explanation(aiResponse.getExplanation())
                .build();

        assessment = assessmentRepository.save(assessment);

        // Save individual Answers
        saveAnswer(assessment, "age", String.valueOf(request.getAge()));
        saveAnswer(assessment, "height", String.valueOf(request.getHeight()));
        saveAnswer(assessment, "weight", String.valueOf(request.getWeight()));
        saveAnswer(assessment, "cycle_regularity", String.valueOf(request.getCycleRegularity()));
        saveAnswer(assessment, "cycle_length", String.valueOf(request.getCycleLength()));
        saveAnswer(assessment, "heavy_bleeding", String.valueOf(request.getHeavyBleeding()));
        saveAnswer(assessment, "acne", String.valueOf(request.getAcne()));
        saveAnswer(assessment, "hair_loss", String.valueOf(request.getHairLoss()));
        saveAnswer(assessment, "facial_hair", String.valueOf(request.getFacialHair()));
        saveAnswer(assessment, "weight_gain", String.valueOf(request.getWeightGain()));
        saveAnswer(assessment, "exercise_days", String.valueOf(request.getExerciseDays()));
        saveAnswer(assessment, "stress_level", String.valueOf(request.getStressLevel()));
        saveAnswer(assessment, "sleep_hours", String.valueOf(request.getSleepHours()));
        saveAnswer(assessment, "water_intake", String.valueOf(request.getWaterIntake()));
        saveAnswer(assessment, "sugar_consumption", String.valueOf(request.getSugarConsumption()));
        saveAnswer(assessment, "insulin_resistance", String.valueOf(request.getInsulinResistance()));
        saveAnswer(assessment, "family_history", String.valueOf(request.getFamilyHistory()));
        saveAnswer(assessment, "mood_swings", String.valueOf(request.getMoodSwings()));
        saveAnswer(assessment, "physical_activity", String.valueOf(request.getPhysicalActivity()));

        // Populate return DTO
        aiResponse.setId(assessment.getId());
        aiResponse.setCreatedAt(assessment.getCreatedAt());

        return aiResponse;
    }

    private void saveAnswer(Assessment assessment, String key, String value) {
        AssessmentAnswer answer = AssessmentAnswer.builder()
                .assessment(assessment)
                .questionKey(key)
                .answerValue(value)
                .build();
        assessmentAnswerRepository.save(answer);
    }

    public List<Assessment> getAssessmentHistory(User user) {
        return assessmentRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Optional<Assessment> getLatestAssessment(User user) {
        return assessmentRepository.findFirstByUserOrderByCreatedAtDesc(user);
    }

    public Optional<Assessment> getAssessmentDetails(Long id, User user) {
        Optional<Assessment> assessmentOpt = assessmentRepository.findById(id);
        if (assessmentOpt.isPresent() && assessmentOpt.get().getUser().getId().equals(user.getId())) {
            return assessmentOpt;
        }
        return Optional.empty();
    }

    // Helper to calculate fallback response
    private AssessmentResponse calculateFallback(AssessmentRequest request) {
        double bmi = request.getWeight() / ((request.getHeight() / 100.0) * (request.getHeight() / 100.0));
        
        double score = 0;
        score += request.getCycleRegularity() * 2.5;
        score += (request.getCycleLength() > 35) ? 2.0 : 0.0;
        score += (bmi > 25) ? 1.5 : 0.0;
        score += request.getFacialHair() * 3.0;
        score += request.getAcne() * 1.5;
        score += request.getHairLoss() * 1.2;
        score += request.getWeightGain() * 1.5;
        score += request.getInsulinResistance() * 2.5;
        score += request.getFamilyHistory() * 2.0;
        score += request.getStressLevel() * 0.8;
        score += (request.getExerciseDays() < 3) ? 0.8 : 0.0;
        score += (request.getSleepHours() < 6) ? 0.5 : 0.0;
        score += request.getSugarConsumption() * 1.0;

        double riskPercentage = Math.min((score / 22.0) * 100.0, 100.0);
        riskPercentage = Math.round(riskPercentage * 10.0) / 10.0;

        String riskCategory;
        if (riskPercentage < 35.0) {
            riskCategory = "Low";
        } else if (riskPercentage < 70.0) {
            riskCategory = "Moderate";
        } else {
            riskCategory = "High";
        }

        String explanation;
        if (riskCategory.equals("High")) {
            explanation = "Your responses indicate a high risk (" + riskPercentage + "%) of PCOS/PCOD based on your symptoms (fallback engine).";
        } else if (riskCategory.equals("Moderate")) {
            explanation = "Your responses suggest a moderate risk (" + riskPercentage + "%) of developing PCOS/PCOD (fallback engine).";
        } else {
            explanation = "Your responses show a low risk (" + riskPercentage + "%) of PCOS/PCOD (fallback engine).";
        }

        List<Map<String, Object>> keyFactors = new ArrayList<>();
        if (request.getCycleRegularity() > 0) {
            Map<String, Object> f = new HashMap<>();
            f.put("factor", "Irregular menstrual cycle");
            f.put("severity", request.getCycleRegularity() == 2 ? "High" : "Medium");
            f.put("impact", "Positive");
            keyFactors.add(f);
        }
        if (request.getFacialHair() == 1) {
            Map<String, Object> f = new HashMap<>();
            f.put("factor", "Excess facial/body hair");
            f.put("severity", "High");
            f.put("impact", "Positive");
            keyFactors.add(f);
        }

        List<Map<String, Object>> recommendations = new ArrayList<>();
        Map<String, Object> r1 = new HashMap<>();
        r1.put("category", "Medical Consultation");
        r1.put("title", "Consult a gynecologist");
        r1.put("description", "Schedule a professional consultation with a gynecologist to review your symptoms.");
        r1.put("icon", "Doctor");
        recommendations.add(r1);

        Map<String, Object> r2 = new HashMap<>();
        r2.put("category", "Nutrition");
        r2.put("title", "Low-GI Diet");
        r2.put("description", "Adopt a diet low in processed sugars and high in fiber.");
        r2.put("icon", "Nutrition");
        recommendations.add(r2);

        String disclaimer = "HerLytics is not a diagnostic tool. Please consult a doctor for clinical diagnosis.";

        return AssessmentResponse.builder()
                .riskPercentage(riskPercentage)
                .confidenceScore(85.0)
                .riskCategory(riskCategory)
                .explanation(explanation)
                .keyFactors(keyFactors)
                .recommendations(recommendations)
                .disclaimer(disclaimer)
                .build();
    }
}
