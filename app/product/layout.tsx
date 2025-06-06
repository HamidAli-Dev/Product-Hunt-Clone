import React from "react";

import { auth } from "@/auth";
import Navbar from "@/components/navbar/navbar";
import { getNotifications, getProductsByUserId } from "@/lib/server-actions";

const ProductPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authUser = await auth();
  const notifications = await getNotifications() || [];
  const products = await getProductsByUserId(authUser?.user?.id || "") || [];

  return (
    <div>
      <Navbar authUser={authUser} notifications={notifications} products={products} />
      {children}
    </div>
  );
};

export default ProductPageLayout;
