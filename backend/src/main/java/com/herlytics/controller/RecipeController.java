package com.herlytics.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.herlytics.entity.Recipe;
import com.herlytics.entity.User;
import com.herlytics.security.UserDetailsImpl;
import com.herlytics.service.RecipeService;
import com.herlytics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private UserService userService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping("/api/recipes")
    public ResponseEntity<?> getRecipes(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Boolean pcosFriendly) {
        List<Recipe> recipes = recipeService.getAllRecipes(tag, pcosFriendly);
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (Recipe r : recipes) {
            response.add(serializeRecipe(r));
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/recipes/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        return recipeService.getRecipeById(id)
                .map(r -> ResponseEntity.ok(serializeRecipe(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/diet/plan")
    public ResponseEntity<?> getDietPlan() {
        User user = getCurrentUser();
        Map<String, Object> dietPlan = recipeService.getDietPlan(user);
        return ResponseEntity.ok(dietPlan);
    }

    private Map<String, Object> serializeRecipe(Recipe r) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", r.getId());
        map.put("title", r.getTitle());
        map.put("description", r.getDescription());
        map.put("imageUrl", r.getImageUrl());
        map.put("cookingTimeMinutes", r.getCookingTimeMinutes());
        map.put("difficulty", r.getDifficulty());
        map.put("isPcosFriendly", r.getIsPcosFriendly());
        map.put("createdAt", r.getCreatedAt());

        try {
            map.put("nutrition", objectMapper.readValue(r.getNutrition(), new TypeReference<Map<String, Object>>() {}));
            map.put("ingredients", objectMapper.readValue(r.getIngredients(), new TypeReference<List<String>>() {}));
            map.put("steps", objectMapper.readValue(r.getSteps(), new TypeReference<List<String>>() {}));
            map.put("tags", objectMapper.readValue(r.getTags(), new TypeReference<List<String>>() {}));
        } catch (Exception e) {
            // If json mapping fails, put empty/defaults
            map.put("nutrition", new HashMap<>());
            map.put("ingredients", new ArrayList<>());
            map.put("steps", new ArrayList<>());
            map.put("tags", new ArrayList<>());
        }
        return map;
    }
}
