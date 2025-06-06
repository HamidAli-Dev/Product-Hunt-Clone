"use client";
import React, { useState } from "react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import {
  PiArrowBendDoubleUpRight,
  PiCaretUpFill,
  PiChatCircle,
} from "react-icons/pi";
import { motion } from "framer-motion";

import ProductModal from "@/app/admin/_components/modals/product-modal";
import ProductModalContent from "@/app/admin/_components/product-modal-content";
import { ActiveProducts } from "@/components/active-products.tsx";
import Modal from "./ui/modals/modal";
import AuthContent from "./navbar/auth-content";
import { upvoteProduct } from "@/lib/server-actions";

interface ProductItemProps {
  authUser: Session | null;
  product: ActiveProducts;
}

interface ExtendedProduct extends ActiveProducts {
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

const ProductItem = ({ authUser, product }: ProductItemProps) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ExtendedProduct | null>(
    null
  );

  const [hasUpvoted, setHasUpvoted] = useState(
    authUser?.user?.id ? product.upvotesData.includes(authUser.user.id) : false
  );
  const [totalUpvotes, setTotalUpvotes] = useState(product.upvotesCount || 0);

  const handleProductItemClick = () => {
    if (!authUser) {
      setShowLoginModal(true);
    } else {
      setCurrentProduct(product as ExtendedProduct);
      setShowProductModal(true);
    }
  };

  const handleArrowClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // Prevent the click event from propagating to the product item container
    e.stopPropagation();
    // Open the link in a new tab
    window.open(`${product.website}`, "_blank");
  };

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  const handleUpvoteClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();

    try {
      await upvoteProduct(product.id);
      setHasUpvoted(!hasUpvoted);
      setTotalUpvotes(hasUpvoted ? totalUpvotes - 1 : totalUpvotes + 1);
    } catch (error) {
      console.log("Error upvoting product", error);
    }
  };

  const releaseDate = product.releaseDate && new Date(product.releaseDate);
  const currentDate = new Date();

  let displayReleaseDate;

  if (releaseDate > currentDate) {
    displayReleaseDate = releaseDate.toLocaleString();
  } else {
    displayReleaseDate = "Available Now";
  }

  const variants = {
    initital: { scale: 1 },
    upvoted: { scale: [1, 1.2, 1], transition: { duration: 0.3 } },
  };

  return (
    <div
      onClick={handleProductItemClick}
      className="py-4 w-full p-2 rounded-md hover:bg-gradient-to-bl from-[#ffe6d3] via-[#fdfdfd] to-white cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={product.logo}
            alt="logo"
            width={1000}
            height={1000}
            className="h-12 w-12 rounded-md"
          />

          <div className="ml-4">
            <div className="md:flex items-center gap-x-2">
              <h1 className="text-sm font-semibold">{product.name}</h1>
              <p className="hidden md:flex text-xs">-</p>
              <p className="text-gray-500 text-xs md:text-sm pr-2">
                {product.headline}
              </p>
              <div
                onClick={handleArrowClick}
                className="hidden md:flex cursor-pointer"
              >
                <PiArrowBendDoubleUpRight />
              </div>
            </div>
            <div className="hidden md:flex gap-x-2 items-center">
              <div className="text-xs text-gray-500 flex gap-x-1 items-center">
                {product?.commentsLength}
                <PiChatCircle />
              </div>

              {product.categories.map(
                (category: { id: string; name: string }) => (
                  <div key={category.id} className="text-xs text-gray-500">
                    <div className="flex gap-x-1 items-center">
                      <div className="mr-1">•</div>
                      <Link
                        href={`/category/${category.name.toLowerCase()}`}
                        className="hover:underline"
                        onClick={handleCategoryClick}
                      >
                        {category.name}
                      </Link>
                    </div>
                  </div>
                )
              )}

              <div className="text-xs text-gray-500">
                <div className="flex gap-x-1 items-center">
                  <div className="mr-1">•</div>
                  {displayReleaseDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm">
          <motion.div
            onClick={handleUpvoteClick}
            variants={variants}
            animate={hasUpvoted ? "upvoted" : "initital"}
          >
            {hasUpvoted ? (
              <div className="border px-2 rounded-md flex flex-col  items-center bg-gradient-to-bl  from-[#ff6154] to-[#ff4582] border-[#ff6154] text-white">
                <PiCaretUpFill className="text-xl" />
                {totalUpvotes}
              </div>
            ) : (
              <div className="border px-2 rounded-md flex flex-col items-center">
                <PiCaretUpFill className="text-xl" />
                {totalUpvotes}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <ProductModal visible={showProductModal} setVisible={setShowProductModal}>
        <ProductModalContent
          currentProduct={currentProduct}
          authUser={authUser}
          totalUpvotes={totalUpvotes}
          setTotalUpvotes={setTotalUpvotes}
          hasUpvoted={hasUpvoted}
          setHasUpvoted={setHasUpvoted}
        />
      </ProductModal>

      <Modal visible={showLoginModal} setVisible={setShowLoginModal}>
        <AuthContent />
      </Modal>
    </div>
  );
};

export default ProductItem;
