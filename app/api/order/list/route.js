import Address from "@/models/address";
import Product from "@/models/product";
import Order from "@/models/order";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try{
        const { userId } = getAuth(request);
        console.log('🔑 User ID from auth:', userId);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB()

        const orders = await Order.find({ userId })
            .populate('items.product')
            .populate('address')
            .sort({ date: -1 });

        console.log('📦 Found orders for user:', orders.length);
        console.log('📊 Orders:', JSON.stringify(orders, null, 2));

        return NextResponse.json({ success: true, orders }, { status: 200 });

    } catch (error) {
        console.error('❌ Fetch orders error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        
    }
}