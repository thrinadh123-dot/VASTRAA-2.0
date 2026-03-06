import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { allProducts } from '../data';
import VeloraProductCard from './VeloraProductCard';

/* ─── Category filter tabs ───────────────────────────────────────────────── */
const FILTERS = ['All', 'Men', 'Women', 'Kids'] as const;
type Filter = typeof FILTERS[number];



/* ─── Derive "New Arrivals" from real product data ───────────────────────────
 * Priority order:
 *   1. Products where isNewDrop === true (badge === 'NEW') — up to 12
 *   2. If fewer than 12, backfill with top-rated products from each category
 * Always pulled from the single source of truth: allProducts (data/index.ts)
 * ─────────────────────────────────────────────────────────────────────────── */
function deriveNewArrivals() {
    // Primary: products flagged NEW or isNewDrop
    const newDrops = allProducts.filter(p => p.isNewDrop || p.badge === 'NEW');

    if (newDrops.length >= 8) return newDrops.slice(0, 12);

    // Backfill — highest rated from each category, de-duped
    const seen = new Set(newDrops.map(p => p.id));
    const backfill = [...allProducts]
        .filter(p => !seen.has(p.id))
        .sort((a, b) => b.rating - a.rating);

    return [...newDrops, ...backfill].slice(0, 12);
}

const NEW_ARRIVALS = deriveNewArrivals();

/* ─── Section ────────────────────────────────────────────────────────────── */
const ProductGridSection = () => {
    const [active, setActive] = useState<Filter>('All');
    const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;

    const filtered = useMemo(
        () => active === 'All' ? NEW_ARRIVALS : NEW_ARRIVALS.filter(p => p.category === active),
        [active],
    );



    return (
        <section ref={sectionRef} className="vx-section bg-[#f5f5f5]">
            <div className="vx-container">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12" data-animate>
                    <div>
                        <p className="vx-label text-[#9a9a9a] mb-3">New Season</p>
                        <h2 className="vx-heading text-[#0a0a0a]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                            New Arrivals
                        </h2>
                        <p className="text-[#9a9a9a] text-sm font-light mt-2">
                            Fresh picks from across all collections.
                        </p>
                    </div>

                    {/* Category filter tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setActive(f)}
                                className={`vx-label px-4 py-2 rounded-full transition-all duration-200 text-[10px] ${active === f
                                    ? 'bg-[#0a0a0a] text-white'
                                    : 'bg-white text-[#9a9a9a] hover:text-[#0a0a0a] border border-transparent hover:border-[#e0e0e0]'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" data-animate data-delay="100">
                    {filtered.map(product => (
                        <VeloraProductCard key={product.id} product={product as any} />
                    ))}
                </div>

                {/* View all CTA */}
                <div className="mt-14 text-center" data-animate data-delay="200">
                    <Link to="/shop?style=new" className="vx-btn vx-btn-outline">
                        View All New Arrivals <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default ProductGridSection;
