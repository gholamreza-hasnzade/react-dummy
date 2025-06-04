import React from 'react';

interface ProductRatingImageProps {
  rating: number;
  thumbnail: string;
  className?: string;
}

export const ProductRatingImage: React.FC<ProductRatingImageProps> = ({ rating, thumbnail, className = '' }) => {
  const getImageStyle = () => {
    if (rating < 3) {
      return 'border-2 border-red-500 filter grayscale';
    }
    if (rating >= 3 && rating < 4) {
      return 'border-2 border-yellow-500';
    }
    return 'border-2 border-green-500 filter brightness-110';
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`w-16 h-16 rounded-lg overflow-hidden ${getImageStyle()}`}>
        <img
          src={thumbnail}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>
      {rating < 3 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
          ⚠️
        </div>
      )}
      {rating >= 3 && rating < 4 && (
        <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1 rounded-full">
          ⭐
        </div>
      )}
      {rating >= 4 && (
        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full">
          ✨
        </div>
      )}
    </div>
  );
}; 