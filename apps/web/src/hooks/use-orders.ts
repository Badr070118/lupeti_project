'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Order } from '@/types';
import { orderService } from '@/services/order.service';

export function useOrders(accessToken: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!accessToken) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await orderService.listMine(accessToken);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { orders, loading, refresh };
}
