import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiAddFill } from "react-icons/ri";

const ProductItem = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    // console.log(props.user);

    // const [open, setOpen] = useState(false);

    return (
        <>
            <div className="w-11/12 my-2 flex flex-col md:flex-row justify-between items-center md:space-x-24">
                <div className="w-full md:w-1/2 flex flex-row justify-start md:justify-between items-center">
                    <div className="md:w-1/2">
                        <Image
                            src={props.data.image}
                            width={100}
                            height={100}
                            alt="product"
                            className="w-28 md:w-32 h-28 md:h-32 rounded-lg object-contain"
                        />
                    </div>
                    <div className={props.data.volumes[0]?.out_of_stock ? `text-gray-400 md:w-1/3 text-lg font-medium text-left` : `text-primary md:w-1/3 text-lg font-medium text-left`}>
                        {props.data ? props.data.name : null}
                    </div>
                </div>
                <div className="w-5/6 md:w-1/2 flex flex-row justify-between items-center">
                    <div className={props.data.volumes[0]?.out_of_stock ? `text-gray-400 text-lg font-medium` : `text-primary text-lg font-medium`}>
                        {props.data.volumes[0] ? props.data.volumes[0]?.price : null} €
                    </div>
                    <div>
                        <button
                            className={props.data.volumes[0]?.out_of_stock ? `bg-gray-400 text-white py-1 px-7 rounded-lg text-sm` : `bg-secondary text-white py-1 px-7 rounded-lg text-sm`}
                            onClick={() => {
                                // const scrollPosition =
                                //     props.scrollRef.current.scrollTop; // Save the scroll position
                                // localStorage.setItem(
                                //     "scrollPosition",
                                //     scrollPosition
                                // );
                                router.push(`/product/` + props.data._id, {
                                    scroll: false, // Prevent scrolling to top on navigation
                                });
                            }}
                            data-umami-event="Read More Button Clicked"
                        >
                            Plačiau
                        </button>
                    </div>
                    <div>
                        <button
                            className={props.data.volumes[0]?.out_of_stock ? `bg-gray-400 p-1 rounded` : `bg-primary p-1 rounded`}
                            onClick={() => {
                                let item = props.data.volumes[0];
                                if (
                                    item?.out_of_stock
                                ) {
                                    toast.error(
                                        "Prekė išparduota"
                                    );
                                    return;
                                }
                                if (
                                    props.user
                                        .active_delivery
                                ) {
                                    toast.error(
                                        "Prieš atlikdami naujus pakeitimus, išjunkite savo dėžutę"
                                    );
                                } else {
                                    props.handleCartAdd(
                                        props.data
                                            ._id,
                                        item.price,
                                        item.volume,
                                        item?.out_of_stock
                                    );
                                }
                            }}
                            data-umami-event="Add to Cart Button Clicked"
                        >
                            <RiAddFill className="text-xs text-white" />
                        </button>
                    </div>
                </div>
            </div>
            {/* {open && (
                <div className="min-h-screen w-full fixed top-0 left-0 bg-black/60 flex justify-center items-center">
                    <div className="w-full md:w-1/2 rounded-lg bg-white p-5 space-y-5">
                              <div className="w-full md:w-1/2 rounded-lg bg-white p-5 space-y-5">                          <div className="flex justify-end items-end">                              <button className="" onClick={() => setOpen(false)}>to                                x                   <div>
                            <div className="w-full flex flex-col justify-between">
                                <div className="text-base font-medium mr-2">
                                    Kaina:
                                </div>
                                <div className="text-base space-y-2">
                                    {props.data.volumes ? props.data.volumes.map((item, i) => {
                                        return (
                                            <div
                                                key={i}
                                                className="flex flex-row justify-between"
                                            >
                                                <div className="text-left w-1/4">
                                                    {item.volume}
                                                </div>
                                                <div className="text-left w-1/4">
                                                    {item.price} €
                                                </div>
                                                <div className="text-left w-1/4 text-red-500 font-medium">
                                                    {item.out_of_stock
                                                        ? "Išparduota"
                                                        : ""}
                                                </div>
                                                <div className="w-1/4 flex justify-end items-end">
                                                    <button
                                                        className="bg-secondary text-white py-1 px-4 rounded-lg"
                                                        onClick={() => {
                                                            if (
                                                                item.out_of_stock
                                                            ) {
                                                                toast.error(
                                                                    "Prekė išparduota"
                                                                );
                                                                return;
                                                            }
                                                            if (
                                                                props.user
                                                                    .active_delivery
                                                            ) {
                                                                toast.error(
                                                                    "Prieš atlikdami naujus pakeitimus, išjunkite savo dėžutę"
                                                                );
                                                            } else {
                                                                props.handleCartAdd(
                                                                    props.data
                                                                        ._id,
                                                                    item.price,
                                                                    item.volume,
                                                                    item.out_of_stock
                                                                );
                                                                setOpen(false);
                                                            }
                                                        }}
                                                    >
                                                        <RiAddFill className="text-xl text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
        </>
    );
};

export default ProductItem;
