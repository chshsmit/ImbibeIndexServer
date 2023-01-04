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
    isPrivate: {
      type: Boolean,
      required: true,
    },
    takes: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.RecipeTake,
      },
    ],
  },
  { timestamps: true }
);

const Recipe = mongoose.model(ModelName.Recipe, RecipeSchema);
export default Recipe;
