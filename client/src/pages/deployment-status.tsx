import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Database, Globe, Settings, RefreshCw } from "lucide-react";

export default function DeploymentStatus() {
  const { data: healthData, isLoading, refetch } = useQuery({
    queryKey: ['/api/health'],
    refetchInterval: 10000, // Check every 10 seconds
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const getStatusColor = (status: string) => {
    return status === 'healthy' ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusIcon = (status: string) => {
    return status === 'healthy' ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Deployment Status Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time status of your MTS Digital Services deployment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Health Status Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                getStatusIcon(healthData?.status || 'unknown')
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? 'Checking...' : healthData?.status || 'Unknown'}
              </div>
              <p className="text-xs text-muted-foreground">
                Environment: {healthData?.environment || 'Unknown'}
              </p>
            </CardContent>
          </Card>

          {/* Categories Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categoriesLoading ? 'Loading...' : (categories?.length || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Product categories loaded
              </p>
            </CardContent>
          </Card>

          {/* Products Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {productsLoading ? 'Loading...' : (products?.length || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Digital products available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Deployment Details
            </CardTitle>
            <CardDescription>
              Comprehensive system status and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* API Endpoints Status */}
            <div>
              <h3 className="font-semibold mb-2">API Endpoints</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Badge variant={categories ? "default" : "destructive"}>
                  /api/categories: {categories ? "✅ Working" : "❌ Failed"}
                </Badge>
                <Badge variant={products ? "default" : "destructive"}>
                  /api/products: {products ? "✅ Working" : "❌ Failed"}
                </Badge>
                <Badge variant={healthData ? "default" : "destructive"}>
                  /api/health: {healthData ? "✅ Working" : "❌ Failed"}
                </Badge>
              </div>
            </div>

            {/* Database Status */}
            {healthData && (
              <div>
                <h3 className="font-semibold mb-2">Database Status</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p>Categories in DB: <strong>{healthData.categoriesCount || 0}</strong></p>
                  <p>Products in DB: <strong>{healthData.productsCount || 0}</strong></p>
                  <p>Environment: <strong>{healthData.environment}</strong></p>
                </div>
              </div>
            )}

            {/* Sample Categories */}
            {categories && categories.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Sample Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category: any) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                  {categories.length > 6 && (
                    <Badge variant="secondary">
                      +{categories.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>

        {/* Deployment Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🔧 Deployment Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">If categories/products are not showing in live deployment:</h4>
              <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
                <li>Clear browser cache: <code>Ctrl+Shift+R</code> (Windows) or <code>Cmd+Shift+R</code> (Mac)</li>
                <li>Try incognito/private browsing mode</li>
                <li>Check this status page on the live deployment</li>
                <li>Verify database environment variables are set in production</li>
                <li>Ensure the deployment includes the latest build</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}