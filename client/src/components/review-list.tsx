import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, CheckCircle } from "lucide-react";
import { type Review } from "@shared/schema";
import StarRating from "./star-rating";

interface ReviewListProps {
  productId?: string;
  limit?: number;
  showProductInfo?: boolean;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export default function ReviewList({ productId, limit, showProductInfo = false }: ReviewListProps) {
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: productId ? ["/api/products", productId, "reviews"] : ["/api/reviews"],
  });

  // Filter reviews by limit if specified
  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

  // Calculate review statistics
  const stats: ReviewStats = reviews.reduce(
    (acc, review) => {
      acc.totalReviews++;
      acc.averageRating = (acc.averageRating * (acc.totalReviews - 1) + review.rating) / acc.totalReviews;
      acc.ratingDistribution[review.rating] = (acc.ratingDistribution[review.rating] || 0) + 1;
      return acc;
    },
    { averageRating: 0, totalReviews: 0, ratingDistribution: {} as Record<number, number> }
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (displayedReviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your experience with this service!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      {stats.totalReviews > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <div>
                  <StarRating rating={Math.round(stats.averageRating)} size="lg" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating] || 0;
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-8">{rating}★</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="font-medium">{review.title}</span>
                    {review.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(review.createdAt!)}
                  </div>
                </div>
                
                {/* Review Content */}
                <p className="text-sm leading-relaxed">{review.comment}</p>
                
                <Separator />
                
                {/* Reviewer Info */}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{review.customerName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}