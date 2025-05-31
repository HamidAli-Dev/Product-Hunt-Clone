"use server";

import { auth } from "@/auth";
import { db } from "./db";
import { revalidatePath } from "next/cache";

interface CreateProductData {
  name: string;
  slug: string;
  headline: string;
  description: string;
  logo: string;
  releaseDate: string;
  website: string;
  twitter: string;
  discord: string;
  images: string[];
  categories: string[];
}

export async function createProduct(data: CreateProductData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const product = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        headline: data.headline,
        description: data.description,
        logo: data.logo,
        releaseDate: data.releaseDate,
        website: data.website,
        twitter: data.twitter,
        discord: data.discord,
        rank: 0,
        status: "PENDING",
        categories: {
          connectOrCreate: data.categories.map((category) => ({
            where: {
              name: category,
            },
            create: {
              name: category,
            },
          })),
        },
        images: {
          createMany: {
            data: data.images.map((image) => ({ url: image })),
          },
        },
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    revalidatePath("/my-products");
    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}
