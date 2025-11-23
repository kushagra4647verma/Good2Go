import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    location: { type: String, required: true },
    image: { type: String },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    googleMapsUrl: { type: String },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

placeSchema.index({
  name: "text",
  location: "text",
  description: "text",
  tags: "text",
});

const Place = mongoose.model("Place", placeSchema);

export default Place;
