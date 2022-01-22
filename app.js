"use strict";

let express = require("express");
let ejs = require("ejs");
let bodyParser = require("body-parser");
let request = require("request");
let session = require("express-session");

const res = require("express/lib/response");

let router = express.Router();
let app = express();
app.use(session({ secret: "secret", saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
let sess;

// Routes
router.get("/", (req, res) => {
  sess = req.session;
  res.render("index", { pagename: "index", sess: sess });
});

router.get("/about", (req, res) => {
  sess = req.session;
  res.render("about", { pagename: "about", sess: sess });
});

router.get("/projects", (req, res) => {
  sess = req.session;
  res.render("projects", { pagename: "projects", sess: sess });
});
router.get("/profile", (req, res) => {
  sess = req.session;
  if (typeof sess == "undefined" || sess.loggedIn != true) {
    let error = ["Not authenticated"];
    res.render("index", { pagename: "index", errs: errors });
  } else {
    res.render("profile", { pagename: "profile", sess: sess });
  }
});

router.get("/logout", (req, res) => {
  sess = req.session;
  sess.destroy((err) => {
    res.redirect("/");
  });
});

router.post("/login", (req, res) => {
  sess = req.session;
  let errors = [];
  // Validate Email
  if (req.body.email.trim() == "") {
    errors.push("email cannot be blank!");
  }
  // Validate Password
  if (req.body.password.trim() == "") {
    errors.push("password cannot be blank!");
  }
  // Validate Email format
  if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(req.body.email)) {
    errors.push("email format is incorrect!");
  }
  if (!/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(req.body.password)) {
    errors.push("password format is incorrect!");
  }
  console.log(errors);
  // create a condition: test if the email  == "mike@aol.com" and password = "Hello1234"
  if (
    req.body.email.trim() == "mike@aol.com" &&
    req.body.password.trim() == "abc123"
  ) {
    sess = req.session;
    sess.loggedIn = true;
    res.render("profile", { pagename: "profile", sess: sess });
  } else {
    errors.push("invalid user");
    res.render("index", { pagename: "index" });
  }

  res.render("index", { pagename: "index", errs: errors });
});

// declare static file locations
app.use(express.static("views"));
app.use(express.static("public"));
app.use("/", router);

// start server
let server = app.listen("8080", () => {
  console.log("Server running on port 8080");
});
