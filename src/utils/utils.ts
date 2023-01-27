import { S3 } from "aws-sdk";

// ----------------------------------------------------------------------------------------------------
export const getImageForRecipe = async (
  recipeId: string | number
): Promise<string> => {
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET!,
    },
  });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `picture-for-recipe-${recipeId}`,
    Expires: 60 * 60 * 5,
  };
  let image;
  try {
    // TODO: Figure out how to handle image not existing
    image = await s3.getSignedUrl("getObject", params);
  } catch (err) {
    image = "";
  }

  return image;
};
