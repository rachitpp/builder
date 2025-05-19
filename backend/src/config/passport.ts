import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import User from "../models/userModel";
import { logger } from "../utils/logger";

const setupPassport = (): void => {
  // Serialize user for the session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${
            process.env.API_URL || "http://localhost:5000"
          }/api/auth/google/callback`,
          scope: ["profile", "email"],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            // Check if user exists
            let user = await User.findOne({ "google.id": profile.id });

            if (user) {
              // Return existing user
              return done(null, user);
            }

            // Check if user exists with same email
            const email =
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "";
            if (email) {
              user = await User.findOne({ email });

              if (user) {
                // Link Google account to existing user
                user.google = {
                  id: profile.id,
                  email: email,
                  name: profile.displayName,
                };
                await user.save();
                return done(null, user);
              }
            }

            // Create new user
            const newUser = await User.create({
              email,
              firstName:
                profile.name?.givenName || profile.displayName.split(" ")[0],
              lastName:
                profile.name?.familyName ||
                profile.displayName.split(" ").slice(1).join(" "),
              password:
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8),
              isEmailVerified: true, // Email is verified through OAuth
              google: {
                id: profile.id,
                email: email,
                name: profile.displayName,
              },
            });

            return done(null, newUser);
          } catch (error) {
            logger.error(`Google OAuth error: ${error}`);
            return done(error as Error, undefined);
          }
        }
      )
    );
  } else {
    logger.warn("Google OAuth credentials not set");
  }

  // LinkedIn OAuth Strategy
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(
      new LinkedInStrategy(
        {
          clientID: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          callbackURL: `${
            process.env.API_URL || "http://localhost:5000"
          }/api/auth/linkedin/callback`,
          scope: ["r_emailaddress", "r_liteprofile"],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            // Check if user exists
            let user = await User.findOne({ "linkedin.id": profile.id });

            if (user) {
              // Return existing user
              return done(null, user);
            }

            // Check if user exists with same email
            const email =
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "";
            if (email) {
              user = await User.findOne({ email });

              if (user) {
                // Link LinkedIn account to existing user
                user.linkedin = {
                  id: profile.id,
                  email: email,
                  name: profile.displayName,
                };
                await user.save();
                return done(null, user);
              }
            }

            // Create new user
            const newUser = await User.create({
              email,
              firstName:
                profile.name?.givenName || profile.displayName.split(" ")[0],
              lastName:
                profile.name?.familyName ||
                profile.displayName.split(" ").slice(1).join(" "),
              password:
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8),
              isEmailVerified: true, // Email is verified through OAuth
              linkedin: {
                id: profile.id,
                email: email,
                name: profile.displayName,
              },
            });

            return done(null, newUser);
          } catch (error) {
            logger.error(`LinkedIn OAuth error: ${error}`);
            return done(error as Error, undefined);
          }
        }
      )
    );
  } else {
    logger.warn("LinkedIn OAuth credentials not set");
  }
};

export default setupPassport;
