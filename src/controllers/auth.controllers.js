import User from "../models/User.js";
import passport from "passport";

export const renderSignUpForm = (req, res) => res.render("auth/signup");

export const signup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password, sexualidad, nacionalidad,queja } = req.body;
  if (password !== confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if(!name){
    errors.push({text: 'pon tu nombre'})
  }
  if(!sexualidad){
    errors.push({text:'pon como te gusta'})
  }
  if(!nacionalidad){
    errors.push({text: "pon tu nacionalidad"})
  }
  if(!queja){
    errors.push({text: "pon tu queja aweonao"})
  }
  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }

  if (errors.length > 0) {
    return res.render("auth/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
      sexualidad,
      nacionalidad,
      queja,
    });
  }

  // Look for email coincidence
  const userFound = await User.findOne({ email: email });
  if (userFound) {
    req.flash("error_msg", "The Email is already in use.");
    return res.redirect("/auth/signup");
  }

  // Saving a New User
  const newUser = new User({ name, email, password, sexualidad, nacionalidad, queja });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  req.flash("success_msg", "You are registered.");
  res.redirect("/auth/signin");
};

export const renderSigninForm = (req, res) => res.render("auth/signin");

export const signin = passport.authenticate("local", {
  successRedirect: "/notes",
  failureRedirect: "/auth/signin",
  failureFlash: true,
});

export const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "You are logged out now.");
    res.redirect("/auth/signin");
  });
};
