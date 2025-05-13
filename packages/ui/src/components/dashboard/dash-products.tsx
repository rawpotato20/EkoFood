import Image from "next/image";
import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ProductItem from "./product-item";
import toast from "react-hot-toast";
import { trackEventFunction } from "@/utils/general";

// import { useRouter } from "next/router";
// import { useEffect, useRef, useState } from "react";

const DashProducts = (props) => {
    const router = useRouter();
    const scrollDivRef = useRef(null);
    const [isRestoringScroll, setIsRestoringScroll] = useState(true); // State to control when to restore the scroll

    const handleCartAdd = async (id, p, v, oos) => {
        const res = await fetch("/api/user/cart", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: props.user.cart_id,
                id2: props.user.box_id,
                id3: id,
                price: p,
                volume: v,
                out_of_stock: oos,
            }),
        }).then((res) => res.json());
        if (res.success) {
            trackEventFunction("Product Added to Cart");
            toast.success(res.message);
            props.fetchCart();
        } else {
            toast.error(res.message);
        }
    };

    useEffect(() => {
        const handleRouteChange = () => {
            if (scrollDivRef.current) {
                // Save scroll position before navigating away
                sessionStorage.setItem(
                    "scrollPosition",
                    scrollDivRef.current.scrollTop
                );
            }
        };

        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [router]);

    // Restore scroll position when component and its children fully mount/render
    useEffect(() => {
        const savedScrollPosition = sessionStorage.getItem("scrollPosition");

        if (savedScrollPosition !== null && scrollDivRef.current) {
            // Add a slight delay to ensure the div is fully rendered
            setTimeout(() => {
                scrollDivRef.current.scrollTop = parseInt(
                    savedScrollPosition,
                    10
                );
                setIsRestoringScroll(false); // Disable further restoration
            }, 0); // Execute after DOM updates
        } else {
            setIsRestoringScroll(false); // In case there's no saved scroll
        }
    }, [props.data]); // Depend on the data array to ensure it's fully loaded

    return (
        <>
            <div className="w-full border-2 border-secondary px-5 pt-2 rounded-lg">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-xl text-primary font-medium">
                        Pridėti produktą:
                    </h1>
                    <Link href="/all-products" className="text-primary text-lg">
                        Visos prekės
                    </Link>
                </div>

                <div
                    ref={scrollDivRef}
                    className="my-5 flex flex-wrap py-2 h-[80vh] md:h-72 overflow-y-scroll overflow-x-hidden"
                >
                    {!isRestoringScroll && // Render the list only after restoring scroll
                        props.data.map((item, index) => (
                            <div key={index} className="w-full">
                                <ProductItem
                                    data={item}
                                    handleCartAdd={handleCartAdd}
                                    user={props.user}
                                />
                                <hr className="bg-secondary text-white w-2/3 h-[2px] mx-auto" />
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default DashProducts;
