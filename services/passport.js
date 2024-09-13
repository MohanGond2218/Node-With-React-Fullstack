const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const { saveUser, User } = require("../models/User"); // Import saveUser function

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Save user to MongoDB using Google ID
        console.log("Profile Id", profile.id);
        const user = await saveUser(profile.id);

        // Once user is saved, call done with the user object
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize user to control what data is saved in the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only the user ID in the session
});

// Deserialize user to retrieve user data from the session
passport.deserializeUser((id, done) => {
  // Find user by ID when deserializing the user
  User.findById(id).then((user) => {
    done(null, user);
  });
});
