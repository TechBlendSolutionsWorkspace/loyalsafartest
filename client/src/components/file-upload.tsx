import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  accept?: string;
  maxSize?: number; // MB
  className?: string;
}

export function FileUpload({
  onUploadComplete,
  currentImage,
  accept = "image/*",
  maxSize = 5,
  className
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please select a file smaller than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Get presigned URL from backend
      const uploadResponse = await fetch("/api/objects/upload", {
        method: "POST",
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadURL } = await uploadResponse.json();

      // Upload file directly to object storage
      const uploadResult = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error("Failed to upload file");
      }

      // Extract object path from upload URL
      const objectPath = `/objects/uploads/${uploadURL.split("/uploads/")[1].split("?")[0]}`;
      
      onUploadComplete(objectPath);
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const clearImage = () => {
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {currentImage && (
        <div className="relative inline-block">
          <img
            src={currentImage}
            alt="Current"
            className="max-w-xs max-h-32 rounded-lg border object-cover"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          <FileImage className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm">
            <span className="text-muted-foreground">
              Drag and drop an image, or{" "}
            </span>
            <Button
              variant="link"
              className="p-0 h-auto font-medium"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              browse files
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports: {accept} (max {maxSize}MB)
          </p>
        </div>
        
        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}