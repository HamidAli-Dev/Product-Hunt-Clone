import React from "react";
import Link from "next/link";
import { Session } from "next-auth";

interface SubmitProps {
  authUser: Session | null;
}
const Submit = ({ authUser }: SubmitProps) => {
  return (
    <div>
      <Link href="/new-product" className="text-[#ff6154]">
        Submit
      </Link>
    </div>
  );
};

export default Submit;
