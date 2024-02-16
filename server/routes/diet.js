const express = require("express");
const router = express();

const DietCtrl = require("../controllers/diet.js");

router.get("/", DietCtrl.getDietPost);
router.post("/", DietCtrl.createDietPost);
router.patch("/:id", DietCtrl.updateDietPost);
router.patch("/:id/likeDietPost", DietCtrl.likeDietPost);
router.delete("/:id", DietCtrl.deleteDietPost);

module.exports = router;
