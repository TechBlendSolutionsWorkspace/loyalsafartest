import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({ 
  onUploadComplete, 
  currentImage, 
  accept = "image/*", 
  maxSize = 5,
  className = "" 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.match(accept.replace("*", ".*"))) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Get upload URL
      const uploadResponse = await apiRequest("POST", "/api/objects/upload");
      const { uploadURL } = await uploadResponse.json();

      // Upload file
      const uploadFileResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadFileResponse.ok) {
        throw new Error("Upload failed");
      }

      // Extract the object path from the upload URL
      const objectPath = `/objects/uploads/${uploadURL.split('/uploads/')[1].split('?')[0]}`;
      
      onUploadComplete(objectPath);
      
      toast({
        title: "Upload successful",
        description: "Image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [accept, maxSize, onUploadComplete, toast]);

  const clearImage = () => {
    onUploadComplete("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentImage ? (
        <div className="relative inline-block">
          <img 
            src={currentImage} 
            alt="Product preview" 
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
            onClick={clearImage}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              {isUploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              ) : (
                <ImageIcon className="w-12 h-12" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isUploading ? "Uploading..." : "Drag and drop an image, or browse"}
              </p>
              <p className="text-sm text-gray-500">
                Supports: {accept} (max {maxSize}MB)
              </p>
            </div>
            {!isUploading && (
              <Button type="button" variant="outline" className="mt-2">
                <Upload className="w-4 h-4 mr-2" />
                Browse files
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}