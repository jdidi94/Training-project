const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const secret = require("../config").secret;
const { OAuth2Client } = require("google-auth-library");
const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

const client = new OAuth2Client(
  "261881368887-r96i6dvmjv2olaodl8t54gh66o9ovu2n.apps.googleusercontent.com"
);

exports.hello = async function (req, res) {
  res.send("hello");
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
  console.log("hi");
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
      const user = await User.findOne({ email: email, username: given_name });
      const username = await User.findOne({ username: given_name });
      const emailUser = await User.findOne({ email: email });

      console.log("email", user);
      if (user) {
        user.token = user.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      } else if (!user && !username && !emailUser) {
        const neWuser = new User();
        console.log("email", neWuser);
        neWuser.setPassword(email + process.env.SECRET);
        neWuser.username = given_name;
        neWuser.email = email;
        const data = await neWuser.save();
        console.log("email", data);
        return res.status(200).json({ user: data.toAuthJSON() });
      } else if (!user && username && !emailUser) {
        return res.status(422).json({
          errors:
            "Sorry you cannot login with google because of the used name in another account try to sign up with email and choose unique name",
        });
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
  try {
    const { username, email, password } = req.body;
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    if (usernameUser && emailUser) {
      return res
        .status(422)
        .json({ errors: "Username and email is already used" });
    } else if (usernameUser) {
      return res.status(400).json({ errors: "Username is already used" });
    } else if (emailUser) {
      return res.status(400).json({ errors: "Email is already used" });
    } else {
      const Token = jwt.sign(
        { username, email, password },
        process.env.SECRET,
        { expiresIn: "20m" }
      );

      console.log("email", email);
      const data = {
        from: "noreply@gmail.com.com",
        to: email,
        subject: "VLV Verify account",
        html: `<p>enjoy an experience with huge number of villas to rent and buy<p>
        <a href="${process.env.URL_ACTIVATION}/${Token}" >Verify account</a>`,
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
    res.send(err.message);
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
      const { username, email, password } = decodeData;
      const useData = new User();

      useData.username = username;
      useData.email = email;
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
