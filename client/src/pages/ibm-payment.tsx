import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Shield, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { redirectToWhatsApp } from "@/lib/whatsapp";
import { apiRequest } from "@/lib/queryClient";
import { Product, InsertOrder } from "@shared/schema";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function IBMPayment() {
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    holderName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get product ID from URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('product');

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

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const validateCard = (cardNumber: string) => {
    return cardNumber.replace(/\s/g, '').length >= 16;
  };

  const validateExpiry = (expiry: string) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    return regex.test(expiry);
  };

  const validateCVV = (cvv: string) => {
    return cvv.length >= 3;
  };

  const handlePayment = async () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Product not selected",
        variant: "destructive",
      });
      return;
    }

    if (!validateCard(paymentData.cardNumber) || 
        !validateExpiry(paymentData.expiryDate) || 
        !validateCVV(paymentData.cvv) || 
        !paymentData.holderName.trim()) {
      toast({
        title: "Invalid Payment Details",
        description: "Please check your card information",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate IBM Payment Gateway processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const orderId = `MTS${Date.now().toString().slice(-6)}`;
      
      const orderData: InsertOrder = {
        orderId,
        productId: selectedProduct.id,
        productName: selectedProduct.fullProductName,
        price: selectedProduct.price,
        paymentMethod: "IBM Payment Gateway",
        status: "completed",
        whatsappSent: false,
      };

      await orderMutation.mutateAsync(orderData);
      setPaymentComplete(true);

      toast({
        title: "Payment Successful",
        description: "Your order has been processed successfully!",
      });

      // Redirect to WhatsApp after successful payment
      setTimeout(() => {
        redirectToWhatsApp(selectedProduct.fullProductName, orderId);
        setLocation('/');
      }, 2000);

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">No Product Selected</h1>
            <p className="text-muted-foreground mb-8">Please select a product to proceed with payment.</p>
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

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">
              Your order for {selectedProduct.fullProductName} has been processed successfully.
              You will be redirected to WhatsApp for order confirmation.
            </p>
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation('/checkout?product=' + selectedProduct.id)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checkout
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Order Summary
                </CardTitle>
                <CardDescription>Secure IBM Payment Gateway</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <i className={`${selectedProduct.icon} text-primary text-3xl`}></i>
                  <div>
                    <h3 className="font-semibold">{selectedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProduct.subcategory}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{selectedProduct.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Features:</span>
                    <span className="text-blue-600 dark:text-blue-400">{selectedProduct.features}</span>
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
                    <span>Total Amount:</span>
                    <span className="text-primary">₹{selectedProduct.price}</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Activation: {selectedProduct.activationTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Warranty: {selectedProduct.warranty}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Enter your card information to complete the purchase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="holderName">Cardholder Name</Label>
                  <Input
                    id="holderName"
                    placeholder="John Doe"
                    value={paymentData.holderName}
                    onChange={(e) => handleInputChange("holderName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                      handleInputChange("cardNumber", value);
                    }}
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
                        handleInputChange("expiryDate", value);
                      }}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-800 dark:text-blue-200">Secure Payment</p>
                      <p className="text-blue-600 dark:text-blue-300">
                        Your payment is secured by IBM Payment Gateway with 256-bit SSL encryption.
                        Your card details are never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay ₹{selectedProduct.price}
                    </>
                  )}
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  By proceeding, you agree to our terms and conditions.
                  This transaction is processed securely through IBM Payment Gateway.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}