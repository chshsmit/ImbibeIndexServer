import mongoose, { Schema } from "mongoose";
import ModelName from "../ModelName";

const TagSchema = new Schema(
  {
    tagName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model(ModelName.Tag, TagSchema);
export default Tag;
