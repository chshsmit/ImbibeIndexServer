import { S3 } from "aws-sdk";

// ----------------------------------------------------------------------------------------------------
export const getImageForRecipe = async (recipeId: string): Promise<string> => {
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
      Key: recipeId,
      Expires: 60 * 60 * 5,
    });
  } catch (err) {
    image = "";
  }

  return image;
};
