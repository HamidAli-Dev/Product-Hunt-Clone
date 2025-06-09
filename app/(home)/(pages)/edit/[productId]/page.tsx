import Image from "next/image";
import Link from "next/link";
import React from "react";
import { PiArrowLeft } from "react-icons/pi";

import EditProduct from "./_components/edit-product";
import DeleteProduct from "./_components/delete-product";
import { getProductById, getRankById } from "@/lib/server-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SingleProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const resolvedParams = await params;
  const { productId } = resolvedParams;

  const product = await getProductById(productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  const productRank = await getRankById();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link href="/my-products" className="flex gap-x-4">
        <PiArrowLeft className="text-2xl text-gray-500" />
        <p> Go Back</p>
      </Link>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-x-4">
          <Image
            src={product.logo}
            alt="logo"
            width={500}
            height={500}
            className="h-20 w-20 md:h-40 md:w-40 border rounded-lg"
          />

          <div className="space-y-1">
            <h1 className="text-3xl font-medium">{product.name}</h1>
            <p className="text-gray-500 text-sm w-3/4">{product.website}</p>

            {product.status === "PENDING" && (
              <Badge className="bg-orange-400">Pending</Badge>
            )}
            {product.status === "ACTIVE" && (
              <Badge className="bg-green-400">ACTIVE</Badge>
            )}
            {product.status === "REJECTED" && (
              <Badge className="bg-red-400">REJECTED</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <EditProduct product={product} />
          <DeleteProduct productId={product.id} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader
            className="flex flex-row items-center 
          justify-between space-y-0 pb-2"
          >
            <CardTitle>Current Rank</CardTitle> 🏅
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {productRank
                ? productRank.findIndex((p) => p.id === product.id) + 1
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            className="flex flex-row items-center 
          justify-between space-y-0 pb-2"
          >
            <CardTitle>Comments </CardTitle> 💬
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{product.comments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            className="flex flex-row items-center 
          justify-between space-y-0 pb-2"
          >
            <CardTitle>Upvotes </CardTitle> 🔺
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{product.upvotes.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="py-6">
        <Separator />
      </div>

      <h2 className="font-semibold text-xl pb-6">Community Feedback </h2>

      {product.comments.length > 0 ? (
        <div className="mt-4 space-y-4">
          {product.comments.map((comment) => (
            <div key={comment.id} className="border p-4 rounded-lg">
              <div className="flex gap-x-4 items-center">
                <Image
                  src={comment.user.image}
                  alt="profile"
                  width={50}
                  height={50}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h2 className="font-semibold">{comment.user.name}</h2>
                  <p className="text-gray-500">{comment.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-4">
          <h2 className="text-xl font-semibold">No comments yet</h2>
          <p className="text-gray-500 pt-4">
            Be the first to comment on this product
          </p>
        </div>
      )}
    </div>
  );
};

export default SingleProductPage;
