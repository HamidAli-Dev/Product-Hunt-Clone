import React from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  getNotifications,
  getProductsByUserId,
  isUserPremium,
} from "@/lib/server-actions";
import Navbar from "@/components/navbar/navbar";

const NewProductLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authUser = await auth();

  const notifications = (await getNotifications()) || [];

  const products = (await getProductsByUserId(authUser?.user?.id || "")) || [];

  const isPremium = await isUserPremium();

  if (!isPremium && products.length === 2) {
    redirect("/");
  }

  return (
    <div>
      <Navbar
        authUser={authUser}
        products={products}
        notifications={notifications}
      />
      {children}
    </div>
  );
};

export default NewProductLayout;
