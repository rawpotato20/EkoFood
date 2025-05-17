import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import CartItem from "./cart-item";
import toast from "react-hot-toast";
import { trackEventFunction } from "@/packages/utils/src/general";
import FreeProducts from "./free-products";
import { Product } from "../admin/edit-products";

//TODO: Consider alternatives for this
import Countdown from "react-countdown";
import type { CountdownRenderProps } from "react-countdown";

interface CartItemData {
  product_id: string;
  quantity: number;
  price: number;
  volume: string;
  is_free_product?: boolean;
  product?: {
    image: string;
    name: string;
  };
}

interface User {
  cart_id: string;
  box_id: string;
  created_at: string;
  active_delivery: boolean;
}

interface DashCartProps {
  data: CartItemData[];
  user: User;
  products: Product[];
  cart: any;
  fetchCart: () => void;
}

const DashCart = (props: DashCartProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [freeProductsModal, setFreeProductsModal] = useState(false);

  const handleFreeProductsModal = () => {
    setFreeProductsModal(!freeProductsModal);
  };

  const handleCartMinus = async (id: string, p: number, v: string) => {
    const res = await fetch("/api/user/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.user.cart_id,
        id2: props.user.box_id,
        id3: id,
        price: p,
        volume: v,
      }),
    }).then((res) => res.json());
    if (res.success) {
      trackEventFunction("Product Removed from Cart");
      toast.success(res.message);
      props.fetchCart();
    } else {
      toast.error(res.message);
    }
  };
  const createdAt = new Date(props.user.created_at);
  const now = new Date();
  const twentyFourHoursLater = new Date(
    createdAt.getTime() + 24 * 60 * 60 * 1000
  );
  return (
    <>
      <div className="w-full border-2 border-secondary px-2 md:px-5 pt-2 rounded-lg">
        <div className="text-xl text-primary font-medium">Jūsų produktai:</div>
        <div className="my-5 flex flex-wrap items-start px-2 md:px-0 py-2 h-72 overflow-y-scroll overflow-x-hidden">
          {props.data?.length > 0 ? (
            props.data.map((item, index) => {
              return (
                <CartItem
                  key={index}
                  data={item}
                  handleCartMinus={handleCartMinus}
                  user={props.user}
                  fetchCart={props.fetchCart}
                />
              );
            })
          ) : (
            <>
              <div className="text-center w-full">Jūsų krepšelis tuščias.</div>
              <div className="text-center w-full">
                Gaukite 10% nuolaidą nuo pirmo užsakymo!
              </div>
            </>
          )}
        </div>
        {/* here  */}
        {now <= twentyFourHoursLater && (
          <div className="flex flex-col gap-1 md:flex-row justify-between items-center mb-4 w-full bg-gray-200 py-2 px-5 rounded-2xl">
            {props.user.created_at && (
              <Countdown
                date={
                  new Date(
                    new Date(props.user.created_at).getTime() +
                      24 * 60 * 60 * 1000
                  )
                }
                renderer={({
                  days,
                  hours,
                  minutes,
                  seconds,
                  completed,
                }: CountdownRenderProps) => {
                  if (completed) {
                    return <span>Pasibaigė</span>;
                  } else {
                    return (
                      <div className="flex flex-col sm:flex w-auto justify-center items-center ">
                        <div className="text-lg font-bold flex gap-2">
                          <div className="bg-[#8ace98] rounded-xl py-2 px-2 text-gray-700">
                            {hours}h
                          </div>
                          <div className="bg-[#8ace98] rounded-xl py-2 px-2 text-gray-700">
                            {minutes}m
                          </div>
                          <div className="bg-[#8ace98] rounded-xl py-2 px-2 text-gray-700">
                            {seconds}s
                          </div>
                        </div>
                        <h3 className="text-sm  mt-2 text-gray-700 text-center">
                          Jeigu padarysite užsakymą per pirmas 24val., vienas
                          jūsų pasirinkimo produktas nemokamai!
                        </h3>
                      </div>
                    );
                  }
                }}
              />
            )}

            <button
              onClick={handleFreeProductsModal}
              className="bg-secondary rounded-xl py-2 px-2 text-white text"
            >
              Išsirinkti produktą
            </button>
          </div>
        )}
      </div>
      {freeProductsModal &&
        true
        //TODO: Figure the types out here
        // <FreeProducts
        //   user={props.user}
        //   data={props.products}
        //   cart={props.cart}
        //   fetchCart={props.fetchCart}
        //   handleClose={handleFreeProductsModal}
        // />
      }
    </>
  );
};

export default DashCart;
