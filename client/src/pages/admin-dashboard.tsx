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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/file-upload";
import { Plus, Edit, Trash2, Eye, Users, TrendingUp, ShoppingCart, Package, DollarSign, Activity, Calendar, Star, BarChart3, FileText, Settings, Search, Shield, UserCheck, Clock, AlertTriangle } from "lucide-react";
import Header from "@/components/header";
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

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [productFormData, setProductFormData] = useState({
    originalPrice: 0,
    price: 0,
    discount: 0,
    isVariant: false,
    parentProductId: "",
    image: "",
    name: "",
    fullProductName: "",
    subcategory: "",
    duration: "",
    description: "",
    features: "",
    category: "",
    activationTime: "",
    warranty: "",
    notes: "",
    popular: false,
    trending: false,
    available: true
  });
  const [parentProductSearch, setParentProductSearch] = useState("");

  // Fetch data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews"],
  });

  // Auto-calculate discount when prices change
  useEffect(() => {
    if (productFormData.originalPrice > 0 && productFormData.price > 0) {
      const discountPercent = Math.round(
        ((productFormData.originalPrice - productFormData.price) / productFormData.originalPrice) * 100
      );
      setProductFormData(prev => ({ ...prev, discount: Math.max(0, discountPercent) }));
    }
  }, [productFormData.originalPrice, productFormData.price]);

  // Filter parent products for variant selection - with safety check
  const filteredParentProducts = Array.isArray(products) ? products.filter((p: Product) => 
    !p.isVariant && 
    p.id !== selectedProduct?.id &&
    p.name && p.name.toLowerCase().includes(parentProductSearch.toLowerCase())
  ) : [];

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setShowProductDialog(false);
      setSelectedProduct(null);
      resetProductForm();
      toast({ title: "Success", description: "Product created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setShowProductDialog(false);
      setSelectedProduct(null);
      resetProductForm();
      toast({ title: "Success", description: "Product updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setShowCategoryDialog(false);
      setSelectedCategory(null);
      toast({ title: "Success", description: "Category created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setShowCategoryDialog(false);
      setSelectedCategory(null);
      toast({ title: "Success", description: "Category updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Helper functions
  const resetProductForm = () => {
    setProductFormData({
      originalPrice: 0,
      price: 0,
      discount: 0,
      isVariant: false,
      parentProductId: "",
      image: "",
      name: "",
      fullProductName: "",
      subcategory: "",
      duration: "",
      description: "",
      features: "",
      category: "",
      activationTime: "",
      warranty: "",
      notes: "",
      popular: false,
      trending: false,
      available: true
    });
    setParentProductSearch("");
  };

  const handlePriceChange = (field: 'originalPrice' | 'price', value: number) => {
    setProductFormData(prev => ({ ...prev, [field]: value }));
  };

  const openCategoryDialog = (category?: Category) => {
    setSelectedCategory(category || null);
    setShowCategoryDialog(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const categoryData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      icon: "fas fa-layer-group", // Default icon for all categories
    };

    if (selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, ...categoryData });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setProductFormData({
        originalPrice: product.originalPrice || 0,
        price: product.price || 0,
        discount: product.discount || 0,
        isVariant: product.isVariant || false,
        parentProductId: product.parentProductId || "",
        image: product.image || "",
        name: product.name || "",
        fullProductName: product.fullProductName || "",
        subcategory: product.subcategory || "",
        duration: product.duration || "",
        description: product.description || "",
        features: product.features || "",
        category: product.category || "",
        activationTime: product.activationTime || "",
        warranty: product.warranty || "",
        notes: product.notes || "",
        popular: product.popular || false,
        trending: product.trending || false,
        available: product.available !== false
      });
    } else {
      setSelectedProduct(null);
      resetProductForm();
    }
    setShowProductDialog(true);
  };

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Product deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });



  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      apiRequest("PUT", `/api/admin/orders/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Order status updated" });
    },
  });

  const handleProductSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      name: productFormData.name,
      fullProductName: productFormData.fullProductName,
      subcategory: productFormData.subcategory,
      duration: productFormData.duration,
      description: productFormData.description,
      features: productFormData.features,
      price: productFormData.price,
      originalPrice: productFormData.originalPrice,
      discount: productFormData.discount,
      category: productFormData.category,
      icon: "fas fa-box", // Default icon for all products
      image: productFormData.image,
      activationTime: productFormData.activationTime,
      warranty: productFormData.warranty,
      notes: productFormData.notes,
      popular: productFormData.popular,
      trending: productFormData.trending,
      available: productFormData.available,
      isVariant: productFormData.isVariant,
      parentProductId: productFormData.parentProductId,
      parentProductName: productFormData.parentProductId ? 
        products.find((p: Product) => p.id === productFormData.parentProductId)?.name : null,
    };

    if (selectedProduct) {
      updateProductMutation.mutate({ id: selectedProduct.id, ...data });
    } else {
      createProductMutation.mutate(data);
    }
  };



  if (statsLoading || productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  // Ensure all data has safe defaults
  const safeProducts = products || [];
  const safeCategories = categories || [];
  const safeOrders = orders || [];
  const safeReviews = reviews || [];

  const dashboardStats: DashboardStats = {
    totalOrders: safeOrders.length,
    totalRevenue: safeOrders.reduce((sum: number, order: Order) => sum + (order.price || 0), 0),
    totalProducts: safeProducts.length,
    totalCategories: safeCategories.length,
    recentOrders: safeOrders.slice(0, 5),
    topProducts: safeProducts.slice(0, 5),
    conversionRate: 4.2,
    averageOrderValue: safeOrders.length ? safeOrders.reduce((sum: number, order: Order) => sum + (order.price || 0), 0) / safeOrders.length : 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your digital services business</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{dashboardStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">{safeCategories.length} categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{Math.round(dashboardStats.averageOrderValue)}</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(dashboardStats.recentOrders || []).map((order: Order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.productName}</p>
                          <p className="text-sm text-muted-foreground">Order #{order.orderId}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{order.price}</p>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best performing items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(dashboardStats.topProducts || []).map((product: Product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover aspect-square" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{product.price}</p>
                          <div className="flex items-center space-x-1">
                            {product.popular && <Badge variant="outline">Popular</Badge>}
                            {product.trending && <Badge variant="outline">Trending</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Products Management</h2>
              <Button onClick={() => openProductDialog()} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div>
              <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                  <DialogHeader>
                    <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>
                      {selectedProduct ? 'Update product information' : 'Create a new digital service product'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={productFormData.name}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Netflix Premium"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullProductName">Full Product Name</Label>
                        <Input
                          id="fullProductName"
                          name="fullProductName"
                          value={productFormData.fullProductName}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, fullProductName: e.target.value }))}
                          placeholder="e.g., Netflix Premium - 1 Month"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Input
                          id="subcategory"
                          name="subcategory"
                          value={productFormData.subcategory}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                          placeholder="e.g., Premium Video"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          name="duration"
                          value={productFormData.duration}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="e.g., 1 Month, 3 Months"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={productFormData.description}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the product and its benefits"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="features">Features</Label>
                      <Textarea
                        id="features"
                        name="features"
                        value={productFormData.features}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, features: e.target.value }))}
                        placeholder="List key features separated by commas"
                        required
                      />
                    </div>

                    {/* Automatic Discount Calculation Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-blue-50/50">
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Original Price (₹)</Label>
                        <Input
                          id="originalPrice"
                          name="originalPrice"
                          type="number"
                          value={productFormData.originalPrice}
                          onChange={(e) => handlePriceChange('originalPrice', Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Our Price (₹)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={productFormData.price}
                          onChange={(e) => handlePriceChange('price', Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount">Discount (% - Auto Calculated)</Label>
                        <Input
                          id="discount"
                          name="discount"
                          type="number"
                          value={productFormData.discount}
                          readOnly
                          className="bg-green-50 font-semibold text-green-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={productFormData.category} onValueChange={(value) => setProductFormData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {safeCategories.map((cat: Category) => (
                              <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activationTime">Activation Time</Label>
                        <Input
                          id="activationTime"
                          name="activationTime"
                          value={productFormData.activationTime}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, activationTime: e.target.value }))}
                          placeholder="e.g., Instant, 24 Hours"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="warranty">Warranty</Label>
                        <Input
                          id="warranty"
                          name="warranty"
                          value={productFormData.warranty}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, warranty: e.target.value }))}
                          placeholder="e.g., 30 Days, Lifetime"
                          required
                        />
                      </div>

                    </div>

                    {/* File Upload Section */}
                    <div className="space-y-2">
                      <Label>Product Image Upload</Label>
                      <FileUpload
                        onUploadComplete={(url) => setProductFormData(prev => ({ ...prev, image: url }))}
                        currentImage={productFormData.image}
                        accept="image/*"
                        maxSize={5}
                        className="w-full"
                      />
                      <input type="hidden" name="image" value={productFormData.image} />
                    </div>

                    {/* Product Variant Selection Section */}
                    <div className="space-y-4 p-4 border rounded-lg bg-amber-50/50">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Product Variant Settings</Label>
                        <Badge variant={productFormData.isVariant ? "default" : "secondary"}>
                          {productFormData.isVariant ? "Variant Product" : "Main Product"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isVariant"
                          checked={productFormData.isVariant}
                          onCheckedChange={(checked) => 
                            setProductFormData(prev => ({ 
                              ...prev, 
                              isVariant: checked as boolean,
                              parentProductId: checked ? prev.parentProductId : ""
                            }))
                          }
                        />
                        <Label htmlFor="isVariant" className="text-sm">
                          This is a variant of another product (e.g., different subscription plans)
                        </Label>
                      </div>

                      {productFormData.isVariant && (
                        <div className="space-y-2">
                          <Label htmlFor="parentProductSearch">Select Main Product</Label>
                          <div className="space-y-2">
                            <div className="relative">
                              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="parentProductSearch"
                                placeholder="Search for main product..."
                                value={parentProductSearch}
                                onChange={(e) => setParentProductSearch(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Select
                              value={productFormData.parentProductId}
                              onValueChange={(value) => 
                                setProductFormData(prev => ({ ...prev, parentProductId: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choose main product" />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredParentProducts.length > 0 ? (
                                  filteredParentProducts.map((product: Product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                      <div className="flex items-center space-x-2">
                                        {product.icon && <i className={product.icon} />}
                                        <span>{product.name || 'Unnamed Product'}</span>
                                        <Badge variant="outline" className="ml-2">
                                          {product.category || 'Uncategorized'}
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="" disabled>
                                    No main products found
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          {productFormData.parentProductId && (
                            <div className="text-sm text-muted-foreground">
                              Selected: {Array.isArray(products) ? products.find((p: Product) => p.id === productFormData.parentProductId)?.name || 'Unknown Product' : 'Loading...'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={productFormData.notes}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes or terms"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="popular"
                          name="popular"
                          checked={productFormData.popular}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, popular: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="popular">Popular</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="trending"
                          name="trending"
                          checked={productFormData.trending}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, trending: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="trending">Trending</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="available"
                          name="available"
                          checked={productFormData.available}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, available: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="available">Available</Label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowProductDialog(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        className="w-full sm:w-auto"
                      >
                        {selectedProduct ? 'Update Product' : 'Create Product'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 md:p-4">Product</th>
                        <th className="text-left p-3 md:p-4 hidden sm:table-cell">Category</th>
                        <th className="text-left p-3 md:p-4">Price</th>
                        <th className="text-left p-3 md:p-4 hidden md:table-cell">Status</th>
                        <th className="text-left p-3 md:p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeProducts.map((product: Product) => (
                        <tr key={product.id} className="border-b">
                          <td className="p-3 md:p-4">
                            <div className="flex items-center space-x-3">
                              <img src={product.image} alt={product.name} className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover aspect-square" />
                              <div>
                                <p className="font-medium text-sm md:text-base">{product.name}</p>
                                <p className="text-xs md:text-sm text-muted-foreground">{product.duration}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 md:p-4 hidden sm:table-cell">
                            <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          </td>
                          <td className="p-3 md:p-4">
                            <div>
                              <span className="font-bold text-sm md:text-base">₹{product.price}</span>
                              <span className="text-xs text-muted-foreground line-through ml-1 block sm:inline">₹{product.originalPrice}</span>
                            </div>
                          </td>
                          <td className="p-3 md:p-4 hidden md:table-cell">
                            <div className="flex flex-wrap items-center gap-1">
                              <Badge variant={product.available ? "default" : "secondary"} className="text-xs">
                                {product.available ? "Available" : "Unavailable"}
                              </Badge>
                              {product.popular && <Badge variant="outline" className="text-xs">Popular</Badge>}
                              {product.trending && <Badge variant="outline" className="text-xs">Trending</Badge>}
                            </div>
                          </td>
                          <td className="p-3 md:p-4">
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openProductDialog(product)}
                                className="p-2"
                              >
                                <Edit className="w-3 h-3 md:w-4 md:h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this product?")) {
                                    deleteProductMutation.mutate(product.id);
                                  }
                                }}
                                className="p-2"
                              >
                                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Categories Management</h2>
              <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                    <DialogDescription>{selectedCategory ? 'Update category details' : 'Create a new product category'}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input id="categoryName" name="name" defaultValue={selectedCategory?.name} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categorySlug">Slug</Label>
                      <Input id="categorySlug" name="slug" defaultValue={selectedCategory?.slug} placeholder="e.g., gaming-tools" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Textarea id="categoryDescription" name="description" defaultValue={selectedCategory?.description || ''} />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowCategoryDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                        {selectedCategory ? 'Update Category' : 'Create Category'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeCategories.map((category: Category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <i className={`${category.icon} text-2xl text-primary`}></i>
                      <div>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>{category.slug}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {safeProducts.filter((p: Product) => p.category === category.slug).length} products
                      </p>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openCategoryDialog(category)}
                          className="p-2"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this category?")) {
                              deleteCategoryMutation.mutate(category.id);
                            }
                          }}
                          className="p-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Orders Management</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{safeOrders.length} Total Orders</Badge>
                <Badge variant="outline">₹{safeOrders.reduce((sum: number, order: Order) => sum + (order.price || 0), 0)} Revenue</Badge>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Product</th>
                        <th className="text-left p-4">Amount</th>
                        <th className="text-left p-4">Payment</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeOrders.map((order: Order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-4 font-mono text-sm">{order.orderId}</td>
                          <td className="p-4">{order.productName}</td>
                          <td className="p-4 font-bold">₹{order.price}</td>
                          <td className="p-4">{order.paymentMethod}</td>
                          <td className="p-4">
                            <Badge variant={
                              order.status === 'completed' ? 'default' : 
                              order.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(order.createdAt || '').toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <Select 
                              defaultValue={order.status} 
                              onValueChange={(status) => updateOrderStatusMutation.mutate({ id: order.id, status })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Reviews Management</h2>
              <Badge variant="outline">{safeReviews.length} Total Reviews</Badge>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {safeReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No reviews yet</p>
                    </div>
                  ) : (
                    safeReviews.map((review: Review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.customerName}</h4>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">
                                {new Date(review.createdAt || '').toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {review.isVerified && (
                              <Badge variant="outline">Verified</Badge>
                            )}
                            <Badge variant={review.isPublished ? "default" : "secondary"}>
                              {review.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </div>
                        </div>
                        <h5 className="font-medium mb-1">{review.title}</h5>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Insights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+15.2%</div>
                  <p className="text-xs text-muted-foreground">Revenue growth</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8/5</div>
                  <p className="text-xs text-muted-foreground">Based on {safeReviews.length} reviews</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Popular Category</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">OTT</div>
                  <p className="text-xs text-muted-foreground">Most purchased category</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safeCategories.map((category: Category) => {
                      const categoryProducts = safeProducts.filter((p: Product) => p.category === category.slug);
                      const categoryRevenue = categoryProducts.reduce((sum: number, product: Product) => sum + (product.price || 0), 0);
                      const percentage = dashboardStats.totalRevenue > 0 ? (categoryRevenue / dashboardStats.totalRevenue) * 100 : 0;
                      
                      return (
                        <div key={category.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-sm text-muted-foreground">₹{categoryRevenue}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm">New order received - Netflix Premium</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm">Product updated - Spotify Premium</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm">New review submitted - 5 stars</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-sm">Category created - Gaming Tools</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}