import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

dotenv.config();

const JWT_SECRET = process.env.SECRETKEY;
if (!JWT_SECRET) {
  throw new Error("SECRETKEY environment variable is not defined");
}

// Configure Passport JWT strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      secretOrKey: JWT_SECRET, 
    },
    async (payload, done) => {
      try {
        return done(null, payload); 
      } catch (error) {
        return done(error, false); 
      }
    }
  )
);

// Initialize Passport
export const initializePassport = passport.initialize();

// Authentication middleware
export const authMiddleware = passport.authenticate("jwt", { session: false });