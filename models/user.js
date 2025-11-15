import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({ 
    _id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    cartItems: {
        type: Object,
        required: false,
        default: {}
    }
}, {minimize: false})

const User = mongoose.models.user || mongoose.model('User', userSchema);

export default User; 