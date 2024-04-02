const { body } = require("express-validator");
const validation = require("../handlers/validation");
const userController = require("../controllers/user");
const router = require("express").Router();
const User = require("../models/user");
const { authMsg } = require("../constants/messgae");
const tokenHandler = require("../handlers/tokenHandler");

router.get("/", (req, res) => {
  res.json("Hello World!");
});

router.post(
  "/signup",
  body("username").isLength({ min: 8 }).withMessage(authMsg.usernameLength),
  body("password").isLength({ min: 8 }).withMessage(authMsg.passwordLength),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage(authMsg.passwordLength),
  body("username").custom((value) => {
    return User.findOne({ username: value }).then((user) => {
      if (user) {
        return Promise.reject(authMsg.usernameExists);
      }
    });
  }),
  validation.validate,
  userController.register
);

router.post(
  "/login",
  body("username").isLength({ min: 8 }).withMessage(authMsg.usernameLength),
  body("password").isLength({ min: 8 }).withMessage(authMsg.passwordLength),
  validation.validate,
  userController.login
);

router.post("/verify-token", tokenHandler.verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
