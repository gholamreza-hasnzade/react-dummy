import React from 'react';
import { StarIcon } from '@/constants/svgs/star';

interface ProductRatingIconProps {
  rating: number;
  className?: string;
}

export const ProductRatingIcon: React.FC<ProductRatingIconProps> = ({ rating, className = '' }) => {
  const getStars = () => {
    if (rating < 3) return 2;
    if (rating >= 3 && rating < 4) return 3;
    return 4;
  };

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          className={`w-4 h-4 ${index < getStars() ? 'text-yellow-500' : 'text-gray-300'}`}
          filled={true}
        />
      ))}
    </div>
  );
}; 