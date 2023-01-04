import mongoose, { Schema } from "mongoose";
import ModelName from "../ModelName";

const RecipeIngredientSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelName.User,
    },
    ingredient: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelName.Ingredient,
    },
    amount: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// We want it to use id instead of _id
RecipeIngredientSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

RecipeIngredientSchema.set("toJSON", { virtuals: true });

const RecipeIngredient = mongoose.model(
  ModelName.RecipeIngredient,
  RecipeIngredientSchema
);
export default RecipeIngredient;
