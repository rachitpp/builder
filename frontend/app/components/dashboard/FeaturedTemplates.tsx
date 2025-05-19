"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Template } from "@/app/features/templates/templateSlice";

interface FeaturedTemplatesProps {
  templates: Template[];
  loading?: boolean;
}

const FeaturedTemplates: React.FC<FeaturedTemplatesProps> = ({
  templates,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <motion.div
          key={template._id}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
          className="group"
        >
          <Link href={`/templates/${template._id}`}>
            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
              <div className="relative aspect-[1/1.4142] bg-gray-100">
                <Image
                  src={
                    template.previewImage || "/images/template-placeholder.svg"
                  }
                  alt={template.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {template.isPremium && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="default"
                      className="bg-gradient-to-r from-amber-500 to-amber-600"
                    >
                      Premium
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg truncate">
                    {template.name}
                  </h3>
                  <Badge variant="outline" className="capitalize">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedTemplates;
