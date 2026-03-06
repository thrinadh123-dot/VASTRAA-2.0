import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { allProducts } from '../data';
import { useDispatch, useSelector } from 'react-redux';
import { toastService } from '../services/toastService';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import type { AppDispatch, RootState } from '../redux';

/* ─── Category filter tabs ───────────────────────────────────────────────── */
const FILTERS = ['All', 'Men', 'Women', 'Kids'] as const;
type Filter = typeof FILTERS[number];

/* ─── Category badge colours ─────────────────────────────────────────────── */
const BADGE: Record<string, string> = {
    Men: 'bg-[#f0f0f0] text-[#0a0a0a]',
    Women: 'bg-[#faf0f5] text-[#8b4a6e]',
    Kids: 'bg-[#f0f7f0] text-[#2e6e3e]',
};

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

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

    const filtered = useMemo(
        () => active === 'All' ? NEW_ARRIVALS : NEW_ARRIVALS.filter(p => p.category === active),
        [active],
    );

    const handleWishlistToggle = (e: React.MouseEvent, product: any, isInWishlist: boolean) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userInfo) {
            navigate('/login');
            return;
        }

        // Backend wishlist ONLY supports MongoDB ObjectIds. 
        // Local-only slugs (men-019 etc.) cannot be synced to the database.
        const productId = product._id || product.id;
        const isMongoId = /^[a-f\d]{24}$/i.test(productId ?? '');

        if (!isMongoId) {
            toastService.info('This item is available for purchase but cannot be saved to wishlist.');
            return;
        }

        if (isInWishlist) {
            dispatch(removeFromWishlist(productId));
        } else {
            dispatch(addToWishlist({
                productId: productId,
                name: product.name,
                image: product.images?.[0],
                price: product.price,
                category: product.category,
            }));
        }
    };

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
                    {filtered.map(product => {
                        const isInWishlist = wishlistItems.some(item => item.productId === product.id);

                        return (
                            <Link
                                key={product.id}
                                to={`/product/${(product as any)._id || product.id}`}
                                className="group block"
                            >
                                {/* Image */}
                                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#e8e8e8] mb-3">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                        loading="lazy"
                                    />

                                    {/* Hover tint */}
                                    <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/10 transition-all duration-300" />

                                    {/* Action bar */}
                                    <div className="absolute bottom-3 inset-x-3 flex gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            aria-label="Add to cart"
                                            onClick={e => e.preventDefault()}
                                            className="flex-1 bg-white/95 backdrop-blur-sm text-[#0a0a0a] py-2 rounded-full vx-label flex items-center justify-center gap-1.5 hover:bg-[#0a0a0a] hover:text-white transition-colors text-[10px]"
                                        >
                                            <FiShoppingCart className="w-3 h-3" strokeWidth={2} />
                                            Add to bag
                                        </button>
                                        <button
                                            aria-label={isInWishlist ? "Remove from wishlist" : "Save"}
                                            onClick={e => handleWishlistToggle(e, product, isInWishlist)}
                                            className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${isInWishlist
                                                ? 'bg-white text-red-500 hover:bg-gray-100'
                                                : 'bg-white/95 text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white'
                                                }`}
                                        >
                                            <FiHeart className={`w-3 h-3 ${isInWishlist ? 'fill-current' : ''}`} strokeWidth={2} />
                                        </button>
                                    </div>

                                    {/* Category badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`vx-label text-[9px] px-2.5 py-1 rounded-full ${BADGE[product.category] ?? 'bg-white/80 text-[#0a0a0a]'}`}>
                                            {product.category.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* NEW badge if applicable */}
                                    {(product.isNewDrop || product.badge === 'NEW') && (
                                        <div className="absolute top-3 right-3">
                                            <span className="vx-label text-[9px] px-2.5 py-1 rounded-full bg-[#0a0a0a] text-white">
                                                NEW
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Name + Price */}
                                <div className="flex items-start justify-between gap-2 px-0.5">
                                    <p className="font-medium text-[#0a0a0a] text-sm tracking-tight leading-snug">
                                        {product.name}
                                    </p>
                                    <p className="font-semibold text-[#0a0a0a] text-sm flex-shrink-0">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </p>
                                </div>

                                {/* Subcategory label */}
                                <p className="text-[#9a9a9a] text-xs mt-0.5 px-0.5">{product.subcategory}</p>
                            </Link>
                        )
                    })}
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
