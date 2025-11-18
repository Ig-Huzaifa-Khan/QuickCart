import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    userId: { type: String, ref: 'user', required: true },
    items: {
        product: { type: String, ref: 'product', required: true },
        quantity: { type: Number, required: true }
    },
    address: { type: String, ref: 'address', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Order Placed' },
    date: { type: Number, required: true }    
})

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;