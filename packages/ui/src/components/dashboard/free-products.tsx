import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ProductItem from "./product-item";
import { trackEventFunction } from "@/packages/utils/src/general";

//TODO: Lucid Icons and Toast to Sonner
import { RiCloseCircleLine } from "react-icons/ri";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  volume: string;
  out_of_stock?: boolean;
}

interface User {
  _id: string;
  cart_id: string;
  box_id: string;
}

interface FreeProductsProps {
  data: Product[];
  user: User;
  fetchCart: () => void;
  handleClose: () => void;
}

const FreeProducts = (props: FreeProductsProps) => {
  console.log("pyoooooooooooo", props);
  const router = useRouter();
  const scrollDivRef = useRef<HTMLDivElement | null>(null);
  const [isRestoringScroll, setIsRestoringScroll] = useState(true);

  const handleCartAdd = async (
    id: string,
    p: number,
    v: string,
    oos: boolean
  ) => {
    const res = await fetch("/api/user/free-product", {
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
        user_id: props.user._id,
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
        sessionStorage.setItem(
          "scrollPosition",
          scrollDivRef.current.scrollTop.toString()
        );
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("scrollPosition");

    if (savedScrollPosition !== null && scrollDivRef.current) {
      setTimeout(() => {
        if (scrollDivRef.current) {
          scrollDivRef.current.scrollTop = parseInt(savedScrollPosition, 10);
        }
        setIsRestoringScroll(false);
      }, 0);
    } else {
      setIsRestoringScroll(false);
    }
  }, [props.data]);

  return (
    <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center z-10">
      <div className="w-full sm:w-5/6  lg:w-1/2 bg-white rounded-lg p-3 sm:p-5 flex flex-col">
        <div className="w-full border-2 border-secondary px-5 pt-2 rounded-lg">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl text-primary font-medium">
              Pridėti produktą:
            </h1>
            <button onClick={props.handleClose} className="text-2xl font-bold">
              <RiCloseCircleLine />
            </button>
          </div>

          <div
            ref={scrollDivRef}
            className="my-5 flex flex-wrap py-2 h-[80vh] md:h-72 overflow-y-scroll overflow-x-hidden"
          >
            {!isRestoringScroll &&
              props.data.map((item, index) => (
                <div key={index} className="w-full">
                  {/* TODO: FIgure out the types here */}
                  {/* <ProductItem
                    data={item}
                    handleCartAdd={handleCartAdd}
                    user={props.user}
                  /> */}
                  <hr className="bg-secondary text-white w-2/3 h-[2px] mx-auto" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeProducts;
