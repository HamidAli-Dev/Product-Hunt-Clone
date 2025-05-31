"use client";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import { toast } from "sonner";
// import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";

interface ImagesUploaderProps {
  onChange: (urls: string[]) => void;
  endpoint: keyof typeof ourFileRouter;
}

const ImagesUploader = ({ onChange, endpoint }: ImagesUploaderProps) => {
  return (
    <UploadDropzone
      className="w-36 h-32"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res && res.length > 0) {
          const urls = res.map((item: { url: string }) => item.url);
          onChange(urls);
          toast.success("Files uploaded successfully!");
        } else {
          toast.error("Upload completed but no URLs received");
        }
      }}
      onUploadError={(err: Error) => {
        console.error("Upload error:", err);
        toast.error(err.message || "Failed to upload files");
      }}
      config={{
        mode: "auto",
      }}
    />
  );
};

export default ImagesUploader;
