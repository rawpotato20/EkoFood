import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { parseCookies } from "nookies";
// const Editor = dynamic(() => import("../../basic/quill-editor"), {
//     ssr: false,
// });

interface Coupon {
  _id: string;
  name: string;
  percentage: number;
  couponType: string;
}

const EditCoupon = (props: { data: Coupon }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState(props.data.name);
  const [percentage, setPercentage] = useState(props.data.percentage);
  const [couponType, setCouponType] = useState(props.data.couponType);

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
    const res = await fetch("/api/admin/coupon", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: adminPassword,
      },
      body: JSON.stringify({
        id: props.data._id,
        percentage,
        couponType,
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

          <select
            id="couponType"
            name="couponType"
            value={couponType}
            onChange={(e) => setCouponType(e.target.value)}
            required
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          >
            <option value="" disabled>
              Select coupon type
            </option>
            <option value="discount">Discount</option>
            <option value="free-delivery">Free Delivery</option>
          </select>

          <div className="space-y-2">
            <label htmlFor="rating">Percentage</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
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

export default EditCoupon;
