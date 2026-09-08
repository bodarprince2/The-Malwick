'use client';

import { useEffect, useState } from 'react';

type PreOrder = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  items: any[];
  total: number;
  mrpTotal: number;
  discountAmount: number;
  status: string;
  createdAt: string;
};

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/pre-orders');
        const data = await response.json();
        if (data.success) {
          setOrders(data.preOrders);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-8 md:p-12 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#b8976a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-display text-2xl font-medium text-[#1a1a1a]">Pre-Registration Orders</h2>
          <p className="text-sm text-[#5a5a5a] mt-1">Showing all waitlisted customers and their reserved items.</p>
        </div>
        <div className="text-sm font-semibold tracking-widest uppercase text-[#8a8a8a] bg-white px-4 py-2 border border-[#1a1a1a]/10 rounded-sm shadow-sm">
          Total: <span className="text-[#1a1a1a] font-bold">{orders.length}</span>
        </div>
      </div>

      <div className="bg-white border border-[#1a1a1a]/10 shadow-sm overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1a1a1a]/10 bg-[#f8f6f2]/50 text-xs font-semibold tracking-widest uppercase text-[#8a8a8a]">
                <th className="p-4 md:p-6 font-medium">Customer</th>
                <th className="p-4 md:p-6 font-medium">Contact</th>
                <th className="p-4 md:p-6 font-medium">Reserved Items</th>
                <th className="p-4 md:p-6 font-medium text-right">Value</th>
                <th className="p-4 md:p-6 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#5a5a5a]">
                    No pre-registration orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#f8f6f2]/30 transition-colors">
                    <td className="p-4 md:p-6 align-top">
                      <p className="text-sm font-bold text-[#1a1a1a]">{order.firstName} {order.lastName}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-[#1a1a1a]/5 text-[#1a1a1a] text-[10px] font-bold tracking-widest uppercase rounded-sm border border-[#1a1a1a]/10">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 md:p-6 align-top space-y-1">
                      <p className="text-sm text-[#1a1a1a]">{order.email}</p>
                      <p className="text-xs text-[#8a8a8a]">{order.phone}</p>
                    </td>
                    <td className="p-4 md:p-6 align-top">
                      <div className="flex flex-col gap-3">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-10 h-14 bg-[#eae7e1] relative shrink-0">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="text-sm font-medium text-[#1a1a1a] line-clamp-1">{item.name}</p>
                              <p className="text-xs text-[#8a8a8a] mt-0.5">
                                Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 md:p-6 align-top text-right whitespace-nowrap">
                      <p className="text-sm font-bold text-[#1a1a1a]">₹ {order.total.toLocaleString("en-IN")}</p>
                    </td>
                    <td className="p-4 md:p-6 align-top whitespace-nowrap">
                      <p className="text-sm text-[#5a5a5a]">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-[#8a8a8a] mt-1">
                        {new Date(order.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
