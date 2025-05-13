import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditAds = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [background, setBackground] = useState("");
    const [backgroundURL, setBackgroundURL] = useState(
        props.data.background
    );
    const [background2, setBackground2] = useState("");
    const [backgroundURL2, setBackgroundURL2] = useState(
        props.data.background2
    );
    // const [image, setImage] = useState("");
    // const [imageURL, setImageURL] = useState(props.data.imageURL);
    const [image2, setImage2] = useState("");
    const [imageURL2, setImageURL2] = useState(props.data.image2);
    // const [image3, setImage3] = useState("");
    // const [imageURL3, setImageURL3] = useState(props.data.imageURL3);
    const [title, setTitle] = useState(props.data.title);
    const [text, setText] = useState(props.data.text);
    const [logo, setLogo] = useState("");
    const [logoURL, setLogoURL] = useState(props.data.logo);
    const [link, setLink] = useState(props.data.link);

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [loading4, setLoading4] = useState(false);
    const [loading5, setLoading5] = useState(false);
    const [loading6, setLoading6] = useState(false);

    const [adminPassword, setAdminPassword] = useState("");

    useEffect(() => {
        let adminPassword = parseCookies().adminPassword;
        if (adminPassword) {
            setAdminPassword(adminPassword);
        }
    }, []);

    const handleImageUpload = async () => {
        setLoading(true);
        if (background2) {
            const formData = new FormData();
            formData.append("file", background2);
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: {
                    "Authorization": adminPassword,
                },
                body: formData,
            }).then((res) => res.json());
            if (res.success) {
                setBackgroundURL2(res.data);
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

    const handleImageUpload2 = async () => {
        setLoading2(true);
        if (image2) {
            const formData = new FormData();
            formData.append("file", image2);
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: {
                    "Authorization": adminPassword,
                },
                body: formData,
            }).then((res) => res.json());
            if (res.success) {
                setImageURL2(res.data);
                toast.success(res.message);
                setLoading2(false);
            } else {
                toast.error(res.message);
                setLoading2(false);
            }
        } else {
            toast.error("Please select an image");
            setLoading2(false);
        }
    };

    const handleImageUpload3 = async () => {
        setLoading3(true);
        if (image) {
            const formData = new FormData();
            formData.append("file", image3);
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: {
                    "Authorization": adminPassword,
                },
                body: formData,
            }).then((res) => res.json());
            if (res.success) {
                setImageURL3(res.data);
                toast.success(res.message);
                setLoading3(false);
            } else {
                toast.error(res.message);
                setLoading3(false);
            }
        } else {
            toast.error("Please select an image");
            setLoading3(false);
        }
    };

    const handleImageUpload4 = async () => {
        setLoading4(true);
        if (logo) {
            const formData = new FormData();
            formData.append("file", logo);
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: {
                    "Authorization": adminPassword,
                },
                body: formData,
            }).then((res) => res.json());
            if (res.success) {
                setLogoURL(res.data);
                toast.success(res.message);
                setLoading4(false);
            } else {
                toast.error(res.message);
                setLoading4(false);
            }
        } else {
            toast.error("Please select an image");
            setLoading4(false);
        }
    };

    const handleImageUpload5 = async () => {
        setLoading5(true);
        if (background) {
            const formData = new FormData();
            formData.append("file", background);
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: {
                    "Authorization": adminPassword,
                },
                body: formData,
            }).then((res) => res.json());
            if (res.success) {
                setBackgroundURL(res.data);
                toast.success(res.message);
                setLoading5(false);
            } else {
                toast.error(res.message);
                setLoading5(false);
            }
        } else {
            toast.error("Please select an image");
            setLoading5(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading6(true);
        const res = await fetch("/api/admin/ads", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": adminPassword,
            },
            body: JSON.stringify({
                id: props.data._id,
                background: backgroundURL,
                background2: backgroundURL2,
                // image: imageURL,
                image2: imageURL2,
                // image3: imageURL3,
                title,
                text,
                logo: logoURL,
                link,
            }),
        }).then((res) => res.json());
        if (res.success) {
            toast.success(res.message);
            setLoading6(false);
            router.refresh();
        } else {
            toast.error(res.message);
            setLoading6(false);
        }
    };

    return (
        <>
            <div className="container mx-auto h-[80vh] overflow-y-scroll">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="background">Mobile Background</label>
                        <input
                            type="file"
                            id="background"
                            name="background"
                            onChange={(e) => setBackground(e.target.files[0])}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                        <button
                            type="button"
                            onClick={handleImageUpload5}
                            disabled={loading5}
                            className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                        >
                            {loading5 ? "įkėlimas..." : "įkelti"}
                        </button>
                    </div>
                    {backgroundURL && (
                        <Image
                            src={backgroundURL}
                            alt="background"
                            width={300}
                            height={300}
                            className="object-contain"
                        />
                    )}

                    <div className="space-y-2">
                        <label htmlFor="image">Desktop Background</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={(e) => setBackground2(e.target.files[0])}
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
                    {backgroundURL2 && (
                        <Image
                            src={backgroundURL2}
                            alt="background"
                            width={300}
                            height={300}
                            className="object-contain"
                        />
                    )}

                    <div className="space-y-2">
                        <label htmlFor="logo">Logo</label>
                        <input
                            type="file"
                            id="logo"
                            name="logo"
                            onChange={(e) => setLogo(e.target.files[0])}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                        <button
                            type="button"
                            onClick={handleImageUpload4}
                            disabled={loading4}
                            className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                        >
                            {loading4 ? "įkėlimas..." : "įkelti"}
                        </button>
                    </div>
                    {logoURL && (
                        <Image
                            src={logoURL}
                            alt="background"
                            width={300}
                            height={300}
                            className="object-contain"
                        />
                    )}

                    {/* <div className="space-y-2">
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
                    </div> */}

                    <div className="space-y-2">
                        <label htmlFor="image2">Image 2</label>
                        <input
                            type="file"
                            id="image2"
                            name="image2"
                            onChange={(e) => setImage2(e.target.files[0])}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                        <button
                            type="button"
                            onClick={handleImageUpload2}
                            disabled={loading2}
                            className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                        >
                            {loading2 ? "įkėlimas..." : "įkelti"}
                        </button>
                    </div>
                    {imageURL2 && (
                        <Image
                            src={imageURL2}
                            alt="background"
                            width={300}
                            height={300}
                            className="object-contain"
                        />
                    )}

                    {/* <div className="space-y-2">
                        <label htmlFor="image3">Image 3</label>
                        <input
                            type="file"
                            id="image3"
                            name="image3"
                            onChange={(e) => setImage3(e.target.files[0])}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                        <button
                            type="button"
                            onClick={handleImageUpload3}
                            disabled={loading3}
                            className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                        >
                            {loading3 ? "įkėlimas..." : "įkelti"}
                        </button>
                    </div> */}

                    <div className="space-y-2">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="text">Text</label>
                        <textarea
                            id="text"
                            name="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="link">Link</label>
                        <select
                            id="link"
                            name="link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                        >
                            <option value="">Select a link</option>
                            <option value="prisijunk">prisijunk</option>
                            <option value="registruokis">registruokis</option>
                            <option value="gauk">gauk</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading6}
                        className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
                    >
                        {loading6 ? "Editing..." : "Edit"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditAds;
