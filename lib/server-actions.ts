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
    const authUser = await auth();

    if (!authUser?.user?.id) {
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
            id: authUser.user.id,
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

export const getOwnerProducts = async () => {
  const authUser = await auth();

  if (!authUser) {
    return [];
  }

  const userId = authUser.user?.id;

  const products = await db.product.findMany({
    where: {
      userId,
    },
  });

  return products;
};

export const getProductById = async (productId: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        categories: true,
        images: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: {
          include: {
            user: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateProduct = async (
  productId: string,
  productData: CreateProductData
) => {
  const {
    name,
    slug,
    headline,
    description,
    logo,
    releaseDate,
    website,
    twitter,
    discord,
    images,
  } = productData;
  try {
    const authUser = await auth();
    if (!authUser) {
      throw new Error("Unauthorized");
    }

    const productByUserId = await db.product.findUnique({
      where: {
        id: productId,
        userId: authUser.user?.id,
      },
    });

    if (!productByUserId) {
      throw new Error("You are not owner of this product");
    }

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        slug,
        headline,
        description,
        logo,
        releaseDate,
        website,
        twitter,
        discord,
        images: {
          deleteMany: {
            productId,
          },
          createMany: {
            data: images.map((image) => ({ url: image })),
          },
        },
        status: "PENDING",
      },
    });

    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product:", error);
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const authUser = await auth();

    if (!authUser || !authUser.user || !authUser.user.id) {
      throw new Error("Unauthorized");
    }

    const productByUserId = await db.product.findUnique({
      where: {
        id: productId,
        userId: authUser.user?.id,
      },
    });

    if (!productByUserId) {
      throw new Error("You are not owner of this product");
    }

    await db.product.delete({
      where: {
        id: productId,
      },
      include: {
        images: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("Error while deleting product", error);
  }
};

export const getPendingProducts = async () => {
  try {
    const products = await db.product.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        categories: true,
        images: true,
      },
    });

    return products;
  } catch (error) {
    console.log("Error while getting pending products", error);
  }
};

export const activateProduct = async (productId: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        status: "ACTIVE",
      },
    });

    await db.notification.create({
      data: {
        userId: product.userId,
        productId: product.id,
        profilePicture: product.logo,
        body: `Your product ${product.name} has been activated`,
        type: "ACTIVATED",
        status: "UNREAD",
      },
    });

    return product;
  } catch (error) {
    console.log("Error while activating product", error);
  }
};

export const rejectProduct = async (productId: string, reason: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found or not authorized");
    }

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        status: "REJECTED",
      },
    });

    await db.notification.create({
      data: {
        userId: product.userId,
        productId: product.id,
        profilePicture: product.logo,
        body: `Your product ${product.name} has been rejected. Reason: ${reason}`,
        type: "REJECTED",
        status: "UNREAD",
      },
    });
  } catch (error) {
    console.log("Error while rejecting product", error);
  }
};
