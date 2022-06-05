const express = require("express");
const env = require("dotenv").config();
const errorhandler = require("errorhandler");
const passport = require("./config/passport");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./routes/user-routes");
const mongoose = require("mongoose");
// const mongoUri = process.env.MONG_URI;
app.use(morgan("combined"));
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["PUT", "POST", "GET", "PATCH"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const isProduction = process.env.NODE_ENV === "production";
const db = mongoose.connect(
  "mongodb://0.0.0.0:27017/newDb",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.log(err);
    else console.log("db connected");
  }
);

app.use(passport.initialize());

app.use("/api/user", userRoutes);
app.listen(4000, function () {
  console.log("listening on port 4000!");
});
