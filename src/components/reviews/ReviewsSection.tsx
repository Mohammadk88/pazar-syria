import { useState } from "react"
import { Star, ThumbsUp, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "@/components/ui/star-rating"
import { formatDate } from "@/lib/utils"

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
  helpful: number
  isHelpful?: boolean
}

interface ReviewsProps {
  sellerId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user1", 
    userName: "محمد أحمد",
    rating: 5,
    comment: "بائع ممتاز وصادق في التعامل. الشقة كانت كما هو موصوف تماماً. أنصح بالتعامل معه.",
    createdAt: new Date("2024-01-10"),
    helpful: 5
  },
  {
    id: "2",
    userId: "user2",
    userName: "سارة علي", 
    rating: 4,
    comment: "تجربة جيدة جداً. البائع متعاون ومتجاوب. الوقت المحدد للمعاينة كان مناسب.",
    createdAt: new Date("2024-01-08"),
    helpful: 3
  },
  {
    id: "3", 
    userId: "user3",
    userName: "خالد محمود",
    rating: 5,
    comment: "أفضل تجربة شراء عقار مررت بها. البائع محترم جداً ومتفهم. المكان رائع والسعر معقول.",
    createdAt: new Date("2024-01-05"),
    helpful: 8
  }
]

export function ReviewsSection({ sellerId, averageRating, totalReviews }: ReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews)
  const [showAddReview, setShowAddReview] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")

  const handleSubmitReview = () => {
    // TODO: Implement review submission
    console.log({ sellerId, rating: newRating, comment: newComment })
    setShowAddReview(false)
    setNewRating(0)
    setNewComment("")
  }

  const handleHelpful = (reviewId: string) => {
    // TODO: Implement helpful functionality
    console.log(`Mark review ${reviewId} as helpful`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>التقييمات والمراجعات</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddReview(!showAddReview)}
          >
            إضافة تقييم
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} size="md" />
              <p className="text-sm text-gray-600 mt-1">
                {totalReviews} تقييم
              </p>
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-1 text-sm">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter(r => r.rating === stars).length
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-3">{stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-500 text-xs w-6">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        {showAddReview && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold mb-3">إضافة تقييم جديد</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">التقييم</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= newRating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">التعليق</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="شاركنا تجربتك مع هذا البائع..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitReview}
                  disabled={newRating === 0 || newComment.trim() === ""}
                  size="sm"
                >
                  نشر التقييم
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddReview(false)}
                  size="sm"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد تقييمات بعد</p>
              <p className="text-sm">كن أول من يقيم هذا البائع</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-medium">{review.userName}</h5>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3 mr-13">
                  {review.comment}
                </p>
                
                <div className="flex items-center gap-4 mr-13">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>مفيد ({review.helpful})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
