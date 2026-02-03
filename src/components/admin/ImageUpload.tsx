import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

interface UploadingFile {
  file: File;
  progress: number;
  preview: string;
}

const ImageUpload = ({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    const filesToUpload = fileArray.slice(0, remainingSlots);

    if (filesToUpload.length === 0) return;

    // Create previews and add to uploading state
    const newUploadingFiles: UploadingFile[] = filesToUpload.map((file) => ({
      file,
      progress: 0,
      preview: URL.createObjectURL(file),
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    // Upload files
    const uploadPromises = filesToUpload.map(async (file, index) => {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadingFiles((prev) =>
          prev.map((uf) =>
            uf.file === file && uf.progress < 90
              ? { ...uf, progress: uf.progress + 10 }
              : uf
          )
        );
      }, 100);

      const url = await uploadImage(file);

      clearInterval(progressInterval);

      // Mark as complete
      setUploadingFiles((prev) =>
        prev.map((uf) =>
          uf.file === file ? { ...uf, progress: 100 } : uf
        )
      );

      // Clean up preview after small delay
      setTimeout(() => {
        URL.revokeObjectURL(newUploadingFiles[index].preview);
        setUploadingFiles((prev) => prev.filter((uf) => uf.file !== file));
      }, 500);

      return url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const successfulUrls = uploadedUrls.filter((url): url is string => url !== null);

    if (successfulUrls.length > 0) {
      onImagesChange([...images, ...successfulUrls]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = async (imageUrl: string) => {
    // Extract filename from URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    // Try to delete from storage (may fail if not admin, but we still remove from list)
    await supabase.storage.from("product-images").remove([fileName]);

    onImagesChange(images.filter((img) => img !== imageUrl));
  };

  const canAddMore = images.length + uploadingFiles.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((imageUrl, index) => (
            <div key={imageUrl} className="relative group aspect-square">
              <img
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(imageUrl)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {uploadingFiles.map((uf, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={uf.preview}
                alt="Uploading"
                className="w-full h-full object-cover rounded-lg border opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/80 rounded-lg p-2 w-3/4">
                  <Progress value={uf.progress} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-2">
            {isDragging ? (
              <Upload className="h-8 w-8 text-primary" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
            <div className="text-sm">
              <span className="font-medium text-primary">Click to upload</span>{" "}
              <span className="text-muted-foreground">or drag and drop</span>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to 10MB ({images.length}/{maxImages} images)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
