import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import AddCoupon from "./add-coupon";
import EditCoupon from "./edit-coupon";
import DeleteCoupon from "./delete-coupon";

//TODO: Replace with lucid icons
import { FiEdit2, FiTrash } from "react-icons/fi";
//TODO: toast so sonner
import toast from "react-hot-toast";

export interface Coupon {
  _id: string;
  name: string;
  couponType: string;
  percentage: number;
}

const Coupon = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [coupons, setCoupon] = useState<Coupon[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [selectedData, setSelectedData] = useState<Coupon | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    const res = await fetch("/api/view/coupon").then((res) => res.json());
    if (res.success) {
      setCoupon(res.data);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // useEffect(() => {
  //     const filteredProducts = products.filter((product) =>
  //         product.name.toLowerCase().includes(search.toLowerCase())
  //     );
  //     setProducts(filteredProducts);
  //     if (search === "") {
  //         fetchProducts();
  //     }
  // }, [search]);

  const handleClose = () => {
    setOpen3(false);
  };

  return (
    <>
      <div className="container mx-auto bg-slate-200 p-5 rounded-xl mt-5 space-y-5 h-[80vh]">
        <div className="flex flex-row justify-between">
          <button
            className="bg-primary text-white rounded-xl py-2 px-7"
            onClick={() => setOpen(true)}
          >
            Add
          </button>
          {/* <input
                        type="text"
                        placeholder="Type here to search..."
                        className="w-1/3 bg-white rounded-xl py-2 px-4"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    /> */}
        </div>
        <div className="">
          <div className="flex flex-row justify-between bg-black/70 text-white rounded-xl py-2 px-7">
            <div className="w-1/6 text-left">Name</div>
            <div className="w-1/6 text-left">Coupon Type</div>
            <div className="w-1/6 text-left">Percentage</div>
            <div className="w-1/6 text-left">Usage</div>
            {/* <div className="w-1/6 text-center">Heading - Text</div> */}
            <div className="w-1/6 text-right">Actions</div>
          </div>
          <div className="h-[60vh] overflow-y-scroll">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="flex flex-row justify-between items-center py-2 px-7 border border-white rounded-xl"
              >
                <div className="w-1/6 text-left flex justify-start">
                  {coupon.name}
                </div>
                <div className="w-1/6 text-left flex justify-start">
                  {coupon.couponType}
                </div>
                <div className="w-1/6 text-left flex justify-start">
                  {coupon.percentage}%
                </div>
                <div className="w-1/6 text-left flex justify-start"></div>
                <div className="w-1/6 text-right flex justify-end space-x-2">
                  <button
                    className="bg-secondary text-white rounded-xl px-4 py-1"
                    onClick={() => {
                      setOpen2(true);
                      setSelectedData(coupon);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="bg-danger text-white rounded-xl px-4 py-1"
                    onClick={() => {
                      setOpen3(true);
                      setSelectedData(coupon);
                    }}
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {open && (
        <>
          <div className="min-h-screen w-full fixed top-0 left-0 z-10 bg-black/60 flex justify-center items-center">
            <div className="container mx-auto bg-white rounded-xl p-3">
              <div className="flex justify-end">
                <button className="" onClick={() => setOpen(false)}>
                  <IoCloseCircleOutline className="text-2xl" />
                </button>
              </div>
              <AddCoupon />
            </div>
          </div>
        </>
      )}
      {open2 && (
        <>
          <div className="min-h-screen w-full fixed top-0 left-0 z-10 bg-black/60 flex justify-center items-center">
            <div className="container mx-auto bg-white rounded-xl p-3">
              <div className="flex justify-end">
                <button className="" onClick={() => setOpen2(false)}>
                  <IoCloseCircleOutline className="text-2xl" />
                </button>
              </div>
              {selectedData && <EditCoupon data={selectedData} />}
            </div>
          </div>
        </>
      )}
      {open3 && (
        <>
          <div className="min-h-screen w-full fixed top-0 left-0 z-10 bg-black/60 flex justify-center items-center">
            <div className="container mx-auto bg-white rounded-xl p-3">
              <div className="flex justify-end">
                <button className="" onClick={() => setOpen3(false)}>
                  <IoCloseCircleOutline className="text-2xl" />
                </button>
              </div>
              {selectedData && (
                <DeleteCoupon data={selectedData} handleClose={handleClose} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Coupon;
