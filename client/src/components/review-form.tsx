import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type InsertReview, type Product } from "@shared/schema";
import StarRating from "./star-rating";

interface ReviewFormProps {
  product: Product;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ product, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: async (reviewData: InsertReview) => {
      const response = await apiRequest("POST", "/api/reviews", reviewData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", product.id, "reviews"] });
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your review will be published after moderation.",
      });

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      setCustomerName("");
      setCustomerEmail("");
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !title.trim() || !comment.trim() || !customerName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and provide a rating.",
        variant: "destructive",
      });
      return;
    }

    const reviewData: InsertReview = {
      productId: product.id,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || undefined,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      isVerified: false,
      isPublished: false, // Reviews need moderation
    };

    reviewMutation.mutate(reviewData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Write a Review</CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your experience with {product.fullProductName}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={rating}
                interactive
                onRatingChange={setRating}
                size="lg"
              />
              <span className="text-sm text-muted-foreground">
                {rating > 0 ? `${rating} out of 5 stars` : "Click to rate"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email (Optional)</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this service..."
              rows={4}
              maxLength={1000}
              required
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/1000 characters
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={reviewMutation.isPending}
            className="w-full sm:w-auto"
          >
            {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}