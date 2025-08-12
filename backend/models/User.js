import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    savedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
