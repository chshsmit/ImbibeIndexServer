import mongoose, { Schema } from "mongoose";
import ModelName from "../ModelName";

const CollectionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelName.User,
    },
    collectionName: {
      type: String,
      required: true,
    },
    isRootCollection: {
      type: Boolean,
      required: true,
    },
    collections: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Collection,
      },
    ],
  },
  { timestamps: true }
);

const Collection = mongoose.model(ModelName.Collection, CollectionSchema);
export default Collection;
