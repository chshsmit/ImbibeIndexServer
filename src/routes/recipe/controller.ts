import { S3 } from "aws-sdk";
import asyncHandler from "express-async-handler";
import fs from "fs";
import Collection from "../../model/Collection";
import Recipe from "../../model/Recipe";
import RecipeTake from "../../model/RecipeTake";
import {
  CreateRecipeRequest,
  CreateRecipeResponse,
  GetRecipeResponse,
  TagForRecipeReponse,
  TakeForRecipeResponse,
  UpdateRecipeRequest,
  UpdateRecipeResponse,
} from "./types";

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /recipe
 * @protected yes
 */
export const createRecipe = asyncHandler(
  async (req: CreateRecipeRequest, res: CreateRecipeResponse) => {
    const { name, isPublished, collectionId } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("No recipe name provided");
    } else if (!isPublished) {
      res.status(400);
      throw new Error(
        "You need to provide whether or not this recipe is private."
      );
    } else if (!collectionId) {
      res.status(400);
      throw new Error("You need provide the collection this recipe is part of");
    }

    const collectionForRecipe = await Collection.findById(collectionId);

    if (!collectionForRecipe) {
      res.status(400);
      throw new Error(
        `The collection with id [${collectionId}] does not exist`
      );
    }

    // Lets create the first take right away
    const firstTake = await RecipeTake.create({
      user: req.user.id,
      takeNumber: 1,
      ingredients: [],
    });

    const recipe = await Recipe.create({
      name,
      user: req.user.id,
      isPublished: isPublished === "Y",
      collectionForRecipe: collectionForRecipe.id,
      takes: [firstTake.id],
    });

    if (recipe) {
      // Lets add the recipe to the collection
      await collectionForRecipe.updateOne({ $push: { recipes: recipe.id } });

      res.status(201).json({
        id: recipe.id,
        name: recipe.name,
      });
    } else {
      res.status(400);
      throw new Error("Invalid recipe data");
    }
  }
);

//--------------------------------------------------------------------------------

export const uploadImage = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findOne({
    user: req.user.id,
    _id: req.params.id,
  });

  if (!req.file) {
    res.status(400);
    throw new Error("No image was provided");
  }

  if (!recipe) {
    res.status(404);
    throw new Error("We did not find the recipe you are looking for.");
  }

  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET!,
    },
  });

  const fileContent = fs.readFileSync(req.file.path);

  const params: S3.PutObjectRequest = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: recipe.id,
    Body: fileContent,
  };
  s3.upload(params, function (err) {
    if (err) {
      res.status(400);
      throw new Error("Something went wrong");
    } else {
      fs.unlink(req.file!.path, () => {
        console.log("Deleted file");
      });
      res.status(201).json({ message: "Upload success" });
    }
  });
});

//--------------------------------------------------------------------------------

/**
 * @method PATCH
 * @route /recipe/:id
 * @protected yes
 */
export const updateRecipe = asyncHandler(
  async (req: UpdateRecipeRequest, res: UpdateRecipeResponse) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      res.status(404);
      throw new Error(`No recipe found with id: ${req.params.id}`);
    }

    if (recipe.user.toString() !== req.user.id) {
      res.status(404);
      console.error("Unauthorized access");
      throw new Error("We did not find this recipe sorry");
    }

    await recipe.updateOne({
      ...req.body,
    });

    res.status(200).json({
      message: "Successfully updated recipe",
    });
  }
);

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

interface UserForRecipe {
  name: string;
  displayName: string;
  id: string;
}

/**
 * @method GET
 * @route /recipe/:id
 * @protected semi-protected
 */

export const getRecipeById = asyncHandler(
  async (req, res: GetRecipeResponse) => {
    let recipe;
    try {
      recipe = await Recipe.findById(req.params.id)
        .populate<{
          user: UserForRecipe;
        }>("user", "name displayName id")
        .populate<{
          takes: Array<TakeForRecipeResponse>;
        }>({
          path: "takes",
          select: "id takeNumber steps takeNotes",
          populate: [
            {
              path: "ingredients",
              populate: {
                path: "ingredient",
                select: "name",
              },
            },
          ],
        })
        .populate<{ tags: Array<TagForRecipeReponse> }>({
          path: "tags",
          select: "_id tagName",
        });
    } catch (err) {
      res.status(404);
      throw new Error("Recipe not found");
    }

    if (!recipe) {
      res.status(404);
      throw new Error(`Recipe with id ${req.params.id} was not found`);
    }

    if (!recipe.isPublished) {
      if (!req.user || req.user.id !== recipe.user.id) {
        res.status(404);
        throw new Error("We could not find the recipe you were looking for");
      }
    }

    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET!,
      },
    });

    let image;
    try {
      image = await s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: req.params.id,
        Expires: 60 * 60 * 5,
      });
    } catch (err) {
      image = "";
    }

    let isEditable = false;
    if (req.user && req.user.id === recipe.user.id) isEditable = true;

    res.status(200).json({
      id: recipe.id,
      name: recipe.name,
      takes: recipe.takes,
      recipeDescription: recipe.recipeDescription,
      isPublished: recipe.isPublished,
      createdBy: {
        displayName: recipe.user.displayName,
        id: recipe.user.id,
      },
      createdAt: recipe.createdAt,
      isEditable,
      tags: recipe.tags.map((tag) => {
        return { id: tag._id, tagName: tag.tagName };
      }),
      image,
    });
  }
);
