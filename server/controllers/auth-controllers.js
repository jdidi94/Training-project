const User = require("../models/user");
const Test = require("../models/test");
const passport = require("passport");
const env = require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;
const { OAuth2Client } = require("google-auth-library");
const mailgun = require("mailgun-js");
const DOMAIN = env.DOMAIN;
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: DOMAIN,
});

const client = new OAuth2Client(
  "261881368887-r96i6dvmjv2olaodl8t54gh66o9ovu2n.apps.googleusercontent.com"
);

exports.hello = async function (req, res) {
  try {
    const test = new Test();
    test.one = req.body.one;
    test.tow = req.body.tow;
    const sender = await test.save();
    res.send("created");
  } catch (err) {
    res.send(err);
  }
};
exports.login = function (req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (user) {
        user.token = user.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(422).json(info);
      }
    }
  )(req, res, next);
};

exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const Client = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "261881368887-r96i6dvmjv2olaodl8t54gh66o9ovu2n.apps.googleusercontent.com",
    });
    // console.log(Client);

    const { email_verified, given_name, email } = Client.payload;
    console.log("email", email);
    if (email_verified) {
      const emailUser = await User.findOne({ email: email });
      if (emailUser) {
        user.token = user.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      } else if (!emailUser) {
        const neWuser = new User();
        neWuser.setPassword(email + process.env.SECRET);
        neWuser.firstName = given_name;
        useData.lastName = lastName;
        neWuser.email = email;
        const data = await neWuser.save();
        return res.status(200).json({ user: data.toAuthJSON() });
      } else {
        return res.status(422).json({
          errors: "Something went wrong...!",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.signUp = async (req, res) => {
  console.log(req.body);
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      number,
      dateOfBirth,
      gender,
    } = req.body;
    const emailUser = await User.findOne({ email });
    console.log(emailUser);
    if (emailUser) {
      return res.status(400).json({ errors: "Email is already used" });
    } else {
      const Token = jwt.sign(
        { firstName, lastName, email, password, number, dateOfBirth, gender },
        process.env.SECRET,
        { expiresIn: "20m" }
      );
      console.log(email);
      const data = {
        from: "noreply@gmail.com",
        to: email,

        subject: "VLV Verify account",
        html: `<p>enjoy an experience with huge number of villas to rent and buy<p>
        <a href="${Token}" >Verify account</a>`,
      };

      mg.messages().send(data, function (error, body) {
        if (error) {
          return res.status(400).json({ errors: error.message });
        }
        return res.status(200).json({
          user: {
            message: "Email has been sent, please activate your account",
          },
        });
      });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.activateAccount = async (req, res) => {
  const { token } = req.body;
  // const user = await User.findById(req.payload.id);
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodeData) => {
      if (err) {
        return res.status().json({ errors: "Incorrect or expired link" });
      }
      const {
        firstName,
        lastName,
        email,
        password,
        number,
        dateOfBirth,
        gender,
      } = decodeData;
      const useData = new User();

      useData.firstName = firstName;
      useData.lastName = lastName;
      useData.email = email;
      useData.number = number;
      useData.dateOfBirth = dateOfBirth;
      useData.gender = gender;
      useData.setPassword(password);
      useData.save((err, success) => {
        if (err) {
          return res.status(400).json({ errors: err });
        }
        return res.status(200).json({ user: useData.toAuthJSON() });
      });
    });
  }
  return res.status(400).json({ error: "something went wrong..." });
};
