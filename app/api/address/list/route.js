import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Address from "@/models/address";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, addresses }, { status: 200 });

    } catch (error) {
        console.error('Fetch addresses error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
