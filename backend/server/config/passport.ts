import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    console.error('Google Auth Error: No email found in profile');
                    throw new Error('Google account has no email');
                }

                // Check if user already exists in our db
                let user = await User.findOne({ email });

                if (user) {
                    // Update googleId if not present (User registered with email previously)
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                    console.log(`Google Auth: User ${email} logged in`);
                    return done(null, user);
                }

                // If not, create a new user
                user = await User.create({
                    username: profile.displayName || email.split('@')[0],
                    email,
                    googleId: profile.id,
                });

                console.log(`Google Auth: New user ${email} created`);
                return done(null, user);
            } catch (error: any) {
                console.error('Google Auth Callback Error:', error);
                return done(error, undefined);
            }
        }
    )
);

// We don't necessarily need serialize/deserialize if we are minting JWTs immediately,
// but passport usually expects them if we are using sessions. 
// We will just serialize the user ID to keep the session tiny.
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
