import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid2X2, Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { getServices } from '../api';
import ServiceCard from '../components/ServiceCard';
import { SERVICE_CATEGORIES } from '../utils/serviceMeta';

const sortOptions = [
  { value: 'latest', label: 'Latest listings' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

const categories = [{ id: 'all', label: 'All Services', icon: Grid2X2 }, ...SERVICE_CATEGORIES];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'all') params.category = category;
        if (sort !== 'latest') params.sort = sort;
        if (search.trim()) params.search = search.trim();

        const { data } = await getServices(params);
        setServices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [category, search, sort]);

  const updateParams = (nextCategory, nextSearch, nextSort) => {
    const params = {};
    if (nextCategory && nextCategory !== 'all') params.category = nextCategory;
    if (nextSearch) params.search = nextSearch;
    if (nextSort && nextSort !== 'latest') params.sort = nextSort;
    setSearchParams(params);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateParams(category, search.trim(), sort);
    setSearch(search.trim());
  };

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    updateParams(nextCategory, search.trim(), sort);
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    updateParams(category, search.trim(), nextSort);
  };

  const clearFilters = () => {
    setCategory('all');
    setSearch('');
    setSort('latest');
    setSearchParams({});
  };

  return (
    <div className="pb-16 pt-28">
      <div className="section-shell">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated overflow-hidden">
          <div className="bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.15),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(47,155,89,0.12),transparent_22%)] p-8 lg:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">Find trusted providers</span>
              <h1 className="mt-5 font-display text-4xl font-semibold text-ink-900 sm:text-5xl">
                Explore services in a cleaner, simpler browsing flow.
              </h1>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Search by category, compare pricing, and review provider details without losing context.
              </p>
            </div>

            <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-4xl">
              <div className="flex flex-col gap-3 rounded-[30px] border border-[#eadfc8] bg-white/95 p-3 shadow-soft sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search services or providers"
                    className="input-field !border-0 !bg-[#fffaf2] !pl-12 !shadow-none"
                  />
                </div>
                <button type="submit" className="btn-primary inline-flex items-center justify-center gap-2 px-6">
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </form>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { label: 'Categories', value: `${SERVICE_CATEGORIES.length}+`, icon: Grid2X2 },
                { label: 'Browsing style', value: 'Clean and clear', icon: ShieldCheck },
                { label: 'Booking focus', value: 'Pricing and trust first', icon: SlidersHorizontal },
              ].map((item) => (
                <div key={item.label} className="rounded-[26px] border border-[#eadfc8] bg-white/90 px-5 py-5 shadow-soft">
                  <div className="mb-4 inline-flex rounded-2xl border border-primary-100 bg-primary-50 p-3 text-primary-700">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-ink-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleCategoryChange(item.id)}
                  className={`chip ${category === item.id ? 'chip-active' : 'chip-inactive'}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 self-start">
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <SlidersHorizontal className="h-4 w-4" />
              Sort by
            </div>
            <select
              value={sort}
              onChange={(event) => handleSortChange(event.target.value)}
              className="input-field min-w-[190px] !py-3"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[28px] border border-[#eadfc8] bg-white/90 px-5 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Results</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink-900">{services.length} listings found</p>
          </div>

          {(category !== 'all' || search || sort !== 'latest') && (
            <button onClick={clearFilters} className="btn-secondary inline-flex items-center justify-center gap-2">
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card overflow-hidden">
                  <div className="skeleton h-56" />
                  <div className="space-y-3 p-5">
                    <div className="skeleton h-6 w-2/3" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="card-elevated px-8 py-16 text-center">
              <div className="mx-auto inline-flex rounded-[28px] border border-primary-100 bg-primary-50 p-5 text-primary-700">
                <Search className="h-8 w-8" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold text-ink-900">No services matched the current filters</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600">
                Try broadening your category or removing the search term to surface more providers.
              </p>
              <button onClick={clearFilters} className="btn-primary mt-6 inline-flex items-center justify-center gap-2">
                Reset search
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
