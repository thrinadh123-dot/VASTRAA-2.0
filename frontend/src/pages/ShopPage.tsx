import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiChevronDown, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import VeloraProductCard from '../components/VeloraProductCard';
import { listProducts } from '../redux/slices/productSlice';
import type { AppDispatch, RootState } from '../redux';
import type { Product } from '../data';
import { allProducts } from '../data';
import { filterProducts, getStyleLabel, STYLE_FILTER_REGISTRY } from '../utils/filterProducts';

const PAGE_SIZE = 16;

const SORTS = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Discount', value: 'discount' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'Most Reviewed', value: 'reviews' },
] as const;

type SortKey = typeof SORTS[number]['value'];

const CATEGORIES = ['All', 'Men', 'Women', 'Kids'] as const;
type Cat = typeof CATEGORIES[number];

const PRICE_RANGES = [
    { label: 'Under ₹2,000', min: 0, max: 2000 },
    { label: '₹2,000 – ₹3,000', min: 2000, max: 3000 },
    { label: '₹3,000 – ₹4,000', min: 3000, max: 4000 },
    { label: '₹4,000+', min: 4000, max: Infinity },
];

// Quick-access style filter pills shown in the toolbar
const STYLE_PILLS = Object.entries(STYLE_FILTER_REGISTRY).map(([key, def]) => ({
    key,
    label: def.label,
}));

function sortProducts(list: Product[], sort: SortKey): Product[] {
    const arr = [...list];
    if (sort === 'price_asc') return arr.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') return arr.sort((a, b) => b.price - a.price);
    if (sort === 'rating') return arr.sort((a, b) => b.rating - a.rating);
    if (sort === 'reviews') return arr.sort((a, b) => b.reviews - a.reviews);
    if (sort === 'discount') {
        return arr.sort((a, b) => {
            const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
            const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
            return discB - discA;
        });
    }
    return arr;
}

const ShopPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();

    const { products, loading: productsLoading } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(listProducts(''));
    }, [dispatch]);

    // Fallback to local catalog when backend hasn't returned products yet
    const sourceProducts = (products && products.length > 0) ? products : allProducts as any[];

    // Derive state from URL — single source of truth
    const urlCat = (searchParams.get('category') as Cat) || 'All';
    const urlStyle = searchParams.get('style') || '';

    const [sort, setSort] = useState<SortKey>('featured');
    const [priceFilter, setPriceFilter] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showStyleMenu, setShowStyleMenu] = useState(false);

    // Sync URL → page reset
    useEffect(() => {
        setPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [urlCat, urlStyle, priceFilter]);

    /* ── Derived heading ─────────────────────────────────────────────────── */
    const styleLabel = urlStyle ? getStyleLabel(urlStyle) : undefined;
    const categoryLabel = urlCat === 'All' ? 'All Collections' : `${urlCat}'s Collection`;
    const pageHeading = styleLabel ?? categoryLabel;

    /* ── Filtering ───────────────────────────────────────────────────────── */
    const filtered = useMemo(() => {
        const priceRange = priceFilter !== null ? PRICE_RANGES[priceFilter] : undefined;
        const base = filterProducts(sourceProducts as any, {
            category: urlCat,
            style: urlStyle || undefined,
            priceMin: priceRange?.min,
            priceMax: priceRange?.max,
        });
        return sortProducts(base as any, sort);
    }, [sourceProducts, urlCat, urlStyle, sort, priceFilter]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    /* ── URL helpers ─────────────────────────────────────────────────────── */
    const buildParams = (overrides: Record<string, string>) => {
        const next: Record<string, string> = {};
        if (urlCat && urlCat !== 'All') next.category = urlCat;
        if (urlStyle) next.style = urlStyle;
        return { ...next, ...overrides };
    };

    const handleCategory = (cat: Cat) => {
        const p: Record<string, string> = {};
        if (cat !== 'All') p.category = cat;
        if (urlStyle) p.style = urlStyle; // preserve style filter
        setSearchParams(p);
        setPage(1);
    };

    const handleStyle = (styleKey: string) => {
        const p = buildParams({ style: styleKey });
        setSearchParams(p);
        setShowStyleMenu(false);
        setPage(1);
    };

    const clearStyle = () => {
        const p: Record<string, string> = {};
        if (urlCat && urlCat !== 'All') p.category = urlCat;
        setSearchParams(p);
        setPage(1);
    };

    const clearAll = () => {
        setSearchParams({});
        setPriceFilter(null);
        setPage(1);
    };

    return (
        <div className="bg-white min-h-screen pt-28 pb-24">
            {/* Hero Header */}
            <div className="vx-container mb-10">
                <p className="vx-label text-[#9a9a9a] mb-3">Shop</p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col">
                        <motion.h1
                            key={pageHeading}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="vx-heading text-[#0a0a0a]"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                        >
                            {pageHeading}
                        </motion.h1>
                        {urlStyle === 'sale' && (
                            <p className="text-[#9a9a9a] text-sm mt-1 uppercase tracking-widest font-medium">Up to 30% Off Selected Styles</p>
                        )}
                    </div>
                    <p className="text-[#9a9a9a] text-sm shrink-0">{filtered.length} products</p>
                </div>

                {/* ── Active style filter badge ───────────────────────────── */}
                <AnimatePresence>
                    {urlStyle && styleLabel && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-4 overflow-hidden"
                        >
                            <div className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white rounded-full px-4 py-2 text-xs font-semibold tracking-wider">
                                <span>Filtered by: {styleLabel}</span>
                                <button
                                    onClick={clearStyle}
                                    className="ml-1 hover:opacity-60 transition-opacity"
                                    aria-label="Remove style filter"
                                >
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="vx-container">
                {/* ── Toolbar row ──────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-[#e8e8e8]">

                    {/* Category pills */}
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategory(cat)}
                                className={`vx-label px-5 py-2.5 rounded-full transition-colors duration-200 ${urlCat === cat
                                    ? 'bg-[#0a0a0a] text-white'
                                    : 'bg-[#f5f5f5] text-[#9a9a9a] hover:text-[#0a0a0a]'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Price filter pills */}
                    <div className="flex gap-2 flex-wrap">
                        {PRICE_RANGES.map((r, i) => (
                            <button
                                key={r.label}
                                onClick={() => { setPriceFilter(priceFilter === i ? null : i); setPage(1); }}
                                className={`vx-label px-4 py-2 rounded-full text-[10px] transition-colors ${priceFilter === i
                                    ? 'bg-[#0a0a0a] text-white'
                                    : 'border border-[#e8e8e8] text-[#9a9a9a] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
                            >
                                {r.label}
                                {priceFilter === i && <FiX className="inline ml-1 w-2.5 h-2.5" />}
                            </button>
                        ))}
                    </div>

                    {/* Style filter dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowStyleMenu(v => !v)}
                            className={`flex items-center gap-2 vx-label px-4 py-2.5 rounded-full border transition-colors ${urlStyle
                                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                                : 'border-[#e8e8e8] text-[#9a9a9a] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
                        >
                            {urlStyle ? (getStyleLabel(urlStyle) ?? 'Style') : 'Style'}
                            {urlStyle
                                ? <FiX className="w-3 h-3" onClick={(e) => { e.stopPropagation(); clearStyle(); }} />
                                : <FiChevronDown className="w-3.5 h-3.5" />
                            }
                        </button>
                        <AnimatePresence>
                            {showStyleMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-0 top-12 w-52 bg-white border border-[#e8e8e8] rounded-2xl py-2 shadow-xl z-20"
                                >
                                    {STYLE_PILLS.map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => handleStyle(key)}
                                            className={`block w-full text-left px-5 py-3 text-sm transition-colors ${urlStyle === key
                                                ? 'text-[#0a0a0a] font-semibold bg-[#f5f5f5]'
                                                : 'text-[#9a9a9a] hover:text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sort dropdown */}
                    <div className="relative ml-auto">
                        <button
                            className="flex items-center gap-2 vx-label text-[#0a0a0a] border border-[#e8e8e8] px-4 py-2.5 rounded-full hover:border-[#0a0a0a] transition-colors"
                            onClick={() => setShowSortMenu(v => !v)}
                        >
                            {SORTS.find(s => s.value === sort)?.label}
                            <FiChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {showSortMenu && (
                            <div className="absolute right-0 top-12 w-52 bg-white border border-[#e8e8e8] rounded-2xl py-2 shadow-xl z-20">
                                {SORTS.map(s => (
                                    <button
                                        key={s.value}
                                        onClick={() => { setSort(s.value as SortKey); setPage(1); setShowSortMenu(false); }}
                                        className={`block w-full text-left px-5 py-3 text-sm transition-colors ${sort === s.value
                                            ? 'text-[#0a0a0a] font-semibold bg-[#f5f5f5]'
                                            : 'text-[#9a9a9a] hover:text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Product Grid ─────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {productsLoading ? (
                        <div className="py-32 flex justify-center">
                            <div className="w-10 h-10 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : paginated.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-32 text-center"
                        >
                            <p className="vx-heading text-[#e8e8e8]" style={{ fontSize: '3rem' }}>No products found</p>
                            <p className="text-[#9a9a9a] mt-4">Try adjusting your filters.</p>
                            <button onClick={clearAll} className="mt-6 vx-btn vx-btn-outline inline-flex">
                                Clear All Filters
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`${urlCat}-${urlStyle}-${priceFilter}-${page}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6"
                        >
                            {paginated.map((product, idx) => (
                                <VeloraProductCard key={product?._id || product.id || `product-${idx}`} product={product} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Pagination ───────────────────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-3">
                        <button
                            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={page === 1}
                            className="w-10 h-10 border border-[#e8e8e8] rounded-full flex items-center justify-center text-[#0a0a0a] disabled:opacity-30 hover:border-[#0a0a0a] transition-colors"
                        >
                            <FiChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={`w-10 h-10 rounded-full vx-label transition-colors ${p === page
                                    ? 'bg-[#0a0a0a] text-white'
                                    : 'border border-[#e8e8e8] text-[#9a9a9a] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            disabled={page === totalPages}
                            className="w-10 h-10 border border-[#e8e8e8] rounded-full flex items-center justify-center text-[#0a0a0a] disabled:opacity-30 hover:border-[#0a0a0a] transition-colors"
                        >
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopPage;
