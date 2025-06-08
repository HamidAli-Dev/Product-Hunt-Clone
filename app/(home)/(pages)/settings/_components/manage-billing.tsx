"use client";
import React from "react";
import { PiX } from "react-icons/pi";
import { toast } from "sonner";

import { createCustomerLink } from "@/lib/stripe";

const ManageBilling = () => {
  const handleManageBilling = async () => {
    try {
      const result = await createCustomerLink();

      if (result) {
        window.location.href = result;
      } else {
        throw new Error("Could not create customer link");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast(
        <>
          <div className="flex items-center gap-4 mx-auto">
            <PiX className="text-red-500 text-3xl" />
            <p>Could not create checkout session. Please try again</p>
          </div>
        </>,
        {
          position: "top-center",
        }
      );
    }
  };
  return (
    <button
      onClick={handleManageBilling}
      className="mt-10 text-blue-500
    cursor-pointer hover:underline"
    >
      Manage Billing
    </button>
  );
};

export default ManageBilling;
