import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Product[];
  conversionRate: number;
  averageOrderValue: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Product Management State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: "",
    fullProductName: "",
    subcategory: undefined as string | undefined,
    duration: "",
    description: "",
    features: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    category: undefined as string | undefined,
    image: "",
    activationTime: "",
    warranty: "",
    notes: "",
    popular: false,
    trending: false,
    available: true,
  });

  // User Management State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [userFormData, setUserFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: undefined as string | undefined,
    permissions: [] as string[],
    isActive: true,
  });

  // Category Management State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  // Manual Refresh Only - No Auto Updates
  const { data: products = [], isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ["/api/products"],
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: categories = [], isLoading: isLoadingCategories, refetch: refetchCategories } = useQuery({
    queryKey: ["/api/categories"],
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: users = [], isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ["/api/admin/orders"],
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ["/api/admin/reviews"],
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: stats = { 
    totalRevenue: 0, 
    totalOrders: 0, 
    totalProducts: 0, 
    totalCategories: 0,
    totalUsers: 0,
    conversionRate: 0,
    averageOrderValue: 0
  }, refetch: refetchStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Product Mutations with Manual Refresh
  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/products", data),
    onSuccess: () => {
      toast({ title: "Success", description: "Product created successfully" });
      setShowProductDialog(false);
      resetProductForm();
      // Manual refresh only when needed
      setTimeout(() => {
        refetchProducts();
        refetchStats();
      }, 100);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/products/${id}`, data),
    onSuccess: () => {
      toast({ title: "Success", description: "Product updated successfully" });
      setShowProductDialog(false);
      setIsEditingProduct(false);
      resetProductForm();
      // Manual refresh only when needed
      setTimeout(() => {
        refetchProducts();
        refetchStats();
      }, 100);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => {
      toast({ title: "Success", description: "Product deleted successfully" });
      setTimeout(() => {
        refetchProducts();
        refetchStats();
      }, 100);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // User Mutations
  const createUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/users", data),
    onSuccess: () => {
      toast({ title: "Success", description: "User created successfully" });
      setShowUserDialog(false);
      resetUserForm();
      setTimeout(() => {
        refetchUsers();
        refetchStats();
      }, 100);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/users/${id}`, data),
    onSuccess: () => {
      toast({ title: "Success", description: "User updated successfully" });
      setShowUserDialog(false);
      resetUserForm();
      setTimeout(() => {
        refetchUsers();
        refetchStats();
      }, 100);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/users/${id}`),
    onSuccess: () => {
      toast({ title: "Success", description: "User deleted successfully" });
      setTimeout(() => {
        refetchUsers();
        refetchStats();
      }, 100);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Helper Functions
  const resetProductForm = () => {
    setProductFormData({
      name: "",
      fullProductName: "",
      subcategory: undefined,
      duration: "",
      description: "",
      features: "",
      price: 0,
      originalPrice: 0,
      discount: 0,
      category: undefined,
      image: "",
      activationTime: "",
      warranty: "",
      notes: "",
      popular: false,
      trending: false,
      available: true,
    });
    setSelectedProduct(null);
    setIsEditingProduct(false);
  };

  const resetUserForm = () => {
    setUserFormData({
      email: "",
      firstName: "",
      lastName: "",
      role: undefined,
      permissions: [],
      isActive: true,
    });
    setSelectedUser(null);
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setIsEditingProduct(true);
      setProductFormData({
        name: product.name || "",
        fullProductName: product.fullProductName || "",
        subcategory: product.subcategory || undefined,
        duration: product.duration || "",
        description: product.description || "",
        features: product.features || "",
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        discount: product.discount || 0,
        category: product.category || undefined,
        image: product.image || "",
        activationTime: product.activationTime || "",
        warranty: product.warranty || "",
        notes: product.notes || "",
        popular: product.popular || false,
        trending: product.trending || false,
        available: product.available !== false,
      });
    } else {
      resetProductForm();
    }
    setShowProductDialog(true);
  };

  const openUserDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setUserFormData({
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: user.role || "user",
        permissions: Array.isArray(user.permissions) ? user.permissions : [],
        isActive: user.isActive !== false,
      });
    } else {
      resetUserForm();
    }
    setShowUserDialog(true);
  };

  const handlePriceChange = (field: 'price' | 'originalPrice', value: number) => {
    setProductFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (updated.originalPrice > 0 && updated.price > 0) {
        updated.discount = Math.round(((updated.originalPrice - updated.price) / updated.originalPrice) * 100);
      }
      return updated;
    });
  };

  const handleProductSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const data = {
      ...productFormData,
      icon: "fas fa-box", // Default icon
    };

    if (isEditingProduct && selectedProduct) {
      updateProductMutation.mutate({ id: selectedProduct.id, ...data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleUserSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (selectedUser) {
      updateUserMutation.mutate({ id: selectedUser.id, ...userFormData });
    } else {
      createUserMutation.mutate(userFormData);
    }
  };

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeUsers = Array.isArray(users) ? users : [];
  
  // Filter main categories only (exclude subcategories)
  const mainCategories = safeCategories.filter((cat: Category) => !cat.isSubcategory);
  
  // Get subcategories for selected main category
  const getSubcategoriesForCategory = (categoryId: string) => {
    return safeCategories.filter((cat: Category) => 
      cat.isSubcategory && cat.parentCategoryId === categoryId
    );
  };
  
  // Get subcategories for currently selected category
  const availableSubcategories = productFormData.category 
    ? getSubcategoriesForCategory(productFormData.category)
    : [];

  const availablePermissions = [
    "read_products", "write_products", "delete_products",
    "read_users", "write_users", "delete_users",
    "read_orders", "write_orders", "delete_orders",
    "read_reviews", "write_reviews", "delete_reviews",
    "admin_access", "moderator_access"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your business operations and data</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts || safeProducts.length}</div>
                  <p className="text-xs text-muted-foreground">Active products</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers || safeUsers.length}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
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

            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {isLoadingProducts ? (
                    <div className="p-8 text-center">Loading products...</div>
                  ) : safeProducts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No products found</div>
                  ) : (
                    safeProducts.map((product: Product) => (
                      <div key={product.id} className="p-4 hover:bg-muted/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.fullProductName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                                {product.originalPrice > product.price && (
                                  <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                                )}
                                <Badge variant="secondary">{product.discount}% OFF</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {product.popular && <Badge variant="default">Popular</Badge>}
                            {product.trending && <Badge variant="outline">Trending</Badge>}
                            {!product.available && <Badge variant="destructive">Unavailable</Badge>}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openProductDialog(product)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteProductMutation.mutate(product.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Dialog */}
            <Dialog open={showProductDialog} onOpenChange={(open) => {
              setShowProductDialog(open);
              if (!open) {
                resetProductForm();
              }
            }}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                <DialogHeader>
                  <DialogTitle>{isEditingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  <DialogDescription>
                    {isEditingProduct ? 'Update product information' : 'Create a new digital service product'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
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
                      value={productFormData.features}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, features: e.target.value }))}
                      placeholder="List key features separated by commas"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-blue-50/50">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (₹)</Label>
                      <Input
                        id="originalPrice"
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
                        type="number"
                        value={productFormData.discount}
                        readOnly
                        className="bg-green-50 font-semibold text-green-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Main Category</Label>
                      <Select 
                        value={productFormData.category || ""} 
                        onValueChange={(value) => setProductFormData(prev => ({ 
                          ...prev, 
                          category: value,
                          subcategory: undefined // Reset subcategory when category changes
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select main category" />
                        </SelectTrigger>
                        <SelectContent>
                          {mainCategories.map((cat: Category) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select 
                        value={productFormData.subcategory || ""} 
                        onValueChange={(value) => setProductFormData(prev => ({ ...prev, subcategory: value }))}
                        disabled={!productFormData.category || availableSubcategories.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !productFormData.category 
                              ? "First select a category" 
                              : availableSubcategories.length === 0 
                                ? "No subcategories available"
                                : "Select subcategory"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSubcategories.map((subcat: Category) => (
                            <SelectItem key={subcat.id} value={subcat.name}>{subcat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="activationTime">Activation Time</Label>
                      <Input
                        id="activationTime"
                        value={productFormData.activationTime}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, activationTime: e.target.value }))}
                        placeholder="e.g., Instant, 24 Hours"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={productFormData.duration}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 1 Month, 1 Year"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="warranty">Warranty</Label>
                      <Input
                        id="warranty"
                        value={productFormData.warranty}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, warranty: e.target.value }))}
                        placeholder="e.g., 30 Days, Lifetime"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Image Upload</Label>
                    <FileUpload
                      onUploadComplete={(url) => setProductFormData(prev => ({ ...prev, image: url }))}
                      currentImage={productFormData.image}
                      accept="image/*"
                      maxSize={5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={productFormData.notes}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes or terms"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="popular"
                        checked={productFormData.popular}
                        onCheckedChange={(checked) => setProductFormData(prev => ({ ...prev, popular: checked as boolean }))}
                      />
                      <Label htmlFor="popular">Popular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trending"
                        checked={productFormData.trending}
                        onCheckedChange={(checked) => setProductFormData(prev => ({ ...prev, trending: checked as boolean }))}
                      />
                      <Label htmlFor="trending">Trending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="available"
                        checked={productFormData.available}
                        onCheckedChange={(checked) => setProductFormData(prev => ({ ...prev, available: checked as boolean }))}
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
                      {createProductMutation.isPending || updateProductMutation.isPending 
                        ? "Saving..." 
                        : isEditingProduct ? "Update Product" : "Create Product"
                      }
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">User Management</h2>
              <Button onClick={() => openUserDialog()} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {isLoadingUsers ? (
                    <div className="p-8 text-center">Loading users...</div>
                  ) : safeUsers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No users found</div>
                  ) : (
                    safeUsers.map((user: User) => (
                      <div key={user.id} className="p-4 hover:bg-muted/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={user.role === 'admin' ? 'default' : user.role === 'moderator' ? 'secondary' : 'outline'}>
                                  {user.role}
                                </Badge>
                                {!user.isActive && <Badge variant="destructive">Inactive</Badge>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openUserDialog(user)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteUserMutation.mutate(user.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Dialog */}
            <Dialog open={showUserDialog} onOpenChange={(open) => {
              setShowUserDialog(open);
              if (!open) {
                resetUserForm();
              }
            }}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                  <DialogDescription>
                    {selectedUser ? 'Update user information and permissions' : 'Create a new user account'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={userFormData.firstName}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={userFormData.lastName}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={userFormData.role || ""} onValueChange={(value) => setUserFormData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="isActive"
                        checked={userFormData.isActive}
                        onCheckedChange={(checked) => setUserFormData(prev => ({ ...prev, isActive: checked as boolean }))}
                      />
                      <Label htmlFor="isActive">Active Account</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 p-4 border rounded-lg">
                      {availablePermissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={userFormData.permissions.includes(permission)}
                            onCheckedChange={(checked) => {
                              setUserFormData(prev => ({
                                ...prev,
                                permissions: checked 
                                  ? [...prev.permissions, permission]
                                  : prev.permissions.filter(p => p !== permission)
                              }));
                            }}
                          />
                          <Label htmlFor={permission} className="text-sm">
                            {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowUserDialog(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createUserMutation.isPending || updateUserMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {createUserMutation.isPending || updateUserMutation.isPending 
                        ? "Saving..." 
                        : selectedUser ? "Update User" : "Create User"
                      }
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Orders Management</h2>
            <Card>
              <CardContent className="p-6">
                {orders.length === 0 ? (
                  <div className="text-center text-muted-foreground">No orders found</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: Order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{order.productName}</h4>
                            <p className="text-sm text-muted-foreground">Order ID: {order.orderId}</p>
                            <p className="text-sm text-muted-foreground">Price: ₹{order.price}</p>
                          </div>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Reviews Management</h2>
            <Card>
              <CardContent className="p-6">
                {reviews.length === 0 ? (
                  <div className="text-center text-muted-foreground">No reviews found</div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review: Review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{review.title}</h4>
                            <p className="text-sm text-muted-foreground">By: {review.customerName}</p>
                            <p className="text-sm">{review.comment}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">⭐ {review.rating}/5</span>
                            {review.isVerified && <Badge variant="default">Verified</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Categories Management</h2>
            <Card>
              <CardContent className="p-6">
                {safeCategories.length === 0 ? (
                  <div className="text-center text-muted-foreground">No categories found</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {safeCategories.map((category: Category) => (
                      <div key={category.id} className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <i className={category.icon} />
                          <div>
                            <h4 className="font-semibold">{category.name}</h4>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}