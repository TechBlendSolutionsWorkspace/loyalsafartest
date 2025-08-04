import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Save, Eye, ImageIcon } from "lucide-react";
import type { Category } from "@shared/schema";

export default function AdminBannerManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [bannerForm, setBannerForm] = useState({
    bannerImage: "",
    bannerTitle: "",
    bannerSubtitle: "",
  });

  const updateBannerMutation = useMutation({
    mutationFn: async (data: { categoryId: string; bannerData: any }) => {
      const response = await apiRequest("PUT", `/api/categories/${data.categoryId}`, data.bannerData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category banner updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update banner",
        variant: "destructive",
      });
    },
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setBannerForm({
        bannerImage: category.bannerImage || "",
        bannerTitle: category.bannerTitle || "",
        bannerSubtitle: category.bannerSubtitle || "",
      });
    }
  };

  const handleSaveBanner = () => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category first",
        variant: "destructive",
      });
      return;
    }

    updateBannerMutation.mutate({
      categoryId: selectedCategory,
      bannerData: bannerForm,
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Category Banner Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage category page banners (Recommended size: 1200x675px - 16:9 aspect ratio)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Selection & Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Select Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => handleCategorySelect(category.id)}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <i className={`${category.icon} text-xl`}></i>
                    <span className="text-sm font-medium">{category.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Banner Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bannerImage" className="text-sm font-medium">
                    Banner Image URL
                  </Label>
                  <Input
                    id="bannerImage"
                    value={bannerForm.bannerImage}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, bannerImage: e.target.value }))}
                    placeholder="https://example.com/banner.jpg"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 1200x675px (16:9 ratio) for best results
                  </p>
                </div>

                <div>
                  <Label htmlFor="bannerTitle" className="text-sm font-medium">
                    Banner Title
                  </Label>
                  <Input
                    id="bannerTitle"
                    value={bannerForm.bannerTitle}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, bannerTitle: e.target.value }))}
                    placeholder="Enter banner title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bannerSubtitle" className="text-sm font-medium">
                    Banner Subtitle
                  </Label>
                  <Textarea
                    id="bannerSubtitle"
                    value={bannerForm.bannerSubtitle}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, bannerSubtitle: e.target.value }))}
                    placeholder="Enter banner subtitle/description"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSaveBanner}
                  disabled={updateBannerMutation.isPending}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateBannerMutation.isPending ? "Saving..." : "Save Banner"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Banner Preview */}
        <div className="space-y-6">
          {selectedCategory && selectedCategoryData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Banner Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {bannerForm.bannerImage ? (
                    <div
                      className="relative h-64 bg-cover bg-center"
                      style={{ backgroundImage: `url(${bannerForm.bannerImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col justify-center px-8">
                        {bannerForm.bannerTitle && (
                          <h1 className="text-3xl font-bold text-white mb-2">
                            {bannerForm.bannerTitle}
                          </h1>
                        )}
                        {bannerForm.bannerSubtitle && (
                          <p className="text-lg text-gray-200">
                            {bannerForm.bannerSubtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Add banner image URL to see preview</p>
                        <p className="text-sm mt-2">Recommended: 1200x675px (16:9 ratio)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Banner Specs */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    Banner Specifications
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• <strong>Aspect Ratio:</strong> 16:9 (recommended)</li>
                    <li>• <strong>Recommended Size:</strong> 1200x675px</li>
                    <li>• <strong>Minimum Size:</strong> 800x450px</li>
                    <li>• <strong>Format:</strong> JPG, PNG, WebP</li>
                    <li>• <strong>File Size:</strong> Under 500KB for best performance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Banners Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Current Category Banners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <i className={`${category.icon} text-lg`}></i>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {category.bannerImage ? (
                        <span className="text-green-600 text-sm">✓ Has Banner</span>
                      ) : (
                        <span className="text-gray-400 text-sm">No Banner</span>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}