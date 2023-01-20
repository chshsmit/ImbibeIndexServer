import mongoose, { Schema } from "mongoose";
import ModelName from "../ModelName";

const RecipeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelName.User,
    },
    name: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
    recipeDescription: {
      type: String,
      required: false,
    },
    takes: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.RecipeTake,
      },
    ],
    collectionForRecipe: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelName.Collection,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Tag,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.User,
      },
    ],
  },
  { timestamps: true }
);

// We want it to use id instead of _id
RecipeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
RecipeSchema.set("toJSON", { virtuals: true });

const Recipe = mongoose.model(ModelName.Recipe, RecipeSchema);
export default Recipe;
