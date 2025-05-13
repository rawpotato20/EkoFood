import multer from "multer";
// import sharp from "sharp";
import stream from "stream";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit to 10MB
});

const getCurrDate = () => {
    let now = new Date();
    let formattedDate = now
        .toISOString()
        .replace(/:/g, "-")
        .replace("T", "_")
        .replace(/\..+/, "");
    return formattedDate;
};

const replace_spaces = (str) => {
    return str.replace(/ /g, "-");
};

// const compressImage = async (buffer, maxFileSize) => {
//     const fileSize = buffer.length;

//     if (fileSize <= maxFileSize) {
//         // No need to compress if the file is already within the size limit
//         return buffer;
//     }

//     const quality = Math.floor((maxFileSize / fileSize) * 100);

//     return await sharp(buffer)
//         .resize({ fit: "inside", width: 1024 })
//         .jpeg({ quality })
//         .toBuffer();
// };

const handler = async (req, res) => {
    if (req.method === "POST") {
        upload.single("file")(req, res, async (error) => {
            if (error) {
                console.log(error);
                return res
                    .status(400)
                    .json({ success: false, message: error.message });
            }

            let { file } = req;
            // console.log(file);
            try {
                // const maxFileSize = 500 * 1024; // Maximum file size in bytes (500 kilobytes)
                // const compressedImage = await compressImage(
                //     file.buffer,
                //     maxFileSize
                // );

                let formattedDate = getCurrDate();
                formattedDate = replace_spaces(
                    formattedDate + "-" + file.originalname
                );

                // Upload the compressed image to Cloudinary using upload_stream
                const cloudinaryResponse = await new Promise(
                    (resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: "eko-maistas", // Optional: You can specify a folder in Cloudinary
                                public_id: formattedDate,
                                resource_type: "image", // Specify the resource type
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );

                        const bufferStream = new stream.PassThrough();
                        bufferStream.end(file.buffer);

                        bufferStream.pipe(uploadStream);
                    }
                );

                // cloudinaryResponse will contain information about the uploaded image
                console.log("Cloudinary response:", cloudinaryResponse);

                // Now you can send the Cloudinary URL or any other relevant information as a response
                return res.status(200).json({
                    success: true,
                    message: "Vaizdas sėkmingai įkeltas",
                    data: cloudinaryResponse.secure_url, // You might want to use a different property based on your needs
                });
            } catch (error) {
                console.log(error);
                return res.status(400).json({ success: false, message: error });
            }
        });
    } else if (req.method === "GET") {
        return res
            .status(400)
            .json({ success: false, message: "Method not allowed" });
    }
};

export default handler;

export const config = {
    api: {
        bodyParser: false,
    },
};
