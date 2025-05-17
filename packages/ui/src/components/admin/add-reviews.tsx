import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Toast to Sonner
import toast from "react-hot-toast";
import { parseCookies } from "nookies";

const AddReviews = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: adminPassword,
      },
      body: JSON.stringify({
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
      <div className="container mx-auto">
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
              onChange={(e) => setRating(e.target.value)}
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
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddReviews;
