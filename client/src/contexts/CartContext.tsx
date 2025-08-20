import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
// import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  quantity: number;
  customizations: Record<string, any>;
  productId: string;
  productName: string;
  productSlug: string;
  productPrice: string;
  productImages: string[];
  productStock: number;
  createdAt: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addToCart: (productId: string, quantity?: number, customizations?: Record<string, any>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  // const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch cart items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!token) return [];
      
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      return response.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1, customizations = {} }: {
      productId: string;
      quantity?: number;
      customizations?: Record<string, any>;
    }) => {
      if (!token) {
        throw new Error('Please login to add items to cart');
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity, customizations }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log('Added to cart successfully');
    },
    onError: (error: Error) => {
      console.error('Error adding to cart:', error.message);
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!token) {
        throw new Error('Please login to update cart');
      }

      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      console.error('Error updating cart:', error.message);
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!token) {
        throw new Error('Please login to remove items from cart');
      }

      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log('Removed from cart successfully');
    },
    onError: (error: Error) => {
      console.error('Error removing from cart:', error.message);
    },
  });

  // Calculate totals
  const itemCount = items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  const totalPrice = items.reduce((total: number, item: CartItem) => {
    return total + parseFloat(item.productPrice) * item.quantity;
  }, 0);

  const addToCart = async (productId: string, quantity = 1, customizations = {}) => {
    await addToCartMutation.mutateAsync({ productId, quantity, customizations });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ itemId, quantity });
  };

  const removeFromCart = async (itemId: string) => {
    await removeFromCartMutation.mutateAsync(itemId);
  };

  const clearCart = async () => {
    // Remove all items from cart
    for (const item of items) {
      await removeFromCartMutation.mutateAsync(item.id);
    }
  };

  const value = {
    items,
    itemCount,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading: isLoading || addToCartMutation.isPending || updateQuantityMutation.isPending || removeFromCartMutation.isPending,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};