"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onVerify: (packagingImage: File, pillImage: File) => void;
}

const ImageUploadArea = ({
  id,
  title,
  imageFile,
  setImageFile,
}: {
  id: string;
  title: string;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}
        ${imageFile ? "p-0 border-solid" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {imageFile ? (
        <>
          <Image
            src={URL.createObjectURL(imageFile)}
            alt={`${title} preview`}
            width={400}
            height={300}
            className="object-cover w-full h-48 rounded-lg"
          />
           <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={(e) => {e.stopPropagation(); handleRemoveImage();}}>
            <X className="h-4 w-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        </>
      ) : (
        <div className="text-center">
          <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to upload
          </p>
        </div>
      )}
    </div>
  );
};

export function ImageUploader({ onVerify }: ImageUploaderProps) {
  const [packagingImage, setPackagingImage] = useState<File | null>(null);
  const [pillImage, setPillImage] = useState<File | null>(null);
  const { toast } = useToast();

  const handleVerifyClick = () => {
    if (!packagingImage || !pillImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both packaging and pill images to proceed.",
        variant: "destructive",
      });
      return;
    }
    onVerify(packagingImage, pillImage);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Start a New Verification</CardTitle>
        <CardDescription>
          Upload images of the medicine's packaging and the pill itself for a comprehensive authenticity check.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <ImageUploadArea id="packaging-upload" title="Medicine Packaging" imageFile={packagingImage} setImageFile={setPackagingImage} />
        <ImageUploadArea id="pill-upload" title="Pill Image" imageFile={pillImage} setImageFile={setPillImage} />
      </CardContent>
      <CardFooter>
        <Button 
          size="lg" 
          className="w-full"
          onClick={handleVerifyClick}
          disabled={!packagingImage || !pillImage}
        >
          Verify Medicine
        </Button>
      </CardFooter>
    </Card>
  );
}
