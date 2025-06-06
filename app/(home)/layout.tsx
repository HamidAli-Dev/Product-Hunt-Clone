import React, { Suspense } from "react";

import Navbar from "@/components/navbar/navbar";
import Spinner from "@/components/spinner";
import { auth } from "@/auth";
import { getNotifications, getProductsByUserId } from "@/lib/server-actions";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const authUser = await auth();
  const notifications = (await getNotifications()) || [];
  const products = (await getProductsByUserId(authUser?.user?.id || "")) || [];
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Navbar
          authUser={authUser}
          notifications={notifications}
          products={products}
        />
        {children}
      </Suspense>
    </div>
  );
};

export default HomeLayout;
