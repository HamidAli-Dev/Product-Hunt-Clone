"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

import { Product } from "@prisma/client";
import MembershipModal from "../ui/modals/upgrade-membership-modal";
import UpgradeMembership from "../upgrade-membership";
import { isUserPremium } from "@/lib/server-actions";

interface SubmitProps {
  authUser: Session | null;
  products: Product[] | null;
}
const Submit = ({ authUser, products }: SubmitProps) => {
  const router = useRouter();

  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);

  if (!products) {
    return null;
  }

  const handleClick = async () => {
    const isPremium = await isUserPremium();
    if (!isPremium && products.length === 2) {
      setIsUpgradeModalVisible(true);
    } else {
      router.push("/new-product");
    }
  };

  return (
    <div>
      <button onClick={handleClick} className="text-[#ff6154]">
        Submit
      </button>
      <MembershipModal
        visible={isUpgradeModalVisible}
        setVisible={setIsUpgradeModalVisible}
      >
        <UpgradeMembership authUser={authUser} />
      </MembershipModal>
    </div>
  );
};

export default Submit;
