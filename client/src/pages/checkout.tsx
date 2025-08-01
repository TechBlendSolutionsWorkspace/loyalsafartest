import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Smartphone, Wallet, CreditCard, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { redirectToWhatsApp } from "@/lib/whatsapp";
import { apiRequest } from "@/lib/queryClient";
import { Product, InsertOrder } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get product ID from URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('product');

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: product } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    }
  }, [product]);

  const orderMutation = useMutation({
    mutationFn: async (orderData: InsertOrder) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI Payment",
      description: "Pay using any UPI app",
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      id: "gpay",
      name: "Google Pay",
      description: "Quick payment with Google Pay",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "paytm",
      name: "Paytm",
      description: "Pay with Paytm wallet",
      icon: <Wallet className="h-5 w-5" />,
    },
  ];

  const handleProductChange = (productId: string) => {
    const newProduct = products.find(p => p.id === productId);
    if (newProduct) {
      setSelectedProduct(newProduct);
      // Update URL without page reload
      window.history.replaceState(null, '', `/checkout?product=${productId}`);
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setShowQR(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedProduct || !selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please select a product and payment method",
        variant: "destructive",
      });
      return;
    }

    const orderId = `MTS${Date.now().toString().slice(-6)}`;
    
    try {
      const orderData: InsertOrder = {
        orderId,
        productId: selectedProduct.id,
        productName: selectedProduct.fullProductName,
        price: selectedProduct.price,
        paymentMethod: selectedPaymentMethod,
        status: "pending",
        whatsappSent: false,
      };

      await orderMutation.mutateAsync(orderData);

      // Redirect to WhatsApp
      redirectToWhatsApp(selectedProduct.fullProductName, orderId);

      toast({
        title: "Order Created",
        description: "Redirecting to WhatsApp for confirmation...",
      });

      // Redirect back to home after a delay
      setTimeout(() => {
        setLocation('/');
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get products grouped by subcategory for duration selection
  const getProductsBySubcategory = (subcategory: string) => {
    return products.filter(p => p.subcategory === subcategory);
  };

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">No Product Selected</h1>
            <p className="text-muted-foreground mb-8">Please select a product from our catalog to proceed with checkout.</p>
            <Button onClick={() => setLocation('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = getProductsBySubcategory(selectedProduct.subcategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Selection */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your order for premium digital services</p>
            </div>

            {/* Product Details Card */}
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-center mb-4">
                <i className={`${selectedProduct.icon} text-primary text-3xl mr-4`}></i>
                <div>
                  <h2 className="text-xl font-semibold">{selectedProduct.name}</h2>
                  <p className="text-muted-foreground">{selectedProduct.subcategory}</p>
                </div>
              </div>
              
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Features: </span>
                  <span className="text-blue-600 dark:text-blue-400">{selectedProduct.features}</span>
                </div>
                <div>
                  <span className="font-semibold">Duration: </span>
                  <span>{selectedProduct.duration}</span>
                </div>
                <div>
                  <span className="font-semibold">Activation: </span>
                  <span>{selectedProduct.activationTime}</span>
                </div>
                <div>
                  <span className="font-semibold">Warranty: </span>
                  <span>{selectedProduct.warranty}</span>
                </div>
                {selectedProduct.notes && (
                  <div>
                    <span className="font-semibold">Note: </span>
                    <span className="text-amber-600 dark:text-amber-400">{selectedProduct.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Duration Selection */}
            {relatedProducts.length > 1 && (
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="font-semibold mb-3">Select Duration</h3>
                <Select value={selectedProduct.id} onValueChange={handleProductChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {relatedProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{product.duration}</span>
                          <span className="ml-4 font-semibold">₹{product.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price Summary */}
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span>{selectedProduct.fullProductName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Original Price:</span>
                  <span className="line-through text-muted-foreground">₹{selectedProduct.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="text-green-600">-{selectedProduct.discount}%</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">₹{selectedProduct.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-semibold mb-4">Choose Payment Method</h3>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                    }`}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                  >
                    <div className="flex items-center">
                      <div className="text-primary mr-3">{method.icon}</div>
                      <div>
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* QR Code Section */}
              {showQR && (
                <div className="mt-6 text-center">
                  <div className="bg-muted p-6 rounded-lg">
                    <div className="w-32 h-32 bg-background border-2 border-border mx-auto mb-4 flex items-center justify-center rounded">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Scan QR code to pay</p>
                    <p className="font-bold text-lg">₹{selectedProduct.price}</p>
                    <p className="text-xs text-muted-foreground">Or pay manually to: +91 74960 67495</p>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleConfirmPayment}
                className="w-full mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                disabled={orderMutation.isPending || !selectedPaymentMethod}
              >
                {orderMutation.isPending ? "Processing..." : "I've Paid - Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}