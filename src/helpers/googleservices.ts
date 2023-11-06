import { User } from "../app/app.associatios";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import passport from "passport";

import { Request } from "express";
import { generateToken } from "./jsonwebtoken";

passport.use(
  new Strategy(
    {
      clientID:
        "807677607895-a2tn6av12i9smfa3mae5uek4rm87mcg8.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/api/v1/user/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        const resUser: any = await User.findOne({
          where: { email: profile.email },
        });

        if (!resUser) {
          return done(null, false);
        }

        const  token = generateToken(resUser.id);
        return done(null, token);
      } catch (error) {
        return done(null, false);
      }
    }
  )
);

export { passport };
