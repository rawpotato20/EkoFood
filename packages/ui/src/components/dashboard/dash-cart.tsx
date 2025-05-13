import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartItem from "./cart-item";
import toast from "react-hot-toast";
import { trackEventFunction } from "@/utils/general";
import Countdown from "react-countdown";
import FreeProducts from "./free-products";

const DashCart = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [freeProductsModal, setFreeProductsModal] = useState(false);

  const handleFreeProductsModal = () => {
    setFreeProductsModal(!freeProductsModal);
  };

  const handleCartMinus = async (id, p, v) => {
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
              const twentyFourHoursLater = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
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
                renderer={({ days, hours, minutes, seconds, completed }) => {
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
      {freeProductsModal && (
        <FreeProducts
          user={props.user}
          data={props.products}
          cart={props.cart}
          fetchCart={props.fetchCart}
          handleClose={handleFreeProductsModal}
        />
      )}
    </>
  );
};

export default DashCart;
