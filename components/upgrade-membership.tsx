import { createCheckoutSession } from "@/lib/stripe";
import { Session } from "next-auth";
import Image from "next/image";
import React from "react";
import { PiX } from "react-icons/pi";
import { toast } from "sonner";

interface UpgradeMembershipProps {
  authUser: Session | null;
}

const UpgradeMembership = ({ authUser }: UpgradeMembershipProps) => {
  const handleCallCheckoutSession = async () => {
    try {
      const result = await createCheckoutSession({
        email: authUser?.user?.email || "",
      });

      if (result && result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("Could not create checkout session");
      }
    } catch (error) {
      toast(
        <>
          <div className="flex items-center gap-4 mx-auto">
            <PiX className="text-red-500 text-3xl" />
            <p className="text-md font-semibold">
              Could not create checkout session. Please try again later.
            </p>
          </div>
        </>,
        {
          position: "top-center",
        }
      );
      console.log("er", error);
    }
  };
  return (
    <div className="space-y-6">
      <Image
        src={"/images/start-up-14.png"}
        width={150}
        height={150}
        alt="Upgrade Membership"
        className="mx-auto"
      />

      <h1 className="text-2xl font-semibold text-center">
        Go Pro and unlock more features
      </h1>
      <p className="text-gray-600 text-center">
        Looking to create more projects ? Upgrade your membership to unlock
        unlimited projects
      </p>

      <div className="pt-4">
        <button
          onClick={handleCallCheckoutSession}
          className="bg-indigo-500 text-white p-2 rounded-md w-full cursor-pointer"
        >
          Upgrade Membership
        </button>
      </div>
    </div>
  );
};

export default UpgradeMembership;
