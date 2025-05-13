import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DeleteCoupon = (props) => {
  const router = useRouter();
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
    const res = await fetch("/api/admin/coupon", {
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

export default DeleteCoupon;
