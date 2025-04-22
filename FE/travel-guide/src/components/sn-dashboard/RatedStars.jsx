import { Star, StarHalf } from "lucide-react";

export default function RatedStars({ rating, max = 5 }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center space-x-1 text-yellow-400">
      {Array(fullStars)
        .fill(null)
        .map((_, i) => (
          <Star
            key={`full-${i}`}
            fill="currentColor"
            stroke="none"
            className="w-5 h-5"
          />
        ))}
      {hasHalf && <StarHalf className="w-5 h-5" />}
      {Array(emptyStars)
        .fill(null)
        .map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
        ))}
    </div>
  );
}
