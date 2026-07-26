import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, BookOpen, Clock, Heart, ArrowLeft, Bookmark, Sparkles, X, ChevronRight, User, Tag } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  category: 'PCOS' | 'Nutrition' | 'Hormones' | 'Exercise' | 'Stress';
  readingTimeMinutes: number;
  imageUrl: string;
  summary: string;
  content: string[];
  createdAt: string;
}

const PRESET_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Understanding Insulin Resistance in PCOS & How to Fix It',
    category: 'PCOS',
    readingTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=600&q=80',
    summary: 'Insulin resistance affects up to 70% of women with PCOS. Discover how high blood sugar drives excess androgen production and how low-GI nutrition reverses it.',
    content: [
      'Insulin resistance occurs when your body cells become less responsive to the hormone insulin. In response, your pancreas produces increasingly higher amounts of insulin to push glucose into cells.',
      'For women with PCOS, elevated insulin levels directly stimulate the ovaries to produce excess male hormones (androgens) like testosterone. This leads to common symptoms such as irregular menstrual cycles, adult acne, hirsutism (facial hair), and androgenic hair thinning.',
      'The good news is that insulin sensitivity can be dramatically improved through dietary changes. Focusing on complex carbohydrates, adequate bioavailable protein, and healthy omega-3 fats prevents insulin spikes and allows hormonal regulation.'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'The Seed Cycling Method for Natural Phase-by-Phase Balance',
    category: 'Hormones',
    readingTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80',
    summary: 'Learn how integrating specific raw seeds during your Follicular and Luteal phases supports natural estrogen and progesterone balance.',
    content: [
      'Seed cycling is a holistic dietary practice that involves consuming specific seeds during the two primary phases of your menstrual cycle to support balanced hormone production.',
      'Days 1-14 (Follicular Phase): Eat 1 tablespoon of raw ground pumpkin seeds and flaxseeds daily. Flaxseeds contain lignans that bind to excess circulating estrogens, while pumpkin seeds provide zinc needed for progesterone synthesis.',
      'Days 15-28 (Luteal Phase): Switch to 1 tablespoon of raw ground sesame seeds and sunflower seeds daily. Sesame seeds contain lignans to prevent excess estrogen buildup, while sunflower seeds provide selenium and Vitamin E to boost progesterone.'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Low-Impact Exercise vs. High Cortisol Cardio in Women',
    category: 'Exercise',
    readingTimeMinutes: 6,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    summary: 'Why chronic high-intensity cardio can spike cortisol and worsen fat storage, and why strength training and Pilates yield superior hormonal outcomes.',
    content: [
      'While exercise is vital for metabolic health, excessive high-intensity interval training (HIIT) or prolonged cardio without adequate recovery can trigger chronic cortisol elevation.',
      'Cortisol, your body main stress hormone, competes with progesterone for receptor sites and can worsen insulin resistance, leading to stubborn abdominal fat accumulation and fatigue.',
      'Switching to slow, weighted strength training, resistance work, Pilates, and brisk outdoor walking builds lean muscle mass to absorb glucose while keeping stress hormones low.'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Anti-Inflammatory Nutrition: The Complete Low-GI Blueprint',
    category: 'Nutrition',
    readingTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
    summary: 'A step-by-step guide to removing inflammatory seed oils, refined sugars, and processing agents to restore gut microbiome health.',
    content: [
      'Chronic low-grade inflammation is a core driver of PCOS, endometriosis, and thyroid dysfunction. Eliminating ultra-processed foods reduces inflammatory cytokine production.',
      'Prioritize dark leafy greens, berries, wild-caught fatty fish (salmon, sardines), extra virgin olive oil, turmeric, and walnuts.',
      'Always pair carbohydrates with a protein or healthy fat source to slow down gastric emptying and maintain flat glucose curves after meals.'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Managing Cortisol & The Vagus Nerve for Hormonal Harmony',
    category: 'Stress',
    readingTimeMinutes: 4,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    summary: 'How deep diaphragmatic breathing and vagal tone stimulation lower adrenal stress hormones and regulate ovulation.',
    content: [
      'The vagus nerve is the main component of your parasympathetic nervous system, responsible for resting, digesting, and hormone production.',
      'Stimulating vagal tone through 4-7-8 breathing exercises, cold water facial immersion, and humming can rapidly lower elevated heart rates and cortisol.',
      'Prioritize 7-8 hours of quality sleep nightly to optimize natural melatonin production and growth hormone release.'
    ],
    createdAt: new Date().toISOString()
  }
];

const Education: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(PRESET_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const categories = ['All', 'PCOS', 'Nutrition', 'Hormones', 'Exercise', 'Stress'];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/api/articles');
        if (res.data && res.data.length > 0) {
          setArticles(res.data);
        }
      } catch (err) {
        setArticles(PRESET_ARTICLES);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    const stored = localStorage.getItem('bookmarkedArticles');
    if (stored) {
      setBookmarkedIds(JSON.parse(stored));
    }
  }, []);

  const handleToggleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((bid) => bid !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    localStorage.setItem('bookmarkedArticles', JSON.stringify(updated));
  };

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All') return matchesSearch;
    return matchesSearch && art.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="w-full max-w-full space-y-6 pb-20 animate-fade-in">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-pinkdark bg-purple-100/80 px-3 py-1 rounded-full">
            Medical Literacy Library
          </span>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 pt-1">
            Education, Research & PCOS Insights
          </h2>
        </div>
        <div className="p-3 bg-brand/10 text-brand rounded-2xl">
          <BookOpen size={22} />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles, clinical topics (e.g., insulin resistance, seed cycling, cortisol)..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-2xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
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

      {/* Articles Grid (RESPONSIVE 4 COLUMNS ON DESKTOP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArticles.map((article) => {
          const isBookmarked = bookmarkedIds.includes(article.id);
          return (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="glass rounded-[2rem] border border-white/50 shadow-soft p-5 space-y-3 cursor-pointer hover:shadow-card transition-all duration-300 relative group"
            >
              {/* Category & Bookmark */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-brand uppercase tracking-widest bg-brand/5 px-2.5 py-0.5 rounded-full border border-brand-light">
                  {article.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-brand-muted font-bold flex items-center gap-1">
                    <Clock size={12} /> {article.readingTimeMinutes} min read
                  </span>
                  <button
                    onClick={(e) => handleToggleBookmark(article.id, e)}
                    className="p-1.5 text-brand-muted hover:text-brand transition-colors"
                  >
                    <Bookmark size={16} className={isBookmarked ? 'fill-brand text-brand' : ''} />
                  </button>
                </div>
              </div>

              <h3 className="font-extrabold text-sm text-brand-text group-hover:text-brand transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                {article.summary}
              </p>

              <div className="pt-2 flex justify-between items-center text-[11px] font-bold text-brand border-t border-brand-light/40">
                <span>Read Full Article</span>
                <ChevronRight size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-5 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-brand-pastel hover:bg-brand-light text-brand-muted hover:text-brand transition-all duration-300"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full">
                {selectedArticle.category} • {selectedArticle.readingTimeMinutes} Min Read
              </span>
              <h2 className="text-xl font-black text-brand-text leading-tight">{selectedArticle.title}</h2>
            </div>

            <div className="p-4 bg-brand-pastel/60 border border-brand-light rounded-2xl text-xs text-brand-dark italic leading-relaxed">
              "{selectedArticle.summary}"
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-4 text-xs text-brand-text leading-relaxed">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx} className="bg-white/80 p-3.5 rounded-xl border border-brand-light/50">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-light flex justify-between items-center">
              <button
                onClick={(e) => handleToggleBookmark(selectedArticle.id, e)}
                className="px-4 py-2 bg-brand-pastel border border-brand-light text-brand font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Bookmark size={14} className={bookmarkedIds.includes(selectedArticle.id) ? 'fill-brand' : ''} />
                <span>{bookmarkedIds.includes(selectedArticle.id) ? 'Bookmarked' : 'Bookmark Guide'}</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-brand text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Education;
