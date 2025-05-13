import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Options from "./options";
import Volumes from "./volumes";

import dynamic from "next/dynamic";
import Gallery from "./gallery";
import { parseCookies } from "nookies";
const Editor = dynamic(() => import("../basic/quill-editor"), {
    ssr: false,
});

const EditProducts = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [name, setName] = useState(props.data.name);
    const [image, setImage] = useState(props.data.image);
    const [imageURL, setImageURL] = useState(props.data.image);
    const [galleryURLs, setGalleryURLs] = useState(props.data.gallery);
    const [volumes, setVolumes] = useState(props.data.volumes);
    const [options, setOptions] = useState(props.data.options);
    const [heading1, setHeading1] = useState(props.data.heading1);
    const [text1, setText1] = useState(props.data.text1);
    const [heading2, setHeading2] = useState(props.data.heading2);
    const [text2, setText2] = useState(props.data.text2);
    const [heading3, setHeading3] = useState(props.data.heading3);
    const [text3, setText3] = useState(props.data.text3);
    const [heading4, setHeading4] = useState(props.data.heading4);
    const [text4, setText4] = useState(props.data.text4);

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [adminPassword, setAdminPassword] = useState("");

    useEffect(() => {
        let adminPassword = parseCookies().adminPassword;
        if (adminPassword) {
            setAdminPassword(adminPassword);
        }
    }, []);

    const handleImageUpload = async () => {
        setLoading(true);
        if (image) {
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
                setImageURL(res.data);
                toast.success(res.message);
                setLoading(false);
            } else {
                toast.error(res.message);
                setLoading(false);
            }
        } else {
            toast.error("Please select an image");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading2(true);
        const res = await fetch("/api/admin/products", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": adminPassword,
            },
            body: JSON.stringify({
                id: props.data._id,
                name,
                image: imageURL,
                gallery: galleryURLs,
                volumes,
                options,
                heading1,
                text1,
                heading2,
                text2,
                heading3,
                text3,
                heading4,
                text4,
                adminPassword: adminPassword
            }),
        }).then((res) => res.json());
        if (res.success) {
            toast.success(res.message);
            setLoading2(false);
            router.refresh();
        } else {
            toast.error(res.message);
            setLoading2(false);
        }
    };

    const handleTextChange1 = (i) => {
        setText1(i);
    };

    const handleTextChange2 = (i) => {
        setText2(i);
    };

    const handleTextChange3 = (i) => {
        setText3(i);
    };

    const handleTextChange4 = (i) => {
        setText4(i);
    };

    const handleOptions = (i) => {
        setOptions(i);
    };

    const handleVolumes = (i) => {
        setVolumes(i);
    }

    const handleGalleryUrls = (i) => {
        setGalleryURLs(i);
    };

    return (
        <>
            <div className="container mx-auto h-[80vh] overflow-y-scroll">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="image">Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                        <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={loading}
                            className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                        >
                            {loading ? "įkėlimas..." : "įkelti"}
                        </button>
                    </div>
                    <Gallery galleryURLs={galleryURLs} handleGalleryUrls={handleGalleryUrls} />
                    <Volumes volumes={volumes} handleVolumes={handleVolumes} />
                    <Options options={options} handleOptions={handleOptions} />
                    
                    <div className="space-y-2">
                        <label htmlFor="heading">Heading 1</label>
                        <input
                            type="text"
                            id="heading"
                            name="heading"
                            value={heading1}
                            onChange={(e) => setHeading1(e.target.value)}
                            // required
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="text">Text 1</label>
                        {/* <ToastUIEditor
                            text={text}
                            handleTextChange={handleTextChange}
                        /> */}
                        <Editor value={text1} setValue={handleTextChange1} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="heading">Heading 2</label>
                        <input
                            type="text"
                            id="heading"
                            name="heading"
                            value={heading2}
                            onChange={(e) => setHeading2(e.target.value)}
                            // required
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="text">Text 2</label>
                        {/* <ToastUIEditor
                            text={text}
                            handleTextChange={handleTextChange}
                        /> */}
                        <Editor value={text2} setValue={handleTextChange2} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="heading">Heading 3</label>
                        <input
                            type="text"
                            id="heading"
                            name="heading"
                            value={heading3}
                            onChange={(e) => setHeading3(e.target.value)}
                            // required
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="text">Text 3</label>
                        {/* <ToastUIEditor
                            text={text}
                            handleTextChange={handleTextChange}
                        /> */}
                        <Editor value={text3} setValue={handleTextChange3} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="heading">Heading 4</label>
                        <input
                            type="text"
                            id="heading"
                            name="heading"
                            value={heading4}
                            onChange={(e) => setHeading4(e.target.value)}
                            // required
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="text">Text 4</label>
                        {/* <ToastUIEditor
                            text={text}
                            handleTextChange={handleTextChange}
                        /> */}
                        <Editor value={text4} setValue={handleTextChange4} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading2}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                    >
                        {loading2 ? "atnaujinimas..." : "atnaujinti"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditProducts;
