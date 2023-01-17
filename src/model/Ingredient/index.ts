import mongoose, { Schema } from "mongoose";
import ModelName from "../ModelName";

const IngredientSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: ModelName.User,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// We want it to use id instead of _id
IngredientSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

IngredientSchema.set("toJSON", { virtuals: true });

const Ingredient = mongoose.model(ModelName.Ingredient, IngredientSchema);
export default Ingredient;
