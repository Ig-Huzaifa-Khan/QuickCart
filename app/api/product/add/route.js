import authSeller from '@/lib/authSeller';
import { v2 } from 'cloudinary';

// configure cloudinary 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
    try {

        const { userId } = getAuth(request)

        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return nextResponse.json({success: false, message: 'Unauthorized Access'}, {status: 401})
        }

        const formData = await request.formData()

        const name = formData.get('name');

        const description = formData.get('description');

        const price = formData.get('price');

        const category = formData.get('category');

        const offerPrice = formData.get('offerPrice');

        const files = formData.getAll('images');

        if(!files || files.length === 0){
            return nextResponse.json({success: false, message: 'no files uploaded'}, {status: 401})
        }

        const result = await Promise.all(files.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer()

            const buffer = Buffer.from(arrayBuffer);

            return new Promise( (resolve, reject) => {
                
                const stream = cloudinary.uploader.upload_stream({resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                })

                stream.end(buffer); 
            })
        })
    )

    const image = result.map(result => result.secure_url)


    await connectDB()

    const newProduct = await Product.create({
        userId,
        name,
        description,
        price:Number(price),
        category,
        offerPrice:Number(offerPrice),
        image,
        date: Date.now()
    })

    return NextResponse.json({ success: true, message: 'Product added successfully', newProduct })
 
    } catch (error) {

        NextResponse.json({ success: false, message: error.message } , { status: 500 } )
    }
}