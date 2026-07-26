package com.herlytics.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food-finder")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FoodFinderController {

    private final List<Map<String, Object>> alternatives = new ArrayList<>();

    public FoodFinderController() {
        initAlternatives();
    }

    private void initAlternatives() {
        alternatives.add(createAlternative(
                "pizza",
                "Millet Veggie Pizza",
                "Traditional pizzas are made with refined flour (maida) which spikes blood glucose and increases insulin resistance.",
                "Cauliflower crust or millet crust is rich in complex carbohydrates and fiber, supporting insulin control for PCOS.",
                "280 kcal / slice, 3g fiber, high trans fat",
                "150 kcal / slice, 7g fiber, rich in antioxidants",
                "Millet Pizza"
        ));

        alternatives.add(createAlternative(
                "burger",
                "Grilled Paneer Lettuce Wrap Burger",
                "Unhealthy fast-food burgers use processed white flour buns and deep-fried patties with high trans-fat.",
                "Paneer provides quality protein, and swapping the white bun for lettuce reduces simple carbs to prevent blood sugar spikes.",
                "450 kcal, 12g protein, high sodium",
                "270 kcal, 18g protein, low sodium",
                "Paneer Lettuce Wrap Burger"
        ));

        alternatives.add(createAlternative(
                "noodles",
                "Zucchini Noodles (Zoodles) or Whole Wheat Pasta",
                "Refined flour instant noodles contain preservatives, high sodium, and have a very high glycemic index.",
                "Zoodles are naturally gluten-free and low-carb, offering a fiber-rich alternative that keeps you full longer.",
                "380 kcal, high refined carbs, low fiber",
                "120 kcal, rich in vitamins A & C, high fiber",
                "Veggie Zoodles or Whole Wheat Pasta"
        ));

        alternatives.add(createAlternative(
                "milkshake",
                "Greek Yogurt Berry Smoothie",
                "Commercial milkshakes are loaded with refined sugars, artificial syrups, and high-fat dairy, which trigger acne and insulin spikes.",
                "Greek yogurt provides a rich source of protein and probiotics, and berries supply anti-inflammatory antioxidants without spikes.",
                "420 kcal, 45g sugar, 4g protein",
                "180 kcal, 12g sugar (natural), 15g protein",
                "Greek Yogurt Smoothie"
        ));

        alternatives.add(createAlternative(
                "french fries",
                "Baked Sweet Potato Wedges",
                "Deep-fried white potatoes contain high trans-fats and acrylamides, leading to cellular inflammation.",
                "Sweet potatoes have a lower glycemic index than white potatoes and are rich in beta-carotene and fiber.",
                "365 kcal, high trans-fats, low vitamins",
                "140 kcal, 0g trans-fat, rich in Vitamin A",
                "Baked Sweet Potato Wedges"
        ));
    }

    private Map<String, Object> createAlternative(
            String keyword,
            String healthyName,
            String unhealthyReason,
            String healthyBenefit,
            String unhealthyNutrition,
            String healthyNutrition,
            String searchName) {
        
        Map<String, Object> item = new HashMap<>();
        item.put("keyword", keyword);
        item.put("healthyName", healthyName);
        item.put("unhealthyReason", unhealthyReason);
        item.put("healthyBenefit", healthyBenefit);
        item.put("unhealthyNutrition", unhealthyNutrition);
        item.put("healthyNutrition", healthyNutrition);
        
        // Swiggy and Zomato search links
        String encodedSearch = URLEncoder.encode(searchName, StandardCharsets.UTF_8);
        item.put("swiggyUrl", "https://www.swiggy.com/search?query=" + encodedSearch);
        item.put("zomatoUrl", "https://www.zomato.com/search?q=" + encodedSearch);
        
        return item;
    }

    @GetMapping("/alternatives")
    public ResponseEntity<?> getAlternatives(@RequestParam(required = false) String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(alternatives);
        }

        String searchKey = query.toLowerCase().trim();
        List<Map<String, Object>> filtered = new ArrayList<>();
        
        for (Map<String, Object> alt : alternatives) {
            String keyword = (String) alt.get("keyword");
            String healthyName = (String) alt.get("healthyName");
            if (keyword.contains(searchKey) || searchKey.contains(keyword) || healthyName.toLowerCase().contains(searchKey)) {
                filtered.add(alt);
            }
        }

        // If no match found, generate a dynamic fallback suggestion
        if (filtered.isEmpty()) {
            Map<String, Object> fallback = createAlternative(
                    searchKey,
                    "Healthy " + query + " bowl with Quinoa / Millets",
                    "Standard prepared versions of " + query + " might contain refined flour, added sugars, or excess oils.",
                    "Switching to a custom bowl with whole grains (millets/quinoa) and fresh greens provides fiber and clean protein.",
                    "Varies (High simple carbs / trans-fat)",
                    "Approx. 350 kcal, rich in plant proteins and dietary fiber",
                    "Healthy " + query
            );
            filtered.add(fallback);
        }

        return ResponseEntity.ok(filtered);
    }
}
