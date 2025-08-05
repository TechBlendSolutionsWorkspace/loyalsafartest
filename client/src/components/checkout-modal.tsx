import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Mail, User, Package, Clock, Shield, Phone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Product {
  id: string;
  name: string;
  fullProductName: string;
  price: number;
  originalPrice: number;
  discount: number;
  activationTime: string;
  warranty: string;
  duration: string;
  subcategory: string;
}

interface CheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentData {
  productId: string;
  customerEmail: string;
  customerName: string;
}

export default function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const { toast } = useToast();

  const createPaymentMutation = useMutation({
    mutationFn: async (data: PaymentData) => {
      return apiRequest('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (response: any) => {
      if (response.success && response.paymentUrl) {
        // Redirect to IMB payment gateway
        window.location.href = response.paymentUrl;
      } else {
        toast({
          title: "Payment Error",
          description: response.message || "Failed to create payment",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('Payment creation error:', error);
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    if (!product) return;

    if (!customerName.trim() || !customerEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!customerEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    createPaymentMutation.mutate({
      productId: product.id,
      customerEmail: customerEmail.trim(),
      customerName: customerName.trim(),
    });
  };

  if (!product) return null;

  const savings = product.originalPrice - product.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Purchase
          </DialogTitle>
          <DialogDescription>
            Secure checkout powered by IMB Payment Gateway
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">{product.fullProductName}</h3>
                  <p className="text-sm text-gray-500">{product.subcategory}</p>
                </div>
              </div>
              <Badge variant="secondary">{product.duration}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm">
                  <strong>Activation:</strong> {product.activationTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <strong>Warranty:</strong> {product.warranty}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                  {savings > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                      <Badge variant="destructive" className="text-xs">
                        Save ₹{savings}
                      </Badge>
                    </>
                  )}
                </div>
                {product.discount > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    {product.discount}% OFF Limited Time
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="customerName"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter your email address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Security Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              🔒 Secure Payment Processing
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 256-bit SSL encryption protects your data</li>
              <li>• Processed through secure IMB Payment Gateway</li>
              <li>• We never store your payment information</li>
              <li>• Instant activation upon successful payment</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handlePayment}
              disabled={createPaymentMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
            >
              {createPaymentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{product.price} Securely
                </>
              )}
            </Button>
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1 h-12"
              disabled={createPaymentMutation.isPending}
            >
              Cancel
            </Button>
          </div>

          {/* Support Contact */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Need help?</p>
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="text-blue-600 hover:text-blue-700"
            >
              <a 
                href="https://wa.me/918142528883?text=I%20need%20help%20with%20my%20purchase"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Phone className="h-3 w-3" />
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}