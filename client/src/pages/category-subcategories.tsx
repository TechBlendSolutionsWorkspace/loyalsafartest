import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { Product, Category } from "@shared/schema";

interface Subcategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  productCount: number;
}

export default function CategorySubcategories() {
  const [, params] = useRoute("/category/:categorySlug/subcategories");
  const categorySlug = params?.categorySlug || "";
  
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Fetch category info
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Fetch products for this category
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const currentCategory = categories?.find((cat: Category) => cat.slug === categorySlug);
  const categoryProducts = products.filter((product: Product) => product.category === currentCategory?.id);

  // Group products by subcategory
  const subcategories: Subcategory[] = useMemo(() => {
    const subcategoryMap = new Map<string, Subcategory>();
    
    categoryProducts.forEach((product: Product) => {
      const subcategoryName = product.subcategory || "General";
      if (!subcategoryMap.has(subcategoryName)) {
        subcategoryMap.set(subcategoryName, {
          id: subcategoryName.toLowerCase().replace(/\s+/g, '-'),
          name: subcategoryName,
          description: `${subcategoryName} products and services`,
          productCount: 0,
        });
      }
      const subcategory = subcategoryMap.get(subcategoryName)!;
      subcategory.productCount += 1;
    });
    
    return Array.from(subcategoryMap.values());
  }, [categoryProducts]);

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ subcategoryId, file }: { subcategoryId: string; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('subcategoryId', subcategoryId);
      
      const response = await fetch('/api/subcategories/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Subcategory image uploaded successfully",
      });
      setUploadModalOpen(false);
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = () => {
    if (imageFile && selectedSubcategory) {
      uploadImageMutation.mutate({
        subcategoryId: selectedSubcategory,
        file: imageFile,
      });
    }
  };

  const openUploadModal = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setUploadModalOpen(true);
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
            <p className="text-muted-foreground">{currentCategory.description}</p>
            <Badge variant="secondary" className="mt-2">
              {subcategories.length} Subcategories • {categoryProducts.length} Products
            </Badge>
          </div>
        </div>

        {/* Subcategories Grid */}
        {subcategories.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Subcategories Available</h2>
            <p className="text-muted-foreground mb-4">
              This category doesn't have any products yet.
            </p>
            {isAuthenticated && (
              <Link to="/admin">
                <Button>Add Products</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcategory) => (
              <Card key={subcategory.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="relative">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {subcategory.image ? (
                      <img 
                        src={subcategory.image} 
                        alt={subcategory.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <i className={`${currentCategory.icon} text-3xl text-primary mb-2`}></i>
                        <p className="text-sm text-muted-foreground">No image</p>
                      </div>
                    )}
                  </div>
                  
                  {isAuthenticated && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => openUploadModal(subcategory.id)}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {subcategory.productCount} Products
                    </Badge>
                    <Link to={`/category/${categorySlug}/subcategory/${subcategory.id}/products`}>
                      <Button size="sm">
                        View Products
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Subcategory Image</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Select Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            
            {imageFile && (
              <div className="text-sm text-muted-foreground">
                Selected: {imageFile.name}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={handleImageUpload}
                disabled={!imageFile || uploadImageMutation.isPending}
                className="flex-1"
              >
                {uploadImageMutation.isPending ? "Uploading..." : "Upload Image"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setUploadModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}