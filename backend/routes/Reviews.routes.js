import express from "express";
import Review from "../models/Review.js";
import Place from "../models/Place.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/my-reviews", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).populate(
      "placeId",
      "name image location category"
    );

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await Review.find({ placeId: id.toString() }).populate(
      "userId",
      "username"
    );
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.log("Error in fetching Review: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.post("/:placeId", auth, async (req, res) => {
  const { placeId } = req.params;
  const { comment, rating } = req.body;
  const userId = req.user.id;

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res
        .status(404)
        .json({ success: false, message: "Place not found" });
    }

    const alreadyReviewed = await Review.findOne({ placeId, userId });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "You already reviewed this place" });
    }

    const review = await Review.create({
      placeId,
      userId,
      comment,
      rating,
    });

    place.reviews.push(review._id);

    const allReviews = await Review.find({ placeId });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    place.averageRating = avgRating;

    await place.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findOneAndDelete({ userId: req.user.id });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Data not found!",
      });
    }
    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.log("Error in Deleting Review: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;
