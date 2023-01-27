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
  };
  let image;
  try {
    await s3.headObject(params).promise();
    image = await s3.getSignedUrl("getObject", {
      ...params,
      Expires: 60 * 60 * 5,
    });
  } catch (err) {
    image = "";
  }

  return image;
};
