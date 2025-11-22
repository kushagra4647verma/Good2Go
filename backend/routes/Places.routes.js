import express from "express";
import auth from "../middleware/auth.js";
import Place from "../models/Place.js";
import mongoose from "mongoose";
const router = express.Router();
router.post("/", auth, async (req, res) => {
  const {
    name,
    description,
    category,
    location,
    image,
    tags,
    coordinates,
    googleMapsUrl,
  } = req.body;

  // Required validations
  if (!name || !description || !category || !location) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required values!",
    });
  }

  try {
    // Check for existing place
    const existingPlace = await Place.findOne({ name, location });
    if (existingPlace) {
      return res.status(400).json({
        success: false,
        message: "Place already exists!",
      });
    }

    // Create new place with all schema fields
    const newPlace = new Place({
      name,
      description,
      category,
      location,
      image,
      tags: tags || [],
      coordinates: coordinates || null,
      googleMapsUrl: googleMapsUrl || "",
      addedBy: req.user.id,
      reviews: [],
      averageRating: 0,
    });

    await newPlace.save();

    res.status(201).json({
      success: true,
      message: "Place added successfully!",
      data: newPlace,
    });
  } catch (error) {
    console.error("Error in Adding Place:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
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
