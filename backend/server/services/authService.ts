import User from '../models/User';

/**
 * Service to handle Authentication database and business logic
 */
class AuthService {
    
    // Find user by email
    async findUserByEmail(email: string) {
        return await User.findOne({ email });
    }

    // Find user by ID
    async findUserById(id: string) {
        return await User.findById(id);
    }
    
    // Find user by ID without password
    async findUserByIdWithoutPassword(id: string) {
        return await User.findById(id).select('-password');
    }

    // Create a new user
    async createUser(userData: any) {
        return await User.create(userData);
    }

    // Get all users without password
    async getAllUsers() {
        return await User.find({}).select('-password');
    }
    
}

export const authService = new AuthService();
