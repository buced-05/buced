import { useState, useRef, useEffect } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

export type ImageUploadProps = {
  value?: string;
  onChange: (file: File | null) => void;
  label?: string;
  aspectRatio?: "square" | "cover" | "profile";
  className?: string;
  disabled?: boolean;
};

const aspectRatioClasses = {
  square: "aspect-square max-w-md",
  cover: "aspect-[16/6] max-w-2xl",
  profile: "aspect-square max-w-xs",
};

export const ImageUpload = ({
  value,
  onChange,
  label,
  aspectRatio = "square",
  className,
  disabled = false,
}: ImageUploadProps) => {
  const { theme } = useThemeStore();
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchroniser la preview avec la prop value
  useEffect(() => {
    if (value) {
      setPreview(value);
    } else if (!value && !fileInputRef.current?.files?.length) {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide");
      return;
    }

    // Limite de taille : 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className={`text-sm font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}>
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
          aspectRatioClasses[aspectRatio],
          isDragging
            ? theme === "dark"
              ? "border-neon-cyan bg-neon-cyan/10"
              : "border-blue-500 bg-blue-50"
            : theme === "dark"
            ? "border-neon-cyan/30 bg-[#1A1A2E] hover:border-neon-cyan/50"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-gray-100",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={disabled}
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-[#0A0A0F]/80 text-white hover:bg-[#0A0A0F]"
                    : "bg-white/90 text-gray-900 hover:bg-white"
                }`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center min-h-[120px]">
            <div className={`p-2 rounded-full mb-2 ${
              theme === "dark" 
                ? "bg-neon-cyan/20" 
                : "bg-blue-100"
            }`}>
              <PhotoIcon
                className={`h-6 w-6 ${
                  theme === "dark" ? "text-neon-cyan" : "text-blue-600"
                }`}
              />
            </div>
            <p className={`text-sm font-bold mb-1 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              {label || "Ajouter une image"}
            </p>
            <p className={`text-xs font-medium mb-1 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Cliquez ou glissez-déposez
            </p>
            <p className={`text-xs mb-2 ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}>
              PNG, JPG, WEBP (max 5MB)
            </p>
            <button
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                theme === "dark"
                  ? "bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Parcourir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

