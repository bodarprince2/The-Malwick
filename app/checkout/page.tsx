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
  const mrpTotal = useAppSelector(selectCartMrpTotal);
  const discountAmount = useAppSelector(selectDiscountAmount);
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

  const handleNotifySubmit = async (e: React.FormEvent) => {
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
    
    try {
      const response = await fetch('/api/pre-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items,
          total,
          mrpTotal,
          discountAmount
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit pre-registration');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an issue processing your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2]">
      <Header variant="solid" />

      <main className="flex-1 py-12 md:py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Title */}
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-8">
          <Link href="/cart" className="hover:text-[#1a1a1a] transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">Checkout</span>
        </div>

        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-medium text-[#1a1a1a] mb-3">Pre-Registration</h1>
          <p className="text-lg text-[#5a5a5a] max-w-xl">This collection is dropping soon. Secure your place in line by pre-registering below. No payment required today.</p>
        </div>

        {/* Unified Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Order summary */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-6">
            <h2 className="font-display text-2xl font-medium text-[#1a1a1a]">Your Order</h2>
            
            {/* Products Card */}
            <div className="bg-white border border-[#1a1a1a]/10 p-6 md:p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-5 border-b border-[#1a1a1a]/5 pb-6 last:border-0 last:pb-0">
                    <div className="relative w-24 h-32 bg-[#eae7e1] shrink-0 border border-[#1a1a1a]/5">
                      <Image
                        src={item.image || products.find(p => p.id === item.productId)?.image || "/logo.png"}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#1a1a1a] text-[#f8f6f2] rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-display text-lg font-medium text-[#1a1a1a] truncate mb-2">{item.name}</h4>
                        {item.size && (
                          <div className="inline-flex items-center bg-[#f8f6f2] px-2 py-0.5 border border-[#1a1a1a]/10 rounded-sm">
                            <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-widest mr-2">Size</span>
                            <span className="text-xs font-bold text-[#1a1a1a]">{item.size}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-baseline mt-3 gap-2">
                        <p className="text-xs text-[#8a8a8a] whitespace-nowrap">₹ {item.price.toLocaleString("en-IN")} each</p>
                        <p className="text-base font-bold text-[#1a1a1a] whitespace-nowrap shrink-0">₹ {(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Details */}
            <div className="bg-white border border-[#1a1a1a]/10 rounded-sm shadow-sm">
              <div className="flex justify-between items-start sm:items-center p-5 md:p-6 border-b border-[#1a1a1a]/10 gap-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-[#5a5a5a] font-medium text-base">Cart Total</span>
                  <span className="text-xs font-normal text-[#8a8a8a]">(Incl. of all taxes)</span>
                </div>
                <span className="font-bold text-lg text-[#1a1a1a] whitespace-nowrap shrink-0">₹ {mrpTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center p-5 md:p-6 border-b border-[#1a1a1a]/10 bg-gradient-to-r from-purple-100/40 to-pink-100/40 gap-2">
                  <span className="text-[#1a1a1a] font-bold text-base whitespace-nowrap">Discount</span>
                  <span className="font-bold text-lg text-[#1a1a1a] whitespace-nowrap shrink-0">- ₹ {discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between items-center p-5 md:p-6 border-b border-[#1a1a1a]/10 gap-2">
                <span className="text-[#5a5a5a] font-medium text-base whitespace-nowrap">Shipping Charges</span>
                <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                  <span className="font-bold text-[#008763] text-lg">Free</span>
                  <span className="text-[#8a8a8a] line-through text-xs">₹ 50.00</span>
                </div>
              </div>
              
              <div className="flex justify-between items-start sm:items-center p-5 md:p-6 gap-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-[#1a1a1a] font-bold text-lg">Estimated Total</span>
                </div>
                <span className="font-bold text-2xl text-[#1a1a1a] whitespace-nowrap shrink-0">₹ {total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Pre-registration form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white p-8 md:p-10 border border-[#1a1a1a]/5 shadow-sm sticky top-32">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-12 md:py-20">
                  <div className="w-20 h-20 bg-[#008763]/10 text-[#008763] rounded-full flex items-center justify-center mb-8">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl font-medium text-[#1a1a1a] mb-4">You're on the list!</h3>
                  <p className="text-[#5a5a5a] text-lg leading-relaxed mb-10 max-w-sm mx-auto">
                    We've securely reserved your items. You will receive an email as soon as checkout opens.
                  </p>
                  <Link href="/shop" className="text-sm font-semibold tracking-widest uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:text-[#b8976a] hover:border-[#b8976a] transition-all inline-block">
                    Continue Browsing
                  </Link>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-medium text-[#1a1a1a] mb-8">Contact Information</h2>
                  <form onSubmit={handleNotifySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">First Name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className={`w-full bg-[#f8f6f2] border ${formErrors.firstName ? 'border-red-500' : 'border-[#1a1a1a]/10'} px-4 py-4 text-sm focus:outline-none focus:border-[#b8976a] transition-colors`} 
                          placeholder="Jane" 
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
                          className={`w-full bg-[#f8f6f2] border ${formErrors.lastName ? 'border-red-500' : 'border-[#1a1a1a]/10'} px-4 py-4 text-sm focus:outline-none focus:border-[#b8976a] transition-colors`} 
                          placeholder="Doe" 
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
                        className={`w-full bg-[#f8f6f2] border ${formErrors.email ? 'border-red-500' : 'border-[#1a1a1a]/10'} px-4 py-4 text-sm focus:outline-none focus:border-[#b8976a] transition-colors`} 
                        placeholder="jane@example.com" 
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-2">{formErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold tracking-widest uppercase text-[#8a8a8a] mb-2">Phone Number</label>
                      <div className="flex">
                        <div className="flex items-center justify-center px-4 border border-[#1a1a1a]/10 border-r-0 bg-[#f8f6f2] text-sm text-[#1a1a1a]">
                          <span className="mr-2">🇮🇳</span>
                          <span className="font-medium">+91</span>
                        </div>
                        <input 
                          type="tel" 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className={`w-full bg-[#f8f6f2] border ${formErrors.phone ? 'border-red-500' : 'border-[#1a1a1a]/10'} px-4 py-4 text-sm focus:outline-none focus:border-[#b8976a] transition-colors`} 
                          placeholder="XXXXX XXXXX" 
                        />
                      </div>
                      {formErrors.phone && <p className="text-red-500 text-xs mt-2">{formErrors.phone}</p>}
                    </div>

                    <div className="pt-4 mt-2 border-t border-[#1a1a1a]/10">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-5 text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-sm ${
                          isSubmitting 
                            ? "bg-[#1a1a1a]/70 text-[#f8f6f2] cursor-not-allowed" 
                            : "bg-[#1a1a1a] text-[#f8f6f2] hover:bg-[#b8976a] hover:shadow-md"
                        }`}
                      >
                        {isSubmitting ? "Processing..." : "Confirm Pre-Registration"}
                      </button>
                      <p className="text-center text-[10px] text-[#8a8a8a] mt-4 uppercase tracking-widest">
                        By registering, you agree to our terms of service
                      </p>
                    </div>
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
