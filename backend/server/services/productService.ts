import Product from '../models/Product';

/**
 * Service to handle Product database and business logic
 */
class ProductService {
    
    // Get all products (with pagination and filtering)
    async getAllProducts(query: any = {}) {
        const pageSize = Number(query.limit) || 8;
        const page = Number(query.page) || 1;
        
        const filter: any = {};

        // 1. Category Filter (Case-insensitive)
        if (query.category && query.category.toLowerCase() !== 'all') {
            filter.category = new RegExp(`^${query.category}$`, 'i');
        }

        // 2. keyword / search filter
        if (query.keyword) {
            filter.name = { $regex: query.keyword, $options: 'i' };
        }

        // 3. Price Range Filter
        if (query.price_gte || query.price_lte) {
            filter.price = {};
            if (query.price_gte) filter.price.$gte = Number(query.price_gte);
            if (query.price_lte) filter.price.$lte = Number(query.price_lte);
        }

        // 4. Style Filters (Matching frontend registry keys)
        if (query.style) {
            const style = query.style.toLowerCase();
            switch (style) {
                case 'casual':
                    filter.styleTags = { $in: ['casual'] };
                    break;
                case 'party':
                    filter.styleTags = { $in: ['party'] };
                    break;
                case 'formal':
                    filter.styleTags = { $in: ['formal'] };
                    break;
                case 'ethnic':
                    filter.styleTags = { $in: ['ethnic'] };
                    break;
                case 'summer':
                    filter.season = 'summer';
                    break;
                case 'winter':
                    filter.season = 'winter';
                    break;
                case 'jackets':
                    filter.subcategory = 'Jackets';
                    break;
                case 'bestseller':
                    filter.isBestseller = true;
                    break;
                case 'new':
                    filter.isNewDrop = true;
                    break;
                case 'sale':
                    filter.isOnSale = true;
                    break;
                case 'ss2026':
                    filter.styleTags = { $in: ['seasonal'] };
                    break;
            }
        }

        // 5. Sorting
        let sortOption: any = { createdAt: -1 }; // Default
        if (query.sort) {
            switch (query.sort) {
                case 'new': sortOption = { createdAt: -1 }; break;
                case 'price_asc': sortOption = { price: 1 }; break;
                case 'price_desc': sortOption = { price: -1 }; break;
                case 'rating': sortOption = { rating: -1 }; break;
                case 'numReviews': sortOption = { numReviews: -1 }; break;
                case 'discount': 
                    // Note: Sorting by calculated discount in Compass/Mongoose can be complex
                    // For now, we sort by isOnSale then price desc as a proxy, 
                    // or simple price desc if calculating on the fly isn't feasible here without aggregation.
                    sortOption = { isOnSale: -1, price: 1 }; 
                    break;
                default: sortOption = { createdAt: -1 };
            }
        }

        const count = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        return {
            products,
            page,
            pages: Math.ceil(count / pageSize)
        };
    }

    // Find product by ID
    async findProductById(id: string) {
        return await Product.findById(id);
    }

    // Create a new empty product
    async createEmptyProduct(userId: string) {
        const product = new Product({
            name: 'Sample name',
            price: 0,
            user: userId,
            images: ['/images/sample.jpg'],
            sizes: ['M'],
            category: 'Men',
            stock: 0,
            rating: 0,
            description: 'Sample description',
        });
        return await product.save();
    }
}

export const productService = new ProductService();
