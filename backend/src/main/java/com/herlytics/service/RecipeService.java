package com.herlytics.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.herlytics.entity.Assessment;
import com.herlytics.entity.Recipe;
import com.herlytics.entity.User;
import com.herlytics.repository.AssessmentRepository;
import com.herlytics.repository.RecipeRepository;
import com.herlytics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Recipe> getAllRecipes(String filterTag, Boolean pcosFriendlyOnly) {
        List<Recipe> recipes = recipeRepository.findAll();

        if (pcosFriendlyOnly != null && pcosFriendlyOnly) {
            recipes = recipes.stream()
                    .filter(Recipe::getIsPcosFriendly)
                    .collect(Collectors.toList());
        }

        if (filterTag != null && !filterTag.isEmpty()) {
            recipes = recipes.stream()
                    .filter(r -> {
                        try {
                            List<String> tags = objectMapper.readValue(r.getTags(), new TypeReference<List<String>>() {});
                            return tags.stream().anyMatch(t -> t.equalsIgnoreCase(filterTag));
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .collect(Collectors.toList());
        }

        return recipes;
    }

    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    public Map<String, Object> getDietPlan(User user) {
        Optional<Assessment> latestAssessmentOpt = assessmentRepository.findFirstByUserOrderByCreatedAtDesc(user);
        
        String riskCategory = "Low";
        if (latestAssessmentOpt.isPresent()) {
            riskCategory = latestAssessmentOpt.get().getRiskCategory();
        }

        Map<String, Object> dietPlan = new HashMap<>();
        List<Map<String, Object>> meals = new ArrayList<>();

        if (riskCategory.equalsIgnoreCase("High")) {
            dietPlan.put("title", "Insulin-Regulating PCOS Diet Plan");
            dietPlan.put("description", "A low-glycemic, high-protein meal plan designed to minimize insulin spikes, support hormonal balance, and manage weight.");
            dietPlan.put("targetCalories", 1500);
            dietPlan.put("proteinGrams", 85);
            dietPlan.put("carbsGrams", 90);
            dietPlan.put("fatGrams", 60);

            meals.add(createMealMap("Breakfast", "Chia Seed Protein Pudding", "Chia seeds soaked in almond milk, mixed with 1/2 scoop vanilla plant protein, topped with raspberries and a dash of cinnamon.", 240, 10, 16, 12));
            meals.add(createMealMap("Lunch", "Grilled Paneer & Spinach Salad", "Grilled paneer cubes tossed with baby spinach, cherry tomatoes, cucumbers, drizzled with extra virgin olive oil and lemon juice.", 320, 18, 8, 22));
            meals.add(createMealMap("Snack", "Spiced Pumpkin Seeds & Almonds", "A handful of dry-roasted almonds and pumpkin seeds, high in magnesium and zinc for hormone synthesis.", 180, 6, 5, 14));
            meals.add(createMealMap("Dinner", "Stir-fried Tofu & Broccoli with Sesame", "Firm tofu stir-fried with broccoli florets, bell peppers, and snap peas in coconut aminos, finished with sesame seeds.", 410, 22, 18, 16));

        } else if (riskCategory.equalsIgnoreCase("Moderate")) {
            dietPlan.put("title", "Balanced Anti-Inflammatory Diet Plan");
            dietPlan.put("description", "Focuses on high-fiber complex carbohydrates, healthy omega-3 fatty acids, and clean protein sources to reduce inflammation.");
            dietPlan.put("targetCalories", 1750);
            dietPlan.put("proteinGrams", 75);
            dietPlan.put("carbsGrams", 140);
            dietPlan.put("fatGrams", 55);

            meals.add(createMealMap("Breakfast", "Oatmeal with Flaxseeds & Walnuts", "Steel-cut oats cooked in water, topped with ground flaxseeds, walnuts, and a few blueberries.", 310, 8, 42, 10));
            meals.add(createMealMap("Lunch", "Quinoa & Avocado Buddha Bowl", "Quinoa, steamed broccoli florets, boiled chickpeas, and sliced avocado served with a creamy tahini-lemon dressing.", 410, 12, 48, 18));
            meals.add(createMealMap("Snack", "Greek Yogurt with Berries", "Plain, unsweetened Greek yogurt topped with a handful of fresh strawberries and pumpkin seeds.", 150, 15, 10, 4));
            meals.add(createMealMap("Dinner", "Lentil & Vegetable Medley Soup", "A hearty soup made with yellow lentils, carrots, spinach, and tomatoes, spiced with turmeric and cumin.", 350, 18, 45, 6));

        } else {
            dietPlan.put("title", "General Hormone-Supporting Diet Plan");
            dietPlan.put("description", "A wholesome, nutrient-dense diet plan focused on whole foods, diverse vegetables, and clean hydration to support everyday energy.");
            dietPlan.put("targetCalories", 2000);
            dietPlan.put("proteinGrams", 65);
            dietPlan.put("carbsGrams", 240);
            dietPlan.put("fatGrams", 50);

            meals.add(createMealMap("Breakfast", "Spelt Toast with Scrambled Eggs & Spinach", "Two eggs scrambled with baby spinach, served alongside a slice of toasted whole spelt bread.", 350, 20, 25, 12));
            meals.add(createMealMap("Lunch", "Brown Rice and Lentil Bowl", "Brown rice served with a side of mixed vegetable lentil curry and a cucumber raita.", 520, 18, 75, 8));
            meals.add(createMealMap("Snack", "Apple Slices with Peanut Butter", "One medium apple sliced and served with 1 tablespoon of natural unsweetened peanut butter.", 190, 4, 20, 8));
            meals.add(createMealMap("Dinner", "Stir-fried Chickpea Salad & Sweet Potato", "Baked sweet potato served with a chickpea salad containing chopped bell peppers, onions, and parsley.", 420, 12, 65, 6));
        }

        dietPlan.put("meals", meals);
        return dietPlan;
    }

    private Map<String, Object> createMealMap(String type, String name, String description, int calories, int protein, int carbs, int fat) {
        Map<String, Object> meal = new HashMap<>();
        meal.put("type", type);
        meal.put("name", name);
        meal.put("description", description);
        
        Map<String, Object> nutrition = new HashMap<>();
        nutrition.put("calories", calories);
        nutrition.put("protein", protein);
        nutrition.put("carbohydrates", carbs);
        nutrition.put("fat", fat);
        meal.put("nutrition", nutrition);
        
        return meal;
    }
}
