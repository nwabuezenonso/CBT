import { Schema, Document, models, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "ADMIN",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const UserModel = models.User || model("User", UserSchema);
export default UserModel;
