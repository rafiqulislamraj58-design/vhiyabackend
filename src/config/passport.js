
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Client_ID,
      clientSecret: process.env.Client_secret,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        
        console.log(profile);

       
        const user = profile;

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
