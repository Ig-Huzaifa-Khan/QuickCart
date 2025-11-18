import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({ 
    _id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: false
    },
    email:{
        type: String,
        required: false
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

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 