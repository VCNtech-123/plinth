import mongoose, { Schema } from 'mongoose';
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  comparePassword(enteredPassword: string): Promise<boolean>;
  currentWorkspace: mongoose.Types.ObjectId
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    currentWorkspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace"
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);