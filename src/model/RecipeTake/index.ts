import mongoose, { Schema } from "mongoose";
import ModelName from "../ModelName";

const StepSchema = new Schema(
  {
    order: {
      type: Number,
      required: true,
    },
    stepText: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const IngredientSchema = new Schema(
  {
    ingredient: {
      type: Schema.Types.ObjectId,
      ref: ModelName.Ingredient,
    },
    amount: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

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
    ingredients: [IngredientSchema],
    steps: [StepSchema],
    takeNotes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// We want it to use id instead of _id
RecipeTakeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

RecipeTakeSchema.set("toJSON", { virtuals: true });

const RecipeTake = mongoose.model(ModelName.RecipeTake, RecipeTakeSchema);
export default RecipeTake;
