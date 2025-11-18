import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
     userId: { type: string, ref: 'User', required: true },
     name: { type: String, required: true },
     description: { type: String, required: true },
     price: { type: Number, required: true },
     category: { type: String, required: true },
     offerPrice: { type: Number },
     image: { type: Array, required: true },
     createdAt: { type: Date, default: Date.now } 
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;