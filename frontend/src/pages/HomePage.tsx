import HeroSection from '../components/HeroSection';
import BrandValueStrip from '../components/BrandValueStrip';
import FeaturedSlider from '../components/FeaturedSlider';
import CategoryShowcase from '../components/CategoryShowcase';
import ProductGridSection from '../components/ProductGridSection';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsletterForm from '../components/NewsletterForm';

/**
 * VASTRAA — Landing Page
 *
 * Refined scroll flow:
 *   Hero → Brand Value Strip → Edit of the Week → Men / Women / Kids →
 *   New Arrivals Grid → Testimonials → Newsletter
 *
 * Removed: PromoBanner, VideoSection, BlogSection (decluttered for premium feel)
 */
const HomePage = () => (
    <main>
        <HeroSection />
        <BrandValueStrip />
        <FeaturedSlider />
        <CategoryShowcase />
        <ProductGridSection />
        <TestimonialsSection />
        <NewsletterForm />
    </main>
);

export default HomePage;
