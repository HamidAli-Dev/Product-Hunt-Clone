"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PiMagnifyingGlass } from "react-icons/pi";

import { Product } from "@prisma/client";
import { searchProducts } from "@/lib/server-actions";

const Search = () => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    if (searchTerm.trim() !== "") {
      const products = (await searchProducts(searchTerm)) || [];

      //filter out the only active products
      const activeProducts = products.filter(
        (product) => product.status === "ACTIVE"
      );

      setSearchResults(activeProducts);
      setIsDropdownVisible(true);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  const handleItemClick = (slug: string, productName: string) => {
    setQuery(productName);
    setIsDropdownVisible(false);
    router.push(`/product/${slug}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="rounded-full flex items-center text-gray-500 ml-4 bg-[#f5f8ff] relative">
      <PiMagnifyingGlass className="ml-2" />

      <input
        type="text"
        placeholder="Search..."
        className="p-2 rounded-full text-xs focus:outline-none bg-[#f5f8ff]"
        value={query}
        onChange={handleSearch}
        ref={searchInputRef}
      />

      {isDropdownVisible && searchResults.length > 0 && (
        <ul className="absolute top-full bg-white rounded-md border mt-2 w-full">
          {searchResults.map((product) => (
            <li
              key={product.id}
              className="p-2 hover:bg-gray-100 
            cursor-pointer text-sm 
            flex items-center gap-x-2"
              onClick={() => handleItemClick(product.slug, product.name)}
            >
              <Image
                src={product.logo}
                alt="logo"
                width={50}
                height={50}
                className="rounded-md h-8 w-8"
              />
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
