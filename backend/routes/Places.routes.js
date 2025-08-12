import express from "express";
import auth from "../middleware/auth.js";
import Place from "../models/Place.js";
import mongoose from "mongoose";
const router = express.Router();
router.post("/", auth, async (req, res) => {
  const { name, description, category, location, image } = req.body;
  if (!name || !description || !category || !location) {
    return res.status(400).json({
      success: false,
      message: "Please provide all values!",
    });
  }
  try {
    const existingPlace = await Place.findOne({ name, location });
    if (existingPlace) {
      return res
        .status(400)
        .json({ success: false, message: "Place already exists!" });
    }
    const newPlace = new Place({
      name,
      description,
      category,
      location,
      image,
      addedBy: req.user.id,
      reviews: [],
      averageRating: 0,
    });
    await newPlace.save();
    res.status(201).json({ success: true, data: newPlace });
  } catch (error) {
    console.error("Error in Adding Place:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const places = await Place.find({});
    res.status(200).json({ success: true, data: places });
  } catch (error) {
    console.log("Error in fetching Places: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/my-places", auth, async (req, res) => {
  try {
    const places = await Place.find({ addedBy: req.user.id });
    res.status(200).json({ success: true, data: places });
  } catch (error) {
    console.log("Error in fetching Places: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    res.status(200).json({ success: true, data: place });
  } catch (error) {
    console.log("Error in fetching Place: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await Place.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Place deleted" });
  } catch (error) {
    console.log("Error in Deleting Place: ", error.message);
    res.status(404).json({
      success: false,
      message: "Place not found Error",
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const place = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Place Invalid!" });
  }
  try {
    const updatedPlace = await Place.findByIdAndUpdate(id, place, {
      new: true,
    });
    res.status(200).json({
      success: true,
      data: updatedPlace,
    });
  } catch (error) {
    console.log("Error in Updating Place: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
export default router;
