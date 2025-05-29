import React, { Suspense } from "react";

import Navbar from "@/components/navbar/navbar";
import Spinner from "@/components/spinner";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Navbar />
        {children}
      </Suspense>
    </div>
  );
};

export default HomeLayout;
