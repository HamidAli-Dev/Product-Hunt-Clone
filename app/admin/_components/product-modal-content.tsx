"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import {
  PiCaretUpFill,
  PiChatCircle,
  PiTrash,
  PiUploadSimple,
} from "react-icons/pi";

import { PendingProduct } from "@/app/admin/_components/pending-products";
import CarouselComponent from "@/app/admin/_components/carousel-component";
import ShareModal from "@/app/admin/_components/modals/share-product-modal";
import ShareModalContent from "@/app/admin/_components/share-modal-content";
import { Badge } from "@/components/ui/badge";
import { commentOnProduct, upvoteProduct } from "@/lib/server-actions";

interface ExtendedProduct extends PendingProduct {
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

interface ProductModalContentProps {
  authUser: Session | null;
  currentProduct: ExtendedProduct | undefined | null;
  hasUpvoted: boolean;
  setHasUpvoted: React.Dispatch<React.SetStateAction<boolean>>;
  totalUpvotes: number;
  setTotalUpvotes: React.Dispatch<React.SetStateAction<number>>;
}

const ProductModalContent = ({
  authUser,
  currentProduct,
  hasUpvoted,
  setHasUpvoted,
  totalUpvotes,
  setTotalUpvotes,
}: ProductModalContentProps) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(currentProduct?.commentData || []);

  const [shareModalModalVisible, setShareModalVisible] = useState(false);

  if (!currentProduct) {
    return <div>No product selected</div>;
  }

  if (!authUser?.user) {
    return null;
  }

  const handleUpvoteClick = async () => {
    try {
      await upvoteProduct(currentProduct.id);
      setTotalUpvotes(hasUpvoted ? totalUpvotes - 1 : totalUpvotes + 1);
      setHasUpvoted(!hasUpvoted);
    } catch (error) {
      console.log("Error upvoting product", error);
    }
  };

  const handleShareClick = () => {
    setShareModalVisible(true);
  };

  const handleCommentSubmit = async () => {
    if (!authUser?.user?.id || !authUser?.user?.name || !authUser?.user?.image)
      return;

    try {
      await commentOnProduct(currentProduct.id, commentText);

      setCommentText("");

      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          userId: authUser.user.id,
          user: authUser.user.name,
          profile: authUser.user.image,
          body: commentText,
          name: authUser.user.name.toLowerCase().replace(/\s/g, "_"),
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.log("Error submitting comment: ", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log("handleDeleteComment", commentId);
  };

  return (
    <div className="h-full">
      <div className="md:w-4/5 mx-auto">
        <Image
          src={currentProduct.logo}
          alt="logo"
          width={200}
          height={200}
          className="h-20 w-20 border rounded-md bg-white shadow-md"
        />

        <div className="py-4 space-y-2">
          <h1 className="text-2xl font-semibold">{currentProduct.name}</h1>
          <div className="md:flex md:justify-between items-center">
            <p className="text-gray-600 text-xl font-light md:w-3/5">
              {currentProduct.headline}
            </p>

            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={() => window.open(currentProduct.website, "_blank")}
                className="border rounded-md flex justify-center items-center p-5 cursor-pointer"
              >
                Visit
              </button>

              <button
                className={`rounded-md flex justify-center items-center p-5 
                gap-x-3 cursor-pointer bg-gradient-to-r w-full xl:w-56 ${
                  hasUpvoted
                    ? "from-[#ff6154] to-[#ff4582] border-[#ff6154] text-white"
                    : "text-black border"
                }`}
                onClick={handleUpvoteClick}
              >
                <PiCaretUpFill
                  className={`text-xl ${
                    hasUpvoted ? "text-white" : "text-black"
                  }`}
                />
                {totalUpvotes}
              </button>
            </div>
          </div>

          <h2 className="text-gray-600 py-6">{currentProduct.description}</h2>
          <div className="md:flex justify-between items-center">
            <div className="flex gap-x-2">
              {currentProduct.categories.map(
                (category: { id: string; name: string }) => (
                  <Link
                    href={`/category/${category.name.toLowerCase()}`}
                    key={category.id}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md cursor-pointer"
                  >
                    {category.name}
                  </Link>
                )
              )}
            </div>

            <div className="flex items-center gap-x-4 py-4">
              <div className="text-md text-gray-600 flex items-center gap-x-1 cursor-pointer">
                <PiChatCircle />
                <p>Discuss</p>
              </div>

              <div
                onClick={handleShareClick}
                className="text-md text-gray-600 flex items-center gap-x-1 cursor-pointer"
              >
                <PiUploadSimple />
                <p>Share</p>
              </div>
            </div>
          </div>
          <CarouselComponent productImages={currentProduct.images} />

          <h1 className="font-semibold pt-10">Community Feedback</h1>
          <div>
            <div className="w-full flex gap-4 mt-4">
              <Image
                src={authUser?.user?.image || ""}
                alt="profile"
                width={50}
                height={50}
                className="rounded-full h-12 w-12"
              />

              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What do you think about this product?"
                className="w-full rounded-md p-4 focus:outline-none text-gray-600"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleCommentSubmit}
                className="bg-[#ff6154] text-white p-2 rounded-md cursor-pointer"
              >
                Comment
              </button>
            </div>
          </div>

          <div className="py-8 space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Image
                  src={comment.profile}
                  alt="profile"
                  width={50}
                  height={50}
                  className="w-8 h-8 rounded-full mt-1 cursor-pointer"
                />

                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-2 items-center">
                      <h1 className="text-gray-600 font-semibold cursor-pointer">
                        {comment.user}
                      </h1>
                      {comment.userId === currentProduct.userId && (
                        <Badge className="bg-[#88aaff]">Creator</Badge>
                      )}

                      <div className="text-gray-500 text-xs">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>

                    {(comment.userId === authUser?.user?.id ||
                      currentProduct.userId === authUser?.user?.id) && (
                      <PiTrash
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:cursor-pointer"
                      />
                    )}
                  </div>

                  <div
                    className="text-gray-600 text-sm 
                    hover:cursor-pointer mt-2"
                  >
                    {comment.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ShareModal
        visible={shareModalModalVisible}
        setVisible={setShareModalVisible}
      >
        <ShareModalContent currentProduct={currentProduct as ExtendedProduct} />
      </ShareModal>
    </div>
  );
};

export default ProductModalContent;
