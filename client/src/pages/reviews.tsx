import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product, Review } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ReviewList from "@/components/review-list";
import ReviewForm from "@/components/review-form";
import StarRating from "@/components/star-rating";
import { ArrowLeft, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function ReviewsPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<Product | null>(null);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: allReviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  // Filter reviews by selected product
  const filteredReviews = selectedProduct === "all" 
    ? allReviews 
    : allReviews.filter(review => review.productId === selectedProduct);

  // Calculate overall statistics
  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0 
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const handleWriteReview = (product: Product) => {
    setSelectedProductForReview(product);
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setSelectedProductForReview(null);
  };

  if (productsLoading || reviewsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading reviews...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Customer Reviews</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              See what our customers say about our digital services
            </p>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{totalReviews}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <StarRating rating={Math.round(averageRating)} size="lg" className="justify-center mb-2" />
              <div className="text-sm text-muted-foreground">Overall Satisfaction</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filter by product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full sm:w-auto"
          >
            Write a Review
          </Button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8">
            {!selectedProductForReview ? (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Product to Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card 
                        key={product.id} 
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleWriteReview(product)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <i className={`${product.icon} text-primary text-lg`} />
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.category.toUpperCase()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ReviewForm 
                product={selectedProductForReview} 
                onReviewSubmitted={handleReviewSubmitted}
              />
            )}
          </div>
        )}

        {/* Reviews List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {selectedProduct === "all" ? "All Reviews" : "Product Reviews"}
            </h2>
            <Badge variant="outline">
              {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <ReviewList 
            productId={selectedProduct === "all" ? undefined : selectedProduct}
            showProductInfo={selectedProduct === "all"}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}