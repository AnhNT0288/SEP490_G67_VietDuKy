const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");

const isDev = process.env.NODE_ENV !== "production";
const googleCallbackURL = isDev
  ? `http://${process.env.HOST}:${process.env.PORT}/api/auth/google/callback`
  : `https://${process.env.SERVER_DOMAIN}/auth/google/callback`;

const facebookCallbackURL = isDev
  ? `http://${process.env.HOST}:${process.env.PORT}/api/auth/facebook/callback`
  : `https://${process.env.SERVER_DOMAIN}/auth/facebook/callback`;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: googleCallbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          displayName: profile.displayName,
          givenName: profile.name?.givenName || null,
          familyName: profile.name?.familyName || null,
          avatar: profile.photos[0]?.value || null,
          password: null,
          role_id: 1,
        });
      } else {
        user.googleId = profile.id;
        user.displayName = profile.displayName;
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: facebookCallbackURL,
      profileFields: ["id", "emails", "name", "picture.type(large)"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("🔍 Facebook profile:", profile);

        const email = profile.emails?.[0]?.value;
        const displayName = `${profile.name.givenName || ""} ${profile.name.middleName || ""} ${profile.name.familyName || ""}`.trim();

        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            email,
            displayName: displayName,
            facebook_id: profile.id,
            avatar: profile.photos?.[0]?.value || null,
            role_id: 1,
          });
        } else {
          user.displayName = displayName;
          user.facebookId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, { id: user.id, token: user.token });
});

passport.deserializeUser(async (userData, done) => {
  try {
    const user = await User.findByPk(userData.id);
    user.token = userData.token;
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
