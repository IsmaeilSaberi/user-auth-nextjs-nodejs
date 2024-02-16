const express = require("express");
const router = express();
const { check } = require("express-validator");

const UserCtrl = require("../controllers/UserCtrl");

const isAdmin = require("../middlewares/isAdmin");
const userExist = require("../middlewares/userExist");

// EXPRESS RATE LIMIT
const rateLimit = require("express-rate-limit");
const { required } = require("nodemon/lib/config");
const loginRegisterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  stausCode: 200,
  handler: function (req, res) {
    res.status(429).json({
      msg: "بعد از 15 دقیقه دوباره امتحان کنید!",
    });
  },
});

router.get("/users", isAdmin, UserCtrl.getAllUsers);

router.post(
  "/register-user",
  loginRegisterLimiter,
  [
    check(
      "username",
      "تعداد کاراکتر نام کاربری باید 5 و تا 25 کاراکتر باشد!"
    ).isLength({
      min: 5,
      max: 25,
    }),

    check(
      "password",
      "تعداد کاراکتر رمز عبور باید 6 و تا 20 کاراکتر باشد!"
    ).isLength({
      min: 6,
      max: 20,
    }),
    check("email", "فرمت ایمیل اشتباه است!").isEmail(),
    check(
      "comments",
      "فرمت یکی از ورودی های ثبت نام کاربر اشتباه است!"
    ).isArray(),
    check(
      "viewed",
      "فرمت یکی از ورودی های ثبت نام کاربر اشتباه است!"
    ).isBoolean(),
  ],
  UserCtrl.registerUser
);

router.post(
  "/login-user",
  loginRegisterLimiter,
  [
    check(
      "password",
      "تعداد کاراکتر رمز عبور باید 8 و تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
    check("email", "فرمت ایمیل اشتباه است!").isEmail(),
  ],
  UserCtrl.loginUser
);

router.post(
  "/update-user/:id",
  isAdmin,
  [
    check(
      "username",
      "تعداد کاراکتر نام کاربری باید 8 و تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),

    check("email", "فرمت ایمیل اشتباه است!").isEmail(),
    check("username", "لطفا نام کاربری دیگری را انتخاب کنید!").custom(
      (value) => {
        return User.find({
          username: value,
        }).then((user) => {
          if (user.length > 1) {
            throw new Error("لطفا نام کاربری دیگری را انتخاب کنید!");
          }
        });
      }
    ),
    check("email", "لطفا ایمیل دیگری را انتخاب کنید!").custom((value) => {
      return User.find({
        email: value,
      }).then((user) => {
        if (user.length > 1) {
          throw new Error("لطفا ایمیل دیگری را انتخاب کنید!");
        }
      });
    }),
  ],
  UserCtrl.updateUser
);

router.post(
  "/update-mini-user/:id",
  userExist,
  [
    check(
      "password",
      "تعداد کاراکتر رمز عبور باید 8 و تا 20 کاراکتر باشد!"
    ).isLength({
      min: 8,
      max: 20,
    }),
  ],
  UserCtrl.updateMiniUser
);

router.post("/remove-user/:id", isAdmin, UserCtrl.removeUser);

// FOR ADMIN
router.get("/get-user/:id", isAdmin, UserCtrl.getOneUserById);

// FOR USER
router.get("/get-user-data", userExist, UserCtrl.getUserDataAccount);
router.get("/get-displayname", UserCtrl.getDisplayname);

// FOR ADMIN
router.get("/get-user-admin-data", isAdmin, UserCtrl.getUserAdminData);

router.post(
  "/search-user",
  isAdmin,
  [check("email", "فرمت ایمیل اشتباه است!").isEmail()],
  UserCtrl.searchUsers
);

router.get(
  "/get-part-of-user-data/:slug",
  userExist,
  UserCtrl.getPartOfUserData
);

router.get("/uncheck-comment/:id", isAdmin, UserCtrl.uncheckComment);

// FOR DASHBOARD DEFAULT PANNEL
router.get("/get-new-items", isAdmin, UserCtrl.getNewItems);

module.exports = router;
