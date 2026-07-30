import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Clock, Award, Heart, Check, X, ShieldAlert, Sparkles, Bookmark, Flame, AlertCircle, RefreshCw, ChefHat, CheckCircle2 } from 'lucide-react';
import { getLatestAssessmentData } from '../utils/assessmentState';

interface Recipe {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  cookingTimeMinutes: number;
  difficulty: string;
  isPcosFriendly: boolean;
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  ingredients: string[];
  steps: string[];
  tags: string[];
  healthBenefit: string;
  matchedJunkKeyword?: string;
}

const FAST_FOOD_KEYWORDS = [
  'pizza', 'burger', 'fries', 'french fries', 'soda', 'coke', 'ice cream', 
  'momos', 'samosa', 'biryani', 'doughnut', 'donut', 'pasta', 'noodle', 
  'maggi', 'chole bhature', 'hot dog', 'chips'
];

const COMPREHENSIVE_RECIPES: Recipe[] = [
  // --- HEALTHY FAST FOOD SWAPS ---
  {
    id: 101,
    title: 'Cauliflower Crust Veggie Pizza',
    category: 'Fast Food Swap',
    description: 'Guilt-free pizza with a low-GI cauliflower crust, organic tomato sauce, almond mozzarella, and fresh basil.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 25,
    difficulty: 'Medium',
    isPcosFriendly: true,
    nutrition: { calories: 390, protein: 22, carbohydrates: 34, fat: 16 },
    ingredients: [
      '2 cups Riced Cauliflower',
      '1 Egg / Flax Egg',
      '1/2 cup Almond Flour',
      '1/2 cup Organic Tomato Sauce',
      '1/2 cup Almond Mozzarella Cheese',
      'Fresh Basil & Oregano'
    ],
    steps: [
      'Steam riced cauliflower and squeeze out all excess moisture using a cheesecloth.',
      'Mix cauliflower, almond flour, egg, and oregano to form a dough crust.',
      'Bake crust at 200°C for 15 minutes until golden brown.',
      'Top with tomato sauce, almond mozzarella, and fresh basil; bake 5 mins more.'
    ],
    tags: ['PCOS Friendly', 'Low Carb', 'Fast Food Swap', 'Vegetarian'],
    healthBenefit: 'Lowers glycemic load by 70% compared to refined wheat crust, preventing insulin spikes.',
    matchedJunkKeyword: 'pizza'
  },
  {
    id: 102,
    title: 'Portobello & Black Bean Quinoa Burger',
    category: 'Fast Food Swap',
    description: 'Juicy roasted portobello mushroom bun filled with black bean quinoa patty, avocado, and microgreens.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 20,
    difficulty: 'Easy',
    isPcosFriendly: true,
    nutrition: { calories: 380, protein: 24, carbohydrates: 36, fat: 14 },
    ingredients: [
      '2 Large Portobello Mushroom Caps',
      '1/2 cup Cooked Black Beans & Quinoa',
      '1/2 Avocado, sliced',
      '1 tbsp Tahini Garlic Dressing',
      'Handful of Arugula & Tomato Slices'
    ],
    steps: [
      'Roast portobello mushroom caps in oven at 190°C for 10 minutes.',
      'Mash black beans and quinoa with cumin, salt, and flaxseed; form patty and grill 4 mins per side.',
      'Assemble burger using mushroom caps as buns with sliced avocado and tahini dressing.'
    ],
    tags: ['PCOS Friendly', 'High Protein', 'Fast Food Swap', 'Vegan'],
    healthBenefit: 'Provides bioavailable zinc and high fiber for natural estrogen clearance.',
    matchedJunkKeyword: 'burger'
  },
  {
    id: 103,
    title: 'Air-Fried Sweet Potato Wedges',
    category: 'Fast Food Swap',
    description: 'Crispy sweet potato wedges seasoned with sea salt, paprika, and rosemary cooked in zero oil.',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 18,
    difficulty: 'Easy',
    isPcosFriendly: true,
    nutrition: { calories: 210, protein: 4, carbohydrates: 38, fat: 5 },
    ingredients: [
      '2 Medium Sweet Potatoes',
      '1 tsp Smoked Paprika',
      '1 tsp Dried Rosemary',
      '1 tsp Extra Virgin Olive Oil',
      'Flaky Sea Salt'
    ],
    steps: [
      'Cut sweet potatoes into thick wedge shapes.',
      'Toss with olive oil, smoked paprika, rosemary, and sea salt.',
      'Air-fry at 190°C for 15-18 minutes until crispy on the outside.'
    ],
    tags: ['PCOS Friendly', 'Low Carb', 'Fast Food Swap', 'Vegan'],
    healthBenefit: 'Rich in beta-carotene and slow-release complex carbs that prevent evening cravings.',
    matchedJunkKeyword: 'fries'
  },
  {
    id: 104,
    title: 'Frozen Coconut Berry Nice-Cream',
    category: 'Fast Food Swap',
    description: 'Creamy sugar-free dessert made from blended frozen coconut cream, wild berries, and chia seeds.',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 5,
    difficulty: 'Easy',
    isPcosFriendly: true,
    nutrition: { calories: 180, protein: 5, carbohydrates: 16, fat: 10 },
    ingredients: [
      '1 cup Frozen Coconut Milk Cubes',
      '1 cup Frozen Wild Blueberries & Strawberries',
      '1 tbsp Chia Seeds',
      '1/2 tsp Vanilla Extract'
    ],
    steps: [
      'Blend frozen coconut milk cubes, frozen berries, and vanilla in a food processor until soft-serve texture.',
      'Scoop into a bowl and top with chia seeds.'
    ],
    tags: ['PCOS Friendly', 'Smoothies & Desserts', 'Fast Food Swap', 'Vegan'],
    healthBenefit: 'Dairy-free recipe prevents A1 casein inflammation and acne breakouts.',
    matchedJunkKeyword: 'ice cream'
  },

  // --- HEALTH TAILORED PCOS RECIPES ---
  {
    id: 1,
    title: 'Spiced Cinnamon Oats & Pumpkin Seeds',
    category: 'Breakfast',
    description: 'Slow-digesting steel-cut oats cooked in almond milk with cinnamon, blueberries, and zinc-dense pumpkin seeds.',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 15,
    difficulty: 'Easy',
    isPcosFriendly: true,
    nutrition: { calories: 380, protein: 18, carbohydrates: 45, fat: 14 },
    ingredients: ['Steel-cut oats', 'Unsweetened Almond Milk', 'Ceylon Cinnamon', 'Blueberries', 'Raw Pumpkin Seeds', 'Raw Honey'],
    steps: ['Simmer oats in almond milk for 12 mins.', 'Stir in cinnamon and honey.', 'Top with blueberries and seeds.'],
    tags: ['PCOS Friendly', 'High Protein', 'Anti-Inflammatory', 'Vegetarian'],
    healthBenefit: 'Cinnamon mimics insulin activity to naturally lower fasting blood sugar levels.'
  },
  {
    id: 2,
    title: 'Herb Grilled Salmon & Quinoa Bowl',
    category: 'Lunch',
    description: 'Wild salmon fillet served over fluffy quinoa, steamed broccoli, and avocado slices with tahini dressing.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 25,
    difficulty: 'Medium',
    isPcosFriendly: true,
    nutrition: { calories: 520, protein: 34, carbohydrates: 42, fat: 22 },
    ingredients: ['Salmon Fillet', 'Quinoa', 'Broccoli', 'Avocado', 'Tahini', 'Lemon'],
    steps: ['Sear salmon in skillet 4 mins per side.', 'Assemble bowl with quinoa and veggies.', 'Drizzle tahini dressing.'],
    tags: ['PCOS Friendly', 'High Protein', 'Anti-Inflammatory'],
    healthBenefit: 'High EPA/DHA omega-3 levels stabilize menstrual cycle regularity.'
  },
  {
    id: 3,
    title: 'Spinach & Tofu Scramble with Sourdough',
    category: 'Breakfast',
    description: 'Organic firm tofu scrambled with turmeric, bell peppers, baby spinach, and sourdough toast.',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 15,
    difficulty: 'Easy',
    isPcosFriendly: true,
    nutrition: { calories: 430, protein: 28, carbohydrates: 40, fat: 16 },
    ingredients: ['Firm Tofu', 'Baby Spinach', 'Bell Pepper', 'Turmeric', 'Sourdough Bread'],
    steps: ['Crumble tofu.', 'Sauté peppers and tofu with turmeric.', 'Fold in spinach and serve with sourdough toast.'],
    tags: ['PCOS Friendly', 'Low Carb', 'High Protein', 'Vegan'],
    healthBenefit: 'Phytoestrogens modulate natural estrogen receptors softly.'
  },
  {
    id: 4,
    title: 'Greek Chickpea & Feta Power Salad',
    category: 'Lunch',
    description: 'Chickpeas tossed with cucumbers, cherry tomatoes, Kalamata olives, and crumbled feta cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 15,
    difficulty: 'Easy',
    isPcosFriendly: true,
    nutrition: { calories: 470, protein: 22, carbohydrates: 50, fat: 18 },
    ingredients: ['Chickpeas', 'Cucumber', 'Cherry Tomatoes', 'Feta Cheese', 'Olive Oil', 'Oregano'],
    steps: ['Combine chickpeas and chopped veggies.', 'Whisk olive oil and lemon dressing.', 'Top with feta cheese.'],
    tags: ['PCOS Friendly', 'Anti-Inflammatory', 'Vegetarian'],
    healthBenefit: 'High dietary fiber slows down glucose absorption to control craving spikes.'
  },
  {
    id: 5,
    title: 'Garlic Herb Chicken & Asparagus Platter',
    category: 'Dinner',
    description: 'Lean chicken breast roasted with garlic, asparagus, zucchini, and sweet potato cubes.',
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 30,
    difficulty: 'Medium',
    isPcosFriendly: true,
    nutrition: { calories: 480, protein: 38, carbohydrates: 35, fat: 18 },
    ingredients: ['Chicken Breast', 'Sweet Potato', 'Asparagus', 'Zucchini', 'Olive Oil', 'Garlic'],
    steps: ['Roast sweet potato & asparagus in oven.', 'Pan-grill chicken breast.', 'Serve together hot.'],
    tags: ['PCOS Friendly', 'High Protein', 'Low Carb'],
    healthBenefit: 'Promotes deep night-time muscular recovery and stable resting metabolic rate.'
  },
  {
    id: 6,
    title: 'Matcha Green Tea Avocado Smoothie',
    category: 'Smoothies & Desserts',
    description: 'Metabolism-boosting organic matcha blended with creamy avocado, spinach, and protein powder.',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    cookingTimeMinutes: 5,
    difficulty: 'Easy',
    isPcosFriendly: true,
    nutrition: { calories: 290, protein: 20, carbohydrates: 18, fat: 14 },
    ingredients: ['1 tsp Matcha Powder', '1/2 Avocado', '1 cup Spinach', '1 scoop Plant Protein', 'Almond Milk'],
    steps: ['Combine all ingredients in a blender.', 'Blend on high speed for 60 seconds until creamy.'],
    tags: ['PCOS Friendly', 'Smoothies & Desserts', 'High Protein', 'Vegan'],
    healthBenefit: 'EGCG in matcha boosts thermogenesis and helps clear liver detoxification pathways.'
  }
];

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(COMPREHENSIVE_RECIPES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<number[]>([]);
  const [userHealthStatus, setUserHealthStatus] = useState<{ riskCategory: string; riskPercentage: number } | null>(null);

  const tags = ['All', 'PCOS Friendly', 'Low Carb', 'High Protein', 'Anti-Inflammatory', 'Fast Food Swap', 'Smoothies & Desserts', 'Vegetarian', 'Vegan'];

  useEffect(() => {
    // Read health status from authentic user-scoped assessment state
    const data = getLatestAssessmentData();
    if (data) {
      setUserHealthStatus({
        riskCategory: data.riskCategory || 'Low Risk',
        riskPercentage: data.riskPercentage || 0,
      });
    } else {
      setUserHealthStatus(null);
    }

    const storedBookmarks = localStorage.getItem('bookmarkedRecipes');
    if (storedBookmarks) {
      setSavedRecipes(JSON.parse(storedBookmarks));
    }
  }, []);

  const handleToggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (savedRecipes.includes(id)) {
      updated = savedRecipes.filter((rid) => rid !== id);
    } else {
      updated = [...savedRecipes, id];
    }
    setSavedRecipes(updated);
    localStorage.setItem('bookmarkedRecipes', JSON.stringify(updated));
  };

  // Check if search query matches any junk food keyword
  const detectedJunkKeyword = FAST_FOOD_KEYWORDS.find((kw) =>
    searchQuery.toLowerCase().includes(kw)
  );

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.matchedJunkKeyword && searchQuery.toLowerCase().includes(r.matchedJunkKeyword));

    if (selectedTag === 'All') return matchesSearch;
    return matchesSearch && r.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
  });

  return (
    <div className="w-full max-w-full space-y-6 pb-20 animate-fade-in">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-purple-100/80 px-3 py-1 rounded-full">
            Health Tailored Kitchen
          </span>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 pt-1">
            PCOS Recipes & Low-GI Meal Library
          </h2>
        </div>
        <span className="text-xs font-black text-brand-pinkdark bg-pink-100/80 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
          <Bookmark size={14} className="fill-brand-pinkdark" />
          {savedRecipes.length} Saved Recipes
        </span>
      </div>

      {/* HEALTH STATUS PERSONALIZATION BANNER */}
      {userHealthStatus && (
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white rounded-[2.5rem] border border-purple-100/80 shadow-xs p-6 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-black">
              <Sparkles size={14} className="text-brand-pinkdark" />
              Tailored for Your Health Assessment
            </span>
            <span className="text-xs font-black text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
              Risk: {userHealthStatus.riskCategory} ({userHealthStatus.riskPercentage}%)
            </span>
          </div>

          <h3 className="font-extrabold text-base text-gray-900">Anti-Inflammatory & Hormonal Balance Meal Library</h3>
          <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
            All recipes are formulated with complex fiber and lean proteins to keep blood sugar stable, prevent insulin spikes, and support estrogen detox naturally.
          </p>
        </div>
      )}

      {/* SEARCH AND FAST FOOD SWAP WARNING SYSTEM */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, ingredients, or type 'pizza', 'burger', 'momos'..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-2xs"
          />
        </div>

        {/* JUNK FOOD ALTERNATIVE WARNING BANNER */}
        {detectedJunkKeyword && (
          <div className="p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white rounded-3xl shadow-md space-y-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-100" />
              <h4 className="font-black text-sm text-white">
                Craving "{detectedJunkKeyword.toUpperCase()}"? Here's your healthier alternative!
              </h4>
            </div>
            <p className="text-xs text-amber-100 leading-relaxed font-medium">
              Standard {detectedJunkKeyword} contains refined flour and seed oils that trigger insulin spikes and PCOS flare-ups. We found some delicious, hormone-friendly swaps below!
            </p>
          </div>
        )}

        {/* CATEGORY TAG PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-brand/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* RECIPE GRID (RESPONSIVE 4 COLUMNS ON DESKTOP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full bg-brand-pastel border border-brand-light p-6 rounded-3xl text-center space-y-2">
            <ChefHat className="mx-auto text-brand" size={32} />
            <p className="text-xs font-bold text-brand-text">No matching recipes found</p>
            <p className="text-[10px] text-brand-muted">Try clearing your search or selecting a different category tag.</p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => {
            const isBookmarked = savedRecipes.includes(recipe.id);
            return (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="glass rounded-[2rem] border border-white/50 shadow-soft p-5 space-y-3 cursor-pointer hover:shadow-card transition-all duration-300 relative group overflow-hidden"
              >
                {/* Header info */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-brand uppercase tracking-widest bg-brand/5 px-2.5 py-0.5 rounded-full border border-brand-light">
                    {recipe.category} • {recipe.difficulty}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-brand-muted font-bold flex items-center gap-1">
                      <Clock size={12} /> {recipe.cookingTimeMinutes} mins
                    </span>
                    <button
                      onClick={(e) => handleToggleBookmark(recipe.id, e)}
                      className="p-1 text-brand-muted hover:text-brand"
                    >
                      <Bookmark size={16} className={isBookmarked ? 'fill-brand text-brand' : ''} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-brand-text group-hover:text-brand transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                    {recipe.description}
                  </p>
                </div>

                {/* Health Benefit Badge */}
                {recipe.healthBenefit && (
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[10px] text-emerald-800 flex items-center gap-2">
                    <Sparkles size={12} className="text-emerald-600 shrink-0" />
                    <span className="leading-tight">{recipe.healthBenefit}</span>
                  </div>
                )}

                {/* Macros & Action */}
                <div className="pt-2 flex justify-between items-center border-t border-brand-light/40">
                  <span className="text-[11px] font-extrabold text-brand">
                    {recipe.nutrition.calories} kcal | P: {recipe.nutrition.protein}g C: {recipe.nutrition.carbohydrates}g
                  </span>

                  <button className="px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-dark transition-all duration-300">
                    Cook Recipe
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* FULL RECIPE COOKING DRAWER / MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-5 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-brand-pastel hover:bg-brand-light text-brand-muted hover:text-brand transition-all duration-300"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full">
                {selectedRecipe.category} • {selectedRecipe.difficulty}
              </span>
              <h3 className="text-xl font-black text-brand-text leading-tight">{selectedRecipe.title}</h3>
              <div className="flex items-center gap-4 text-xs text-brand-muted pt-1">
                <span className="flex items-center gap-1 font-semibold"><Clock size={14} /> {selectedRecipe.cookingTimeMinutes} Mins</span>
                <span className="flex items-center gap-1 font-semibold"><Flame size={14} className="text-brand-pinkdark" /> {selectedRecipe.nutrition.calories} kcal</span>
              </div>
            </div>

            {/* Macros summary box */}
            <div className="grid grid-cols-3 gap-2 bg-brand-pastel/50 p-3 rounded-2xl border border-brand-light text-center">
              <div>
                <span className="block text-[9px] text-brand-muted font-bold">Protein</span>
                <span className="text-xs font-black text-brand-pinkdark">{selectedRecipe.nutrition.protein}g</span>
              </div>
              <div>
                <span className="block text-[9px] text-brand-muted font-bold">Carbs</span>
                <span className="text-xs font-black text-amber-600">{selectedRecipe.nutrition.carbohydrates}g</span>
              </div>
              <div>
                <span className="block text-[9px] text-brand-muted font-bold">Fats</span>
                <span className="text-xs font-black text-emerald-600">{selectedRecipe.nutrition.fat}g</span>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-brand-text">Ingredients Needed</h4>
              <ul className="space-y-2">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-brand-muted flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Directions */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-brand-text">Cooking Steps</h4>
              <div className="space-y-3">
                {selectedRecipe.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs text-brand-muted">
                    <span className="h-5 w-5 rounded-full bg-brand text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-light flex justify-between items-center">
              <button
                onClick={(e) => handleToggleBookmark(selectedRecipe.id, e)}
                className="px-4 py-2 bg-brand-pastel border border-brand-light text-brand font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Bookmark size={14} className={savedRecipes.includes(selectedRecipe.id) ? 'fill-brand' : ''} />
                <span>{savedRecipes.includes(selectedRecipe.id) ? 'Saved' : 'Save Recipe'}</span>
              </button>

              <button
                onClick={() => setSelectedRecipe(null)}
                className="px-5 py-2 bg-brand text-white font-bold text-xs rounded-xl"
              >
                Done Cooking
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Recipes;
