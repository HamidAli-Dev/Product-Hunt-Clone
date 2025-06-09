import { auth } from "@/auth";
import ProductForm from "./_components/product-form";
import { getProductsByUserId, isUserPremium } from "@/lib/server-actions";
import { redirect } from "next/navigation";

const NewProduct = async () => {
  const authUser = await auth();
  const products = (await getProductsByUserId(authUser?.user?.id || "")) || [];
  const isPremium = await isUserPremium();

  if (!isPremium && products.length === 2) {
    redirect("/");
  }

  return (
    <>
      <ProductForm />
    </>
  );
};

export default NewProduct;
