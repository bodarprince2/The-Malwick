"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/app/data/products";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateItemSize,
  clearCart,
  selectCartItems,
  selectCartSubtotal,
  selectCartQuantity,
  selectShippingFee,
  selectDiscountAmount,
  selectCartMrpTotal,
  selectCartTotal
} from "@/app/store/slices/cartSlice";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const totalQuantity = useAppSelector(selectCartQuantity);
  const shippingFee = useAppSelector(selectShippingFee);
  const discountAmount = useAppSelector(selectDiscountAmount);
  const mrpTotal = useAppSelector(selectCartMrpTotal);
  const total = useAppSelector(selectCartTotal);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
      <Header variant="solid" />

      <main className="flex-1 py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <h1 className="font-display text-4xl md:text-5xl font-medium text-[#1a1a1a] mb-12">Your Cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#8a8a8a] mb-6">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h2 className="text-2xl font-display text-[#1a1a1a] mb-4">Your Cart is Empty</h2>
            <p className="text-[#5a5a5a] mb-8">Discover our premium collection and find something you'll love.</p>
            <Link
              href="/shop"
              className="bg-[#1a1a1a] text-[#f8f6f2] px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#b8976a] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items Section */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#1a1a1a]/10 text-xs font-semibold tracking-widest uppercase text-[#8a8a8a]">
                <div className="col-span-12">Cart Items</div>
              </div>

              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-6 p-6 bg-white border border-[#1a1a1a]/5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative w-full md:w-32 h-40 bg-[#eae7e1] shrink-0">
                    <Image
                      src={item.image || products.find(p => p.id === item.productId)?.image || "/logo.png"}
                      alt={item.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="flex flex-col flex-1 justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/product/${item.productId}`} className="font-display text-xl font-medium text-[#1a1a1a] hover:text-[#b8976a] transition-colors">
                          {item.name}
                        </Link>
                        <div className="mt-2 space-y-2">
                          {item.size && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-[#5a5a5a]">Size:</span>
                              <div className="relative">
                                <select
                                  value={item.size}
                                  onChange={(e) => dispatch(updateItemSize({ id: item.id, newSize: e.target.value }))}
                                  className="appearance-none text-xs font-semibold tracking-wider uppercase text-[#1a1a1a] bg-white border border-[#1a1a1a]/20 rounded-none pl-3 pr-8 py-1.5 focus:outline-none focus:border-[#1a1a1a] cursor-pointer hover:border-[#1a1a1a]/40 transition-colors"
                                >
                                  {products.find(p => p.id === item.productId)?.sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#1a1a1a]">
                                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                              </div>
                            </div>
                          )}
                          {item.color && <p className="text-sm text-[#5a5a5a]">Color: <span className="text-[#1a1a1a]">{item.color}</span></p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-[#1a1a1a]">₹ {item.price.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider mt-1">MRP incl. of all taxes</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-6">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#5a5a5a]">Quantity:</span>
                        <div className="flex items-center border border-[#1a1a1a]/20 rounded-full bg-white">
                          <button
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                            className="w-8 h-8 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-l-full transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            className="w-8 h-8 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-r-full transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-[#FF0000] hover:text-red-500 transition-colors flex items-center justify-center p-1"
                        aria-label="Delete item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-sm text-[#8a8a8a] hover:text-[#1a1a1a] underline transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-4">
              <div className="sticky top-32">
                <h3 className="font-display text-lg font-medium text-[#8a8a8a] mb-4 uppercase tracking-widest">Billing Details</h3>

                <div className="bg-white border border-[#1a1a1a]/10 rounded-sm">
                  <div className="flex justify-between items-center p-5 border-b border-[#1a1a1a]/10">
                    <span className="text-[#5a5a5a] font-medium text-base">Cart Total <span className="text-sm font-normal">(Incl. of all taxes)</span></span>
                    <span className="font-bold text-lg text-[#1a1a1a]">₹ {mrpTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center p-5 border-b border-[#1a1a1a]/10 bg-gradient-to-r from-purple-100/40 to-pink-100/40">
                      <span className="text-[#1a1a1a] font-bold text-base">Discount</span>
                      <span className="font-bold text-lg text-[#1a1a1a]">- ₹ {discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-5 border-b border-[#1a1a1a]/10">
                    <span className="text-[#5a5a5a] font-medium text-base">Shipping Charges</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#008763] text-lg">Free</span>
                      <span className="text-[#8a8a8a] line-through text-base">₹ 50.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-5">
                    <span className="text-[#1a1a1a] font-bold text-lg">Total Amount <span className="text-sm font-normal text-[#5a5a5a]">(Incl. of GST)</span></span>
                    <span className="font-bold text-xl text-[#1a1a1a]">₹ {total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full mt-6 bg-[#1a1a1a] text-[#f8f6f2] py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#b8976a] transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
