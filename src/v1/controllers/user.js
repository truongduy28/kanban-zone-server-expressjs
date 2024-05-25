const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jsonwebtoken = require("jsonwebtoken");
const { authMsg } = require("../constants/messgae");
const { getCurrentHost } = require("../utils/get-host");

exports.register = async (req, res) => {
  const { password } = req.body;
  try {
    const encodePassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASSWORD_SECRET_KEY
    );
    const user = await User.create({ ...req.body, password: encodePassword });
    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );
    res.status(201).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select(
      "password username avatar"
    );
    const host = await getCurrentHost();
    user.avatar = host + "/" + user.avatar;
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            param: "username",
            msg: authMsg.invalid,
          },
        ],
      });
    }

    const decryptedPass = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPass !== password) {
      return res.status(401).json({
        errors: [
          {
            param: "username",
            msg: authMsg.invalid,
          },
        ],
      });
    }

    user.password = undefined;

    const token = jsonwebtoken.sign(
      { id: user._id },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};
