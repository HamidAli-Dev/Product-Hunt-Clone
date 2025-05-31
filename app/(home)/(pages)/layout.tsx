import { auth } from "@/auth";
import Spinner from "@/components/spinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const authUser = await auth();

  if (!authUser) {
    redirect("/");
  }
  return (
    <div>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </div>
  );
};

export default ProtectedLayout;
