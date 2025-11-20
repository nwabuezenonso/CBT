import { Schema, models, model } from "mongoose";

const WaitlistSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
  },
  { timestamps: true }
);

const WaitlistModel = models.Waitlist || model("Waitlist", WaitlistSchema);
export default WaitlistModel;
