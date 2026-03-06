import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toastService } from '../services/toastService';
import {
    FiShield, FiChevronRight, FiLock, FiCheck, FiTruck,
    FiAlertCircle, FiArrowLeft, FiPlus, FiMapPin
} from 'react-icons/fi';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import type { AppDispatch, RootState } from '../redux';

/* ── Helpers ────────────────────────────────────────────────────── */
const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/* ── Field Component ────────────────────────────────────────────── */
const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-2">{label}</label>
        {children}
        {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" />{error}
            </motion.p>
        )}
    </div>
);

const inputCls = (err?: string) =>
    `w-full px-4 py-3 bg-[#f8f7f5] border rounded-xl text-sm text-[#1a1a1a] outline-none transition-all
     focus:bg-white focus:ring-2 focus:border-transparent
     ${err ? 'border-red-300 focus:ring-red-300' : 'border-[#f0eeec] focus:ring-[#1a1a1a]/15'}`;

/* ── Step Indicator ─────────────────────────────────────────────── */
const STEPS = ['Shipping', 'Payment', 'Confirm'];
const StepBar = ({ step }: { step: number }) => (
    <div className="flex items-center justify-center gap-0 mb-10">
        {STEPS.map((label, i) => {
            const idx = i + 1;
            const done = step > idx;
            const active = step === idx;
            return (
                <div key={label} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <motion.div
                            animate={{ scale: active ? 1.1 : 1 }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                ${done ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                                    : active ? 'bg-[#1a1a1a] text-white shadow-md shadow-[#1a1a1a]/20'
                                        : 'bg-[#f0eeec] text-[#bbb]'}`}
                        >
                            {done ? <FiCheck className="w-4 h-4" /> : idx}
                        </motion.div>
                        <span className={`mt-2 text-[10px] font-bold tracking-widest uppercase transition-colors
                            ${active ? 'text-[#1a1a1a]' : done ? 'text-emerald-500' : 'text-[#ccc]'}`}>
                            {label}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={`w-16 sm:w-24 h-0.5 mx-3 mb-5 transition-colors duration-500 ${step > idx ? 'bg-emerald-400' : 'bg-[#f0eeec]'}`} />
                    )}
                </div>
            );
        })}
    </div>
);

/* ── Order Summary Sidebar ──────────────────────────────────────── */
const OrderSummary = ({ items }: { items: any[] }) => {
    const itemsTotal = items.reduce((a, i) => a + (i.price * i.quantity), 0);
    const shipping = itemsTotal > 1000 ? 0 : 99;
    const tax = Math.round(itemsTotal * 0.18);
    const total = itemsTotal + shipping + tax;

    return (
        <div className="bg-white rounded-2xl border border-[#f0eeec] shadow-sm p-6 sticky top-24">
            <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-widest mb-5">Order Summary</h3>
            <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
                {items.map((item, i) => (
                    <div key={`${item.product}-${i}`} className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#f8f7f5] flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#1a1a1a] truncate">{item.name}</p>
                            <p className="text-[10px] text-[#aaa]">Qty {item.quantity} {item.size ? `· ${item.size}` : ''}</p>
                        </div>
                        <p className="text-xs font-bold text-[#1a1a1a] flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                ))}
            </div>
            <div className="border-t border-[#f5f4f2] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#666]"><span>Subtotal</span><span>₹{itemsTotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-[#666]"><span>Shipping</span><span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">Free</span> : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-[#666]"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-bold text-[#1a1a1a] text-base pt-2 border-t border-[#f5f4f2]">
                    <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#f5f4f2] text-[10px] text-[#aaa] font-medium">
                <FiShield className="w-3.5 h-3.5 text-emerald-500" />
                SSL Encrypted · Safe & Secure Checkout
            </div>
        </div>
    );
};

/* ── Main Checkout ───────────────────────────────────────────────── */
const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { userInfo } = useSelector((s: RootState) => s.auth);
    const cartItems = useSelector((s: RootState) => s.cart.items);

    const [step, setStep] = useState(1);
    const [paying, setPaying] = useState(false);

    /* Shipping */
    const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>(
        (userInfo as any)?.addresses?.find((a: any) => a.isDefault)?._id || ((userInfo as any)?.addresses?.length ? (userInfo as any).addresses[0]._id : 'new')
    );
    const [ship, setShip] = useState({ firstName: '', lastName: '', address: '', city: '', state: '', postalCode: '', country: 'India', phone: '' });
    const [shipErr, setShipErr] = useState<Record<string, string>>({});
    const [saveAddress, setSaveAddress] = useState(false);

    // Populate ship form if a saved address is selected
    useState(() => {
        if (selectedAddressId !== 'new' && (userInfo as any)?.addresses) {
            const addr = (userInfo as any).addresses.find((a: any) => a._id === selectedAddressId);
            if (addr) {
                const names = addr.fullName.split(' ');
                setShip({
                    firstName: names[0] || '',
                    lastName: names.slice(1).join(' ') || '',
                    address: addr.street,
                    city: addr.city,
                    state: addr.state,
                    postalCode: addr.postalCode,
                    country: addr.country || 'India',
                    phone: addr.phone
                });
            }
        }
    });

    const handleAddressSelect = (id: string) => {
        setSelectedAddressId(id);
        if (id !== 'new' && (userInfo as any)?.addresses) {
            const addr = (userInfo as any).addresses.find((a: any) => a._id === id);
            if (addr) {
                const names = addr.fullName.split(' ');
                setShip({
                    firstName: names[0] || '',
                    lastName: names.slice(1).join(' ') || '',
                    address: addr.street,
                    city: addr.city,
                    state: addr.state,
                    postalCode: addr.postalCode,
                    country: addr.country || 'India',
                    phone: addr.phone
                });
                setShipErr({});
            }
        } else {
            setShip({ firstName: '', lastName: '', address: '', city: '', state: '', postalCode: '', country: 'India', phone: '' });
        }
    };

    /* Payment */
    const [method, setMethod] = useState<'card' | 'paypal' | 'upi'>('card');
    const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [cardErr] = useState<Record<string, string>>({});

    /* Totals */
    const itemsTotal = useMemo(() => cartItems.reduce((a, i) => a + (i.price * i.quantity), 0), [cartItems]);
    const shipping = itemsTotal > 1000 ? 0 : 99;
    const tax = Math.round(itemsTotal * 0.18);
    const grand = itemsTotal + shipping + tax;

    /* ── Validate Shipping ── */
    const validateShipping = () => {
        const errs: Record<string, string> = {};
        if (!ship.firstName.trim()) errs.firstName = 'First name is required';
        if (!ship.lastName.trim()) errs.lastName = 'Last name is required';
        if (!ship.address.trim()) errs.address = 'Address is required';
        if (!ship.city.trim()) errs.city = 'City is required';
        if (!ship.postalCode.trim()) errs.postalCode = 'Postal code is required';
        else if (!/^\d{6}$/.test(ship.postalCode)) errs.postalCode = 'Enter a valid 6-digit pin';
        if (!ship.phone.trim()) errs.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(ship.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid 10-digit number';
        setShipErr(errs);
        return Object.keys(errs).length === 0;
    };

    /* ── Validate Card ── */

    /* ── Simulated Payment ── */
    const handlePay = async () => {
        setPaying(true);

        try {
            const transactionId = `SIM-${Date.now()}`;
            const result = await dispatch(createOrder({
                shippingAddress: {
                    fullName: `${ship.firstName} ${ship.lastName}`,
                    phone: ship.phone,
                    address: ship.address,
                    city: ship.city,
                    postalCode: ship.postalCode,
                    state: ship.state,
                    country: ship.country,
                },
                paymentMethod: method === 'card' ? 'Credit Card' : method === 'paypal' ? 'PayPal' : 'UPI',
                transactionId,
                orderItems: cartItems.map(item => ({
                    product: item.product, // Must be Mongo ObjectId
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    qty: item.quantity,
                    size: item.size
                })),
                saveAddress: selectedAddressId === 'new' ? saveAddress : false
            }));

            if (createOrder.fulfilled.match(result)) {
                dispatch(clearCart());
                toastService.success('Order placed successfully!', [
                    { label: 'Track Order', path: `/order/${result.payload._id}` },
                    { label: 'Continue Shopping', path: '/shop' }
                ]);
                navigate(`/order/${result.payload._id}`);
            } else {
                toastService.error(result.payload as string || 'Checkout failed');
            }
        } catch (err: any) {
            toastService.error('Checkout failed');
        } finally {
            setPaying(false);
        }
    };

    /* ── Empty Cart Guard ── */
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-[#f0eeec] flex items-center justify-center mx-auto mb-4">
                        <FiTruck className="text-[#ccc] text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Your cart is empty</h2>
                    <p className="text-[#aaa] text-sm mb-6">Add items before checking out.</p>
                    <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-sm font-bold rounded-xl hover:bg-[#333] transition-colors">
                        Browse Collection
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f5] pt-20 pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="text-[10px] text-[#aaa] tracking-[0.3em] uppercase mb-1">VASTRAA</p>
                    <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight flex items-center justify-center gap-2">
                        <FiLock className="w-5 h-5 text-emerald-500" />
                        Secure Checkout
                    </h1>
                </div>

                <StepBar step={step} />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Form */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">

                            {/* ─── STEP 1: SHIPPING ────────────────────── */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                                    <div className="bg-white rounded-2xl border border-[#f0eeec] shadow-sm overflow-hidden">
                                        <div className="px-8 py-6 border-b border-[#f5f4f2]">
                                            <h2 className="text-lg font-bold text-[#1a1a1a] tracking-tight">Shipping Information</h2>
                                            <p className="text-[#aaa] text-sm mt-0.5">Where should we deliver your order?</p>
                                        </div>
                                        <div className="p-8 space-y-8">
                                            {/* Saved Addresses Selection */}
                                            {(userInfo as any)?.addresses && (userInfo as any).addresses.length > 0 && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#aaa]">Select Saved Address</h3>
                                                        <button onClick={() => handleAddressSelect('new')} className="text-[10px] font-bold text-[#1a1a1a] hover:underline flex items-center gap-1">
                                                            <FiPlus size={10} /> Add New
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {(userInfo as any).addresses.map((addr: any) => (
                                                            <div
                                                                key={addr._id}
                                                                onClick={() => handleAddressSelect(addr._id)}
                                                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${selectedAddressId === addr._id ? 'border-[#1a1a1a] bg-[#f8f7f5] shadow-lg shadow-black/[0.03]' : 'border-[#f0eeec] hover:border-[#ddd]'}`}
                                                            >
                                                                {selectedAddressId === addr._id && (
                                                                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                                                        <FiCheck className="text-white w-2.5 h-2.5" />
                                                                    </div>
                                                                )}
                                                                <p className="text-xs font-bold text-[#1a1a1a] mb-1">{addr.fullName}</p>
                                                                <p className="text-[10px] text-[#666] leading-relaxed truncate">{addr.street}</p>
                                                                <p className="text-[10px] text-[#666]">{addr.city}, {addr.postalCode}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Address Form (only show if 'new' or no addresses) */}
                                            {(selectedAddressId === 'new' || !(userInfo as any)?.addresses?.length) && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 pt-4 border-t border-[#f5f4f2]">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <FiMapPin className="text-[#1a1a1a]" size={14} />
                                                        <h3 className="text-sm font-bold text-[#1a1a1a]">Enter Shipping Details</h3>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                        <Field label="First Name" error={shipErr.firstName}>
                                                            <input className={inputCls(shipErr.firstName)} placeholder="Aarav"
                                                                value={ship.firstName} onChange={e => setShip(p => ({ ...p, firstName: e.target.value }))} />
                                                        </Field>
                                                        <Field label="Last Name" error={shipErr.lastName}>
                                                            <input className={inputCls(shipErr.lastName)} placeholder="Sharma"
                                                                value={ship.lastName} onChange={e => setShip(p => ({ ...p, lastName: e.target.value }))} />
                                                        </Field>
                                                    </div>
                                                    <Field label="Address" error={shipErr.address}>
                                                        <input className={inputCls(shipErr.address)} placeholder="123 MG Road, Apartment 4B"
                                                            value={ship.address} onChange={e => setShip(p => ({ ...p, address: e.target.value }))} />
                                                    </Field>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                        <Field label="City" error={shipErr.city}>
                                                            <input className={inputCls(shipErr.city)} placeholder="Bengaluru"
                                                                value={ship.city} onChange={e => setShip(p => ({ ...p, city: e.target.value }))} />
                                                        </Field>
                                                        <Field label="State">
                                                            <input className={inputCls()} placeholder="Karnataka"
                                                                value={ship.state} onChange={e => setShip(p => ({ ...p, state: e.target.value }))} />
                                                        </Field>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                        <Field label="PIN Code" error={shipErr.postalCode}>
                                                            <input className={inputCls(shipErr.postalCode)} placeholder="560001" maxLength={6}
                                                                value={ship.postalCode} onChange={e => setShip(p => ({ ...p, postalCode: e.target.value.replace(/\D/g, '') }))} />
                                                        </Field>
                                                        <Field label="Country">
                                                            <select className={inputCls()} value={ship.country} onChange={e => setShip(p => ({ ...p, country: e.target.value }))}>
                                                                <option>India</option>
                                                                <option>United States</option>
                                                                <option>United Kingdom</option>
                                                            </select>
                                                        </Field>
                                                    </div>
                                                    <Field label="Phone Number" error={shipErr.phone}>
                                                        <input className={inputCls(shipErr.phone)} placeholder="9876543210" maxLength={10}
                                                            value={ship.phone} onChange={e => setShip(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))} />
                                                    </Field>

                                                    <label className="flex items-center gap-3 cursor-pointer group w-fit mt-4">
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                checked={saveAddress}
                                                                onChange={e => setSaveAddress(e.target.checked)}
                                                                className="sr-only"
                                                            />
                                                            <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${saveAddress ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'bg-white border-[#f0eeec]'}`}>
                                                                {saveAddress && <FiCheck className="text-white w-3 h-3" />}
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-bold text-[#1a1a1a] select-none">Save address to profile for future orders</span>
                                                    </label>
                                                </motion.div>
                                            )}
                                        </div>
                                        <div className="px-8 pb-8">
                                            <button onClick={() => { if (validateShipping()) setStep(2); }}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-[#1a1a1a] text-white text-sm font-bold rounded-xl hover:bg-[#333] active:scale-[0.99] transition-all">
                                                Continue to Payment <FiChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── STEP 2: PAYMENT ─────────────────────── */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                                    <div className="bg-white rounded-2xl border border-[#f0eeec] shadow-sm overflow-hidden">
                                        <div className="px-8 py-6 border-b border-[#f5f4f2]">
                                            <h2 className="text-lg font-bold text-[#1a1a1a] tracking-tight">Payment Method</h2>
                                            <p className="text-[#aaa] text-sm mt-0.5">Choose how you'd like to pay</p>
                                        </div>
                                        <div className="p-8 space-y-4">
                                            {/* Method Selector */}
                                            {[
                                                { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay', icon: '💳' },
                                                { id: 'paypal', label: 'PayPal', sub: 'Pay with your PayPal account', icon: '🅿️' },
                                                { id: 'upi', label: 'UPI', sub: 'GPay, PhonePe, Paytm', icon: '📱' },
                                            ].map(opt => (
                                                <label key={opt.id}
                                                    className={`flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer border-2 transition-all
                                                        ${method === opt.id ? 'border-[#1a1a1a] bg-[#f8f7f5]' : 'border-[#f0eeec] hover:border-[#ddd] hover:bg-[#fafaf9]'}`}>
                                                    <input type="radio" name="payMethod" value={opt.id}
                                                        checked={method === opt.id as any}
                                                        onChange={() => setMethod(opt.id as any)}
                                                        className="sr-only" />
                                                    <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-[#1a1a1a]">{opt.label}</p>
                                                        <p className="text-[11px] text-[#aaa]">{opt.sub}</p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                                                        ${method === opt.id ? 'border-[#1a1a1a] bg-[#1a1a1a]' : 'border-[#ccc]'}`}>
                                                        {method === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                    </div>
                                                </label>
                                            ))}

                                            {/* Card Form */}
                                            <AnimatePresence>
                                                {method === 'card' && (
                                                    <motion.div key="cardform"
                                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden">
                                                        <div className="mt-2 p-6 bg-[#f8f7f5] rounded-xl border border-[#f0eeec] space-y-4">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">Card Details</p>
                                                                <div className="flex gap-1.5">
                                                                    {['VISA', 'MC', 'RUPAY'].map(b => (
                                                                        <span key={b} className="text-[9px] font-bold text-[#888] border border-[#e8e8e8] bg-white px-1.5 py-0.5 rounded">{b}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <Field label="Card Number" error={cardErr.number}>
                                                                <input className={inputCls(cardErr.number)} placeholder="1234 5678 9012 3456"
                                                                    value={card.number} onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))} />
                                                            </Field>
                                                            <Field label="Name on Card" error={cardErr.name}>
                                                                <input className={inputCls(cardErr.name)} placeholder="AARAV SHARMA"
                                                                    value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value.toUpperCase() }))} />
                                                            </Field>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <Field label="Expiry (MM/YY)" error={cardErr.expiry}>
                                                                    <input className={inputCls(cardErr.expiry)} placeholder="MM/YY"
                                                                        value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} />
                                                                </Field>
                                                                <Field label="CVC" error={cardErr.cvc}>
                                                                    <input className={inputCls(cardErr.cvc)} placeholder="•••" maxLength={4} type="password"
                                                                        value={card.cvc} onChange={e => setCard(p => ({ ...p, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))} />
                                                                </Field>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {method === 'paypal' && (
                                                    <motion.div key="paypalform" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                        <div className="p-5 bg-[#f0f6fd] rounded-xl border border-[#c5dcf4] text-center">
                                                            <p className="text-sm font-medium text-[#0070ba]">You'll be redirected to complete PayPal checkout securely. (Simulated)</p>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {method === 'upi' && (
                                                    <motion.div key="upiform" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                        <div className="p-5 bg-[#f0fbf5] rounded-xl border border-[#b6e8ca]">
                                                            <Field label="UPI ID">
                                                                <input className={inputCls()} placeholder="yourname@upi" />
                                                            </Field>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Secure note */}
                                            <div className="flex items-center gap-2 text-[11px] text-[#aaa] pt-2">
                                                <FiLock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                Your payment info is encrypted and never stored on our servers.
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="px-8 pb-8 flex gap-3">
                                            <button onClick={() => setStep(1)}
                                                className="flex items-center gap-2 px-5 py-4 border border-[#f0eeec] text-[#666] text-sm font-medium rounded-xl hover:bg-[#f8f7f5] hover:text-[#1a1a1a] transition-all">
                                                <FiArrowLeft className="w-4 h-4" /> Back
                                            </button>
                                            <button onClick={handlePay} disabled={paying}
                                                className={`flex-1 flex items-center justify-center gap-2.5 py-4 text-sm font-bold rounded-xl transition-all
                                                    ${paying ? 'bg-[#555] cursor-not-allowed' : 'bg-[#1a1a1a] hover:bg-[#333] active:scale-[0.99]'} text-white`}>
                                                {paying ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Processing Payment…
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiLock className="w-4 h-4" />
                                                        Pay ₹{grand.toLocaleString('en-IN')}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>

                        {/* Shipping summary pill on step 2 */}
                        {step === 2 && ship.address && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="mt-4 flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-[#f0eeec] text-xs text-[#666]">
                                <FiTruck className="w-4 h-4 text-[#1a1a1a] flex-shrink-0" />
                                <span className="flex-1 truncate">Delivering to: <strong className="text-[#1a1a1a]">{ship.address}, {ship.city} — {ship.postalCode}</strong></span>
                                <button onClick={() => setStep(1)} className="text-[#1a1a1a] font-bold hover:underline flex-shrink-0">Edit</button>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar Summary */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <OrderSummary items={cartItems} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
