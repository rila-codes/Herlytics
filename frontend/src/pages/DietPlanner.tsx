import React, { useState } from 'react';
import { 
  Utensils, Calendar, Clock, Sparkles, BookOpen, ShoppingBag, 
  ChevronRight, Star, MapPin, CheckCircle, X, ArrowRight, 
  Flame, HeartPulse, Apple, Search, ExternalLink, ShieldCheck, Truck, Store
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { hasCompletedAssessment } from '../utils/assessmentState';

interface RestaurantOption {
  id: string;
  name: string;
  platform: 'Swiggy' | 'Zomato' | 'EatFit';
  rating: number;
  deliveryTime: string;
  price: number;
  dishName: string;
  distance: string;
}

interface Meal {
  type: string;
  name: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  ingredients: string[];
  steps: string[];
  healthBenefit: string;
  restaurantOptions: RestaurantOption[];
}

interface DayPlan {
  day: string;
  shortDay: string;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  meals: Meal[];
}

const WEEKLY_DIET_DATA: DayPlan[] = [
  {
    day: 'Monday',
    shortDay: 'Mon',
    targetCalories: 1800,
    proteinGrams: 95,
    carbsGrams: 150,
    fatGrams: 65,
    meals: [
      {
        type: 'Breakfast',
        name: 'Spiced Cinnamon Oats with Pumpkin Seeds & Berries',
        description: 'Slow-digesting steel-cut oats cooked in almond milk, topped with cinnamon, blueberries, and zinc-rich pumpkin seeds.',
        cookingTime: '15 mins',
        difficulty: 'Easy',
        nutrition: { calories: 380, protein: 18, carbohydrates: 45, fat: 14 },
        ingredients: [
          '1/2 cup Steel-cut Oats',
          '1 cup Unsweetened Almond Milk',
          '1 tsp Ceylon Cinnamon',
          '1/4 cup Fresh Blueberries',
          '2 tbsp Pumpkin Seeds',
          '1 tsp Raw Honey'
        ],
        steps: [
          'Simmer steel-cut oats in almond milk over medium heat for 10-12 minutes until soft.',
          'Stir in Ceylon cinnamon and raw honey.',
          'Transfer to a bowl and top with fresh blueberries and raw pumpkin seeds.'
        ],
        healthBenefit: 'Low GI carb base stabilizes morning insulin and prevents mid-day sugar spikes.',
        restaurantOptions: [
          {
            id: 'e1',
            name: 'EatFit Healthy Kitchen',
            platform: 'Swiggy',
            rating: 4.8,
            deliveryTime: '20-25 mins',
            price: 199,
            dishName: 'Cinnamon Oats & Seed Superbowl',
            distance: '1.8 km'
          },
          {
            id: 'e2',
            name: 'NutriKitchen Bowls',
            platform: 'Zomato',
            rating: 4.7,
            deliveryTime: '15-20 mins',
            price: 180,
            dishName: 'Almond Berry Oats Jar',
            distance: '2.2 km'
          },
          {
            id: 'e3',
            name: 'FreshMenu Wellness',
            platform: 'EatFit',
            rating: 4.6,
            deliveryTime: '25-30 mins',
            price: 210,
            dishName: 'Steel-Cut Oats Power Breakfast',
            distance: '3.0 km'
          }
        ]
      },
      {
        type: 'Lunch',
        name: 'Quinoa & Herb Salmon Bowl with Avocado',
        description: 'Pan-seared wild salmon served over warm quinoa, steamed broccoli florets, and sliced avocado with lemon tahini dressing.',
        cookingTime: '25 mins',
        difficulty: 'Medium',
        nutrition: { calories: 520, protein: 34, carbohydrates: 42, fat: 22 },
        ingredients: [
          '150g Wild Salmon Fillet',
          '1/2 cup Cooked Quinoa',
          '1 cup Steamed Broccoli',
          '1/2 Fresh Avocado',
          '1 tbsp Tahini & Lemon Juice'
        ],
        steps: [
          'Season salmon with salt, pepper, and lemon juice.',
          'Sear salmon in a skillet with 1 tsp olive oil for 4 mins on each side.',
          'Assemble bowl with quinoa, steamed broccoli, and avocado slices.',
          'Drizzle tahini lemon dressing over top.'
        ],
        healthBenefit: 'Rich in Omega-3 fatty acids to reduce systemic inflammation and support ovulation.',
        restaurantOptions: [
          {
            id: 'l1',
            name: 'Salad Days - Healthy Bowls',
            platform: 'Zomato',
            rating: 4.9,
            deliveryTime: '25-30 mins',
            price: 380,
            dishName: 'Herb Grilled Salmon & Quinoa Power Bowl',
            distance: '2.1 km'
          },
          {
            id: 'l2',
            name: 'Green Gourmet Bistro',
            platform: 'Swiggy',
            rating: 4.8,
            deliveryTime: '30-35 mins',
            price: 360,
            dishName: 'Pan-Seared Salmon Quinoa Salad',
            distance: '3.5 km'
          },
          {
            id: 'l3',
            name: 'Copper Chimney Health',
            platform: 'Zomato',
            rating: 4.7,
            deliveryTime: '25 mins',
            price: 410,
            dishName: 'Tahini Salmon & Avocado Bowl',
            distance: '2.8 km'
          }
        ]
      },
      {
        type: 'Afternoon Snack',
        name: 'Greek Yogurt with Flaxseeds & Walnuts',
        description: 'Unsweetened probiotic Greek yogurt topped with crushed walnuts and ground flaxseeds.',
        cookingTime: '5 mins',
        difficulty: 'Easy',
        nutrition: { calories: 220, protein: 15, carbohydrates: 18, fat: 8 },
        ingredients: [
          '150g Plain Unsweetened Greek Yogurt',
          '1 tbsp Ground Flaxseed',
          '4-5 Walnut halves',
          'Pinch of Cinnamon'
        ],
        steps: [
          'Scoop Greek yogurt into a small bowl.',
          'Mix in ground flaxseed and top with walnuts.'
        ],
        healthBenefit: 'Lignans in flaxseed help bind and remove excess circulating estrogens.',
        restaurantOptions: [
          {
            id: 's1',
            name: 'NutriKitchen Bowls',
            platform: 'Swiggy',
            rating: 4.7,
            deliveryTime: '15-20 mins',
            price: 149,
            dishName: 'Probiotic Berry Yogurt Parfait',
            distance: '1.5 km'
          },
          {
            id: 's2',
            name: 'EatFit Healthy Kitchen',
            platform: 'EatFit',
            rating: 4.8,
            deliveryTime: '20 mins',
            price: 159,
            dishName: 'Greek Yogurt & Flax Seed Tub',
            distance: '2.0 km'
          }
        ]
      },
      {
        type: 'Dinner',
        name: 'Garlic Herb Chicken with Roasted Vegetables',
        description: 'Lean chicken breast roasted with garlic, asparagus, zucchini, and sweet potato cubes.',
        cookingTime: '30 mins',
        difficulty: 'Medium',
        nutrition: { calories: 480, protein: 38, carbohydrates: 35, fat: 18 },
        ingredients: [
          '180g Chicken Breast',
          '1/2 cup Sweet Potato Cubes',
          '6-8 Asparagus Spears',
          '1 Zucchini, sliced',
          '1 tbsp Extra Virgin Olive Oil',
          'Garlic & Rosemary'
        ],
        steps: [
          'Toss sweet potato, zucchini, and asparagus in olive oil and minced garlic.',
          'Roast in preheated oven at 200°C for 20 minutes.',
          'Pan-grill seasoned chicken breast for 6-8 mins per side until internal temp reaches 75°C.',
          'Serve chicken alongside oven-roasted greens.'
        ],
        healthBenefit: 'High protein content promotes satiety and hormone balance before sleep.',
        restaurantOptions: [
          {
            id: 'd1',
            name: 'Green Gourmet Bistro',
            platform: 'Zomato',
            rating: 4.8,
            deliveryTime: '30-35 mins',
            price: 320,
            dishName: 'Rosemary Garlic Chicken & Veggie Platter',
            distance: '3.1 km'
          },
          {
            id: 'd2',
            name: 'Subway Fresh Choice',
            platform: 'Swiggy',
            rating: 4.6,
            deliveryTime: '20-25 mins',
            price: 290,
            dishName: 'Roasted Garlic Chicken & Asparagus Bowl',
            distance: '1.9 km'
          },
          {
            id: 'd3',
            name: 'Copper Chimney Health',
            platform: 'Zomato',
            rating: 4.7,
            deliveryTime: '35 mins',
            price: 350,
            dishName: 'Herb Grilled Chicken Breast with Sweet Potato',
            distance: '4.0 km'
          }
        ]
      }
    ]
  },
  {
    day: 'Tuesday',
    shortDay: 'Tue',
    targetCalories: 1750,
    proteinGrams: 90,
    carbsGrams: 145,
    fatGrams: 62,
    meals: [
      {
        type: 'Breakfast',
        name: 'Chia Seed Pudding with Berry Compote',
        description: 'Overnight chia seeds soaked in coconut milk with homemade sugar-free raspberry compote.',
        cookingTime: '10 mins (Prep)',
        difficulty: 'Easy',
        nutrition: { calories: 340, protein: 12, carbohydrates: 38, fat: 14 },
        ingredients: [
          '3 tbsp Chia Seeds',
          '1 cup Coconut Milk',
          '1/2 tsp Vanilla Extract',
          '1/2 cup Raspberries',
          '1 tbsp Sliced Almonds'
        ],
        steps: [
          'Whisk chia seeds, vanilla extract, and coconut milk together in a jar.',
          'Refrigerate for at least 4 hours or overnight.',
          'Top with warm crushed raspberries and sliced almonds before serving.'
        ],
        healthBenefit: 'Soluble fiber in chia seeds regulates bowel regularity and clears excess hormones.',
        restaurantOptions: [
          {
            id: 't1',
            name: 'EatFit Healthy Kitchen',
            platform: 'EatFit',
            rating: 4.8,
            deliveryTime: '20 mins',
            price: 179,
            dishName: 'Overnight Chia Berry Parfait',
            distance: '1.8 km'
          },
          {
            id: 't2',
            name: 'Salad Days - Healthy Bowls',
            platform: 'Swiggy',
            rating: 4.9,
            deliveryTime: '25 mins',
            price: 190,
            dishName: 'Coconut Chia Berry Superfood Jar',
            distance: '2.5 km'
          }
        ]
      },
      {
        type: 'Lunch',
        name: 'Spinach & Tofu Scramble with Whole-Grain Toast',
        description: 'Crumbled firm tofu scrambled with turmeric, baby spinach, bell peppers, and sourdough toast.',
        cookingTime: '15 mins',
        difficulty: 'Easy',
        nutrition: { calories: 430, protein: 28, carbohydrates: 40, fat: 16 },
        ingredients: [
          '200g Organic Firm Tofu',
          '1 cup Baby Spinach',
          '1/2 Red Bell Pepper',
          '1/2 tsp Turmeric & Black Pepper',
          '1 Slice Whole Grain Sourdough Bread'
        ],
        steps: [
          'Crumble firm tofu using a fork.',
          'Sauté diced bell peppers in olive oil for 3 mins, then add crumbled tofu.',
          'Stir in turmeric, black pepper, and spinach until wilted.',
          'Serve with toasted sourdough bread.'
        ],
        healthBenefit: 'Phytoestrogens in organic soy help modulate natural estrogen receptors softly.',
        restaurantOptions: [
          {
            id: 't3',
            name: 'Subway Fresh Choice',
            platform: 'Swiggy',
            rating: 4.6,
            deliveryTime: '20-25 mins',
            price: 240,
            dishName: 'Tofu & Spinach Protein Toastie',
            distance: '1.9 km'
          },
          {
            id: 't4',
            name: 'NutriKitchen Bowls',
            platform: 'Zomato',
            rating: 4.8,
            deliveryTime: '25 mins',
            price: 260,
            dishName: 'Turmeric Tofu Scramble & Sourdough',
            distance: '2.4 km'
          }
        ]
      },
      {
        type: 'Afternoon Snack',
        name: 'Handful of Dry-Roasted Spiced Almonds & Green Tea',
        description: 'Slow-roasted almonds with sea salt paired with metabolism-boosting matcha green tea.',
        cookingTime: '2 mins',
        difficulty: 'Easy',
        nutrition: { calories: 190, protein: 7, carbohydrates: 8, fat: 15 },
        ingredients: ['20 Raw Almonds', 'Sea Salt', 'Organic Matcha Green Tea'],
        steps: ['Toast almonds lightly.', 'Brew matcha green tea.'],
        healthBenefit: 'Magnesium in almonds helps reduce menstrual cramping.',
        restaurantOptions: [
          {
            id: 't5',
            name: 'Chaayos Healthy Snacks',
            platform: 'Zomato',
            rating: 4.7,
            deliveryTime: '15 mins',
            price: 120,
            dishName: 'Roasted Masala Almonds & Matcha Tea',
            distance: '1.2 km'
          }
        ]
      },
      {
        type: 'Dinner',
        name: 'Baked Sea Bass with Lemon Asparagus',
        description: 'Tender sea bass fillet baked with fresh dill, lemon zest, and grilled asparagus spears.',
        cookingTime: '25 mins',
        difficulty: 'Medium',
        nutrition: { calories: 460, protein: 40, carbohydrates: 25, fat: 18 },
        ingredients: ['Sea Bass Fillet', 'Asparagus', 'Lemon', 'Olive Oil', 'Dill'],
        steps: ['Bake sea bass at 190°C for 18 mins with lemon and dill.', 'Serve with grilled asparagus.'],
        healthBenefit: 'Selenium & iodine support thyroid gland function and metabolic health.',
        restaurantOptions: [
          {
            id: 't6',
            name: 'The Fish & Grill Co.',
            platform: 'Zomato',
            rating: 4.9,
            deliveryTime: '30 mins',
            price: 450,
            dishName: 'Baked Herb Sea Bass & Asparagus',
            distance: '3.2 km'
          },
          {
            id: 't7',
            name: 'Green Gourmet Bistro',
            platform: 'Swiggy',
            rating: 4.8,
            deliveryTime: '35 mins',
            price: 420,
            dishName: 'Lemon Herb Baked White Fish',
            distance: '3.8 km'
          }
        ]
      }
    ]
  }
];

const DietPlanner: React.FC = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'chart' | 'recipes' | 'delivery'>('chart');
  
  // Modals / Drawers State
  const [selectedRecipeMeal, setSelectedRecipeMeal] = useState<Meal | null>(null);
  const [selectedOrderMeal, setSelectedOrderMeal] = useState<Meal | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantOption | null>(null);
  
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderStep, setOrderStep] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const currentDayPlan = WEEKLY_DIET_DATA[selectedDayIndex] || WEEKLY_DIET_DATA[0];

  const handleOpenOrderModal = (meal: Meal) => {
    setSelectedOrderMeal(meal);
    setSelectedRestaurant(meal.restaurantOptions[0]); // Select first restaurant by default
    setOrderPlaced(false);
    setOrderStep(1);
  };

  const handleSimulateOrder = () => {
    setOrderStep(2);
    setTimeout(() => {
      setOrderStep(3);
      setOrderPlaced(true);
    }, 2000);
  };

  const resetOrderModal = () => {
    setSelectedOrderMeal(null);
    setSelectedRestaurant(null);
    setOrderPlaced(false);
    setOrderStep(1);
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-20 animate-fade-in">
      
      {/* Top Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-purple-100/80 px-3 py-1 rounded-full">
            PCOS & Hormonal Wellness
          </span>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 pt-1">
            Diet & Nutrition Hub
          </h1>
        </div>
        <div className="p-3 bg-brand/10 text-brand rounded-2xl">
          <Utensils size={22} />
        </div>
      </div>

      {/* Main 3-Tab Selector Bar (Diet Chart | Recipes | Food Delivery) */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-brand-pastel/60 border border-brand-light rounded-2xl shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveTab('chart')}
          className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
            activeTab === 'chart'
              ? 'bg-brand text-white shadow-md'
              : 'text-brand-muted hover:text-brand hover:bg-white/60'
          }`}
        >
          <Calendar size={14} />
          <span>Diet Chart</span>
        </button>

        <button
          onClick={() => setActiveTab('recipes')}
          className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
            activeTab === 'recipes'
              ? 'bg-brand text-white shadow-md'
              : 'text-brand-muted hover:text-brand hover:bg-white/60'
          }`}
        >
          <BookOpen size={14} />
          <span>Recipes</span>
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
            activeTab === 'delivery'
              ? 'bg-brand text-white shadow-md'
              : 'text-brand-muted hover:text-brand hover:bg-white/60'
          }`}
        >
          <Truck size={14} />
          <span>Order Food</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: 7-DAY DIET CHART VIEW                                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'chart' && !hasCompletedAssessment() ? (
        <div className="glass rounded-[2.5rem] border border-brand-light p-8 text-center space-y-4 shadow-card animate-fade-in">
          <div className="w-16 h-16 bg-purple-100 text-brand rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
            🔒
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-black text-gray-900">Personalized Diet Chart Locked</h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Complete your wellness assessment to unlock your personalized anti-inflammatory 7-day meal schedule.
            </p>
          </div>
          <Link to="/assessment" className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-black text-xs rounded-xl shadow-md hover:bg-brand-dark transition-all">
            <span>Start Assessment (5–7 mins)</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : activeTab === 'chart' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* 7-Day Day Selector Buttons */}
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-brand-muted block mb-2">Select Day of Week</span>
            <div className="grid grid-cols-7 gap-1 bg-white/70 p-1.5 rounded-2xl border border-brand-light shadow-sm">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((shortDay, index) => {
                const isSelected = selectedDayIndex === index;
                return (
                  <button
                    key={shortDay}
                    onClick={() => setSelectedDayIndex(Math.min(index, WEEKLY_DIET_DATA.length - 1))}
                    className={`py-2.5 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'bg-brand text-white font-extrabold shadow-md scale-105'
                        : 'text-brand-muted hover:bg-brand-pastel/50 font-semibold'
                    }`}
                  >
                    <span className="text-[10px]">{shortDay}</span>
                    <span className="text-[9px] opacity-75 mt-0.5">{index + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Day Title & Overview Banner */}
          <div className="glass rounded-[2.5rem] border border-white/50 shadow-card p-6 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-brand-pink/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-extrabold">
                  <Sparkles size={12} className="text-brand-pinkdark" />
                  <span>{currentDayPlan.day}'s Personalized Routine</span>
                </span>
                <span className="text-xs font-black text-brand-pinkdark bg-brand-pink/20 px-2.5 py-1 rounded-full">
                  Day {selectedDayIndex + 1} of 7
                </span>
              </div>
              
              <h3 className="text-lg font-black text-brand-text leading-tight">PCOS Anti-Inflammatory Meal Plan</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Targeted for low-GI carbohydrate absorption, reducing systemic inflammation, and stabilizing blood sugar.
              </p>
            </div>
          </div>

          {/* Daily Macros Target Panel */}
          <div className="glass rounded-[2rem] border border-white/50 shadow-soft p-5">
            <h4 className="font-extrabold text-xs text-brand-text uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Flame size={14} className="text-brand-pinkdark" />
              <span>Day {selectedDayIndex + 1} Macro Targets</span>
            </h4>
            
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-brand-pastel/40 p-3 rounded-2xl border border-brand-light">
                <span className="block text-[9px] text-brand-muted font-bold">Calories</span>
                <span className="text-sm font-black text-brand">{currentDayPlan.targetCalories}</span>
                <span className="block text-[8px] text-brand-muted mt-0.5">kcal</span>
              </div>

              <div className="bg-brand-pastel/40 p-3 rounded-2xl border border-brand-light">
                <span className="block text-[9px] text-brand-muted font-bold">Protein</span>
                <span className="text-sm font-black text-brand-pinkdark">{currentDayPlan.proteinGrams}g</span>
                <span className="block text-[8px] text-brand-muted mt-0.5">Build/Repair</span>
              </div>

              <div className="bg-brand-pastel/40 p-3 rounded-2xl border border-brand-light">
                <span className="block text-[9px] text-brand-muted font-bold">Carbs</span>
                <span className="text-sm font-black text-amber-600">{currentDayPlan.carbsGrams}g</span>
                <span className="block text-[8px] text-brand-muted mt-0.5">Low-GI</span>
              </div>

              <div className="bg-brand-pastel/40 p-3 rounded-2xl border border-brand-light">
                <span className="block text-[9px] text-brand-muted font-bold">Fats</span>
                <span className="text-sm font-black text-emerald-600">{currentDayPlan.fatGrams}g</span>
                <span className="block text-[8px] text-brand-muted mt-0.5">Healthy Fat</span>
              </div>
            </div>
          </div>

          {/* Meals List for Current Selected Day */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-brand-text flex items-center justify-between">
              <span>{currentDayPlan.day}'s Meal Schedule</span>
              <span className="text-[11px] font-extrabold text-brand bg-purple-50 px-3 py-1 rounded-full">4 Meals Planned</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {currentDayPlan.meals.map((meal, idx) => (
              <div key={idx} className="glass rounded-[2rem] border border-white/50 shadow-soft p-5 space-y-4 hover:shadow-card transition-all duration-300">
                
                {/* Meal Header */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/5 px-2.5 py-1 rounded-full border border-brand-light">
                    {meal.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-brand-muted flex items-center gap-1">
                      <Clock size={12} /> {meal.cookingTime}
                    </span>
                    <span className="text-[10px] font-extrabold text-brand-pinkdark bg-brand-pink/20 px-2 py-0.5 rounded-full">
                      {meal.nutrition.calories} kcal
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="font-extrabold text-sm text-brand-text">{meal.name}</h5>
                  <p className="text-xs text-brand-muted leading-relaxed mt-1">{meal.description}</p>
                </div>

                {/* Restaurant Options Count Indicator */}
                <div className="flex items-center justify-between p-3 bg-brand-light/30 border border-brand-light/60 rounded-xl text-[10px]">
                  <div className="flex items-center gap-1.5 text-brand-dark">
                    <ShieldCheck size={14} className="text-brand shrink-0" />
                    <span><strong>Health Benefit:</strong> {meal.healthBenefit}</span>
                  </div>
                </div>

                {/* Action Buttons: View Recipe & Order Food */}
                <div className="pt-2 border-t border-brand-light/40 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedRecipeMeal(meal)}
                    className="py-2.5 px-3 bg-white border border-brand-light hover:bg-brand-pastel rounded-xl font-bold text-xs text-brand flex items-center justify-center gap-1.5 shadow-sm transition-all duration-300"
                  >
                    <BookOpen size={14} />
                    <span>View Recipe</span>
                  </button>

                  <button
                    onClick={() => handleOpenOrderModal(meal)}
                    className="py-2.5 px-3 bg-brand hover:bg-brand-dark text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all duration-300"
                  >
                    <Truck size={14} />
                    <span>Order ({meal.restaurantOptions.length} Places)</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: RECIPE LIBRARY VIEW                                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'recipes' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="space-y-2">
            <h3 className="text-lg font-black text-brand-text">PCOS Recipe Library</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Explore easy-to-cook, anti-inflammatory dishes specifically designed for hormonal balance.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 text-brand-muted" size={16} />
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-brand-light rounded-2xl text-xs text-brand-text focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-sm"
            />
          </div>

          {/* Recipes Cards List */}
          <div className="space-y-4">
            {WEEKLY_DIET_DATA.flatMap((d) => d.meals)
              .filter((m) => m.name.toLowerCase().includes(searchFilter.toLowerCase()) || m.description.toLowerCase().includes(searchFilter.toLowerCase()))
              .map((meal, index) => (
                <div key={index} className="glass rounded-[2rem] border border-white/50 shadow-soft p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-brand bg-brand-pink/20 px-2.5 py-0.5 rounded-full">
                      {meal.type} • {meal.difficulty}
                    </span>
                    <span className="text-[10px] text-brand-muted font-bold flex items-center gap-1">
                      <Clock size={12} /> {meal.cookingTime}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-brand-text">{meal.name}</h4>
                  <p className="text-xs text-brand-muted leading-relaxed">{meal.description}</p>

                  <div className="pt-2 flex justify-between items-center border-t border-brand-light/40">
                    <span className="text-[11px] font-extrabold text-brand">
                      {meal.nutrition.calories} kcal | P: {meal.nutrition.protein}g C: {meal.nutrition.carbohydrates}g
                    </span>
                    
                    <button
                      onClick={() => setSelectedRecipeMeal(meal)}
                      className="px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl shadow-sm hover:bg-brand-dark transition-all duration-300"
                    >
                      Cook Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: ORDER HEALTHY FOOD (MULTIPLE RESTAURANTS) VIEW         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'delivery' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="glass rounded-[2.5rem] border border-white/50 shadow-card p-6 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-orange-500 text-white font-extrabold text-[9px] rounded-full uppercase tracking-wider">
                Swiggy & Zomato Verified
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold text-[9px] rounded-full uppercase tracking-wider">
                Multiple Restos
              </span>
            </div>

            <h3 className="text-lg font-black text-brand-text">Multiple Healthy Restaurant Partners</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Choose from top rated healthy restaurants delivering low-GI, PCOS-friendly dishes directly to your location.
            </p>
          </div>

          {/* List of Recommended Partner Dishes for Quick Order */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-brand-text">Available Healthy Kitchen Partners</h4>

            {currentDayPlan.meals.map((meal, index) => (
              <div key={index} className="glass rounded-[2rem] border border-white/50 shadow-soft p-5 space-y-4">
                
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/5 px-2.5 py-0.5 rounded-full">
                    {meal.type}
                  </span>
                  <span className="text-[10px] text-brand-muted font-bold">
                    {meal.restaurantOptions.length} Partner Restaurants Available
                  </span>
                </div>

                <div>
                  <h5 className="font-extrabold text-sm text-brand-text">{meal.name}</h5>
                  <p className="text-xs text-brand-muted mt-0.5">{meal.description}</p>
                </div>

                {/* List of Multiple Restaurant Options for this meal */}
                <div className="space-y-2 pt-2 border-t border-brand-light/40">
                  {meal.restaurantOptions.map((resto) => (
                    <div key={resto.id} className="p-3 bg-white/80 rounded-xl border border-brand-light/70 flex justify-between items-center hover:border-brand/50 transition-all duration-300">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded text-white ${
                            resto.platform === 'Swiggy' ? 'bg-orange-500' : resto.platform === 'Zomato' ? 'bg-red-600' : 'bg-brand'
                          }`}>
                            {resto.platform}
                          </span>
                          <span className="font-extrabold text-xs text-brand-text">{resto.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-1">
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold"><Star size={10} className="fill-amber-400" /> {resto.rating}</span>
                          <span>• {resto.distance}</span>
                          <span>• {resto.deliveryTime}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-xs font-black text-brand">₹{resto.price}</span>
                        <button
                          onClick={() => {
                            setSelectedOrderMeal(meal);
                            setSelectedRestaurant(resto);
                            setOrderPlaced(false);
                            setOrderStep(1);
                          }}
                          className="mt-1 px-3 py-1 bg-brand text-white font-extrabold text-[10px] rounded-lg shadow-sm hover:bg-brand-dark"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: RECIPE DETAILS DRAWER / MODAL                        */}
      {/* ------------------------------------------------------------- */}
      {selectedRecipeMeal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedRecipeMeal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-brand-pastel hover:bg-brand-light text-brand-muted hover:text-brand transition-all duration-300"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full">
                {selectedRecipeMeal.type} • {selectedRecipeMeal.difficulty}
              </span>
              <h3 className="text-xl font-black text-brand-text leading-tight">{selectedRecipeMeal.name}</h3>
              <div className="flex items-center gap-4 text-xs text-brand-muted pt-1">
                <span className="flex items-center gap-1 font-semibold"><Clock size={14} /> {selectedRecipeMeal.cookingTime}</span>
                <span className="flex items-center gap-1 font-semibold"><Flame size={14} className="text-brand-pinkdark" /> {selectedRecipeMeal.nutrition.calories} kcal</span>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-brand-text">Ingredients Needed</h4>
              <ul className="space-y-2">
                {selectedRecipeMeal.ingredients.map((ing, i) => (
                  <li key={i} className="text-xs text-brand-muted flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Directions */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-brand-text">Cooking Steps</h4>
              <div className="space-y-3">
                {selectedRecipeMeal.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs text-brand-muted">
                    <span className="h-5 w-5 rounded-full bg-brand text-white font-extrabold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action to Order if User decides not to cook */}
            <div className="pt-4 border-t border-brand-light flex justify-between items-center">
              <span className="text-[11px] text-brand-muted">Don't want to cook?</span>
              <button
                onClick={() => {
                  const m = selectedRecipeMeal;
                  setSelectedRecipeMeal(null);
                  handleOpenOrderModal(m);
                }}
                className="px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Truck size={14} />
                <span>Order Meal ({selectedRecipeMeal.restaurantOptions.length} Places)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: SWIGGY / ZOMATO MULTI-RESTAURANT ORDERING MODAL      */}
      {/* ------------------------------------------------------------- */}
      {selectedOrderMeal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            
            <button
              onClick={resetOrderModal}
              className="absolute top-5 right-5 p-2 rounded-full bg-brand-pastel hover:bg-brand-light text-brand-muted hover:text-brand transition-all duration-300"
            >
              <X size={18} />
            </button>

            {!orderPlaced ? (
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-white font-extrabold text-[10px] rounded-md ${
                    selectedRestaurant.platform === 'Swiggy' ? 'bg-orange-500' : 'bg-red-600'
                  }`}>
                    {selectedRestaurant.platform} Express
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    PCOS Nutrition Verified
                  </span>
                </div>

                {/* Multiple Restaurant Choice Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-brand-muted uppercase tracking-wider block">Choose Restaurant Partner</span>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedOrderMeal.restaurantOptions.map((resto) => {
                      const isSelected = selectedRestaurant.id === resto.id;
                      return (
                        <div
                          key={resto.id}
                          onClick={() => setSelectedRestaurant(resto)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all duration-300 flex justify-between items-center ${
                            isSelected
                              ? 'border-brand bg-brand/5 ring-1 ring-brand'
                              : 'border-brand-light hover:bg-brand-pastel/40'
                          }`}
                        >
                          <div>
                            <span className="font-extrabold text-xs text-brand-text block">{resto.name}</span>
                            <span className="text-[10px] text-brand-muted">⭐ {resto.rating} • {resto.distance} • {resto.deliveryTime}</span>
                          </div>
                          <span className="font-black text-xs text-brand">₹{resto.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Item Box */}
                <div className="p-4 bg-brand-pastel/60 border border-brand-light rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-brand-text">{selectedRestaurant.dishName}</span>
                    <span className="font-black text-sm text-brand">₹{selectedRestaurant.price}</span>
                  </div>
                  <p className="text-[10px] text-brand-muted leading-relaxed">
                    Delivered from <strong>{selectedRestaurant.name}</strong> via {selectedRestaurant.platform}.
                  </p>
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-2 text-xs text-brand-muted border-t border-brand-light/60 pt-3">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span>₹{selectedRestaurant.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600 font-bold">FREE (Health Pass)</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-brand-text border-t border-brand-light/60 pt-2">
                    <span>To Pay</span>
                    <span className="text-brand">₹{selectedRestaurant.price + 25}</span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateOrder}
                  disabled={orderStep === 2}
                  className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-extrabold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all duration-300"
                >
                  {orderStep === 2 ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Place Order via {selectedRestaurant.platform}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Order Confirmation State */
              <div className="text-center py-6 space-y-5 animate-fade-in">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle size={36} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-brand-text">Order Confirmed!</h3>
                  <p className="text-xs text-brand-muted max-w-[260px] mx-auto leading-relaxed">
                    Your order for <strong>{selectedRestaurant.dishName}</strong> has been placed with <strong>{selectedRestaurant.name}</strong> via {selectedRestaurant.platform}.
                  </p>
                </div>

                <div className="p-4 bg-brand-pastel/60 border border-brand-light rounded-2xl space-y-2 text-left">
                  <div className="flex justify-between text-xs font-bold text-brand-text">
                    <span>Estimated Arrival:</span>
                    <span className="text-brand">{selectedRestaurant.deliveryTime}</span>
                  </div>
                  <div className="w-full bg-brand-light h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-2/3 animate-pulse" />
                  </div>
                  <span className="block text-[10px] text-brand-muted text-center pt-1">
                    👨‍🍳 Kitchen preparing your healthy meal...
                  </span>
                </div>

                <button
                  onClick={resetOrderModal}
                  className="w-full py-3 bg-brand text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Back to Diet Planner
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default DietPlanner;
