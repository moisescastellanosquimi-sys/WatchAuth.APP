import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import type { User } from '@/types';

const STORAGE_KEY = '@auth_user';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@watchauth.com',
    name: 'Watch Collector',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isPremium: false,
    sellerVerified: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'premium@watchauth.com',
    name: 'Premium Dealer',
    avatar: 'https://i.pravatar.cc/150?img=33',
    isPremium: true,
    sellerType: 'professional',
    sellerVerified: true,
    createdAt: new Date().toISOString(),
  },
];

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('Login attempt:', email);
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
      setUser(foundUser);
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    console.log('Signup attempt:', email, name);
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      isPremium: false,
      sellerVerified: false,
      createdAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const upgradeToPremium = async (tier: 'professional' | 'collector') => {
    if (user) {
      const updatedUser = { ...user, isPremium: true, subscriptionTier: tier };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const setSellerType = async (sellerType: 'professional' | 'private') => {
    if (user) {
      const updatedUser = { ...user, sellerType };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const submitBusinessVerification = async (documents: string[]) => {
    if (user) {
      const updatedUser = { ...user, businessDocuments: documents, sellerVerified: true };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const verifyPrivateSeller = async () => {
    if (user) {
      const updatedUser = { ...user, sellerVerified: true };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    upgradeToPremium,
    setSellerType,
    submitBusinessVerification,
    verifyPrivateSeller,
  };
});
