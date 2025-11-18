import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/user";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";


export async function POST(request) {

    try {

        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { address, items } = await request.json();

        if(!address || !items || items.length === 0){

            return NextResponse.json({success: false, message: 'Invalid Data'}, {status: 400})
        }

        await connectDB();

        // calculate amount using items
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                amount += product.offerPrice * item.quantity;
            }
        }

         await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.02),
                date: Date.now()
            }
         })

         // clear user cart after order creation

         const user = await User.findById(userId)

         if (user) {
            user.cartItems = {}
            await user.save()
         }

         return NextResponse.json({ success: true, message: 'Order placed successfully' }, { status: 200 })

    } catch (error) {

        console.log(error)

        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}