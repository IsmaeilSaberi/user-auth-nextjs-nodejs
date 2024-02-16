const Diet = require("../models/diet.js");
const mongoose = require("mongoose");

const getDietPost = async (req, res) => {
  try {
    const dietPosts = await Diet.find();

    res.status(200).json(dietPosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
module.exports.getDietPost = getDietPost;

const createDietPost = async (req, res) => {
  try {
    const { Grains, Proteins, Vegetables, Fruits } = req.body;

    const newDietPost = new Diet({
      Grains,
      Proteins,
      Vegetables,
      Fruits,
      ID: req.userId,
      creator: req.userName,
      createdAt: new Date().toISOString(),
    });

    await newDietPost.save();

    res.status(201).json(newDietPost);
    console.log(" This one comes from create new Diet Post \n", newDietPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
module.exports.createDietPost = createDietPost;

const updateDietPost = async (req, res) => {
  const { id } = req.params;
  const { Grains, Proteins, Vegetables, Fruits } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("No Diet Data found with that id");
  }
  try {
    const updatedDietPost = await Diet.findByIdAndUpdate(
      id,
      {
        Grains: Grains,
        Proteins: Proteins,
        Vegetables: Vegetables,
        Fruits: Fruits,
      },
      { new: true }
    );

    res.json(updatedDietPost);
    console.log(
      " This one comes from update new Diet Post \n",
      updatedDietPost
    );
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
module.exports.updateDietPost = updateDietPost;

const deleteDietPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("No Diet Data found with that id");
  }
  try {
    await Diet.findByIdAndRemove(id);

    res.json({ message: "Diet Data by that id is successfully deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
module.exports.deleteDietPost = deleteDietPost;

const likeDietPost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    console.log("Unauthenticated user");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("No Diet Data found with that id");
  }

  try {
    const dietPost = await Diet.findById(id);

    const index = dietPost.likes.findIndex((id) => id === String(req.userId));
    // if this user have not liked the post
    if (index === -1) {
      dietPost.likes.push(req.userId);
    } else {
      dietPost.likes = dietPost.likes.filter((id) => id !== String(req.userId));
    }
    // console.log(dietPost.likes)
    const updatedDietPost = await Diet.findByIdAndUpdate(id, dietPost, {
      new: true,
    });

    res.json(updatedDietPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
module.exports.likeDietPost = likeDietPost;
