// This is a placeholder for the rating images
// In a real application, you would want to use actual images
// For now, we'll use emoji-based ratings

export const getRatingImage = (rating: number): string => {
  if (rating < 3) return '⭐'; // Low rating
  if (rating < 4) return '⭐⭐'; // Medium rating
  return '⭐⭐⭐'; // High rating
}; 