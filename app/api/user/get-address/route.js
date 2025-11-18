import Address from "@/models/address"
import { getAuth } from "@clerk/nextjs/server"
import connectDB from "@/config/db"
import { NextResponse } from "next/server"

export async function Get(request) {

    try {

        const { userId } = getAuth(request)

        await connectDB()

        const addresses = await Address.find({ userId })

        return NextResponse.json({ success: true, addresses }, { status: 200 })


    } catch {

        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
    
}