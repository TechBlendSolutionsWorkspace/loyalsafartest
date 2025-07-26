import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Wallet, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { redirectToWhatsApp } from "@/lib/whatsapp";
import { apiRequest } from "@/lib/queryClient";
import { Product, InsertOrder } from "@shared/schema";

interface CheckoutModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setShowQR(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    const orderId = `MTS${Date.now().toString().slice(-6)}`;
    
    try {
      const orderData: InsertOrder = {
        orderId,
        productId: product.id,
        productName: product.name,
        price: product.price,
        paymentMethod: selectedPaymentMethod,
        status: "pending",
        whatsappSent: false,
      };

      await orderMutation.mutateAsync(orderData);

      // Redirect to WhatsApp
      redirectToWhatsApp(product.name, orderId);

      toast({
        title: "Order Created",
        description: "Redirecting to WhatsApp for confirmation...",
      });

      onClose();
      setSelectedPaymentMethod("");
      setShowQR(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedPaymentMethod("");
    setShowQR(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Details */}
          <div className="flex items-center p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <div className="font-semibold">{product.name}</div>
              <div className="text-2xl font-bold text-primary">₹{product.price}</div>
              <div className="text-sm text-muted-foreground">
                Order ID: MTS{Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Choose Payment Method:</h4>
            
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
            <div className="text-center">
              <div className="bg-muted p-6 rounded-lg">
                <div className="w-32 h-32 bg-background border-2 border-border mx-auto mb-4 flex items-center justify-center rounded">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">Scan QR code to pay</p>
                <p className="font-bold text-lg">₹{product.price}</p>
                <p className="text-xs text-muted-foreground">Or pay manually to: +91 74960 67495</p>
              </div>
            </div>
          )}

          <Button 
            onClick={handleConfirmPayment}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            disabled={orderMutation.isPending}
          >
            {orderMutation.isPending ? "Processing..." : "I've Paid - Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
