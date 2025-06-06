import React from "react";

import { Category, Comment, Image, Product, User } from "@prisma/client";
import { auth } from "@/auth";
import ProductItem from "@/components/product-item";

export interface extendedComment extends Comment {
  user: User;
}

export interface ActiveProducts extends Product {
  categories: Category[];
  images: Image[];
  comments: extendedComment[];
  commentsLength: number;
  upvotesData: string[];
  upvotesCount: number;
  commentData: {
    id: string;
    userId: string;
    user: string;
    profile: string;
    body: string;
    name: string;
    createdAt: Date;
  }[];
}

interface ActiveProductsProps {
  activeProducts: ActiveProducts[];
}

const ActiveProducts = async ({ activeProducts }: ActiveProductsProps) => {
  const authUser = await auth();

  const formattedActiveProducts = activeProducts.map((product) => {
    const commentsCount = product.comments ? product.comments.length : 0;

    const commentText = product.comments
      ? product.comments.map((comment) => ({
          id: comment.id,
          userId: comment.userId,
          user: comment.user.name,
          profile: comment.profilePicture,
          body: comment.body,
          name: comment.user.name.toLowerCase().replace(/\s/g, "_"),
          createdAt: comment.createdAt,
        }))
      : [];

    return {
      ...product,
      categories: product.categories,
      images: product.images,
      commentsLength: commentsCount,
      commentData: commentText,
    };
  });

  return (
    <div className="w-full">
      <div className="flex items-center border-b pb-3">
        <h1 className="text-xl font-medium">All Products</h1>
      </div>

      <div className="space-y-2 py-6 flex flex-col">
        {formattedActiveProducts.map((product) => (
          <ProductItem key={product.id} authUser={authUser} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ActiveProducts;
