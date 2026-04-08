import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 'md', interactive = false, onRate }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'}`}
        >
          <Star
            className={`${sizes[size]} transition-colors ${
              star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
