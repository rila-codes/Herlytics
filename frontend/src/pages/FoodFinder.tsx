import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Flame, ArrowRight, ExternalLink, HelpCircle, AlertCircle, ShoppingBag, ShieldCheck, Sparkles, Filter, CheckCircle, Truck, X } from 'lucide-react';

interface Alternative {
  id: string;
  keyword: string;
  category: 'Fast Food' | 'Sweets & Desserts' | 'Snacks' | 'Beverages';
  healthyName: string;
  unhealthyReason: string;
  healthyBenefit: string;
  unhealthyNutrition: string;
  healthyNutrition: string;
  swiggyUrl: string;
  zomatoUrl: string;
  restaurantPartner: {
    name: string;
    platform: 'Swiggy' | 'Zomato';
    rating: number;
    price: number;
    deliveryTime: string;
  };
}

const PRESET_ALTERNATIVES: Alternative[] = [
  {
    id: 'f1',
    keyword: 'Pizza',
    category: 'Fast Food',
    healthyName: 'Cauliflower Crust Veggie Pizza with Almond Mozzarella',
    unhealthyReason: 'Refined flour crust causes steep blood sugar spikes, driving high insulin levels and worsening ovarian androgen production.',
    healthyBenefit: 'Low-GI cauliflower base is rich in sulforaphane, helping liver enzymes filter excess circulating estrogen.',
    unhealthyNutrition: '850 kcal • 110g Carbs • 45g Fat',
    healthyNutrition: '420 kcal • 35g Carbs • 24g Protein',
    swiggyUrl: 'https://www.swiggy.com',
    zomatoUrl: 'https://www.zomato.com',
    restaurantPartner: {
      name: 'Salad Days & Fit Pizza',
      platform: 'Swiggy',
      rating: 4.9,
      price: 340,
      deliveryTime: '25 mins'
    }
  },
  {
    id: 'f2',
    keyword: 'Burger',
    category: 'Fast Food',
    healthyName: 'Portobello Mushroom & Black Bean Quinoa Burger',
    unhealthyReason: 'Commercially fried meat patties contain inflammatory trans-fats and processed sodium that trigger bloating.',
    healthyBenefit: 'Black beans provide bioavailable zinc and soluble fiber essential for hormone synthesis and satiety.',
    unhealthyNutrition: '720 kcal • 55g Fat • 85g Carbs',
    healthyNutrition: '380 kcal • 12g Fat • 28g Protein',
    swiggyUrl: 'https://www.swiggy.com',
    zomatoUrl: 'https://www.zomato.com',
    restaurantPartner: {
      name: 'EatFit Healthy Kitchen',
      platform: 'Zomato',
      rating: 4.8,
      price: 260,
      deliveryTime: '20 mins'
    }
  },
  {
    id: 'f3',
    keyword: 'Chocolate Milkshake',
    category: 'Beverages',
    healthyName: 'Raw Cacao Avocado & Protein Smoothie',
    unhealthyReason: 'Commercial milkshakes contain up to 60g of refined corn syrup, causing severe glycemic crashes.',
    healthyBenefit: 'Raw cacao delivers magnesium to soothe menstrual cramps, while avocado fats stabilize blood sugar.',
    unhealthyNutrition: '580 kcal • 65g Sugar • 22g Fat',
    healthyNutrition: '290 kcal • 4g Sugar • 18g Protein',
    swiggyUrl: 'https://www.swiggy.com',
    zomatoUrl: 'https://www.zomato.com',
    restaurantPartner: {
      name: 'NutriKitchen Smoothies',
      platform: 'Swiggy',
      rating: 4.7,
      price: 190,
      deliveryTime: '15 mins'
    }
  },
  {
    id: 'f4',
    keyword: 'French Fries',
    category: 'Snacks',
    healthyName: 'Air-Fried Sweet Potato Wedges with Rosemary',
    unhealthyReason: 'Deep-fried white potatoes in vegetable oils produce acrylamide and fuel systemic inflammation.',
    healthyBenefit: 'Sweet potatoes provide slow-release complex carbs, Vitamin A, and beta-carotene for skin clarity.',
    unhealthyNutrition: '450 kcal • 58g Carbs • 24g Fat',
    healthyNutrition: '210 kcal • 32g Carbs • 4g Fat',
    swiggyUrl: 'https://www.swiggy.com',
    zomatoUrl: 'https://www.zomato.com',
    restaurantPartner: {
      name: 'Green Gourmet Bistro',
      platform: 'Zomato',
      rating: 4.8,
      price: 180,
      deliveryTime: '20 mins'
    }
  },
  {
    id: 'f5',
    keyword: 'Ice Cream',
    category: 'Sweets & Desserts',
    healthyName: 'Frozen Coconut Berry Nice-Cream with Chia Seeds',
    unhealthyReason: 'Dairy milk ice creams combine high sugar and A1 casein milk protein which can trigger acne flare-ups.',
    healthyBenefit: 'Dairy-free coconut milk paired with antioxidant blueberries calms skin and digestive tract.',
    unhealthyNutrition: '380 kcal • 42g Sugar • 20g Fat',
    healthyNutrition: '180 kcal • 6g Natural Sugar • 6g Fiber',
    swiggyUrl: 'https://www.swiggy.com',
    zomatoUrl: 'https://www.zomato.com',
    restaurantPartner: {
      name: 'EatFit Desserts',
      platform: 'Swiggy',
      rating: 4.8,
      price: 160,
      deliveryTime: '15 mins'
    }
  },
  {
    id: 'f6',
    keyword: 'White Sauce Pasta',
    category: 'Fast Food',
    healthyName: 'Zucchini Noodle & Chickpea Pasta in Cashew Cream',
    unhealthyReason: 'Maida pasta with heavy cream creates heavy gut inflammation and sluggish digestion.',
    healthyBenefit: 'Cashew cream delivers heart-healthy fats and magnesium without dairy inflammation.',
    unhealthyNutrition: '790 kcal • 95g Carbs • 38g Fat',
    healthyNutrition: '390 kcal • 38g Carbs • 22g Protein',
    swiggyUrl: 'https://www.swiggy.com',
    zomatoUrl: 'https://www.zomato.com',
    restaurantPartner: {
      name: 'Salad Days Bowls',
      platform: 'Zomato',
      rating: 4.9,
      price: 320,
      deliveryTime: '25 mins'
    }
  },
  {
    id: 'f7',
    keyword: 'Soft Drinks / Cola',
    category: 'Beverages',
    healthyName: 'Sparkling Hibiscus & Berry Kombucha',
    unhealthyReason: 'Carbonated soda contains high fructose corn syrup and phosphoric acid that depletes bone calcium.',
    healthyBenefit: 'Probiotic kombucha supports gut microbiome diversity and natural estrogen breakdown.',
    unhealthyNutrition: '210 kcal • 54g Sugar',
    healthyNutrition: '35 kcal • 2g Sugar • Probiotics',
    swiggyUrl: 'https://www.swiggy.com',
    zomatoUrl: 'https://www.zomato.com',
    restaurantPartner: {
      name: 'Chaayos Wellness',
      platform: 'Swiggy',
      rating: 4.7,
      price: 120,
      deliveryTime: '15 mins'
    }
  },
  {
    id: 'f8',
    keyword: 'Biryani',
    category: 'Fast Food',
    healthyName: 'Quinoa & Brown Rice Herb Chicken Biryani',
    unhealthyReason: 'Excess white rice cooked in vanaspati ghee increases visceral fat storage.',
    healthyBenefit: 'Quinoa and brown rice provide high fiber and low-glycemic satiety.',
    unhealthyNutrition: '890 kcal • 115g Carbs • 38g Fat',
    healthyNutrition: '490 kcal • 52g Carbs • 36g Protein',
    swiggyUrl: 'https://www.swiggy.com',
    zomatoUrl: 'https://www.zomato.com',
    restaurantPartner: {
      name: 'Copper Chimney Health',
      platform: 'Zomato',
      rating: 4.8,
      price: 360,
      deliveryTime: '30 mins'
    }
  }
];

const FoodFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [results, setResults] = useState<Alternative[]>(PRESET_ALTERNATIVES);
  const [loading, setLoading] = useState(false);
  const [selectedOrderSwap, setSelectedOrderSwap] = useState<Alternative | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const categories = ['All', 'Fast Food', 'Sweets & Desserts', 'Snacks', 'Beverages'];

  const fetchAlternatives = async (searchVal: string, catVal: string = selectedCategory) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/food-finder/alternatives?query=${searchVal}`);
      if (res.data && res.data.length > 0) {
        setResults(res.data);
      } else {
        filterPresets(searchVal, catVal);
      }
    } catch (err) {
      filterPresets(searchVal, catVal);
    } finally {
      setLoading(false);
    }
  };

  const filterPresets = (searchVal: string, catVal: string) => {
    let filtered = PRESET_ALTERNATIVES;
    if (catVal !== 'All') {
      filtered = filtered.filter((item) => item.category === catVal);
    }
    if (searchVal.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.keyword.toLowerCase().includes(searchVal.toLowerCase()) ||
        item.healthyName.toLowerCase().includes(searchVal.toLowerCase())
      );
    }
    setResults(filtered);
  };

  useEffect(() => {
    filterPresets(query, selectedCategory);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAlternatives(query, selectedCategory);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-20 animate-fade-in">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-purple-100/80 px-3 py-1 rounded-full">
            PCOS Craving Converter
          </span>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 pt-1">
            Healthy Food Finder & Craving Alternatives
          </h2>
        </div>
        <div className="p-3 bg-brand/10 text-brand rounded-2xl">
          <ShoppingBag size={22} />
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
        Craving junk food? Tell us what you want to eat, and we will recommend a hormone-safe, low-GI alternative with direct order links! 🌸
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search size={20} className="absolute left-4 top-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            filterPresets(e.target.value, selectedCategory);
          }}
          placeholder="Type 'pizza', 'burger', 'milkshake', 'fries', 'momos'..."
          className="w-full pl-12 pr-28 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-2xs"
        />
        <button
          type="submit"
          className="absolute right-2.5 top-2.5 px-5 py-2 bg-brand text-white text-xs font-black rounded-xl hover:bg-brand-dark transition-all shadow-sm"
        >
          Find Swaps
        </button>
      </form>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-brand/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results List (RESPONSIVE 4 COLUMNS ON DESKTOP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full min-h-[30vh] flex items-center justify-center">
            <div className="h-8 w-8 border-3 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="col-span-full bg-purple-50/60 border border-purple-100 p-8 rounded-3xl text-center space-y-2">
            <HelpCircle className="mx-auto text-brand" size={32} />
            <p className="text-xs font-black text-gray-900">No matching alternatives found</p>
            <p className="text-[10px] text-gray-500 font-semibold">Try searching for common cravings like pizza, burger, fries, or ice cream.</p>
          </div>
        ) : (
          results.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-xs p-5 space-y-4 hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Craving: {item.keyword}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Healthy Swap ✓
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-gray-900 leading-snug">
                  {item.healthyName}
                </h3>

                {/* Unhealthy Warning */}
                <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl text-[11px] text-rose-900 space-y-1">
                  <div className="flex items-center gap-1 font-black text-[10px] text-rose-700">
                    <AlertCircle size={12} />
                    <span>Why Regular {item.keyword} Hurts PCOS</span>
                  </div>
                  <p className="leading-relaxed font-medium">{item.unhealthyReason}</p>
                </div>

                {/* Healthy Benefits */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-[11px] text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1 font-black text-[10px] text-emerald-700">
                    <Sparkles size={12} />
                    <span>Why This Swap Works</span>
                  </div>
                  <p className="leading-relaxed font-medium">{item.healthyBenefit}</p>
                </div>

                {/* Nutrition Comparison */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-[10px] space-y-1 font-bold">
                  <div className="flex justify-between text-rose-600">
                    <span>Unhealthy:</span>
                    <span>{item.unhealthyNutrition}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Healthy Swap:</span>
                    <span>{item.healthyNutrition}</span>
                  </div>
                </div>
              </div>

              {/* Order Partner Button */}
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="text-[10px] text-gray-500 font-semibold">
                  <span className="block">{item.restaurantPartner.name}</span>
                  <span className="font-black text-brand">₹{item.restaurantPartner.price} • {item.restaurantPartner.deliveryTime}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedOrderSwap(item);
                    setOrderConfirmed(false);
                  }}
                  className="px-4 py-2 bg-brand hover:bg-brand-dark text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Truck size={14} />
                  <span>Order</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SWAGGY / ZOMATO SWAP ORDER MODAL */}
      {selectedOrderSwap && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedOrderSwap(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-brand-pastel hover:bg-brand-light text-brand-muted hover:text-brand transition-all duration-300"
            >
              <X size={18} />
            </button>

            {!orderConfirmed ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-white font-extrabold text-[10px] rounded-md ${
                    selectedOrderSwap.restaurantPartner.platform === 'Swiggy' ? 'bg-orange-500' : 'bg-red-600'
                  }`}>
                    {selectedOrderSwap.restaurantPartner.platform} Express
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Low-GI Verified
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-brand-text">{selectedOrderSwap.healthyName}</h3>
                  <p className="text-xs text-brand-muted">Restaurant: {selectedOrderSwap.restaurantPartner.name} • {selectedOrderSwap.restaurantPartner.deliveryTime}</p>
                </div>

                <div className="p-3.5 bg-brand-pastel/60 border border-brand-light rounded-2xl space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Item Total</span>
                    <span className="text-brand font-black">₹{selectedOrderSwap.restaurantPartner.price}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-brand-muted">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                </div>

                <button
                  onClick={() => setOrderConfirmed(true)}
                  className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Confirm Order via {selectedOrderSwap.restaurantPartner.platform}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4 animate-fade-in">
                <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-lg font-black text-brand-text">Healthy Order Placed!</h3>
                <p className="text-xs text-brand-muted max-w-[260px] mx-auto">
                  Your healthy alternative order for <strong>{selectedOrderSwap.healthyName}</strong> is arriving in {selectedOrderSwap.restaurantPartner.deliveryTime}.
                </p>
                <button
                  onClick={() => setSelectedOrderSwap(null)}
                  className="w-full py-3 bg-brand text-white font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default FoodFinder;
