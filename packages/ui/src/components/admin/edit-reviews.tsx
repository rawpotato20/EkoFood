import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Nookies and Toast
import toast from "react-hot-toast";
import { parseCookies } from "nookies";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
}

interface EditReviewsProps {
  data: Review;
}

const EditReviews = (props: EditReviewsProps) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/review", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: adminPassword,
      },
      body: JSON.stringify({
        id: props.data.id,
        name,
        rating,
        comment,
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
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
          >
            {loading ? "atnaujinimas..." : "atnaujinti"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditReviews;
