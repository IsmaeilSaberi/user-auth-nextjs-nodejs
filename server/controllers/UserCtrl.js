const User = require("../models/User");
const Comment = require("../models/Comment");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    if (req.query.pn && req.query.pgn) {
      const paginate = req.query.pgn;
      const pageNumber = req.query.pn;
      const GoalUsers = await User.find()
        .sort({ _id: -1 })
        .skip((pageNumber - 1) * paginate)
        .limit(paginate)
        .select({
          username: 1,
          email: 1,
          role: 1,
          viewed: 1,
          createdAt: 1,
        });
      const AllUsersNumber = await (await User.find()).length;
      res.status(200).json({ GoalUsers, AllUsersNumber });
    } else {
      const AllUsers = await User.find()
        .sort({ _id: -1 })
        .select({ password: false });
      res.status(200).json(AllUsers);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.getAllUsers = getAllUsers;

//REGISTER USER
const registerUser = async (req, res) => {
  try {
    /////EXPRESS VALIDATOR
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      //CHECKING OF EQUATION OF PASSWORD AND CONFIRM PASSWORD
      if (req.body.password == req.body.rePassword) {
        //CHECKING OF EXISTANCE OF DUPLICATE EMAIL
        const emailExist = await User.find({ email: req.body.email });
        if (emailExist.length < 1) {
          //CHECKING OF EXISTANCE OF DUPLICATE USERNAME
          const usernameExist = await User.find({
            username: req.body.username,
          });
          if (usernameExist.length < 1) {
            //MAKING NEW USER
            const data = req.body;
            data.username = req.body.username
              .replace(/\s+/g, "_")
              .toLowerCase();
            data.email = req.body.email.replace(/\s+/g, "_").toLowerCase();
            data.password = req.body.password.replace(/\s+/g, "").toLowerCase();
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const BMI = Math.round((weight / (height * height)) * 100) / 100;

            let BMR = 1;
            if (data.gender == "Male") {
              BMR =
                65 +
                9.563 * [data.weight] +
                (16.5 * [data.height] - 65 * [data.age] + [data.age]);
            } else {
              BMR =
                65 +
                9.563 * [data.weight] +
                (16.5 * [data.height] - 65 * [data.age] + [data.age]);
            }

            const newUser = new User({
              username: data.username,
              email: data.email,
              password: hashedPassword,
              role: "User",
              gender: data.gender,
              age: data.age,
              weight: data.weight,
              height: data.height,
              comments: [],
              viewed: false,
              createdAt: new Date().toLocaleDateString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              updatedAt: new Date().toLocaleDateString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
            newUser
              .save()
              .then((d) => {
                //MAKING AUTH COOKIE
                const token = jwt.sign(
                  {
                    _id: newUser._id,
                    username: newUser.username,
                  },
                  process.env.TOKEN_SECRET
                );
                res
                  .status(200)
                  .json({ msg: "ثبت نام موفقیت آمیز بود!", auth: token });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json(err);
              });
          } else {
            res.status(422).json({ msg: "لطفا نام کاربری دیگری وارد کنید!" });
          }
        } else {
          res.status(422).json({ msg: "لطفا ایمیل دیگری وارد کنید!" });
        }
      } else {
        res.status(422).json({ msg: "تکرار رمز عبور اشتباه است!" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.registerUser = registerUser;

//LOGIN USER
const loginUser = async (req, res) => {
  try {
    /////EXPRESS VALIDATOR
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      //CHECKING OF EXISTANCE OF DUPLICATE EMAIL
      const emailExist = await User.find({ email: req.body.email });
      if (emailExist.length > 0) {
        const theUser = emailExist[0];
        const data = req.body;
        data.email = req.body.email.replace(/\s+/g, "_").toLowerCase();
        data.password = req.body.password.replace(/\s+/g, "").toLowerCase();

        const validPassword = await bcrypt.compare(
          data.password,
          theUser.password
        );
        if (validPassword == false) {
          res.status(422).json({ msg: "ایمیل یا رمز عبور اشتباه است!" });
        } else {
          // MAKING AUTH TOKEN
          const token = jwt.sign(
            { _id: theUser._id, username: theUser.username },
            process.env.TOKEN_SECRET
          );
          res
            .status(200)
            .json({ msg: "با موفقیت وارد حساب کاربری شدید!", auth: token });
        }
      } else {
        res.status(422).json({ msg: "لطفا ثبت نام کنید!" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.loginUser = loginUser;

const updateUser = async (req, res) => {
  try {
    /////EXPRESS VALIDATOR
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      const data = req.body;
      data.username = req.body.username.replace(/\s+/g, "_").toLowerCase();
      data.email = req.body.email.replace(/\s+/g, "_").toLowerCase();
      await User.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.status(200).json({ msg: "کاربر با موفقیت آپدیت شد!" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports.updateUser = updateUser;

const updateMiniUser = async (req, res) => {
  try {
    /////EXPRESS VALIDATOR
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ msg: errors.errors[0].msg });
    } else {
      if (req.body.username || req.body.email || req.body.viewed) {
        res.status(400).json({ msg: "خطا در اطلاعات فرستاده شده!" });
      } else {
        if (req.body.password == req.body.rePassword) {
          const data = req.body;
          const newPass = req.body.password.replace(/\s+/g, "").toLowerCase();
          data.password = await bcrypt.hash(newPass, 10);
          data.updatedAt = new Date().toLocaleDateString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          await User.findByIdAndUpdate(req.params.id, data, {
            new: true,
          });
          return res
            .status(200)
            .json({ msg: "اطلاعات شما با موفقیت آپدیت شد!" });
        } else {
          return res.status(422).json({ msg: "تکرار رمز عبور اشتباه است!" });
        }
      }
      return res.status(200).json({ msg: "اطلاعات شما با موفقیت آپدیت شد!" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports.updateMiniUser = updateMiniUser;

const removeUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "کاربر با موفقیت حذف شد!" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.removeUser = removeUser;

const getOneUserById = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id).select({
      password: false,
    });

    // FOR ADDING FAVORITE PRODUCTS TO TARGET USER
    const targetUserFavProducts = await Product.find({
      _id: { $in: targetUser.favoriteProducts },
    }).select({ title: 1, slug: 1 });
    targetUser.favoriteProducts = targetUserFavProducts;

    // FOR ADDING CART PRODUCTS TO TARGET USER
    const targetUserCartProducts = await Product.find({
      _id: { $in: targetUser.cart },
    }).select({ title: 1, slug: 1 });
    targetUser.cart = targetUserCartProducts;

    // FOR ADDING BUYED PRODUCTS TO TARGET USER
    const targetUseruserProducts = await Product.find({
      _id: { $in: targetUser.userProducts },
    }).select({ title: 1, slug: 1 });
    targetUser.userProducts = targetUseruserProducts;

    // FOR ADDING PAYMENTS TO TARGET USER
    const targetUserPayments = await Payment.find({
      email: targetUser.email,
    }).select({ amount: 1, payed: 1, createdAt: 1 });
    targetUser.payments = targetUserPayments;

    // FOR ADDING COMMENTS TO TARGET USER
    const targetUserComments = await Comment.find({
      email: targetUser.email,
    }).select({
      message: 1,
      typeOfModel: 1,
      createdAt: 1,
    });
    targetUser.comments = targetUserComments;

    res.status(200).json(targetUser);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.getOneUserById = getOneUserById;

// FOR LOGIN REGISTER AND REDIRECT
const getUserDataAccount = async (req, res) => {
  try {
    const targetUser = await User.findById(req.user._id).select({ _id: 1 });
    res.status(200).json(targetUser);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.getUserDataAccount = getUserDataAccount;

// FOR ADMIN REDIRECT
const getUserAdminData = async (req, res) => {
  try {
    const targetUser = await User.findById(req.user._id).select({ _id: 1 });
    res.status(200).json(targetUser);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.getUserAdminData = getUserAdminData;

// ACCOUNT AND CART PAGE
const getPartOfUserData = async (req, res) => {
  try {
    const theSlug = req.params.slug;
    if (theSlug == "info") {
      const targetUser = await User.findById(req.user._id).select({
        username: 1,
        email: 1,
        role: 1,
        gender: 1,
        age: 1,
        weight: 1,
        height: 1,
        BMI: 1,
        BMR: 1,
        createdAt: 1,
        updatedAt: 1,
      });
      res.status(200).json(targetUser);
    } else if (theSlug == "comments") {
      const targetUser = await User.findById(req.user._id);
      const userComments = await Comment.find({ email: targetUser.email })
        .sort({ _id: -1 })
        .select({
          createdAt: 1,
          published: 1,
          typeOfModel: 1,
          src_id: 1,
          message: 1,
        });

      const fullDataUserComments = [];
      // ADDING SOURCE POST OR PRODUCT TO COMMENT

      for (let i = 0; i < userComments.length; i++) {
        let theSrc = {};
        if (userComments[i].typeOfModel == "post") {
          const postSrc = await Post.findById(userComments[i].src_id).select({
            title: 1,
            slug: 1,
          });
          theSrc = postSrc;
        } else {
          const productSrc = await Product.findById(
            userComments[i].src_id
          ).select({
            title: 1,
            slug: 1,
          });
          theSrc = productSrc;
        }
        const newCommentData = {
          createdAt: userComments[i].createdAt,
          published: userComments[i].published,
          typeOfModel: userComments[i].typeOfModel,
          src_id: userComments[i].src_id,
          message: userComments[i].message,
          src: theSrc,
        };
        fullDataUserComments.push(newCommentData);
      }

      res.status(200).json(fullDataUserComments);
    } else {
      res.status(200).json({ msg: "عدم تعیین بخش مورد نیاز!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.getPartOfUserData = getPartOfUserData;

const searchUsers = async (req, res) => {
  try {
    const theUser = await User.find({ email: req.body.email }).select({
      _id: true,
    });
    if (theUser.length > 0) {
      res.status(200).json({ userData: theUser[0] });
    } else {
      res.status(200).json({ userData: 0 });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.searchUsers = searchUsers;

//HEADER DISPLAYNAME
const getDisplayname = async (req, res) => {
  try {
    let token = req.cookies.auth_cookie;
    if (!token) {
      token = req.headers.auth_cookie;
    }
    if (!token) {
      res.status(200).json({ displayName: "" });
    } else {
      try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const displayname = await User.findById(verified._id).select({
          username: 1,
        });
        res.status(200).json({ displayName: displayname });
      } catch (error) {
        console.log(error);
        res.status(200).json({ displayName: "" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.getDisplayname = getDisplayname;

const uncheckComment = async (req, res) => {
  try {
    const newCommentData = {
      viewed: false,
    };
    await Comment.findByIdAndUpdate(req.params.id, newCommentData, {
      new: true,
    });
    res.status(200).json({ msg: "دیدگاه به بخش دیدگاه های جدید افزوده شد!" });
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports.uncheckComment = uncheckComment;

const getNewItems = async (req, res) => {
  try {
    const newUsers = await User.find({ viewed: false });

    const newComments = await Comment.find({ viewed: false });
    const sendingData = {
      newUsersNumber: newUsers.length,

      newCommentsNumber: newComments.length,
    };
    res.status(200).json(sendingData);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
module.exports.getNewItems = getNewItems;
