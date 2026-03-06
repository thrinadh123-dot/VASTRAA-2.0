import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiChevronDown, FiClock, FiTruck, FiPackage, FiCalendar, FiCheck } from 'react-icons/fi';
import { toastService } from '../services/toastService';
import SizeGuideModal from '../components/SizeGuideModal';

import { getProductDetails, clearProductDetails } from '../redux/slices/productSlice';
import { addCartItem, addGuestItem } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import type { AppDispatch, RootState } from '../redux';
import { allProducts } from '../data';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Utility                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Sub-components                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

/** Full-colour + half-star aware rating stars */
const Stars = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
    const dim = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => {
                const filled = i <= Math.floor(rating);
                const half = !filled && i <= rating + 0.5;
                return (
                    <svg key={i} className={`${dim} ${filled || half ? 'text-amber-400' : 'text-[#e0e0e0]'}`}
                        viewBox="0 0 24 24" fill={filled || half ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                );
            })}
        </div>
    );
};

/** Smooth animated accordion */
const Accordion = ({ title, children, isOpen, onToggle }: { title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) => {
    return (
        <div className="border-b border-[#e8e8e8]">
            <button onClick={onToggle}
                className="w-full flex items-center justify-between py-4 text-left group">
                <span className="text-sm font-semibold text-[#0a0a0a] tracking-wide">{title}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                    <FiChevronDown className="w-4 h-4 text-[#9a9a9a] group-hover:text-[#0a0a0a] transition-colors" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden">
                        <div className="pb-5 text-sm text-[#5a5a5a] leading-relaxed space-y-1.5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/** Countdown urgency timer — resets at midnight */
const UrgencyTimer = () => {
    const getSecondsUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    };
    const [secs, setSecs] = useState(getSecondsUntilMidnight);
    useEffect(() => {
        const t = setInterval(() => setSecs(s => (s <= 0 ? getSecondsUntilMidnight() : s - 1)), 1000);
        return () => clearInterval(t);
    }, []);
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return (
        <div className="flex items-center gap-2 text-[13px] text-[#5a5a5a] bg-[#fafaf9] border border-[#ebebeb] rounded-xl px-3.5 py-2.5">
            <FiClock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>Order in <span className="font-bold text-[#0a0a0a] tabular-nums">{h}:{m}:{s}</span> for next-day delivery</span>
        </div>
    );
};


/* ─────────────────────────────────────────────────────────────────────────── */
/*  Dummy review data (fallback when no backend reviews exist yet)             */
/* ─────────────────────────────────────────────────────────────────────────── */
const DUMMY_REVIEWS = [
    { _id: 'd1', name: 'Rahul Sharma', rating: 5, comment: 'Excellent quality and perfect fitting. Worth every rupee — I got so many compliments!', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { _id: 'd2', name: 'Amet Verma', rating: 4, comment: 'Fabric is very comfortable and looks premium. Stitching quality is great.', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { _id: 'd3', name: 'Neha Kapoor', rating: 5, comment: 'Loved the design. Delivery was super fast and packaging was neat too.', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { _id: 'd4', name: 'Rohit Singh', rating: 4, comment: 'Good product overall but size runs slightly large. Would recommend sizing down.', createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
    { _id: 'd5', name: 'Priya Mehta', rating: 5, comment: 'Amazing style and very comfortable for all-day wear. Will definitely buy again!', createdAt: new Date(Date.now() - 21 * 86400000).toISOString() },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main Page                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { productDetails: backendProduct, loading: backendLoading, error: backendError } = useSelector((s: RootState) => s.products);
    const { userInfo } = useSelector((s: RootState) => s.auth);
    const wishlistItems = useSelector((s: RootState) => (s as any).wishlist?.items || []);

    /* ── Resolve: Backend first, then fallback to local (if needed temporarily) ── */
    const localProduct = useMemo(() => (id ? allProducts.find(p => p.id === id) : undefined), [id]);

    const product = useMemo(() => {
        return backendProduct || (localProduct ? {
            _id: localProduct.id,
            name: localProduct.name,
            category: localProduct.category,
            productType: (localProduct as any).productType || 'other',
            price: localProduct.price,
            rating: localProduct.rating,
            numReviews: (localProduct as any).reviews ?? 0,
            description: localProduct.description,
            stock: 10,
            images: localProduct.images,
            badge: (localProduct as any).badge,
            subcategory: (localProduct as any).subcategory,
            sizes: (localProduct as any).sizes ?? [],
            originalPrice: localProduct.originalPrice,
            discountPercentage: (localProduct as any).discountPercentage,
            isOnSale: localProduct.isOnSale,
            recommendedSize: (localProduct as any).recommendedSize ?? null,
            isNewDrop: localProduct.isNewDrop,
            isBestseller: localProduct.isBestseller,
        } : null);
    }, [localProduct, backendProduct]);

    const loading = backendLoading;
    const error = backendError;

    useEffect(() => {
        if (id) dispatch(getProductDetails(id));
        return () => { dispatch(clearProductDetails()); };
    }, [dispatch, id]);

    /* ── Image gallery ─────────────────────────────────────────────────────── */
    // Use existing images array; pad to 3–4 views by reusing the same URL
    const images = useMemo(() => {
        if (!product) return [];
        const base = (product as any).images || [(product as any).image || ''];
        if (base.length >= 3) return base.slice(0, 4);
        // Duplicate with crop variants to simulate multi-angle gallery
        return [
            base[0],
            base[0]?.replace('w=800', 'w=800&crop=faces'),
            base[0],
        ].filter(Boolean);
    }, [product]);

    const [activeImg, setActiveImg] = useState(0);
    useEffect(() => setActiveImg(0), [id]);

    /* ── UI state ──────────────────────────────────────────────────────────── */
    const [selectedSize, setSize] = useState('');
    const qty = 1; // always add 1 at a time (no qty stepper in this layout)
    const [lightbox, setLightbox] = useState(false);
    const [sizeModal, setSizeModal] = useState(false);
    const [sizeError, setSizeError] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const toggleSection = (section: string) => {
        setOpenSection(prev => (prev === section ? null : section));
    };

    useEffect(() => {
        const sizes: string[] = (product as any)?.sizes ?? [];
        if (product?.recommendedSize) {
            setSize(product.recommendedSize);
        } else if (sizes.length && !selectedSize) {
            setSize(sizes[0]);
        }
    }, [product, product?.recommendedSize]);

    /* ── Wishlist state ────────────────────────────────────────────────────── */
    const productId = (product as any)?._id || id;
    const isWishlisted = useMemo(
        () => wishlistItems.some((p: any) => (p.productId || p.product || p._id || p.id) === productId),
        [wishlistItems, productId]
    );

    const toggleWishlist = async () => {
        if (!userInfo) { toastService.error('Sign in to save items'); navigate('/login'); return; }
        if (!product) return;

        if (isWishlisted) {
            await dispatch(removeFromWishlist(productId as string));
            toastService.info('Removed from wishlist');
        } else {
            await dispatch(addToWishlist({
                productId: productId as string,
                name: product.name,
                price: product.price,
                image: images[0],
                category: product.category,
                description: product.description
            }));
            toastService.success('Added to wishlist ♥', { label: 'View Wishlist', path: '/wishlist' }, productId as string);
        }
    };

    /* ── Cart handler ──────────────────────────────────────────────────────── */
    const addToCartHandler = async () => {
        if (!selectedSize) { setSizeError(true); toastService.error('Please select a size'); return; }
        setSizeError(false);

        if (!product?._id) {
            toastService.error("Invalid product ID");
            return;
        }

        console.log("Product being sent:", product);

        if (!userInfo) {
            // Guest cart — localStorage still expects minimal metadata for UI display
            dispatch(addGuestItem({
                product: product._id,
                name: product.name,
                image: images[0],
                price: product.price,
                quantity: qty,
                size: selectedSize,
                stock: product.stock ?? 10
            }));
            toastService.success(`${product.name} added to cart!`, { label: 'View Cart', path: '/cart' });
            return;
        }

        const res = await dispatch(addCartItem({
            product: product._id,
            quantity: qty,
            size: selectedSize,
            name: product.name,
            image: images[0],
            price: product.price,
            stock: product.stock ?? 10,
            category: product.category,
            description: product.description
        }));

        if (res.meta.requestStatus === 'fulfilled') {
            toastService.success(`${product.name} added to cart!`, [
                { label: 'View Cart', path: '/cart' },
                { label: 'Checkout', path: '/checkout' }
            ], product._id, `${product.name} added`);
        } else {
            toastService.error((res.payload as string) || 'Failed to add to cart');
        }
    };


    /* ── Rating breakdown (dynamic from backend) ────────────────────────── */
    const rating = product?.rating ?? 0;
    const totalReviews = product?.numReviews ?? 0;
    const breakdown = useMemo(() => {
        const counts = [0, 0, 0, 0, 0]; // [1*, 2*, 3*, 4*, 5*]
        const reviews = (product as any)?.reviews || [];
        if (reviews.length) {
            reviews.forEach((r: any) => {
                const s = Math.min(Math.max(Math.floor(r.rating), 1), 5);
                counts[s - 1]++;
            });
        }
        return counts.reverse(); // [5*, 4*, 3*, 2*, 1*]
    }, [(product as any)?.reviews]);

    const reviewsToDisplay = useMemo(() => {
        const backendReviews = (product as any)?.reviews || [];
        // Use real reviews if available, otherwise fall back to curated dummy reviews
        const allReviews = backendReviews.length > 0 ? backendReviews : DUMMY_REVIEWS;
        return showAllReviews ? allReviews : allReviews.slice(0, 3);
    }, [(product as any)?.reviews, showAllReviews]);

    // Total review count used in the show-more guard
    const allAvailableReviews = useMemo(() => {
        const backendReviews = (product as any)?.reviews || [];
        return backendReviews.length > 0 ? backendReviews : DUMMY_REVIEWS;
    }, [(product as any)?.reviews]);

    /* ── Guards ────────────────────────────────────────────────────────────── */
    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center pt-24">
            <div className="w-10 h-10 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (error) return (
        <div className="min-h-screen bg-white pt-32 max-w-xl mx-auto px-4">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Link to="/shop" className="text-sm underline underline-offset-2">← Back to Shop</Link>
        </div>
    );
    if (!product) return null;

    const sizes: string[] = (product as any)?.sizes ?? [];
    const inStock = (product?.stock ?? 0) > 0;

    /* ─────────────────────────────────────────────────────────────────────── */
    /*  Render                                                                  */
    /* ─────────────────────────────────────────────────────────────────────── */
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
            className="bg-white min-h-screen pt-20 pb-28 md:pb-16">

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[11px] text-[#9a9a9a] tracking-widest uppercase mb-8 pt-4">
                    <Link to="/" className="hover:text-[#0a0a0a] transition-colors">Home</Link>
                    <span>›</span>
                    <Link to={`/shop?category=${product.category}`} className="hover:text-[#0a0a0a] transition-colors">{product.category}</Link>
                    <span>›</span>
                    <span className="text-[#0a0a0a] font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>

                {/* ── Two-column layout ─────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* ══ LEFT — Single image ══════════════════════════════════════════ */}
                    <div>
                        {/* Main image */}
                        <div className="relative rounded-2xl overflow-hidden bg-[#f5f4f2] cursor-zoom-in"
                            onClick={() => setLightbox(true)}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    src={images[activeImg]}
                                    alt={product.name}
                                    className="w-full object-contain"
                                    style={{ maxHeight: '74vh' }}
                                    initial={{ opacity: 0, scale: 1.03 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </AnimatePresence>

                            {/* Badge */}
                            {(product as any)?.badge && (
                                <div className="absolute top-4 left-4">
                                    <span className="text-[9px] font-bold tracking-widest uppercase bg-[#0a0a0a] text-white px-3 py-1.5 rounded-full">
                                        {(product as any).badge}
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ══ RIGHT — Product info (sticky desktop) ══════════════════════ */}
                    <div className="lg:sticky lg:top-[88px] lg:self-start space-y-5">

                        {/* Category label */}
                        <div>
                            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#9a9a9a]">
                                {product.category}{(product as any)?.subcategory ? ` · ${(product as any).subcategory}` : ''}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-[1.75rem] md:text-3xl font-bold text-[#0a0a0a] tracking-tight leading-snug">
                            {product.name}
                        </h1>

                        {/* Rating row */}
                        <div className="flex items-center gap-2.5">
                            <Stars rating={rating} size="sm" />
                            <span className="text-xs text-[#9a9a9a]">{rating.toFixed(1)} · {totalReviews} reviews</span>
                        </div>

                        {/* Price Area */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-[#0a0a0a]">
                                        ₹{product.isOnSale && product.discountPercentage && product.originalPrice
                                            ? Math.round(product.originalPrice * (1 - product.discountPercentage / 100)).toLocaleString('en-IN')
                                            : product.price.toLocaleString('en-IN')}
                                    </span>
                                    {product.isOnSale && product.discountPercentage && product.originalPrice && (
                                        <span className="text-xl text-[#9a9a9a] line-through font-medium decoration-[#9a9a9a]/40">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-[#9a9a9a] font-medium uppercase tracking-widest">Incl. of all taxes</p>
                            </div>

                            {product.isOnSale && product.discountPercentage && product.originalPrice && (
                                <div className="inline-flex items-center gap-2 bg-[#fff0f0] border border-[#ffdfdf] px-3 py-1.5 rounded-full">
                                    <span className="text-[10px] font-black text-[#c00000] uppercase tracking-wider">
                                        -{product.discountPercentage}% Off
                                    </span>
                                    <div className="w-px h-3 bg-[#c00000]/20" />
                                    <span className="text-[11px] font-bold text-[#c00000]">
                                        Save ₹{(product.originalPrice - Math.round(product.originalPrice * (1 - product.discountPercentage / 100))).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Urgency timer */}
                        <UrgencyTimer />

                        <div className="h-px bg-[#ebebeb]" />

                        {/* Size selector */}
                        {sizes.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex flex-col gap-1">
                                        <p className={`text-xs font-bold tracking-widest uppercase ${sizeError ? 'text-red-500' : 'text-[#0a0a0a]'}`}>
                                            Select Size {selectedSize && <span className="font-normal normal-case tracking-normal text-[#9a9a9a]">— {selectedSize}</span>}
                                        </p>
                                        {/* Smart Recommendation Badge */}
                                        {product.recommendedSize && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-1.5"
                                            >
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 border border-violet-100 rounded-md">
                                                    <FiCheck className="w-2.5 h-2.5 text-violet-600" />
                                                    <span className="text-[10px] font-bold text-violet-700 uppercase tracking-tighter">
                                                        Recommended for you: {product.recommendedSize}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                    <button
                                        className="text-[10px] text-[#9a9a9a] underline underline-offset-2 hover:text-[#0a0a0a] transition-colors"
                                        onClick={() => setSizeModal(true)}
                                    >
                                        Size Guide
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((s: string) => {
                                        const isRecommended = product.recommendedSize === s;
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => { setSize(s); setSizeError(false); }}
                                                className={`relative min-w-[52px] h-10 px-3 rounded-full text-xs font-semibold border-2 transition-all duration-200
                                                    ${selectedSize === s
                                                        ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                                                        : 'bg-white text-[#3a3a3a] border-[#e0e0e0] hover:border-[#0a0a0a]'
                                                    }
                                                    ${isRecommended && selectedSize !== s ? 'border-violet-200 bg-violet-50/30' : ''}`}
                                            >
                                                {s}
                                                {isRecommended && (
                                                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm shadow-violet-200">
                                                        <FiCheck size={8} className="text-white" />
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {sizeError && (
                                    <p className="text-xs text-red-500 mt-2">Please select a size to continue</p>
                                )}
                                {userInfo && !product.recommendedSize && (
                                    (() => {
                                        // Simple logic to check if user has ANY preference that MIGHT apply to this product
                                        const hasPref = userInfo.sizePreferences && (
                                            userInfo.sizePreferences.tshirt ||
                                            userInfo.sizePreferences.shirt ||
                                            userInfo.sizePreferences.jeans ||
                                            userInfo.sizePreferences.shoes
                                        );
                                        return hasPref ? (
                                            <p className="text-[10px] text-[#9a9a9a] mt-3 italic">
                                                ★ Your saved size is currently unavailable for this item.
                                            </p>
                                        ) : null;
                                    })()
                                )}
                            </div>
                        )}


                        {/* CTA Buttons */}
                        {inStock ? (
                            <div className="flex items-stretch gap-3">
                                <motion.button
                                    onClick={addToCartHandler}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex-1 py-3.5 bg-[#0a0a0a] text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-[#333] transition-colors duration-200"
                                >
                                    <FiShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </motion.button>

                                {/* Wishlist heart */}
                                <motion.button
                                    onClick={toggleWishlist}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.93 }}
                                    className="w-12 h-12 flex-shrink-0 rounded-2xl border-2 border-[#e0e0e0] hover:border-red-400 flex items-center justify-center transition-colors duration-200"
                                >
                                    <FiHeart
                                        className={`w-5 h-5 transition-colors duration-200 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#5a5a5a]'}`}
                                        fill={isWishlisted ? 'currentColor' : 'none'}
                                    />
                                </motion.button>
                            </div>
                        ) : (
                            <button disabled className="w-full py-3.5 bg-[#e0e0e0] text-[#9a9a9a] rounded-2xl font-semibold text-sm cursor-not-allowed">
                                Out of Stock
                            </button>
                        )}


                        {/* Accordions */}
                        <div className="border-t border-[#ebebeb] mt-2">
                            <Accordion
                                title="Description & Fit"
                                isOpen={openSection === 'description'}
                                onToggle={() => toggleSection('description')}
                            >
                                <p>{product.description || 'Crafted for modern expression, this piece blends refined craftsmanship with everyday comfort.'}</p>
                                <p><span className="font-medium text-[#0a0a0a]">Material:</span> 100% Premium French Terry Cotton (400 GSM heavyweight)</p>
                                <p><span className="font-medium text-[#0a0a0a]">Fit:</span> Relaxed tailored silhouette — structured yet comfortable</p>
                                <p><span className="font-medium text-[#0a0a0a]">Care:</span> Machine wash cold, 30°C. Do not bleach.</p>
                                <p><span className="font-medium text-[#0a0a0a]">Origin:</span> Designed in India</p>
                            </Accordion>
                            <Accordion
                                title="Shipping"
                                isOpen={openSection === 'shipping'}
                                onToggle={() => toggleSection('shipping')}
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2.5">
                                        <FiTruck className="w-4 h-4 text-[#6a6a6a] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">Discount</p>
                                            <p className="text-sm font-medium text-[#0a0a0a]">Disc 50%</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FiPackage className="w-4 h-4 text-[#6a6a6a] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">Package</p>
                                            <p className="text-sm font-medium text-[#0a0a0a]">Regular Package</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FiClock className="w-4 h-4 text-[#6a6a6a] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">Delivery Time</p>
                                            <p className="text-sm font-medium text-[#0a0a0a]">3–4 Working Days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FiCalendar className="w-4 h-4 text-[#6a6a6a] mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">Estimation Arrive</p>
                                            <p className="text-sm font-medium text-[#0a0a0a]">10–12 Oct 2025</p>
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>


                    </div>
                </div>

                {/* ── Ratings & Reviews ──────────────────────────────────────────────── */}
                <section className="mt-20 pt-12 border-t border-[#ebebeb]">
                    <h2 className="text-2xl font-bold text-[#0a0a0a] tracking-tight mb-10">Rating &amp; Reviews</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
                        {/* Left — aggregate score */}
                        <div className="space-y-5">
                            <div className="flex items-end gap-2">
                                <span className="text-[72px] font-black text-[#0a0a0a] leading-none tracking-tight">
                                    {rating.toFixed(1)}
                                </span>
                                <div className="pb-2">
                                    <span className="text-lg text-[#9a9a9a] font-light">/ 5</span>
                                    <p className="text-xs text-[#9a9a9a] mt-0.5">{totalReviews} Global Reviews</p>
                                </div>
                            </div>
                            <Stars rating={rating} size="md" />

                            {/* Breakdown bars */}
                            <div className="space-y-2">
                                {breakdown.map((count, idx) => {
                                    const starLabel = 5 - idx;
                                    const total = Math.max(breakdown.reduce((a, b) => a + b, 0), 1);
                                    const pct = Math.round((count / total) * 100);
                                    return (
                                        <div key={starLabel} className="flex items-center gap-2">
                                            <span className="text-xs text-amber-400 w-3">{starLabel}</span>
                                            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                            </svg>
                                            <div className="flex-1 h-1.5 bg-[#ebebeb] rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-amber-400 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, delay: 0.1 * idx, ease: 'easeOut' }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-[#9a9a9a] w-5 text-right">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {reviewsToDisplay.map((review: any) => (
                                <div key={review._id} className="bg-[#fafaf9] rounded-2xl p-5 border border-[#f0f0f0]">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://api.dicebear.com/7.x/personas/svg?seed=${review.name}`}
                                                alt={review.name}
                                                className="w-9 h-9 rounded-full bg-[#f0eeeb] object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${review.name}&background=ebebeb&color=0a0a0a`; }}
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-[#0a0a0a]">{review.name}</p>
                                                <Stars rating={review.rating} size="sm" />
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-[#9a9a9a]">
                                            {new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#5a5a5a] leading-relaxed">"{review.comment}"</p>
                                </div>
                            ))}

                            {allAvailableReviews.length > 3 && (
                                <div className="flex justify-center pt-4">
                                    <button
                                        onClick={() => setShowAllReviews(!showAllReviews)}
                                        className="text-sm font-semibold text-[#0a0a0a] border border-[#e0e0e0] rounded-full px-6 py-2.5 hover:bg-[#f5f5f5] transition-colors"
                                    >
                                        {showAllReviews ? 'Show Less ▲' : `Show All ${allAvailableReviews.length} Reviews ▼`}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* ── Sticky mobile CTA ─────────────────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[#ebebeb] px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex-1">
                    <p className="text-xs text-[#9a9a9a] truncate">{product.name}</p>
                    <p className="text-sm font-bold text-[#0a0a0a]">
                        ₹{product.isOnSale && product.discountPercentage && product.originalPrice
                            ? Math.round(product.originalPrice * (1 - product.discountPercentage / 100)).toLocaleString('en-IN')
                            : product.price.toLocaleString('en-IN')}
                    </p>
                </div>
                <motion.button
                    onClick={toggleWishlist}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 flex-shrink-0 rounded-xl border-2 border-[#e0e0e0] flex items-center justify-center">
                    <FiHeart className={`w-[18px] h-[18px] ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#5a5a5a]'}`} fill={isWishlisted ? 'currentColor' : 'none'} />
                </motion.button>
                <motion.button
                    onClick={addToCartHandler}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 px-6 h-11 bg-[#0a0a0a] text-white rounded-xl font-semibold text-sm flex items-center gap-2">
                    <FiShoppingCart className="w-4 h-4" />
                    Add to Cart
                </motion.button>
            </div>

            {/* ── Lightbox ──────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightbox(false)}>
                        <motion.img
                            src={images[activeImg]} alt={product.name}
                            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        />
                        <button onClick={() => setLightbox(false)}
                            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Size Guide Modal ─────────────────────────────────────────────── */}
            <SizeGuideModal isOpen={sizeModal} onClose={() => setSizeModal(false)} />
        </motion.div>
    );
};

export default ProductDetailPage;
