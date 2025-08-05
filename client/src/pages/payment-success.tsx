import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Package, Clock, Shield, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";

interface PaymentSuccessProps {
  orderId?: string;
  transactionId?: string;
}

export default function PaymentSuccess() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1] || '');
  const orderId = params.get('order_id');
  const transactionId = params.get('transaction_id');
  const status = params.get('status');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!orderId
  });

  const order = (orders as any)?.find((o: any) => o.orderId === orderId);

  const { data: product } = useQuery({
    queryKey: ['/api/products', order?.productId],
    enabled: !!order?.productId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (status !== 'completed' && status !== 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl text-red-800 dark:text-red-300">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Your payment could not be processed. Please try again or contact support.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/">
                <Button className="w-full">Return to Home</Button>
              </Link>
              <Button variant="outline" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const whatsappMessage = product ? 
    `🎉 *Order Confirmed!*%0A%0A📦 *Product*: ${(product as any).fullProductName}%0A💰 *Price*: ₹${(product as any).price}%0A🆔 *Order ID*: ${orderId}%0A⚡ *Activation*: ${(product as any).activationTime}%0A🛡️ *Warranty*: ${(product as any).warranty}%0A%0AThank you for your purchase! Your product will be activated soon.` : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl text-green-800 dark:text-green-300">Payment Successful!</CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Your order has been confirmed and will be processed shortly.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Order ID:</span>
                <p className="font-mono text-blue-600 dark:text-blue-400">{orderId}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Transaction ID:</span>
                <p className="font-mono text-green-600 dark:text-green-400">{transactionId}</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          {product && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">{(product as any).fullProductName}</h4>
                    <p className="text-sm text-gray-500">{(product as any).subcategory}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">₹{(product as any).price}</p>
                  <Badge variant="secondary">{(product as any).duration}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">
                    <strong>Activation:</strong> {(product as any).activationTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    <strong>Warranty:</strong> {(product as any).warranty}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• You'll receive your product activation details via WhatsApp</li>
              <li>• Your product will be activated within the specified time frame</li>
              <li>• Keep your Order ID for future reference</li>
              <li>• Contact support if you have any questions</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {whatsappMessage && (
              <Button 
                asChild 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <a 
                  href={`https://wa.me/918142528883?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Get Support on WhatsApp
                </a>
              </Button>
            )}
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Important Note */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded p-3">
            <p>🔒 Your payment was processed securely. We never store your payment details.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}