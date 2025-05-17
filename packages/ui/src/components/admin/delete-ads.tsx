import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Toast to Sonner
import toast from "react-hot-toast";
//TODO: Nookies
import { parseCookies } from "nookies";

interface Ad {
  _id: string;
  title: string;
  text: string;
  link: string;
  color: string;
  logoURL: string;
  imageURL: string;
  imageURL2: string;
  imageURL3: string;
}

interface DeleteAdsProps {
  data: Ad;
  handleClose: () => void;
}

const DeleteAds = (props: DeleteAdsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [color, setColor] = useState(props.data.color);
  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState(props.data.imageURL);
  const [image2, setImage2] = useState("");
  const [imageURL2, setImageURL2] = useState(props.data.imageURL2);
  const [image3, setImage3] = useState("");
  const [imageURL3, setImageURL3] = useState(props.data.imageURL3);
  const [title, setTitle] = useState(props.data.title);
  const [text, setText] = useState(props.data.text);
  const [logo, setLogo] = useState("");
  const [logoURL, setLogoURL] = useState(props.data.logoURL);
  const [link, setLink] = useState(props.data.link);

  const [loading, setLoading] = useState(false);

  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    let adminPassword = parseCookies().adminPassword;
    if (adminPassword) {
      setAdminPassword(adminPassword);
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/ads", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: adminPassword,
      },
      body: JSON.stringify({
        id: props.data._id,
      }),
    }).then((res) => res.json());
    if (res.success) {
      toast.success(res.message);
      setLoading(false);
      router.refresh();
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="text-xl font-medium">
          Are you sure you want to delete?
        </div>
        <br />
        <div className="flex flex-row justify-between items-center">
          <button
            className="bg-indigo-500 text-white py-2 px-7 rounded"
            type="button"
            onClick={props.handleClose}
          >
            CANCEL
          </button>
          <button
            className="bg-danger text-white py-2 px-7 rounded"
            type="button"
            onClick={() => handleSubmit()}
          >
            {loading ? "DELETING..." : "DELETE"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteAds;
