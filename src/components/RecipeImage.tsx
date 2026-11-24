"use client";

import { useState } from "react";
import { Utensils } from "lucide-react";

interface RecipeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function RecipeImage({
  src,
  alt,
  className = "",
}: RecipeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EEF3EC] text-[#2D5A3D] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Utensils className="w-8 h-8 mb-2 opacity-70" aria-hidden="true" />
        <span className="font-display text-sm font-semibold text-[#1B261E] line-clamp-2 max-w-[18ch]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
