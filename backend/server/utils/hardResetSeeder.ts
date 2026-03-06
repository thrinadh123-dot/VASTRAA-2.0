import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import Order from '../models/Order';
import Cart from '../models/Cart';
import connectDB from '../config/db';

dotenv.config();

const productsData = [
    // Men's Products
    {
        name: 'Essential White Crew Tee', category: 'Men', subcategory: 'T-Shirts',
        price: 1499, rating: 4.5, numReviews: 445, badge: '',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'Heavyweight 220 GSM combed cotton with a ribbed crew neck. The perfect canvas for any outfit.',
        images: ['https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Oversized Drop-Shoulder Tee', category: 'Men', subcategory: 'T-Shirts',
        price: 1799, rating: 4.3, numReviews: 312, badge: 'NEW',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Relaxed drop-shoulder silhouette in 200 GSM cotton jersey. Minimal branding, maximum comfort.',
        images: ['https://images.unsplash.com/photo-1666358085449-a10a39f33942?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Striped Breton Tee', category: 'Men', subcategory: 'T-Shirts',
        price: 1799, originalPrice: 1999, isOnSale: true, rating: 4.4, numReviews: 186, badge: 'SALE',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Classic French Breton stripe in 100% ring-spun cotton. Heritage design built to last.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Ci3pG-GfvuJbDfbJfvqZJ-jczec-_8AGsg&s'],
        stock: 50
    },
    {
        name: 'Henley Long-Sleeve Tee', category: 'Men', subcategory: 'T-Shirts',
        price: 2199, rating: 4.5, numReviews: 224, badge: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Ribbed Henley placket in waffle-knit cotton. Wear alone or beneath a flannel shirt.',
        images: ['https://images.unsplash.com/photo-1565128354282-a6390fc125b2?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Crew Neck Pocket Tee', category: 'Men', subcategory: 'T-Shirts',
        price: 1199, originalPrice: 1599, isOnSale: true, rating: 4.2, numReviews: 163, badge: 'SALE',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: '180 GSM cotton with a single chest pocket. A classic casual staple.',
        images: ['https://plus.unsplash.com/premium_photo-1683134099563-4b6f06329586?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Waffle Knit Thermal Top', category: 'Men', subcategory: 'T-Shirts',
        price: 2299, rating: 4.4, numReviews: 129, badge: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Waffle-stitch cotton-modal blend with a crew neck. Lightweight layering.',
        images: ['https://plus.unsplash.com/premium_photo-1705495968134-0d842e74c601?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Racer-Back Performance Tee', category: 'Men', subcategory: 'T-Shirts',
        price: 1699, rating: 4.3, numReviews: 201, badge: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Moisture-wicking polyester blend with flatlock seams. Built for movement.',
        images: ['https://cultstore.com/cdn/shop/files/703237_1.jpg?v=1750402180&width=5000'],
        stock: 50
    },
    {
        name: 'Slim Fit Piqué Polo', category: 'Men', subcategory: 'T-Shirts',
        price: 1999, originalPrice: 2499, isOnSale: true, rating: 4.5, numReviews: 201, badge: 'SALE',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Piqué cotton polo with a ribbed collar and two-button placket.',
        images: ['https://cdn.muftijeans.in/media/catalog/product/r/e/resized_images_lot3_mfk-10216-t-57-maroon_1_mfk-10216-t-57-maroon.jpeg'],
        stock: 50
    },
    {
        name: 'Slim Fit Oxford Shirt', category: 'Men', subcategory: 'Formal Shirts',
        price: 2799, rating: 4.5, numReviews: 128, badge: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Crisp 100% cotton Oxford weave, tailored slim fit, button-down collar.',
        images: ['https://levi.in/cdn/shop/files/245770260_01_Styleshot.jpg?v=1736252337'],
        stock: 50
    },
    {
        name: 'White Formal Dress Shirt', category: 'Men', subcategory: 'Formal Shirts',
        price: 2999, rating: 4.7, numReviews: 94, badge: '',
        sizes: ['S', 'M', 'L', 'XL'],
        description: '100% cotton poplin with a spread collar and French placket. Boardroom-ready.',
        images: ['https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/14198228/2024/3/7/194f70de-f5ab-4bfe-86bc-ae385d5330e81709790482293-DENNISON-Men-White-Solid-Pure-Cotton-Smart-Slim-Fit-Formal-S-6.jpg'],
        stock: 50
    },
    {
        name: 'Linen Casual Shirt', category: 'Men', subcategory: 'Formal Shirts',
        price: 2499, rating: 4.4, numReviews: 112, badge: 'NEW',
        sizes: ['S', 'M', 'L', 'XL'],
        description: '100% linen in a relaxed fit with a band collar. Naturally breathable.',
        images: ['https://images.unsplash.com/photo-1740711152088-88a009e877bb?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Flannel Check Overshirt', category: 'Men', subcategory: 'Formal Shirts',
        price: 3299, rating: 4.5, numReviews: 138, badge: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Brushed cotton flannel in a classic heritage check. Shirt and jacket in one.',
        images: ['https://images.unsplash.com/photo-1590392139414-6997d09e2da7?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Corduroy Overshirt', category: 'Men', subcategory: 'Formal Shirts',
        price: 3499, rating: 4.6, numReviews: 77, badge: '',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Fine-wale corduroy in an oversized shirt-jacket silhouette.',
        images: ['https://images.unsplash.com/photo-1647013629840-13c441a3221b?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Contrast Stitch Polo', category: 'Men', subcategory: 'Formal Shirts',
        price: 2599, rating: 4.4, numReviews: 77, badge: '',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Cotton piqué polo with tonal contrast stitching. Smart-casual at its best.',
        images: ['https://www.jackjones.in/cdn/shop/files/902342901_g0_b910a9ab-949d-426e-bae5-9b8b2a0c98fd.jpg?v=1770620717&width=2048'],
        stock: 50
    },
    {
        name: 'Essential Zip-Up Hoodie', category: 'Men', subcategory: 'Hoodies',
        price: 3299, rating: 4.6, numReviews: 174, badge: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Heavyweight 400 GSM French terry with a full-zip front and kangaroo pocket.',
        images: ['https://plus.unsplash.com/premium_photo-1705883268316-e7270ceaffcf?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Pullover Crew Hoodie', category: 'Men', subcategory: 'Hoodies',
        price: 2999, rating: 4.5, numReviews: 188, badge: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Loopback fleece interior with a ribbed hem and cuffs. Weekend essential.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRLPE83tSBOmGONF0CMSFgh7s6jWY8FKlqLA&s'],
        stock: 50
    },
    {
        name: 'Merino Crewneck Sweater', category: 'Men', subcategory: 'Hoodies',
        price: 4299, rating: 4.8, numReviews: 87, badge: '',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Extra-fine 18.5 micron merino wool. Temperature-regulating and machine washable.',
        images: ['https://images.unsplash.com/photo-1646983843001-8df73aef2b8a?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Fleece Half-Zip Pullover', category: 'Men', subcategory: 'Hoodies',
        price: 2799, originalPrice: 3499, isOnSale: true, rating: 4.5, numReviews: 133, badge: 'SALE',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Anti-pill polar fleece with a quarter-zip collar. The go-to mid-layer.',
        images: ['https://assets.ajio.com/medias/sys_master/root/20240109/uRrS/659d465954c30e62769f4661/-473Wx593H-466866480-blue-MODEL.jpg'],
        stock: 50
    },
    {
        name: 'Merino V-Neck Cardigan', category: 'Men', subcategory: 'Hoodies',
        price: 4499, rating: 4.7, numReviews: 56, badge: 'NEW',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Fine-gauge merino cardigan with a button closure and ribbed trim.',
        images: ['https://images.hawesandcurtis.com/tr:w-600,q-80/JW/JWPWH007-F01-205970-800px-1040px.jpg'],
        stock: 50
    },
    {
        name: 'Cable-Knit Fisherman Sweater', category: 'Men', subcategory: 'Hoodies',
        price: 3999, rating: 4.6, numReviews: 73, badge: '',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Chunky Irish cable knit in 100% wool with a crew neck and ribbed hem.',
        images: ['https://images.unsplash.com/photo-1758537698215-af1e35acb911?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Vintage Wash Denim Jacket', category: 'Men', subcategory: 'Jackets',
        price: 3999, rating: 4.7, numReviews: 210, badge: '',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Stone-washed denim with subtle distressing and classic Western yoke stitching.',
        images: ['https://images.unsplash.com/photo-1657349038547-b18a07fb4329?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Quilted Bomber Jacket', category: 'Men', subcategory: 'Jackets',
        price: 3399, originalPrice: 4299, isOnSale: true, rating: 4.6, numReviews: 84, badge: 'SALE',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Satin-shell diamond quilting with a ribbed waistband and cuffs. Flight-inspired.',
        images: ['https://images.unsplash.com/photo-1662624080599-dd453fbe6cd0?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Nylon Packable Windbreaker', category: 'Men', subcategory: 'Jackets',
        price: 3499, rating: 4.5, numReviews: 93, badge: '',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Lightweight 20D ripstop nylon that packs into its chest pocket.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBXNYJlf4uaQkpmH-_sIW2VVK4cRNULquWgQ&s'],
        stock: 50
    },
    {
        name: 'Utility Field Jacket', category: 'Men', subcategory: 'Jackets',
        price: 4499, rating: 4.6, numReviews: 79, badge: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Waxed cotton field jacket with four bellows pockets and a storm-flap collar.',
        images: ['https://d1pdzcnm6xgxlz.cloudfront.net/tops/8905875530916-9.jpg'],
        stock: 50
    },
    {
        name: 'Puffer Down Jacket', category: 'Men', subcategory: 'Jackets',
        price: 4999, rating: 4.7, numReviews: 108, badge: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: '90/10 duck-down fill with a durable ripstop outer shell. Packable.',
        images: ['https://images.unsplash.com/photo-1621343342511-d9923a83bcf0?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Slim Taper Stretch Jeans', category: 'Men', subcategory: 'Jeans',
        price: 2799, rating: 4.4, numReviews: 302, badge: '',
        sizes: ['30', '32', '34', '36'],
        description: 'Stretch-cotton denim in a slim-taper cut. Fades beautifully with each wash.',
        images: ['https://levi.in/cdn/shop/files/006A30001_01_Styleshot.jpg?v=1770706726'],
        stock: 50
    },
    {
        name: 'Dark Wash Slim Jeans', category: 'Men', subcategory: 'Jeans',
        price: 2499, rating: 4.5, numReviews: 219, badge: '',
        sizes: ['30', '32', '34', '36', '38'],
        description: 'Dark indigo slim cut with a clean finish. Dresses up or down effortlessly.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1bx0ajDOYiryb47GulKwVFBSQVNOwVERBRA&s'],
        stock: 50
    },
    {
        name: 'Raw Selvedge Straight Jeans', category: 'Men', subcategory: 'Jeans',
        price: 4999, rating: 4.9, numReviews: 38, badge: 'LIMITED',
        sizes: ['30', '32', '34', '36'],
        description: 'Japanese selvedge denim, unsanforized and unwashed. Every fade is uniquely yours.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTManSPtbi7Iah8ebSbxge3MIHCs5MBxKAL5Q&s'],
        stock: 50
    },
    {
        name: 'Slim Chino Trousers', category: 'Men', subcategory: 'Jeans',
        price: 2199, rating: 4.4, numReviews: 156, badge: '',
        sizes: ['30', '32', '34', '36', '38'],
        description: 'Stretch-twill in a clean slim cut. Wrinkle-resistant and office-ready.',
        images: ['https://imagescdn.peterengland.com/img/app/product/3/39623333-12799845.jpg?auto=format&w=390'],
        stock: 50
    },
    {
        name: 'Relaxed Cargo Pants', category: 'Men', subcategory: 'Jeans',
        price: 1899, originalPrice: 2699, isOnSale: true, rating: 4.3, numReviews: 133, badge: 'SALE',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Ripstop nylon cargo with six pockets and an elasticated back waistband.',
        images: ['https://www.dennislingo.com/cdn/shop/files/DLMCTS24006_SG_1.jpg?v=1713528425'],
        stock: 50
    },
    {
        name: 'Low-Top Canvas Sneakers', category: 'Men', subcategory: 'Sneakers',
        price: 2199, rating: 4.3, numReviews: 95, badge: '',
        sizes: ['7', '8', '9', '10', '11', '12'],
        description: 'Vulcanised canvas upper with a rubber sole and cushioned insole.',
        images: ['https://images.unsplash.com/photo-1536250194479-7b3cbda7f847?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Retro Running Sneakers', category: 'Men', subcategory: 'Sneakers',
        price: 3499, rating: 4.6, numReviews: 167, badge: 'NEW',
        sizes: ['7', '8', '9', '10', '11', '12'],
        description: 'Vintage track profile with a cushioned EVA midsole and suede overlays.',
        images: ['https://images.unsplash.com/photo-1698611028521-4c284ca88b11?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Leather Derby Shoes', category: 'Men', subcategory: 'Sneakers',
        price: 4499, rating: 4.8, numReviews: 43, badge: '',
        sizes: ['7', '8', '9', '10', '11'],
        description: 'Full-grain calfskin with a Goodyear-welted rubber sole. Decades of wear.',
        images: ['https://images.unsplash.com/photo-1632561742737-ab007df44013?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Waxed Chelsea Boots', category: 'Men', subcategory: 'Sneakers',
        price: 4999, rating: 4.8, numReviews: 52, badge: 'LIMITED',
        sizes: ['7', '8', '9', '10', '11', '12'],
        description: 'Pull-on Chelsea with a waxed leather upper and stacked leather heel.',
        images: ['https://images.unsplash.com/photo-1608629601270-a0007becead3?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Waterproof Hiking Boots', category: 'Men', subcategory: 'Sneakers',
        price: 3499, originalPrice: 4299, isOnSale: true, rating: 4.6, numReviews: 71, badge: 'SALE',
        sizes: ['7', '8', '9', '10', '11', '12'],
        description: 'Waterproof nubuck with a Vibram rubber outsole. Hiking performance daily.',
        images: ['https://images.unsplash.com/photo-1631287381310-925554130169?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },
    {
        name: 'Slim Fit Wool Blazer', category: 'Men', subcategory: 'Blazers',
        price: 4799, rating: 4.8, numReviews: 62, badge: 'NEW',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Italian wool-blend with a notch lapel and structured shoulders.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvo1XRAfLbLKt6b-XYq_3Pj5O2FZkfHtjbug&s'],
        stock: 50
    },
    {
        name: 'Double-Breasted Blazer', category: 'Men', subcategory: 'Blazers',
        price: 4999, rating: 4.7, numReviews: 38, badge: 'LIMITED',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Peak-lapel double-breasted in a textured bouclé blend. Bold statement.',
        images: ['https://frenchcrown.in/cdn/shop/files/BL168-DB_2.jpg?v=1739251561&width=3500'],
        stock: 50
    },
    {
        name: 'Slim Two-Piece Suit', category: 'Men', subcategory: 'Blazers',
        price: 4999, rating: 4.8, numReviews: 34, badge: 'NEW',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Two-piece Italian wool suit with flat-front trousers.',
        images: ['https://m.media-amazon.com/images/I/712XrCzm2lL._AC_UY1000_.jpg'],
        stock: 50
    },
    {
        name: 'Pinstripe Dress Trousers', category: 'Men', subcategory: 'Blazers',
        price: 2799, originalPrice: 3499, isOnSale: true, rating: 4.5, numReviews: 44, badge: 'SALE',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Subtle chalk-stripe wool-blend with a mid-rise waist and clean forward drape.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd-DVkjJ_vLVQZyoFC0cS6PSWGiNASCf6rJQ&s'],
        stock: 50
    },
    {
        name: 'Shearling Aviator Jacket', category: 'Men', subcategory: 'Blazers',
        price: 4999, rating: 4.9, numReviews: 26, badge: 'LIMITED',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Genuine leather shell with a natural shearling collar and lining.',
        images: ['https://images.unsplash.com/photo-1551028442-ee84b4d3a50a?w=800&auto=format&fit=crop&q=80'],
        stock: 50
    },

    // Women's Products
    {
        name: 'Ribbed Knit Midi Dress', category: 'Women', subcategory: 'Dresses',
        price: 2799, rating: 4.7, numReviews: 213, badge: 'NEW',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'Viscose-rib midi dress with a V-neckline and a self-tie waist. Effortlessly versatile.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJeu5-nOxuIHkKPgfYmEtEg__MT0OR17V4zg&s'],
        stock: 25
    },
    {
        name: 'Satin Slip Dress', category: 'Women', subcategory: 'Dresses',
        price: 2799, originalPrice: 3499, isOnSale: true, rating: 4.8, numReviews: 156, badge: 'SALE',
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'Bias-cut silk-satin slip with adjustable spaghetti straps and a cowl neck.',
        images: ['https://oyela.in/cdn/shop/files/1_4fb1f012-28d9-414f-98b5-9aa32905e02c.jpg?v=1746600078'],
        stock: 25
    },
    {
        name: 'Linen Wrap Dress', category: 'Women', subcategory: 'Dresses',
        price: 2199, originalPrice: 2999, isOnSale: true, rating: 4.5, numReviews: 188, badge: 'SALE',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: '100% European linen in a true wrap silhouette with a waist tie.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQchUq3rRiCWgVznGuxPd3QHd-SN4rmoexu2Q&s'],
        stock: 25
    },
    {
        name: 'Pleated Chiffon Midi', category: 'Women', subcategory: 'Dresses',
        price: 3799, rating: 4.6, numReviews: 142, badge: '',
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'Sunburst pleated chiffon with a fluid drape and a fitted bodice.',
        images: ['https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/H48498s.jpg?im=Resize,width=750'],
        stock: 25
    },
    {
        name: 'Poplin Mini Shirtdress', category: 'Women', subcategory: 'Dresses',
        price: 2499, rating: 4.4, numReviews: 96, badge: '',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'Crisp cotton poplin shirtdress. Pair with sneakers or strappy heels.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0AD1T0t3p9NEGR22soEyy6na0ucvj58Ptuw&s'],
        stock: 25
    },
    {
        name: 'Off-Shoulder Ruffle Dress', category: 'Women', subcategory: 'Dresses',
        price: 3199, rating: 4.7, numReviews: 103, badge: 'NEW',
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'Tiered ruffle hem in a lightweight cotton voile. Summer occasion perfection.',
        images: ['https://images.unsplash.com/photo-1765229298134-e11f4fa69b1b?w=800&auto=format&fit=crop&q=80'],
        stock: 25
    },
    {
        name: 'Wide-Leg Jumpsuit', category: 'Women', subcategory: 'Dresses',
        price: 3499, rating: 4.6, numReviews: 144, badge: '',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'Fluid crepe one-piece: elegance of a dress with comfort of pants.',
        images: ['https://images.unsplash.com/photo-1767077280665-c3e251378f9e?w=800&auto=format&fit=crop&q=80'],
        stock: 25
    },
    {
        name: 'Washable Silk Pajama Set', category: 'Women', subcategory: 'Dresses',
        price: 3999, rating: 4.9, numReviews: 201, badge: 'LIMITED',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'Thermoregulating silk that goes straight in the washing machine.',
        images: ['https://images.unsplash.com/photo-1767785829300-28722d89e696?w=800&auto=format&fit=crop&q=80'],
        stock: 25
    },

    // Kids Products
    {
        name: 'Graphic Dino Print Tee', category: 'Kids', subcategory: 'T-Shirts',
        price: 1499, rating: 4.5, numReviews: 145, badge: '',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: '100% soft cotton with a bold dino print. Durable and machine washable.',
        images: ['https://images.unsplash.com/photo-1760808573791-f2b3e6cf44d1?w=800&auto=format&fit=crop&q=80'],
        stock: 100
    },
    {
        name: 'Classic Stripe Long-Sleeve Tee', category: 'Kids', subcategory: 'T-Shirts',
        price: 1359, originalPrice: 1599, isOnSale: true, rating: 4.4, numReviews: 148, badge: 'SALE',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: 'Classic stripe in soft combed cotton with a relaxed fit.',
        images: ['https://plus.unsplash.com/premium_photo-1755534537397-c72659a0a70c?w=800&auto=format&fit=crop&q=80'],
        stock: 100
    },
    {
        name: 'Essential Crew Tee 3-Pack', category: 'Kids', subcategory: 'T-Shirts',
        price: 1999, rating: 4.3, numReviews: 286, badge: '',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: '180 GSM combed cotton crew tees in three classic colours.',
        images: ['https://images.unsplash.com/photo-1711934047742-44a49e7225b9?w=800&auto=format&fit=crop&q=80'],
        stock: 100
    },
    {
        name: 'Rainbow Unicorn Graphic Tee', category: 'Kids', subcategory: 'T-Shirts',
        price: 1699, rating: 4.6, numReviews: 162, badge: 'NEW',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: 'Bright rainbow unicorn print on 100% organic cotton. Soft and gentle.',
        images: ['https://images.unsplash.com/photo-1760026506462-f4e0647a88c9?w=800&auto=format&fit=crop&q=80'],
        stock: 100
    }
];

const hardReset = async () => {
    try {
        await connectDB();

        console.log('🧹 Clearing collections...');
        await Order.deleteMany({});
        await Product.deleteMany({});
        await Cart.deleteMany({});
        console.log('✅ Collections cleared.');

        console.log('🌱 Seeding products...');
        // We do NOT provide _id here, Mongoose will auto-generate ObjectId
        const createdProducts = await Product.create(productsData);

        console.log('\n✅ Successfully seeded products:');
        createdProducts.forEach(p => {
            console.log(`   - ${p.name}: ${p._id} (${p.category})`);
        });

        console.log('\n🚀 Database Reset & Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error during hard reset: ${error}`);
        process.exit(1);
    }
};

hardReset();
