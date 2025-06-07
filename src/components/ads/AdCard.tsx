import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Calendar, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { Button } from "@/components/ui/button"
import { formatPrice, formatDate } from "@/lib/utils"
import { useLanguage } from "@/hooks/useLanguage"

interface AdCardProps {
  id: string
  title: string
  price: number | null
  currency: string
  location: string | null
  imageUrl?: string
  category: string
  adType: "SALE" | "RENT" | "WANTED"
  createdAt: Date | string
  views: number
  rating?: number
  reviewCount?: number
  isFavorite?: boolean
  isPromoted?: boolean
  viewType?: 'grid' | 'list'
  onFavoriteToggle?: () => void
}

export function AdCard({
  id,
  title,
  price,
  currency,
  location,
  imageUrl,
  category,
  adType,
  createdAt,
  views,
  rating,
  reviewCount,
  isFavorite = false,
  isPromoted = false,
  viewType = 'grid',
  onFavoriteToggle
}: AdCardProps) {
  const { t, getDirection } = useLanguage()
  const isRTL = getDirection() === 'rtl'

  // List view layout
  if (viewType === 'list') {
    return (
      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
        {isPromoted && (
          <Badge className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            {t("promoted")}
          </Badge>
        )}
        
        <div className="flex">
          {/* Image section - smaller for list view */}
          <div className="relative w-48 h-36 flex-shrink-0 overflow-hidden">
            <Image
              src={imageUrl || `/api/placeholder?width=400&height=300&text=${encodeURIComponent(category)}`}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Favorite button */}
            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} p-2 bg-white/80 hover:bg-white`}
              onClick={(e) => {
                e.preventDefault()
                onFavoriteToggle?.()
              }}
            >
              <Heart 
                className={`w-4 h-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`} 
              />
            </Button>

            {/* Ad type badge */}
            <Badge 
              variant={adType === "SALE" ? "default" : "secondary"}
              className={`absolute bottom-2 ${isRTL ? "right-2" : "left-2"}`}
            >
              {t(adType.toLowerCase() as "sale" | "rent")}
            </Badge>
          </div>

          {/* Content section - expanded for list view */}
          <CardContent className="flex-1 p-4">
            <div className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                {/* Category */}
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>

                {/* Title */}
                <Link href={`/ads/${id}`}>
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
                    {title}
                  </h3>
                </Link>

                {/* Price and Rating */}
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-sky-600">
                    {price ? formatPrice(price, currency) : 'السعر عند الاستفسار'}
                  </p>
                  
                  {/* Rating */}
                  {rating && (
                    <div className="flex items-center space-x-1">
                      <StarRating 
                        rating={rating} 
                        size="sm" 
                        className="text-xs"
                      />
                      {reviewCount && reviewCount > 0 && (
                        <span className="text-xs text-gray-500">
                          ({reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Location */}
                {location && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </div>

              {/* Meta information */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 mt-3">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatDate(createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  <span>{views}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  // Grid view layout (existing)
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
      {isPromoted && (
        <Badge className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          {t("promoted")}
        </Badge>
      )}
      
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl || `/api/placeholder?width=400&height=300&text=${encodeURIComponent(category)}`}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} p-2 bg-white/80 hover:bg-white`}
          onClick={(e) => {
            e.preventDefault()
            onFavoriteToggle?.()
          }}
        >
          <Heart 
            className={`w-4 h-4 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`} 
          />
        </Button>

        {/* Ad type badge */}
        <Badge 
          variant={adType === "SALE" ? "default" : "secondary"}
          className={`absolute bottom-2 ${isRTL ? "right-2" : "left-2"}`}
        >
          {t(adType.toLowerCase() as "sale" | "rent")}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Category */}
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>

          {/* Title */}
          <Link href={`/ads/${id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
              {title}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-sky-600">
              {price ? formatPrice(price, currency) : 'السعر عند الاستفسار'}
            </p>
            
            {/* Rating */}
            {rating && (
              <div className="flex items-center space-x-1">
                <StarRating 
                  rating={rating} 
                  size="sm" 
                  className="text-xs"
                />
                {reviewCount && reviewCount > 0 && (
                  <span className="text-xs text-gray-500">
                    ({reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {/* Meta information */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
