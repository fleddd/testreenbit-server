import passport from "passport";
import {
  Profile,
  Strategy as GoogleStrategy,
  StrategyOptions,
} from "passport-google-oauth20";
import { User } from "../models/user-model";
import dotenv from "dotenv";
import { Chat } from "../models/chat-model";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: process.env.CALLBACK_URL as string,
      scope: ["profile", "email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const findUser = await User.findOne({ googleId: profile.id });
        if (!findUser) {
          const newUser = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails![0].value,
            avatar: profile._json.picture,
          });
          const newSavedUser = await newUser.save();

          const predefinedChats = [
            {
              displayName: "Predefined Chat 1",
              membersId: [newUser.googleId],
              lastMessageText: "Welcome to the Predefined Chat 1!",
              lastMessageDate: new Date().toISOString(),
              avatar: process.env.DEFAULT_AVATAR_URL || "",
            },
            {
              displayName: "Predefined Chat 2",
              membersId: [newUser.googleId],
              lastMessageText: "Welcome to the Predefined Chat 2!",
              lastMessageDate: new Date().toISOString(),
              avatar: process.env.DEFAULT_AVATAR_URL || "",
            },
            {
              displayName: "Predefined Chat 3",
              membersId: [newUser.googleId],
              lastMessageText: "Welcome to Predefined Chat 3!",
              lastMessageDate: new Date().toISOString(),
              avatar: process.env.DEFAULT_AVATAR_URL || "",
            },
          ];

          await Chat.insertMany(predefinedChats);
          return done(null, newSavedUser);
        }

        return done(null, findUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.googleId);
});
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findOne({ googleId: id });
    return user ? done(null, user) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});
