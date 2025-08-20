import React from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function CheckoutPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container-luxury text-center">
          <h1 className="text-4xl font-bold mb-4">Checkout</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please login to proceed with checkout
          </p>
          <Link href="/login">
            <Button className="btn-luxury">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-luxury">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Checkout functionality coming soon.
          </p>
          <Link href="/cart">
            <Button className="btn-luxury">Back to Cart</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}