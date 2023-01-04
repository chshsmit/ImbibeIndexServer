import mongoose, { Schema } from "mongoose";
import ModelName from "../ModelName";

const RecipeTakeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelName.User,
    },
    takeNumber: {
      type: Number,
      required: true,
    },
    ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.RecipeIngredient,
      },
    ],
  },
  { timestamps: true }
);

const RecipeTake = mongoose.model(ModelName.RecipeTake, RecipeTakeSchema);
export default RecipeTake;
