import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    userId: { type: String, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Order Placed', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Order Placed' },
    date: { type: Number, required: true }    
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;