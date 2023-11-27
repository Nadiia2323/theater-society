import { v2 as cloudinary } from 'cloudinary';


const cloudinaryConfig = () => {
  cloudinary.config({ 
  cloud_name: process.env.cloudName, 
  api_key: process.env.apiKey, 
  api_secret: process.env.apiSecret 
});
}
          
export default cloudinaryConfig