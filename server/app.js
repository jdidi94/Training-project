const express = require("express");
const env = require("dotenv").config();
const errorhandler = require("errorhandler");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/user-routes");
const mongoose = require("mongoose");
const mongoUri = process.env.mongoUri;
app.use(morgan("combined"));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["PUT", "POST", "GET", "PATCH"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var isProduction = process.env.NODE_ENV === "production";
const db = mongoose.connect(
  mongoUri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("hey i'm connected");
  }
);
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/user", userRoutes);
app.listen(4000, function () {
  console.log("listening on port 4000!");
});
