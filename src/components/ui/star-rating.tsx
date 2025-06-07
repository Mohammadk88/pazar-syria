import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showText = false,
  className
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
        // Full star
        stars.push(
          <Star
            key={i}
            className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")}
          />
        )
      } else if (i - 0.5 <= rating) {
        // Half star
        stars.push(
          <StarHalf
            key={i}
            className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")}
          />
        )
      } else {
        // Empty star
        stars.push(
          <Star
            key={i}
            className={cn(sizeClasses[size], "text-gray-300")}
          />
        )
      }
    }
    return stars
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">{renderStars()}</div>
      {showText && (
        <span className={cn("text-gray-600", textSizeClasses[size])}>
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  )
}
