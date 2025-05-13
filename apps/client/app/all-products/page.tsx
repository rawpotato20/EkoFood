import AllNav from "@/components/basic/all-nav";
import ProductItem from "@/components/dashboard/product-item";
// import { usePathname, useRouter } from "next/navigation";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const AllProducts = (props) => {
    const router = useRouter();
    // const pathname = usePathname();

    const scrollDivRef = useRef(null);
    const [isRestoringScroll, setIsRestoringScroll] = useState(true); // State to control when to restore the scroll

    const [user, setUser] = useState(null);

    useEffect(() => {
        let user = JSON.parse(parseCookies().user || null);
        if (!user) {
            router.push("/");
        } else {
            setUser(user);
        }
    }, []);

    const [cart, setCart] = useState({});
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const res = await fetch("/api/view/products").then((res) => res.json());
        if (res.success) {
            setProducts(
                res.data.sort((a, b) => a.display_order - b.display_order)
            );
        } else {
            toast.error(res.message);
        }
    };

    const fetchCart = async () => {
        const res = await fetch(`/api/view/cart?id=${user.cart_id}`).then(
            (res) => res.json()
        );
        if (res.success) {
            setCart(res.data);
        } else {
            toast.error(res.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const handleCartAdd = async (id, p, v, oos) => {
        const res = await fetch("/api/user/cart", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: user.cart_id,
                id2: user.box_id,
                id3: id,
                price: p,
                volume: v,
                out_of_stock: oos,
            }),
        }).then((res) => res.json());
        if (res.success) {
            toast.success(res.message);
            router.push("/dashboard");
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
    }, [products]); // Depend on the data array to ensure it's fully loaded


    return (
        <>
        <div className="h-[100vh] bg-christmas">
            <div className="container mx-auto min-h-screen px-3 md:px-0 flex flex-col space-y-7">
                <AllNav />

                <div className="my-5 p-3 border border-primary rounded-lg">
                    <div
                        ref={scrollDivRef}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[80vh] overflow-y-scroll overflow-x-hidden">
                        {!isRestoringScroll && // Render the list only after restoring scroll
                            products.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col justify-center"
                                    >
                                        <ProductItem
                                            key={index}
                                            data={item}
                                            handleCartAdd={handleCartAdd}
                                            user={user}
                                        />
                                        <hr className="bg-secondary text-white w-2/3 h-[2px] mx-auto" />
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default AllProducts;
