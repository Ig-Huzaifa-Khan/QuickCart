import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        let user = await User.findById(userId);

        // If user doesn't exist, create a new one
        if (!user) {
            user = await User.create({
                _id: userId,
                name: "User",
                email: "",
                cartItems: {}
            });
        }

        return NextResponse.json({ success: true, user })
    } catch (error) {
        console.error('User data fetch error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
 