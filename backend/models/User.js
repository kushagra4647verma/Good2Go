import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    savedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
    googleId: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
