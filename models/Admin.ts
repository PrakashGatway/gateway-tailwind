import mongoose, { type Model, Schema, type Types } from "mongoose";

export interface AdminRecord {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
}

// Uses the existing `admins` collection; no account is seeded or created implicitly.
const adminSchema = new Schema<AdminRecord>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: true },
  },
  { collection: "admins", strict: false, versionKey: false },
);

const Admin =
  (mongoose.models.Admin as Model<AdminRecord> | undefined) ||
  mongoose.model<AdminRecord>("Admin", adminSchema);

export default Admin;
