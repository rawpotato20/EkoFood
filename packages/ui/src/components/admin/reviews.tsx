import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import AddReviews from "./add-reviews";
import EditReviews from "./edit-reviews";
import DeleteReview from "./delete-review";

const Reviews = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [reviews, setReviews] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [selectedData, setSelectedData] = useState({});

    const [loading, setLoading] = useState(false);

    const fetchReviews = async () => {
        const res = await fetch("/api/view/review").then((res) => res.json());
        if (res.success) {
            setReviews(res.data);
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
                        <div className="w-1/6 text-left">Rating</div>
                        <div className="w-1/6 text-left">Comment</div>
                        {/* <div className="w-1/6 text-left">Details</div> */}
                        {/* <div className="w-1/6 text-center">Heading - Text</div> */}
                        <div className="w-1/6 text-right">Actions</div>
                    </div>
                    <div className="h-[60vh] overflow-y-scroll">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="flex flex-row justify-between items-center py-2 px-7 border border-white rounded-xl"
                            >
                                <div className="w-1/6 text-left flex justify-start">
                                    {review.name}
                                </div>
                                <div className="w-1/6 text-left flex justify-start">
                                    {review.rating}
                                </div>
                                <div className="w-1/6 text-left flex justify-start">
                                    {review.comment}
                                </div>
                                <div className="w-1/6 text-right flex justify-end space-x-2">
                                    <button
                                        className="bg-secondary text-white rounded-xl px-4 py-1"
                                        onClick={() => {
                                            setOpen2(true);
                                            setSelectedData(review);
                                        }}
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        className="bg-danger text-white rounded-xl px-4 py-1"
                                        onClick={() => {
                                            setOpen3(true);
                                            setSelectedData(review);
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
                                <button
                                    className=""
                                    onClick={() => setOpen(false)}
                                >
                                    <IoCloseCircleOutline className="text-2xl" />
                                </button>
                            </div>
                            <AddReviews />
                        </div>
                    </div>
                </>
            )}
            {open2 && (
                <>
                    <div className="min-h-screen w-full fixed top-0 left-0 z-10 bg-black/60 flex justify-center items-center">
                        <div className="container mx-auto bg-white rounded-xl p-3">
                            <div className="flex justify-end">
                                <button
                                    className=""
                                    onClick={() => setOpen2(false)}
                                >
                                    <IoCloseCircleOutline className="text-2xl" />
                                </button>
                            </div>
                            <EditReviews data={selectedData} />
                        </div>
                    </div>
                </>
            )}
            {open3 && (
                <>
                    <div className="min-h-screen w-full fixed top-0 left-0 z-10 bg-black/60 flex justify-center items-center">
                        <div className="container mx-auto bg-white rounded-xl p-3">
                            <div className="flex justify-end">
                                <button
                                    className=""
                                    onClick={() => setOpen3(false)}
                                >
                                    <IoCloseCircleOutline className="text-2xl" />
                                </button>
                            </div>
                            <DeleteReview
                                data={selectedData}
                                handleClose={handleClose}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Reviews;
