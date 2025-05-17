import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Toast to SOnner
import toast from "react-hot-toast";
import Options from "./options";
import Volumes from "./volumes";

import Gallery from "./gallery";

//TODO: Nookies
import { parseCookies } from "nookies";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../basic/quill-editor"), {
  ssr: false,
});

type OptionType = { [key: string]: string };

type VolumeType = {
  volume: string;
  price: number;
};

const AddProducts = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>();
  const [imageURL, setImageURL] = useState("");
  const [galleryURLs, setGalleryURLs] = useState<string[]>([]);
  const [volumes, setVolumes] = useState<VolumeType[]>([]);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [heading1, setHeading1] = useState("");
  const [text1, setText1] = useState("");
  const [heading2, setHeading2] = useState("");
  const [text2, setText2] = useState("");
  const [heading3, setHeading3] = useState("");
  const [text3, setText3] = useState("");
  const [heading4, setHeading4] = useState("");
  const [text4, setText4] = useState("");

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
          Authorization: adminPassword,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading2(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: adminPassword,
      },
      body: JSON.stringify({
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

  const handleTextChange1 = (i: string) => {
    setText1(i);
  };

  const handleTextChange2 = (i: string) => {
    setText2(i);
  };

  const handleTextChange3 = (i: string) => {
    setText3(i);
  };

  const handleTextChange4 = (i: string) => {
    setText4(i);
  };

  const handleOptions = (i: OptionType[]) => {
    setOptions(i);
  };

  const handleVolumes = (i: VolumeType[]) => {
    setVolumes(i);
  };

  const handleGalleryUrls = (i: string[]) => {
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
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
          <Gallery
            galleryURLs={galleryURLs}
            handleGalleryUrls={handleGalleryUrls}
          />
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

          {imageURL && (
            <button
              type="submit"
              disabled={loading2}
              className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
            >
              {loading2 ? "Adding..." : "Add"}
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default AddProducts;
