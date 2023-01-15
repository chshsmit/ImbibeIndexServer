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
        type: {
          ingredient: {
            type: Schema.Types.ObjectId,
            ref: ModelName.Ingredient,
          },
          amount: Number,
          unit: String,
        },
      },
    ],
    steps: [
      {
        type: { order: Number, stepText: String },
      },
    ],
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
