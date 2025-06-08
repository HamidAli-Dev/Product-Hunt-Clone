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

export const getActiveProducts = async () => {
  try {
    const products = await db.product.findMany({
      where: {
        status: "ACTIVE",
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
      orderBy: {
        upvotes: {
          _count: "desc",
        },
      },
    });

    return products;
  } catch (error) {
    console.log("Error while getting active products", error);
  }
};

export const commentOnProduct = async (productId: string, comment: string) => {
  try {
    const authUser = await auth();

    if (!authUser || !authUser.user || !authUser.user.id) {
      throw new Error("Unauthorized");
    }

    const userId = authUser.user.id;

    // Check if authUser has profile picture
    const profilePicture = authUser.user.image || "";

    await db.comment.create({
      data: {
        userId,
        productId,
        body: comment,
        profilePicture,
        createdAt: new Date(),
      },
      include: {
        user: true,
      },
    });

    const productDetails = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        userId: true,
        name: true, // Include the product name in the query
      },
    });

    // Check if the commenter is not the owner of the product
    if (productDetails && productDetails.userId !== userId) {
      // Notify the product owner about the comment
      await db.notification.create({
        data: {
          userId: productDetails.userId,
          body: `Commented on your product "${productDetails.name}"`,
          profilePicture: profilePicture,
          productId: productId,
          type: "COMMENT",
          status: "UNREAD",
          // Ensure commentId is included here
        },
      });
    }
  } catch (error) {
    console.log("Error while commenting on product", error);
  }
};

export const upvoteProduct = async (productId: string) => {
  try {
    const authUser = await auth();

    if (!authUser || !authUser.user || !authUser.user.id) {
      throw new Error("Unauthorized");
    }

    const profilePicture = authUser.user.image || "";

    const upvote = await db.upvote.findFirst({
      where: {
        userId: authUser.user.id,
        productId,
      },
    });

    if (upvote) {
      await db.upvote.delete({
        where: {
          id: upvote.id,
        },
      });
    } else {
      await db.upvote.create({
        data: {
          userId: authUser.user.id,
          productId,
        },
      });
    }

    const productOwner = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        userId: true,
      },
    });

    // notify the product owner about the upvote

    if (productOwner && productOwner.userId !== authUser.user.id) {
      await db.notification.create({
        data: {
          userId: productOwner.userId,
          body: `Upvoted your product`,
          profilePicture: profilePicture,
          productId: productId,
          type: "UPVOTE",
          status: "UNREAD",
        },
      });
    }

    return true;
  } catch (error) {
    console.log("Error while upvoting product", error);
  }
};

export const getUpvotedProducts = async () => {
  try {
    const authUser = await auth();

    if (!authUser || !authUser.user || !authUser.user.id) {
      throw new Error("Unauthorized");
    }

    const userId = authUser.user.id;

    const upvotedProducts = await db.upvote.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    return upvotedProducts.map((upvote) => upvote.product);
  } catch (error) {
    console.error("Error getting upvoted products:", error);
    return [];
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        slug,
      },
      include: {
        images: true,
        categories: true,
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
    console.log("Error while getProductBySlug", error);
  }
};

export const getCategories = async () => {
  try {
    const categories = await db.category.findMany({
      where: {
        products: {
          some: {
            status: "ACTIVE",
          },
        },
      },
    });

    return categories;
  } catch (error) {
    console.log("Error while getCategories", error);
  }
};

export const getProductsByCategoryName = async (category: string) => {
  try {
    const products = await db.product.findMany({
      where: {
        categories: {
          some: {
            name: category,
          },
        },
        status: "ACTIVE",
      },
    });

    return products;
  } catch (error) {
    console.log("Error while getProductsByCategoryName", error);
  }
};

export const getRankById = async () => {
  try {
    const rankedProducts = await db.product.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        upvotes: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        upvotes: {
          _count: "desc",
        },
      },
    });

    // Find the maximum number of upvotes among all products
    const maxUpvotes =
      rankedProducts.length > 0 ? rankedProducts[0].upvotes.length : 0;

    // Assign ranks to each product based on their number of upvotes
    const productsWithRank = rankedProducts.map((product, index) => ({
      ...product,
      rank: product.upvotes.length === maxUpvotes ? 1 : index + 2,
    }));

    return productsWithRank;
  } catch (error) {
    console.log("Error while getRankById", error);
  }
};

export const getNotifications = async () => {
  try {
    const authUser = await auth();
    if (!authUser || !authUser.user || !authUser.user.id) {
      throw new Error("Unauthorized");
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: authUser.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (notifications.length === 0) {
      return null;
    }

    return notifications;
  } catch (error) {
    console.log("Error while getNotifications", error);
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const authUser = await auth();

    if (!authUser || !authUser.user || !authUser.user.id) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authUser?.user.id;

    await db.notification.updateMany({
      where: {
        userId,
      },
      data: {
        status: "READ",
      },
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};

export const searchProducts = async (query: string) => {
  try {
    const products = await db.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        status: "ACTIVE",
      },
    });

    return products;
  } catch (error) {
    console.log("Error while searching products", error);
  }
};

export const getProductsByUserId = async (userId: string) => {
  try {
    const products = await db.product.findMany({
      where: {
        userId,
      },
    });

    return products;
  } catch (error) {
    console.log("Error while getProductsByUserId", error);
  }
};

export const isUserPremium = async () => {
  try {
    const authUser = await auth();
    if (!authUser || !authUser.user || !authUser.user.id) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        id: authUser.user.id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.isPremium;
  } catch (error) {
    console.log("Error while isUserPremium", error);
  }
};
