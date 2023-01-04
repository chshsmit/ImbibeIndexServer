import mongoose, { Schema } from "mongoose";
import ModelName from "../ModelName";

const IngredientSchema = new Schema(
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
  },
  { timestamps: true }
);

const Ingredient = mongoose.model(ModelName.Ingredient, IngredientSchema);
export default Ingredient;
