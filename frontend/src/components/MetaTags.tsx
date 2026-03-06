import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MetaTags = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let title = 'VASTRAA – Premium Indian Fashion';
        let description = 'Discover modern Indian fashion for men, women, and kids at VASTRAA. High-quality essentials and timeless designs.';

        if (path === '/') {
            title = 'VASTRAA – Premium Indian Fashion';
        } else if (path.startsWith('/shop')) {
            title = 'Shop the Collection – VASTRAA';
        } else if (path.startsWith('/sale')) {
            title = 'Sale: Limited Time Offers – VASTRAA';
        } else if (path.startsWith('/support/faq')) {
            title = 'FAQs – Support – VASTRAA';
        } else if (path.startsWith('/support/contact')) {
            title = 'Contact Us – Support – VASTRAA';
        } else if (path.startsWith('/legal/privacy')) {
            title = 'Privacy Policy – VASTRAA';
        } else if (path.startsWith('/profile')) {
            title = 'My Profile – Account – VASTRAA';
        }

        document.title = title;

        // Update meta description if exists
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }
    }, [location]);

    return null;
};

export default MetaTags;
