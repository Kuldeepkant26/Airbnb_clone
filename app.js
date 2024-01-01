if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");

const Listings = require("./models/linstings");
const Reviews = require("./models/reviews");
const User = require("./models/user");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

const rlisting = require("./routes/rlistings");
const rreviews = require("./routes/rreviews");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const db_url=process.env.ATLASDB_URL;

main().then(() => {
  console.log("Connected to DB");
});
async function main() {
  await mongoose.connect(db_url);
}
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/body"));
app.use(express.urlencoded({ extended: true })); //to access the data inside request
app.use(express.static(path.join(__dirname, "/public")));

const store=MongoStore.create({
  mongoUrl:db_url,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("Error in mongo Session store",err);
})
const sopt = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //To prevent cross scripting attacks
  },
};



app.use(session(sopt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.currUser = req.user;
  // console.log(req.user);
  next();
});

app.use("/", rlisting);
app.use("/", rreviews);

app.get("/signup", (req, res) => {
  res.render("signupform.ejs");
});

app.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;
  let u1 = new User({
    email: email,
    username: username,
  });
  let rUser = await User.register(u1, password);
  req.login(rUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "SignUp Successfully");
    res.redirect("/home");
  });
});

app.get("/login", (req, res) => {
  res.render("loginform.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "You are logedin  now");
    res.redirect("/home");
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/home");
  });
});


  
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.render("error.ejs", { statusCode, message });
  return; // Add a return statement here
});
