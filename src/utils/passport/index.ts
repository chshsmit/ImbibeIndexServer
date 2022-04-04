import bcrypt from "bcrypt";
import { PassportStatic } from "passport";
import { Strategy as localStrategy } from "passport-local";
import { User } from "../../model/User";

export const localPassportConfig = (passport: PassportStatic) => {
  passport.use(
    new localStrategy(async (username, password, done) => {
      const user = await User.findOne({
        where: { email: username },
        select: ["id", "firstName", "lastName", "email", "hashedPassword"],
      });
      console.log(user);

      if (!user) return done(null, false);

      bcrypt.compare(password, user.hashedPassword, (err, result) => {
        if (err) throw err;
        if (result) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );

  passport.serializeUser((user: User, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id: number, cb) => {
    const user = User.findOne({ where: { id } });

    if (user) cb(null, user);
  });
};
