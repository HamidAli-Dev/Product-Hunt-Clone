import React, { Suspense } from "react";

import Navbar from "@/components/navbar/navbar";
import Spinner from "@/components/spinner";
import { auth } from "@/auth";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const authUser = await auth();
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Navbar authUser={authUser} />
        {children}
      </Suspense>
    </div>
  );
};

export default HomeLayout;
