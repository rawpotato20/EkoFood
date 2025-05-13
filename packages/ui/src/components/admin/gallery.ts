import Image from "next/image";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";

const Gallery = (props) => {
    const [gallery, setGallery] = useState(props.galleryURLs);

    const [images, setImages] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [adminPassword, setAdminPassword] = useState("");

    useEffect(() => {
        let adminPassword = parseCookies().adminPassword;
        if (adminPassword) {
            setAdminPassword(adminPassword);
        }
    }, []);

    const handleBulkUpload = async () => {
        setLoading(true);
    
        if (images.length > 0) {
            // Temporary array to accumulate uploaded URLs
            const uploadedURLs = [];
    
            for (let i = 0; i < images.length; i++) {
                const res = await handleImageUpload(images[i]);
                if (res) uploadedURLs.push(res);
            }
    
            // Update state once with all URLs at the end of uploads
            setImageURLs((prev) => [...prev, ...uploadedURLs]);
            setGallery((prev) => [...prev, ...uploadedURLs]);
    
            toast.success("Images uploaded successfully");
        } else {
            toast.error("Please select images");
        }
    
        setLoading(false);
    };
    
    const handleImageUpload = async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        const res = await fetch("/api/admin/upload", {
            method: "POST",
            headers: {
                "Authorization": adminPassword,
            },
            body: formData,
        }).then((res) => res.json());
        if (res.success) {
            return res.data;
        } else {
            toast.error(res.message);
            return null;            
        }
    };

    const showAdd = () => {
        setShowForm(true);
    };

    const removeImageFromURLs = (imageURL) => {
        setImageURLs((prev) => [...prev.filter((url) => url !== imageURL.toString())]);
        setGallery((prev) => [...prev.filter((url) => url !== imageURL.toString())]);
    }

    useEffect(() => {
        props.handleGalleryUrls(gallery);
    }, [gallery]);

    return (
        <>
            <div>
                <h1>Gallery</h1>
                {gallery.map((item, i) => (
                    <div key={item} className="flex justify-start items-center">
                        <Image
                            src={item}
                            alt="gallery"
                            width={100}
                            height={100}
                        />
                        <button
                            className="bg-danger text-white rounded-xl px-4 py-1"
                            onClick={() => {
                                console.log(item)
                                removeImageFromURLs(item)
                            }}
                        >
                            <FiTrash />
                        </button>
                    </div>
                ))}
                {showForm && (
                    <>
                        <form className="flex flex-col md:flex-row justify-between items-center border border-gray-400 p-2 space-y-2">
                            <div className="md:w-3/4">
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                        setImages(Array.from(e.target.files));
                                    }}
                                    className="w-full"
                                />
                            </div>
                            <div className="md:w-1/4 flex justify-center items-center">
                                <button
                                    type="button"
                                    onClick={handleBulkUpload}
                                    className="rounded bg-green-500 text-white py-1 px-4"
                                >
                                    {loading ? "uploading..." : "Upload"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
                <div>
                    <button
                        type="button"
                        onClick={showAdd}
                        className="rounded bg-green-500 text-white py-1 px-4"
                    >
                        <IoMdAddCircleOutline className="text-xl" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Gallery;