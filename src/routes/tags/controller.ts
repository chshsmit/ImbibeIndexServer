import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import {
  CreateTagsRequest,
  CreateTagsResponse,
  GetTagsResponse,
} from "./types";

const prisma = new PrismaClient();

//--------------------------------------------------------------------------------

/**
 * @method POST
 * @route /tags
 * @protected no
 */
export const createTags = asyncHandler(
  async (req: CreateTagsRequest, res: CreateTagsResponse) => {
    const { tags } = req.body;

    if (!tags) {
      res.status(400);
      throw new Error("No tags provided");
    }

    const newTags = tags.map((tag) => {
      return {
        tagName: tag,
      };
    });

    const createdTags = await prisma.tag.createMany({
      data: newTags,
      skipDuplicates: true,
    });

    res.status(201).json({
      message: `Successfully saved ${createdTags.count} new tags`,
    });
  }
);

//--------------------------------------------------------------------------------

/**
 * @method GET
 * @route /tags
 * @protected no
 */
export const getTags = asyncHandler(async (req, res: GetTagsResponse) => {
  const tags = await prisma.tag.findMany();

  res.status(200).json({
    tags: tags.map((tag) => {
      return { id: tag.id, tagName: tag.tagName };
    }),
  });
});
