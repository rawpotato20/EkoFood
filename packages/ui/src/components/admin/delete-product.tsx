import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Nookies and toast
import { parseCookies } from "nookies";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  volume: string;
  strength: string;
  power: string;
  intelligence: string;
  hunger: string;
  heading: string;
  text: string;
}

interface DeleteProductProps {
  data: Product;
  handleClose: () => void;
}

const DeleteProduct = (props: DeleteProductProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState(props.data.name);
  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState(props.data.image);
  const [price, setPrice] = useState(props.data.price);
  const [volume, setVolume] = useState(props.data.volume);
  const [strength, setStrength] = useState(props.data.strength);
  const [power, setPower] = useState(props.data.power);
  const [intelligence, setIntelligence] = useState(props.data.intelligence);
  const [hunger, setHunger] = useState(props.data.hunger);
  const [heading, setHeading] = useState(props.data.heading);
  const [text, setText] = useState(props.data.text);

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

  const handleSubmit = async () => {
    setLoading2(true);
    const res = await fetch("/api/admin/products", {
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
      setLoading2(false);
      router.refresh();
    } else {
      toast.error(res.message);
      setLoading2(false);
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
            {loading2 ? "DELETING..." : "DELETE"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteProduct;
