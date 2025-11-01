'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  isInteractive?: boolean;
  onRate?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 16,
  className,
  isInteractive = false,
  onRate,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleMouseOver = (rate: number) => {
    if (isInteractive) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const handleClick = (rate: number) => {
    if (isInteractive && onRate) {
      setCurrentRating(rate);
      onRate(rate);
    }
  };

  const displayRating = hoverRating > 0 ? hoverRating : currentRating;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            size={size}
            className={cn(
              'transition-colors',
              starValue <= displayRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
              isInteractive ? 'cursor-pointer' : ''
            )}
            onMouseOver={() => handleMouseOver(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
