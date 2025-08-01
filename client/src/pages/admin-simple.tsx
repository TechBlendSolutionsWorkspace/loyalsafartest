import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, ShoppingCart, Eye, Star, DollarSign, Package } from "lucide-react";

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("30");
  
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  // Mock data for demo - would be replaced with real API calls
  const mockOrders = [
    { id: '1', orderId: 'ORD001', productName: 'Netflix Premium - 1 Month', price: 149, status: 'completed', paymentMethod: 'UPI', createdAt: new Date().toISOString() },
    { id: '2', orderId: 'ORD002', productName: 'Surfshark VPN - 6 Months', price: 899, status: 'completed', paymentMethod: 'Card', createdAt: new Date().toISOString() },
    { id: '3', orderId: 'ORD003', productName: 'Disney+ Hotstar - 3 Months', price: 299, status: 'pending', paymentMethod: 'UPI', createdAt: new Date().toISOString() },
  ];

  const mockReviews = [
    { id: '1', productId: '1', rating: 5, comment: 'Great service!', customerName: 'John Doe' },
    { id: '2', productId: '2', rating: 4, comment: 'Good quality', customerName: 'Jane Smith' },
    { id: '3', productId: '3', rating: 5, comment: 'Excellent!', customerName: 'Mike Johnson' },
  ];

  const orders = mockOrders;
  const reviews = mockReviews;

  // Calculate stats from existing data
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.price, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Get recent orders
  const recentOrders = orders
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Get popular products
  const productStats = products.reduce((acc: any, product: any) => {
    const productOrders = orders.filter((order: any) => order.productId === product.id);
    acc[product.id] = {
      ...product,
      orderCount: productOrders.length,
      revenue: productOrders.reduce((sum: number, order: any) => sum + order.price, 0)
    };
    return acc;
  }, {});

  const topProducts = Object.values(productStats)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor your business performance and analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From {totalOrders} orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">From {totalReviews} reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="overview" className="px-2 sm:px-4">Overview</TabsTrigger>
            <TabsTrigger value="products" className="px-2 sm:px-4">Products</TabsTrigger>
            <TabsTrigger value="orders" className="px-2 sm:px-4">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Best performing products by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 md:space-y-4">
                    {topProducts.map((product: any, index) => (
                      <div key={product.id} className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs md:text-sm truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.orderCount} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm md:text-base">₹{product.revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Order #{order.orderId.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{order.productName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{order.price}</p>
                          <Badge variant="outline" className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 10).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold">₹{product.price}</p>
                          <p className="text-sm text-muted-foreground">{product.discount}% off</p>
                        </div>
                        <div className="flex space-x-2">
                          {product.popular && <Badge className="bg-orange-500">Popular</Badge>}
                          {product.trending && <Badge className="bg-blue-500">Trending</Badge>}
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 20).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">Order #{order.orderId}</p>
                          <p className="text-sm text-muted-foreground">{order.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold">₹{order.price}</p>
                          <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                        </div>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}