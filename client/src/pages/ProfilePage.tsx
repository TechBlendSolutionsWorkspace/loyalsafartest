import React from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container-luxury text-center">
          <h1 className="text-4xl font-bold mb-4">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please login to view your profile
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
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>
        <div className="max-w-2xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <p className="text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}