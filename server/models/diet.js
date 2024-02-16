const mongoose = require("mongoose");

const dietSchema = mongoose.Schema({
  ID: { type: String },
  creator: { type: String },
  Grains: {
    recipes: [
      {
        title: { type: String },
        img: { type: String },
        calories: { type: Number },
      },
    ],
    start: {
      type: Date,
      default: new Date(),
    },
    end: {
      type: Date,
      default: new Date(),
    },
  },
  Proteins: {
    recipes: [
      {
        title: { type: String },
        img: { type: String },
        calories: { type: Number },
      },
    ],
    start: {
      type: Date,
      default: new Date(),
    },
    end: {
      type: Date,
      default: new Date(),
    },
  },
  Vegetables: {
    recipes: [
      {
        title: { type: String },
        img: { type: String },
        calories: { type: Number },
      },
    ],
    start: {
      type: Date,
      default: new Date(),
    },
    end: {
      type: Date,
      default: new Date(),
    },
  },
  Fruits: {
    recipes: [
      {
        title: { type: String },
        img: { type: String },
        calories: { type: Number },
        serving_qty: { type: Number },
      },
    ],
    start: {
      type: Date,
      default: new Date(),
    },
    end: {
      type: Date,
      default: new Date(),
    },
  },
  likes: { type: [String], default: [] },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Diet", dietSchema);
