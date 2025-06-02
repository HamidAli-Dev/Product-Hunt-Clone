"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PiCheckCircle, PiFlag, PiPencilLine, PiXCircle } from "react-icons/pi";

import { Product, Category, Image as ImageType } from "@prisma/client";
import LogoUploader from "@/components/logo-uploader";
import ImagesUploader from "@/components/images-uploader";
import { updateProduct } from "@/lib/server-actions";

interface ProductWithAlias extends Product {
  categories: Category[];
  images: ImageType[];
}

interface EditProductFormProps {
  product: ProductWithAlias;
}

const EditProductForm = ({ product }: EditProductFormProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState("");
  const [isEditingProductImages, setIsEditingProductImages] = useState(false);
  const [uploadedProductImages, setUploadedProductImages] = useState<string[]>(
    []
  );

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [headline, setHeadline] = useState(product.headline);
  const [description, setDescription] = useState(product.description);
  const [releaseDate, setReleaseDate] = useState(product.releaseDate);
  const [website, setWebsite] = useState(product.website);
  const [twitter, setTwitter] = useState(product.twitter);
  const [discord, setDiscord] = useState(product.discord);
  const categories = product.categories;

  const handleLogoUpload = (url?: string) => {
    if (url) {
      setUploadedLogoUrl(url);
      setIsEditingLogo(false);
    } else {
      setIsEditingLogo(true);
    }
  };

  const handleProductImagesUpload = useCallback((urls: string[]) => {
    setUploadedProductImages(urls);
    setIsEditingProductImages(false);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const productName = e.target.value;
    const truncatedProductName = productName.slice(0, 30);
    setName(truncatedProductName);
  };

  useEffect(() => {
    // Update slug when name changes
    const truncatedName = name.slice(0, 30);
    const slugValue = truncatedName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "-");
    setSlug(slugValue);
  }, [name]); // Trigger effect when name changes

  const onSave = async () => {
    setIsLoading(true);
    const formattedCategories = categories.map((category) => category.name);
    try {
      const result = await updateProduct(product.id, {
        name,
        slug,
        headline,
        description,
        logo: uploadedLogoUrl || product.logo,
        releaseDate,
        website,
        twitter,
        discord,
        categories: formattedCategories,
        images:
          uploadedProductImages.length > 0
            ? uploadedProductImages
            : product.images.map((image) => image.url),
      });

      if (result?.success) {
        toast(
          <>
            <div className="flex items-center gap-4  mx-auto">
              <PiCheckCircle className="text-emerald-500 text-3xl" />
              <div className="text-md font-semibold">
                Product updated successfully.
              </div>
            </div>
          </>,
          { position: "top-center" }
        );
      }

      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast(
        <>
          <div className="flex items-center gap-4  mx-auto">
            <PiXCircle className="text-red-500 text-3xl" />
            <div className="text-md font-semibold">
              There was an error updating the product
              {error}
            </div>
          </div>
        </>,
        { position: "top-center" }
      );

      setIsLoading(false);
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-4 mx-auto">
        <PiPencilLine className="text-3xl text-emerald-500" />
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>
      <div className="w-full rounded-md p-10 bg-emerald-100 mt-10 md:flex items-center gap-x-4">
        <PiFlag className="text-5xl text-emerald-500 mb-4 md:mb-0" />
        <div className="text-gray-600">
          This is the product form. You can update the product details here. If
          your product is currently live, and you make changes to the product
          details. It will delist the product from the marketplace until it is
          reviewed and approved by the admin.
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        <div>
          <h1 className="font-medium">Logo</h1>
          {isEditingLogo ? (
            <div>
              <LogoUploader
                endpoint="productImages"
                onChange={handleLogoUpload}
              />
              <button
                onClick={() => setIsEditingLogo(false)}
                className="mt-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <Image
                src={uploadedLogoUrl || product.logo}
                alt="logo"
                width={200}
                height={200}
                className="w-28 md:w-60 border rounded-md cursor-pointer"
              />

              <button
                onClick={() => setIsEditingLogo(true)}
                className="text-sm text-blue-500 cursor-pointer hover:underline mt-2"
              >
                Change Logo
              </button>
            </div>
          )}
        </div>

        <div>
          <h1 className="font-medium">Product Name</h1>
          <input
            type="text"
            className="w-full p-4 border rounded-xl focus:outline-none mt-6"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <div className="font-medium">Website</div>
          <input
            type="text"
            className="border w-full focus:outline-none mt-6 p-4 rounded-xl"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Release Date</div>
          <input
            type="text"
            className="border w-full focus:outline-none mt-6 p-4 rounded-xl"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Headline</div>
          <textarea
            className="border w-full focus:outline-none mt-6 p-4 rounded-xl"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Short Description</div>
          <textarea
            className="border w-full focus:outline-none mt-6 p-4 rounded-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Twitter</div>
          <input
            type="text"
            className="border w-full focus:outline-none mt-6 p-4 rounded-xl"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Discord</div>
          <input
            type="text"
            className="border w-full focus:outline-none mt-6 p-4 rounded-xl"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <h1 className="font-medium">Categories</h1>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categories.map((category: { name: string; id: string }) => (
              <div key={category.id}>
                <div
                  className="bg-gray-200 p-2
                text-center text-sm rounded-full"
                >
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <h3 className="font-medium mb-2">Product Images</h3>
          {isEditingProductImages ? null : (
            <div className="grid grid-cols-5 gap-4">
              {uploadedProductImages.length > 0 &&
                uploadedProductImages.map((url: string) => (
                  <div key={url}>
                    <Image
                      priority
                      src={url}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="border-gray-200 rounded-md hover:cursor-pointer"
                    />
                  </div>
                ))}

              {/* Display uploaded images if available, else render product images */}
              {uploadedProductImages.length === 0 &&
                product.images &&
                product.images.map((image) => (
                  <div key={image.id}>
                    <Image
                      priority
                      src={image.url}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-40 border-gray-200 rounded-md hover:cursor-pointer"
                    />
                  </div>
                ))}
            </div>
          )}

          {isEditingProductImages ? (
            <div>
              <ImagesUploader
                endpoint="productImages"
                onChange={handleProductImagesUpload}
              />
              <button
                className="mt-2 cursor-pointer"
                onClick={() => setIsEditingProductImages(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingProductImages(true)}
              className="text-sm text-blue-500 my-2 cursor-pointer hover:underline"
            >
              Click to upload images
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end py-10">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="bg-emerald-500 text-white 
        p-4 rounded-md w-40 text-center cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProductForm;
