import React from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container-luxury text-center">
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please login to access the admin panel
          </p>
          <Link href="/login">
            <Button className="btn-luxury">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container-luxury text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You don't have permission to access the admin panel
          </p>
          <Link href="/">
            <Button className="btn-luxury">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-luxury">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Admin functionality coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}