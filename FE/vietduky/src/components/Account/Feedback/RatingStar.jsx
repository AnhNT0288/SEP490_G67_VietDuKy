import React from 'react';

const RatingStars = ({ rating, setRating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => setRating(star)}
          className={`text-lg ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default RatingStars;