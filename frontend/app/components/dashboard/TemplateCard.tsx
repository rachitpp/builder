import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/lib/store';
import { getTemplateById } from '@/app/features/templates/templateSlice';
import type { Template } from '@/app/features/templates/templateSlice';

interface TemplateCardProps {
  template: Template;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleUseTemplate = async () => {
    try {
      // Fetch full template details if needed
      await dispatch(getTemplateById(template._id)).unwrap();
      
      // Navigate to resume creation page with the template ID
      router.push(`/dashboard/resumes/new?template=${template._id}`);
    } catch (error) {
      console.error('Failed to get template details:', error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md template-preview">
      {/* Template Preview Image */}
      <div className="relative h-44 bg-gray-100">
        {template.previewImage ? (
          <img 
            src={template.previewImage} 
            alt={template.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
        )}
        
        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
            PREMIUM
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full">
          {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
        </div>
      </div>
      
      {/* Template Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800">{template.name}</h3>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {template.description}
        </p>
        
        {/* Actions */}
        <div className="mt-auto">
          <button 
            onClick={handleUseTemplate}
            className={`w-full py-2 px-4 rounded-md text-center text-sm font-medium ${
              template.isPremium 
                ? 'bg-yellow-400 text-yellow-800 hover:bg-yellow-500' 
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {template.isPremium ? 'Use Premium Template' : 'Use Template'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;