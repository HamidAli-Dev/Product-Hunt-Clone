"use client";
import React, { useState } from "react";

import { Category, Image, Product } from "@prisma/client";
import { PiPencil } from "react-icons/pi";
import EditProductForm from "./edit-product-form";
import EditProductModal from "@/components/ui/modals/edit-product-modal";

interface ProductWithAlias extends Product {
  categories: Category[];
  images: Image[];
}

interface EditProductProps {
  product: ProductWithAlias;
}

const EditProduct = ({ product }: EditProductProps) => {
  const [editProductModalVisible, setEditProductModalVisible] = useState(false);

  const handleEditProductClick = () => {
    setEditProductModalVisible(true);
  };

  return (
    <>
      <button
        onClick={handleEditProductClick}
        className="bg-emerald-100 p-4 rounded-md 
    flex items-center justify-center cursor-pointer"
      >
        <PiPencil className="text-xl text-emerald-500" />
      </button>

      <EditProductModal
        visible={editProductModalVisible}
        setVisible={setEditProductModalVisible}
      >
        <EditProductForm product={product} />
      </EditProductModal>
    </>
  );
};

export default EditProduct;
