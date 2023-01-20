import asyncHandler from "express-async-handler";

//--------------------------------------------------------------------------------

export const searchRecipes = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "successfully searched" });
});
