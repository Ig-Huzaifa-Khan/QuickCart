import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });


export const syncUserCreation = inngest.createFunction({
    id:'sync-user-from-clerk'
},

{
    event: 'clerk/user.created'
},

async ({event}) => {
    const{
        id, first_name, last_name, email_addresses, image_url
    } = event.data
    const email = (email_addresses && email_addresses[0] && (email_addresses[0].email_address || email_addresses[0].email)) || event.data.email || '';

    const userData ={
        _id: id,
        email: email,
        name: `${first_name || ''} ${last_name || ''}`.trim(),
        imageUrl: image_url || ''
    }

    try {
        await connectDB()
        // Use upsert to create or update the user record reliably
        await User.findOneAndUpdate({_id: id}, userData, {upsert: true, setDefaultsOnInsert: true})
    } catch (err) {
        console.error('syncUserCreation error:', err)
        throw err
    }
}
)

// Inngest function to updare user data in database

export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {event: 'clerk/user.updated'},
    async({event}) => {
         const{
        id, first_name, last_name, email_addresses, image_url
    } = event.data
        const email = (email_addresses && email_addresses[0] && (email_addresses[0].email_address || email_addresses[0].email)) || event.data.email || '';

        const userData ={
            _id: id,
            email: email,
            name: `${first_name || ''} ${last_name || ''}`.trim(),
            imageUrl: image_url || ''
        }

        try {
            await connectDB()
            await User.findOneAndUpdate({_id: id}, userData, {upsert: true, new: true})
        } catch (err) {
            console.error('syncUserUpdation error:', err)
            throw err
        }
    }
)

// Inngest Function to delete user from database

export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {
        event: 'clerk/user.deleted'
    },
    async({event}) => {
        const {id } = event.data
        try {
            await connectDB()
            await User.findByIdAndDelete(id)
        } catch (err) {
            console.error('syncUserDeletion error:', err)
            throw err
        }
    }
)