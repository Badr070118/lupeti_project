'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Order } from '@/types';
import { orderService } from '@/services/order.service';

export function useOrders(accessToken: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedToken, setResolvedToken] = useState<string | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    if (!accessToken) {
      setOrders([]);
      setResolvedToken(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await orderService.listMine(accessToken);
      setOrders(data);
    } finally {
      setResolvedToken(accessToken);
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    let active = true;
    const request = accessToken ? orderService.listMine(accessToken) : Promise.resolve([]);
    request.then((data) => { if (active) setOrders(data); })
      .catch(() => { if (active) setOrders([]); })
      .finally(() => { if (active) { setResolvedToken(accessToken); setLoading(false); } });
    return () => { active = false; };
  }, [accessToken]);

  return { orders: resolvedToken === accessToken ? orders : [], loading: loading || resolvedToken !== accessToken, refresh };
}
