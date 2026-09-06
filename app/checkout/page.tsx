"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/app/data/products";
import { useAppSelector } from "@/app/store/hooks";
import {
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
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

const formSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().refine((val) => isValidPhoneNumber(val, "IN"), {
    message: "Please enter a valid Indian phone number.",
  }),
});

export default function CheckoutPage() {
  const router = useRouter();
  
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const totalQuantity = useAppSelector(selectCartQuantity);
  const shippingFee = useAppSelector(selectShippingFee);
  const discountAmount = useAppSelector(selectDiscountAmount);
  const mrpTotal = useAppSelector(selectCartMrpTotal);
  const total = useAppSelector(selectCartTotal);

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (!mounted || items.length === 0) return null;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      formSchema.parse(formData);
      setFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: any = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const isComingSoon = items.some(item => item.status === 'coming_soon');

  if (isComingSoon) {
    const comingSoonItem = items.find(item => item.status === 'coming_soon') || items[0];
    
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
        <Header variant="solid" />

        <main className="flex-1 py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-medium text-[#1a1a1a] mb-4">Coming Soon</h1>
            <p className="text-lg text-[#5a5a5a]">Be the first to know when this product is available.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto">
            {/* Left Column: Product Preview */}
            <div className="flex flex-col">
              <div className="relative aspect-[3/4] w-full bg-[#eae7e1] border border-[#1a1a1a]/5 overflow-hidden mb-8">
                <Image
                  src={comingSoonItem.image || products.find(p => p.id === comingSoonItem.productId)?.image || "/logo.png"}
                  alt={comingSoonItem.name}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-[#1a1a1a] text-[#f8f6f2] text-xs font-bold tracking-widest uppercase shadow-sm">
                  Coming Soon
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-3xl font-medium text-[#1a1a1a] leading-tight">{comingSoonItem.name}</h2>
                
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="font-medium text-2xl text-[#1a1a1a]">₹ {(comingSoonItem.originalPrice || comingSoonItem.price).toLocaleString("en-IN")}</span>
                </div>
                <p className="text-[10px] text-[#8a8a8a] uppercase tracking-wider mb-6">MRP incl. of all taxes</p>

                <div className="flex flex-wrap gap-x-8 gap-y-4 py-6 border-t border-[#1a1a1a]/10">
                  {comingSoonItem.size && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8a8a8a]">Size</span>
                      <span className="text-base font-medium text-[#1a1a1a]">{comingSoonItem.size}</span>
                    </div>
                  )}
                  {comingSoonItem.color && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8a8a8a]">Color</span>
                      <span className="text-base font-medium text-[#1a1a1a]">{comingSoonItem.color}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8a8a8a]">Quantity</span>
                    <span className="text-base font-medium text-[#1a1a1a]">{comingSoonItem.quantity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Notify Form */}
            <div className="flex flex-col">
              <div className="bg-white p-8 md:p-12 border border-[#1a1a1a]/5 shadow-sm sticky top-32">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 bg-[#008763]/10 text-[#008763] rounded-full flex items-center justify-center mb-8">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h3 className="font-display text-3xl font-medium text-[#1a1a1a] mb-4">You're on the list!</h3>
                    <p className="text-[#5a5a5a] text-lg leading-relaxed mb-10">
                      We'll notify you as soon as this product becomes available.<br/>Thank you for your interest.
                    </p>
                    <Link href="/shop" className="text-sm font-semibold tracking-widest uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:text-[#b8976a] hover:border-[#b8976a] transition-all">
                      Discover More Products
                    </Link>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-2xl font-medium text-[#1a1a1a] mb-8 uppercase tracking-wide">Get Notified</h2>
                    <form onSubmit={handleNotifySubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">First Name</label>
                          <input 
                            type="text" 
                            id="firstName" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className={`w-full bg-[#f8f6f2] border ${formErrors.firstName ? 'border-red-500' : 'border-[#1a1a1a]/10'} px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors`} 
                            placeholder="Enter your first name" 
                          />
                          {formErrors.firstName && <p className="text-red-500 text-xs mt-2">{formErrors.firstName}</p>}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">Last Name</label>
                          <input 
                            type="text" 
                            id="lastName" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className={`w-full bg-[#f8f6f2] border ${formErrors.lastName ? 'border-red-500' : 'border-[#1a1a1a]/10'} px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors`} 
                            placeholder="Enter your last name" 
                          />
                          {formErrors.lastName && <p className="text-red-500 text-xs mt-2">{formErrors.lastName}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`w-full bg-[#f8f6f2] border ${formErrors.email ? 'border-red-500' : 'border-[#1a1a1a]/10'} px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors`} 
                          placeholder="Enter your email address" 
                        />
                        {formErrors.email && <p className="text-red-500 text-xs mt-2">{formErrors.email}</p>}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={`w-full bg-[#f8f6f2] border ${formErrors.phone ? 'border-red-500' : 'border-[#1a1a1a]/10'} px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors`} 
                          placeholder="+91 XXXXX XXXXX" 
                        />
                        {formErrors.phone && <p className="text-red-500 text-xs mt-2">{formErrors.phone}</p>}
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 text-sm font-semibold tracking-widest uppercase transition-all mt-4 ${
                          isSubmitting 
                            ? "bg-[#1a1a1a]/70 text-[#f8f6f2] cursor-not-allowed" 
                            : "bg-[#1a1a1a] text-[#f8f6f2] hover:bg-[#b8976a]"
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "Notify Me When Available"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
      <Header variant="solid" />

      <main className="flex-1 py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-12">
          <Link href="/cart" className="hover:text-[#1a1a1a] transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">Checkout</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-medium text-[#1a1a1a] mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-col-reverse lg:flex-row">
          {/* Checkout Form Section (Placeholder for now) */}
          <div className="lg:col-span-7 flex flex-col gap-12 order-2 lg:order-1">
            <div className="bg-white p-8 border border-[#1a1a1a]/5 shadow-sm">
              <h2 className="font-display text-2xl font-medium text-[#1a1a1a] mb-6">Selected Products</h2>
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 border border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30 transition-colors">
                    <div className="relative w-full sm:w-28 h-36 bg-[#eae7e1] shrink-0">
                      <Image
                        src={item.image || products.find(p => p.id === item.productId)?.image || "/logo.png"}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#1a1a1a] text-[#f8f6f2] rounded-full flex items-center justify-center text-xs font-medium shadow-sm">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-display text-xl font-medium text-[#1a1a1a]">{item.name}</h4>
                        <div className="mt-2 flex gap-4">
                          {item.size && <p className="text-sm text-[#5a5a5a]">Size: <span className="text-[#1a1a1a]">{item.size}</span></p>}
                          {item.color && <p className="text-sm text-[#5a5a5a]">Color: <span className="text-[#1a1a1a]">{item.color}</span></p>}
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex justify-between items-end">
                        <p className="text-sm text-[#5a5a5a]">₹ {item.price.toLocaleString("en-IN")} each</p>
                        <p className="text-lg font-medium text-[#1a1a1a]">₹ {(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 border border-[#1a1a1a]/5 shadow-sm">
              <h2 className="font-display text-2xl font-medium text-[#1a1a1a] mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">Email Address</label>
                  <input type="email" id="email" className="w-full bg-[#f8f6f2] border border-[#1a1a1a]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#b8976a] transition-colors" placeholder="Enter your email" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border border-[#1a1a1a]/5 shadow-sm">
              <h2 className="font-display text-2xl font-medium text-[#1a1a1a] mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">First Name</label>
                    <input type="text" id="firstName" className="w-full bg-[#f8f6f2] border border-[#1a1a1a]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#b8976a] transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">Last Name</label>
                    <input type="text" id="lastName" className="w-full bg-[#f8f6f2] border border-[#1a1a1a]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#b8976a] transition-colors" />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">Address</label>
                  <input type="text" id="address" className="w-full bg-[#f8f6f2] border border-[#1a1a1a]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#b8976a] transition-colors" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border border-[#1a1a1a]/5 shadow-sm">
              <h2 className="font-display text-2xl font-medium text-[#1a1a1a] mb-6">Payment</h2>
              <div className="p-4 bg-[#f8f6f2] border border-[#1a1a1a]/10 text-center text-sm text-[#5a5a5a]">
                Payment gateway integration will go here.
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white p-8 border border-[#1a1a1a]/10 sticky top-32 shadow-sm">
              <h3 className="font-display text-2xl font-medium text-[#1a1a1a] mb-6">Order Summary</h3>
              
              <div className="pb-2">
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
              </div>
              
              <button 
                className="w-full bg-[#1a1a1a] text-[#f8f6f2] py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#b8976a] transition-all"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
