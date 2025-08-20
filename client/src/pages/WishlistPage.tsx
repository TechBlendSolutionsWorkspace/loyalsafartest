import React from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function WishlistPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container-luxury text-center">
          <h1 className="text-4xl font-bold mb-4">Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please login to view your wishlist
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
        <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your wishlist is empty. Add items you love to save them for later.
          </p>
          <Link href="/products">
            <Button className="btn-luxury">Shop Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}