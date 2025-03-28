import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase';
import { Food, Order, AdminSettings } from '../types';

export const useFoods = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firebaseService.subscribeToFoods(
      (foods) => {
        setFoods(foods);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { foods, loading, error };
};

export const useUserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firebaseService.subscribeToUserOrders(
      (orders) => {
        setOrders(orders);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { orders, loading, error };
};

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firebaseService.subscribeToAdminSettings(
      (settings) => {
        setSettings(settings);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { settings, loading, error };
}; 