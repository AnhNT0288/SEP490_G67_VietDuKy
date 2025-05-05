const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const {User} = require("../models");

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
            let email = profile.emails?.[0]?.value || null;
            let avatar = profile.photos?.[0]?.value || null;

            let user = await User.findOne({where: {email}});

            if (!user) {
                user = await User.create({
                    googleId: profile.id || '',
                    email,
                    displayName: profile.displayName || '',
                    avatar,
                    password: null,
                    role_id: 1,
                });
            } else {
                user.googleId = profile.id || '';
                user.displayName = profile.displayName || '';
                await user.save();
            }

            return done(null, user);
        } catch (error) {
            console.error("Google Strategy Error: ", error);
            return done(error, null);
        }
    }
));

passport.use(new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: facebookCallbackURL,
        profileFields: ["id", "emails", "name", "picture.type(large)"],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value || null;
            const displayName = `${profile.name.givenName || ""} ${profile.name.middleName || ""} ${profile.name.familyName || ""}`.trim();
            const avatar = profile.photos?.[0]?.value || null;

            let user = await User.findOne({where: {email}});

            if (!user) {
                user = await User.create({
                    facebookId: profile.id || '',
                    email,
                    displayName,
                    avatar,
                    password: null,
                    role_id: 1,
                });
            } else {
                user.facebookId = profile.id || '';
                user.displayName = displayName;
                await user.save();
            }

            return done(null, user);
        } catch (error) {
            console.error("Facebook Strategy Error: ", error);
            return done(error, null);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, {id: user.id, token: user.token});
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
