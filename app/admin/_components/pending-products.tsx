"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Session } from "next-auth";
import { PiCheckCircle, PiXCircle } from "react-icons/pi";

import { Category, Image as ImageType, Product } from "@prisma/client";
import ProductModalContent from "@/app/admin/_components/product-modal-content";
import ActivateProductModal from "@/app/admin/_components/modals/activate-product-modal";
import ProductModal from "@/app/admin/_components/modals/product-modal";
import ActivateProductModalContent from "@/app/admin/_components/activate-product-modal-content";
import RejectProductModal from "@/app/admin/_components/modals/reject-product-modal";
import RejectProductModalContent from "@/app/admin/_components/reject-product-modal-content";

export interface PendingProduct extends Product {
  categories: Category[];
  images: ImageType[];
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

interface PendingProductsProps {
  authUser: Session | null;
  pendingProducts: PendingProduct[];
}

const PendingProducts = ({
  authUser,
  pendingProducts,
}: PendingProductsProps) => {
  const [currentProduct, setCurrentProduct] = useState<
    PendingProduct | undefined | null
  >(null);

  const [viewProductModalVisible, setViewProductModalVisible] = useState(false);
  const [activateProductModalVisible, setActivateProductModalVisible] =
    useState(false);
  const [rejectProductModalVisible, setRejectProductModalVisible] =
    useState(false);

  const formattedProducts = pendingProducts.map((product) => {
    return {
      ...product,
      categories: product.categories,
      images: product.images,
      commentData: product.commentData || []
    };
  });

  const handleViewProductModal = (product: PendingProduct) => {
    const formattedProduct = formattedProducts.find(
      (formattedProduct) => formattedProduct.id === product.id
    );
    if (formattedProduct) {
      setCurrentProduct(formattedProduct);
      setViewProductModalVisible(true);
    }
  };

  const handleActivateProductModal = (product: PendingProduct) => {
    setCurrentProduct(product);
    setActivateProductModalVisible(true);
  };

  const handleRejectProductModal = (product: PendingProduct) => {
    setCurrentProduct(product);
    setRejectProductModalVisible(true);
  };

  return (
    <div>
      <div className="flex flex-col w-full my-6">
        {formattedProducts.map((product: PendingProduct) => (
          <div
            key={product.id}
            className="flex border rounded-md p-4 justify-between items-center"
          >
            <div className="flex gap-x-6 items-center">
              <Image
                src={product.logo}
                alt="logo"
                width={200}
                height={200}
                className="w-10 md:w-20 rounded-md cursor-pointer"
              />

              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{product.name} </h1>
                <p className="hidden md:flex text-gray-500 text-sm pr-6">
                  {product.description}
                </p>
                <div className="hidden md:flex text-gray-500 font-semibold">
                  Release Date : {product.releaseDate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-x-4 justify-center">
              <button
                onClick={() => handleViewProductModal(product)}
                className="bg-[#ff6154] text-white px-4 py-2 text-center text-sm rounded-md cursor-pointer"
              >
                View Product
              </button>

              <button
                onClick={() => handleActivateProductModal(product)}
                className="bg-emerald-100 text-white px-4 py-2 text-center text-sm rounded-md cursor-pointer"
              >
                <PiCheckCircle className="text-xl text-emerald-500" />
              </button>

              <button
                onClick={() => handleRejectProductModal(product)}
                className="bg-red-100 text-white px-4 py-2 text-center text-sm rounded-md cursor-pointer"
              >
                <PiXCircle className="text-xl text-red-500" />
              </button>
            </div>
          </div>
        ))}

        <ProductModal
          visible={viewProductModalVisible}
          setVisible={setViewProductModalVisible}
        >
          <ProductModalContent
            authUser={authUser}
            currentProduct={currentProduct}
            hasUpvoted={false}
            setHasUpvoted={() => {}}
            totalUpvotes={0}
            setTotalUpvotes={() => {}}
          />
        </ProductModal>

        <ActivateProductModal
          visible={activateProductModalVisible}
          setVisible={setActivateProductModalVisible}
        >
          <ActivateProductModalContent
            currentProduct={currentProduct}
            closeModal={() => setActivateProductModalVisible(false)}
          />
        </ActivateProductModal>

        <RejectProductModal
          visible={rejectProductModalVisible}
          setVisible={setRejectProductModalVisible}
        >
          <RejectProductModalContent
            currentProduct={currentProduct}
            closeModal={() => setRejectProductModalVisible(false)}
          />
        </RejectProductModal>
      </div>
    </div>
  );
};

export default PendingProducts;
