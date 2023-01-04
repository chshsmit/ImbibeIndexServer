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
    parentCollection: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: ModelName.Collection,
    },
    collections: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Collection,
      },
    ],
    recipes: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Recipe,
      },
    ],
  },
  { timestamps: true }
);

// We want it to use id instead of _id
CollectionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CollectionSchema.set("toJSON", { virtuals: true });

const Collection = mongoose.model(ModelName.Collection, CollectionSchema);
export default Collection;
