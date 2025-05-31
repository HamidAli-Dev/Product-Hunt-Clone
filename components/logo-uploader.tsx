"use client";
import React from "react";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface LogoUploaderProps {
  endpoint: keyof typeof ourFileRouter;
  onChange: (url: string) => void;
}

const LogoUploader = ({ endpoint, onChange }: LogoUploaderProps) => {
  return (
    <UploadDropzone
      className="w-32 h-32"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res?.[0]?.url) {
          onChange(res[0].url);
          toast.success("Logo uploaded successfully!");
        }
      }}
      onUploadError={(err) => {
        console.error("Upload error:", err);
        toast.error(err.message || "Failed to upload file");
      }}
      config={{
        mode: "auto",
      }}
    />
  );
};

export default LogoUploader;
