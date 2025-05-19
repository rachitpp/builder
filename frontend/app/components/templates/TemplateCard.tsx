import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  isPremium: boolean;
  onPreview: (id: string) => void;
  onUse: (id: string) => void;
}

export function TemplateCard({
  id,
  name,
  description,
  imageUrl,
  category,
  isPremium,
  onPreview,
  onUse,
}: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-4 right-4 z-10">
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-amber-400 to-amber-600"
          >
            Premium
          </Badge>
        </div>
      )}

      {/* Template Preview Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <Badge variant="secondary" className="mb-2">
            {category}
          </Badge>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onPreview(id)}
          >
            Preview
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onUse(id)}
          >
            Use Template
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
