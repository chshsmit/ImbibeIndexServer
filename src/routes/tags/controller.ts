import asyncHandler from "express-async-handler";
import Tag from "../../model/Tag";
import {
  CreateTagsRequest,
  CreateTagsResponse,
  GetTagsResponse,
} from "./types";

export const createTags = asyncHandler(
  async (req: CreateTagsRequest, res: CreateTagsResponse) => {
    const { tags } = req.body;

    if (!tags) {
      res.status(400);
      throw new Error("No tags provided");
    }

    const tagsFromMongo = await Tag.find();

    if (!tagsFromMongo) {
      res.status(500);
      throw new Error("Something unexpected happened");
    }

    const currentTags = tagsFromMongo.map((tag) => tag.tagName);

    const tagsToSave = tags.filter((tag) => !currentTags.includes(tag));

    const newTags = tagsToSave.map((tag) => {
      const newTag = new Tag();
      newTag.tagName = tag;
      return newTag;
    });

    // Save all tags
    await Tag.insertMany(newTags);

    res.status(201).json({
      message: `Successfully saved ${tagsToSave.length} new tags`,
    });
  }
);

export const getTags = asyncHandler(async (req, res: GetTagsResponse) => {
  const tags = await Tag.find();

  res.status(200).json({
    tags: tags.map((tag) => {
      return { id: tag.id, tagName: tag.tagName };
    }),
  });
});
