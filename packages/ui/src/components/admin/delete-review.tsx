import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Nookies and Toast
import { parseCookies } from "nookies";
import toast from "react-hot-toast";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
}

interface DeleteReviewProps {
  data: Review;
  handleClose: () => void;
}

const DeleteReview = (props: DeleteReviewProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState(props.data.name);
  const [rating, setRating] = useState(props.data.rating);
  const [comment, setComment] = useState(props.data.comment);

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
    const res = await fetch("/api/admin/review", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: adminPassword,
      },
      body: JSON.stringify({
        id: props.data.id,
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

export default DeleteReview;
