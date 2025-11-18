import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Address from "@/models/address";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { address } = await request.json();

        await connectDB();

        const newAddress = await Address.create({
            userId,
            ...address
        });

        return NextResponse.json({ success: true, message: "Address added successfully", address: newAddress }, { status: 200 });

    } catch (error) {
        console.error('Add address error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
