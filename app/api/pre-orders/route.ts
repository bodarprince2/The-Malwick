import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

const formSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().refine((val) => isValidPhoneNumber(val, "IN"), {
    message: "Please enter a valid Indian phone number.",
  }),
  items: z.array(z.any()).min(1, "Cart cannot be empty."),
  total: z.number(),
  mrpTotal: z.number(),
  discountAmount: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the incoming data
    const validatedData = formSchema.parse(body);

    const client = await clientPromise;
    const db = client.db(); // Use default database from URI

    const preOrderDoc = {
      ...validatedData,
      phone: validatedData.phone.startsWith('+91') 
        ? validatedData.phone 
        : `+91 ${validatedData.phone.replace(/^0+/, '')}`, // Remove leading zeros if any
      createdAt: new Date(),
      status: 'pending', // could be used later to mark as contacted/fulfilled
    };

    const result = await db.collection('pre_orders').insertOne(preOrderDoc);

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Validation error", errors: error.issues }, { status: 400 });
    }
    console.error('Error saving pre-order:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
