import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/file-upload";
import { 
  Plus, Edit, Trash2, Eye, Users, TrendingUp, ShoppingCart, Package, DollarSign, 
  Activity, Calendar, Star, BarChart3, FileText, Settings, Search, Shield, 
  UserCheck, Clock, AlertTriangle, Upload, Download, Home, RefreshCw, Save
} from "lucide-react";
import { Link } from "wouter";
import EnhancedHeader from "@/components/enhanced-header";
import Footer from "@/components/footer";
import type { Product, Category, Order, Review, User } from "@shared/schema";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  recentOrders: Order[];
  topProducts: Product[];
  conversionRate: number;
  averageOrderValue: number;
}

interface CategoryWithCounts {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  subcategories: string[];
}

export default function AdminDashboardIntegrated() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState("all");
  
  const [productFormData, setProductFormData] = useState({
    name: "",
    fullProductName: "",
    subcategory: "",
    duration: "",
    description: "",
    features: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    category: "",
    icon: "",
    image: "",
    activationTime: "Instant",
    warranty: "Standard Warranty",
    notes: "",
    popular: false,
    trending: false,
    available: true
  });

  // Fetch data with manual refresh control
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
    staleTime: 300000, // 5 minutes
  });

  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    staleTime: 300000,
  });

  const { data: categories = [], isLoading: categoriesLoading, refetch: refetchCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 300000,
  });

  const { data: orders = [], refetch: refetchOrders } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    staleTime: 300000,
  });

  const { data: reviews = [], refetch: refetchReviews } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews"],
    staleTime: 300000,
  });

  // Create category summary with product counts and subcategories
  const categoriesWithCounts: CategoryWithCounts[] = categories.map(category => {
    const categoryProducts = products.filter(p => p.category === category.id);
    const subcategoriesSet = new Set(categoryProducts.map(p => p.subcategory).filter(Boolean));
    const subcategories = Array.from(subcategoriesSet);
    
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      productCount: categoryProducts.length,
      subcategories
    };
  });

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.fullProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.subcategory?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === "all" || product.category === selectedCategoryFilter;
    const matchesSubcategory = selectedSubcategoryFilter === "all" || product.subcategory === selectedSubcategoryFilter;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Get unique subcategories for selected category
  const availableSubcategories = selectedCategoryFilter === "all" 
    ? Array.from(new Set(products.map(p => p.subcategory).filter(Boolean)))
    : Array.from(new Set(products.filter(p => p.category === selectedCategoryFilter).map(p => p.subcategory).filter(Boolean)));

  // Mutations for CRUD operations
  const createProductMutation = useMutation({
    mutationFn: (productData: any) => apiRequest("/api/products", "POST", productData),
    onSuccess: () => {
      toast({ title: "Success", description: "Product created successfully" });
      setShowProductDialog(false);
      resetProductForm();
      refetchProducts();
      refetchStats();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create product", variant: "destructive" });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, ...productData }: any) => apiRequest(`/api/products/${id}`, "PUT", productData),
    onSuccess: () => {
      toast({ title: "Success", description: "Product updated successfully" });
      setShowProductDialog(false);
      resetProductForm();
      refetchProducts();
      refetchStats();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update product", variant: "destructive" });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/products/${id}`, "DELETE"),
    onSuccess: () => {
      toast({ title: "Success", description: "Product deleted successfully" });
      refetchProducts();
      refetchStats();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete product", variant: "destructive" });
    }
  });

  const resetProductForm = () => {
    setProductFormData({
      name: "",
      fullProductName: "",
      subcategory: "",
      duration: "",
      description: "",
      features: "",
      price: 0,
      originalPrice: 0,
      discount: 0,
      category: "",
      icon: "",
      image: "",
      activationTime: "Instant",
      warranty: "Standard Warranty",
      notes: "",
      popular: false,
      trending: false,
      available: true
    });
    setSelectedProduct(null);
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setProductFormData({
        name: product.name || "",
        fullProductName: product.fullProductName || "",
        subcategory: product.subcategory || "",
        duration: product.duration || "",
        description: product.description || "",
        features: product.features || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        discount: product.discount || 0,
        category: product.category || "",
        icon: product.icon || "",
        image: product.image || "",
        activationTime: product.activationTime || "Instant",
        warranty: product.warranty || "Standard Warranty",
        notes: product.notes || "",
        popular: product.popular || false,
        trending: product.trending || false,
        available: product.available !== false
      });
    } else {
      resetProductForm();
    }
    setShowProductDialog(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate discount if original price is provided
    const finalFormData = {
      ...productFormData,
      discount: productFormData.originalPrice > 0 && productFormData.price > 0
        ? Math.round((1 - productFormData.price / productFormData.originalPrice) * 100)
        : productFormData.discount
    };

    if (selectedProduct) {
      updateProductMutation.mutate({ id: selectedProduct.id, ...finalFormData });
    } else {
      createProductMutation.mutate(finalFormData);
    }
  };

  const handleManualRefresh = () => {
    toast({ title: "Refreshing data...", description: "Updating all dashboard data" });
    Promise.all([
      refetchStats(),
      refetchProducts(),
      refetchCategories(),
      refetchOrders(),
      refetchReviews()
    ]).then(() => {
      toast({ title: "Success", description: "Dashboard data refreshed successfully" });
    });
  };

  // Loading state
  if (statsLoading || productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your digital services marketplace</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleManualRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                View Store
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                      <p className="text-3xl font-bold">{stats?.totalProducts || products.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                      <p className="text-3xl font-bold">{stats?.totalOrders || orders.length}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-3xl font-bold">₹{stats?.totalRevenue || 0}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Categories</p>
                      <p className="text-3xl font-bold">{stats?.totalCategories || categories.length}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Category Overview</CardTitle>
                <CardDescription>Products distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriesWithCounts.map((category) => (
                    <Card key={category.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <Badge variant="secondary">{category.productCount} products</Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Subcategories: {category.subcategories.length}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {category.subcategories.slice(0, 3).map((sub, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {sub}
                              </Badge>
                            ))}
                            {category.subcategories.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{category.subcategories.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Product Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedSubcategoryFilter} onValueChange={setSelectedSubcategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {availableSubcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => openProductDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </CardContent>
            </Card>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const category = categories.find(c => c.id === product.category);
                return (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{category?.name}</p>
                          {product.subcategory && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {product.subcategory}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => openProductDialog(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteProductMutation.mutate(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                          {product.originalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm line-through text-muted-foreground">₹{product.originalPrice}</span>
                              <Badge variant="destructive" className="ml-2 text-xs">
                                {product.discount}% OFF
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {product.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                          {product.trending && <Badge variant="secondary" className="text-xs">Trending</Badge>}
                          {!product.available && <Badge variant="destructive" className="text-xs">Unavailable</Badge>}
                        </div>
                        
                        {product.duration && (
                          <p className="text-sm text-muted-foreground">Duration: {product.duration}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesWithCounts.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-xl">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">/{category.slug}</p>
                      </div>
                      <Badge variant="secondary">{category.productCount} products</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Subcategories ({category.subcategories.length}):</p>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.map((subcategory, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {subcategory}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3">
                        <Link href={`/category/${category.slug}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 10).map((order) => (
                      <Card key={order.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{order.orderId}</p>
                              <p className="text-sm text-muted-foreground">{order.productName}</p>
                              <p className="text-sm text-muted-foreground">Status: {order.status}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{order.price}</p>
                              <Badge variant="secondary">{order.paymentMethod}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {selectedProduct ? "Update product information" : "Create a new product in your store"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProductSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="e.g., Netflix Premium 1M"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullProductName">Full Product Name</Label>
                <Input
                  id="fullProductName"
                  value={productFormData.fullProductName}
                  onChange={(e) => setProductFormData({ ...productFormData, fullProductName: e.target.value })}
                  placeholder="e.g., Netflix Premium Plan - 1 Month"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={productFormData.category}
                  onValueChange={(value) => setProductFormData({ ...productFormData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  value={productFormData.subcategory}
                  onChange={(e) => setProductFormData({ ...productFormData, subcategory: e.target.value })}
                  placeholder="e.g., Netflix, AI Tools, Cloud Storage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={productFormData.duration}
                  onChange={(e) => setProductFormData({ ...productFormData, duration: e.target.value })}
                  placeholder="e.g., 1 Month, 1 Year, Lifetime"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={productFormData.price}
                  onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (₹)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min="0"
                  value={productFormData.originalPrice}
                  onChange={(e) => setProductFormData({ ...productFormData, originalPrice: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activationTime">Activation Time</Label>
                <Select
                  value={productFormData.activationTime}
                  onValueChange={(value) => setProductFormData({ ...productFormData, activationTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instant">Instant</SelectItem>
                    <SelectItem value="Within 1 hour">Within 1 hour</SelectItem>
                    <SelectItem value="Within 24 hours">Within 24 hours</SelectItem>
                    <SelectItem value="Within 3 days">Within 3 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productFormData.description}
                onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Textarea
                id="features"
                value={productFormData.features}
                onChange={(e) => setProductFormData({ ...productFormData, features: e.target.value })}
                placeholder="e.g., HD Streaming, No Ads, Private Login, Multi-device Access"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="popular"
                  checked={productFormData.popular}
                  onCheckedChange={(checked) => setProductFormData({ ...productFormData, popular: checked })}
                />
                <Label htmlFor="popular">Popular</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="trending"
                  checked={productFormData.trending}
                  onCheckedChange={(checked) => setProductFormData({ ...productFormData, trending: checked })}
                />
                <Label htmlFor="trending">Trending</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={productFormData.available}
                  onCheckedChange={(checked) => setProductFormData({ ...productFormData, available: checked })}
                />
                <Label htmlFor="available">Available</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setShowProductDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {selectedProduct ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}