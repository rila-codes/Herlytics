package com.herlytics.config;

import com.herlytics.entity.Article;
import com.herlytics.entity.Recipe;
import com.herlytics.repository.ArticleRepository;
import com.herlytics.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Override
    public void run(String... args) throws Exception {
        seedRecipes();
        seedArticles();
    }

    private void seedRecipes() {
        if (recipeRepository.count() == 0) {
            recipeRepository.save(Recipe.builder()
                    .title("Grilled Paneer Salad")
                    .description("A high-protein, low-carb salad filled with fresh greens and grilled cottage cheese, perfect for insulin management.")
                    .cookingTimeMinutes(15)
                    .difficulty("Easy")
                    .imageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500")
                    .nutrition("{\"calories\": 320, \"protein\": 18, \"carbs\": 8, \"fat\": 22}")
                    .ingredients("[\"200g Paneer (Cottage Cheese)\", \"1 cup Cherry Tomatoes\", \"1 Cucumber, chopped\", \"1 cup Spinach leaves\", \"1 tbsp Olive Oil\", \"1 tbsp Lemon juice\", \"Salt & Pepper to taste\"]")
                    .steps("[\"Dice paneer into small cubes.\", \"Heat olive oil in a pan and lightly grill paneer until golden.\", \"In a large bowl, mix spinach, cherry tomatoes, and cucumber.\", \"Add the grilled paneer.\", \"Drizzle with lemon juice, sprinkle salt and pepper, and toss well.\"]")
                    .tags("[\"Vegetarian\", \"Low Carb\", \"PCOS Friendly\", \"High Protein\"]")
                    .isPcosFriendly(true)
                    .build());

            recipeRepository.save(Recipe.builder()
                    .title("Quinoa & Avocado Buddha Bowl")
                    .description("A nutrient-dense vegan bowl packed with complex carbs, healthy fats, and fiber to stabilize blood sugar levels.")
                    .cookingTimeMinutes(20)
                    .difficulty("Easy")
                    .imageUrl("https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=500")
                    .nutrition("{\"calories\": 410, \"protein\": 12, \"carbs\": 48, \"fat\": 18}")
                    .ingredients("[\"1/2 cup Quinoa, uncooked\", \"1/2 Avocado, sliced\", \"1/2 cup Chickpeas, boiled\", \"1/2 cup Broccoli florets\", \"2 tbsp Tahini sauce\", \"1 tbsp Lemon juice\"]")
                    .steps("[\"Rinse and cook quinoa according to package instructions.\", \"Steam broccoli florets until tender.\", \"Assemble cooked quinoa, sliced avocado, chickpeas, and broccoli in a serving bowl.\", \"Drizzle with tahini sauce and fresh lemon juice.\", \"Serve warm.\"]")
                    .tags("[\"Vegan\", \"Vegetarian\", \"PCOS Friendly\", \"High Fiber\"]")
                    .isPcosFriendly(true)
                    .build());

            recipeRepository.save(Recipe.builder()
                    .title("Chia Seed Protein Pudding")
                    .description("An easy, make-ahead breakfast rich in Omega-3 fatty acids to help reduce inflammation.")
                    .cookingTimeMinutes(10)
                    .difficulty("Easy")
                    .imageUrl("https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500")
                    .nutrition("{\"calories\": 240, \"protein\": 10, \"carbs\": 16, \"fat\": 12}")
                    .ingredients("[\"3 tbsp Chia Seeds\", \"1 cup Unsweetened Almond Milk\", \"1/2 scoop Vanilla Plant Protein Powder\", \"1/4 cup Mixed Berries (blueberries/strawberries)\", \"1/2 tsp Cinnamon powder\"]")
                    .steps("[\"In a jar or glass container, mix chia seeds, almond milk, and protein powder.\", \"Stir vigorously to ensure no clumps form.\", \"Cover and refrigerate for at least 4 hours, or overnight, until it thickens.\", \"Before serving, top with fresh mixed berries and sprinkle cinnamon.\"]")
                    .tags("[\"Vegetarian\", \"PCOS Friendly\", \"High Protein\", \"Gluten Free\"]")
                    .isPcosFriendly(true)
                    .build());

            System.out.println("Recipes seeded successfully!");
        }
    }

    private void seedArticles() {
        if (articleRepository.count() == 0) {
            articleRepository.save(Article.builder()
                    .title("Understanding PCOS: Symptoms & Causes")
                    .category("PCOS")
                    .readingTimeMinutes(5)
                    .imageUrl("https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500")
                    .content("Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder affecting women of reproductive age. " +
                            "Characterized by irregular menstrual cycles, elevated levels of androgens (male hormones), and fluid-filled sacs (follicles) in the ovaries, " +
                            "it can manifest as acne, hair thinning, weight gain, and excessive facial or body hair.\n\n" +
                            "While the exact cause of PCOS is unknown, key contributing factors include insulin resistance, low-grade inflammation, and hereditary factors. " +
                            "Early detection through risk evaluation and active management of symptoms can significantly improve long-term health outcome, preventing complications like type 2 diabetes and heart diseases.")
                    .build());

            articleRepository.save(Article.builder()
                    .title("PCOS Nutrition: Foods to Eat and Avoid")
                    .category("Nutrition")
                    .readingTimeMinutes(6)
                    .imageUrl("https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=500")
                    .content("Your diet plays a critical role in managing PCOS, primarily by regulating insulin levels. " +
                            "Insulin resistance affects up to 70% of women with PCOS, leading to weight gain and increased androgen production.\n\n" +
                            "**Foods to focus on:**\n" +
                            "1. Low-Glycemic Index (GI) foods: Whole grains, legumes, nuts, seeds, and non-starchy vegetables.\n" +
                            "2. Anti-inflammatory foods: Fatty fish, olive oil, berries, leafy greens, and turmeric.\n" +
                            "3. Lean protein: Paneer, tofu, chicken, eggs, and legumes.\n\n" +
                            "**Foods to limit/avoid:**\n" +
                            "1. Refined carbohydrates: White bread, pastries, and processed snacks.\n" +
                            "2. Sugary beverages: Soda, energy drinks, and packaged juices.\n" +
                            "3. Trans fats and processed meats.\n\n" +
                            "A balanced plate with fiber, healthy fats, and protein will keep your blood sugar stable and help manage cravings.")
                    .build());

            articleRepository.save(Article.builder()
                    .title("Restoring Hormonal Balance Naturally")
                    .category("Hormones")
                    .readingTimeMinutes(4)
                    .imageUrl("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500")
                    .content("Hormonal fluctuations are at the core of PCOS. Beyond medical treatments, small daily habits can help restore natural balance:\n\n" +
                            "1. **Prioritize Sleep:** Growth hormone and cortisol are heavily regulated during sleep. Chronic sleep deprivation disrupts insulin sensitivity and exacerbates mood swings.\n" +
                            "2. **Manage Stress:** High cortisol levels lead to progesterone depletion and increased fat storage, particularly in the abdomen. Incorporate meditation, deep breathing, or nature walks into your daily routine.\n" +
                            "3. **Regular Exercise:** Physical activity increases insulin sensitivity, decreases testosterone, and improves blood circulation. Even 30 minutes of brisk walking can help.")
                    .build());

            System.out.println("Articles seeded successfully!");
        }
    }
}
