import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getServices } from '../api';
import ServiceCard from '../components/ServiceCard';

const categories = [
  { id: 'all', label: 'All Services', emoji: '🏠' },
  { id: 'electrician', label: 'Electrician', emoji: '⚡' },
  { id: 'plumber', label: 'Plumber', emoji: '🔧' },
  { id: 'tutor', label: 'Tutor', emoji: '📚' },
  { id: 'delivery', label: 'Delivery', emoji: '🚚' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'painting', label: 'Painting', emoji: '🎨' },
  { id: 'carpentry', label: 'Carpentry', emoji: '🪚' },
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('latest');

  useEffect(() => { loadServices(); }, [category, sort]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'all') params.category = category;
      if (sort !== 'latest') params.sort = sort;
      if (search) params.search = search;
      const { data } = await getServices(params);
      setServices(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); loadServices(); };
  const handleCategoryChange = (cat) => { setCategory(cat); setSearchParams(cat === 'all' ? {} : { category: cat }); };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Find <span className="gradient-text">Services</span></h1>
          <p className="text-slate-500">Browse verified professionals near you</p>
        </motion.div>

        {/* Search */}
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services, providers..." className="input-field !pl-12 !pr-24 !py-4 text-lg !bg-white shadow-soft" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-all">
              Search
            </button>
          </div>
        </motion.form>

        {/* Category Pills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
              className={`chip ${category === cat.id ? 'chip-active' : 'chip-inactive'}`}>
              <span className="mr-1">{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{services.length} services found</p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-primary-500">
              {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden"><div className="h-48 skeleton" /><div className="p-5 space-y-3"><div className="h-5 w-3/4 skeleton" /><div className="h-4 w-full skeleton" /><div className="h-4 w-2/3 skeleton" /></div></div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No services found</h3>
            <p className="text-slate-500">Try changing your filters or search term.</p>
            {(category !== 'all' || search) && (
              <button onClick={() => { setCategory('all'); setSearch(''); setSearchParams({}); }}
                className="mt-4 btn-secondary inline-flex items-center gap-2"><X className="w-4 h-4" /> Clear Filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => <ServiceCard key={service._id} service={service} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
