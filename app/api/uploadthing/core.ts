import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  productLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // This is where you can add auth checks
      return {};
    })
    .onUploadComplete(() => {}),

  productImages: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
