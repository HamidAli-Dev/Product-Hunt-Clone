"use client";

const GoToWebsite = ({ website }: { website: string }) => {
  return (
    <div
      className="hidden lg:flex hover:underline cursor-pointer"
      onClick={() => window.open(website, "_blank")}
    >
      Go to website
    </div>
  );
};

export default GoToWebsite;
