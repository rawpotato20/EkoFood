import { trackEventFunction } from "@/packages/utils/src/general";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

//TODO: Lucide Icons and tost
import toast from "react-hot-toast";
import { RiSubtractLine } from "react-icons/ri";

interface CartItemProps {
  data: {
    product_id: string;
    quantity: number;
    price: number;
    volume: string;
    is_free_product?: boolean;
    product?: {
      image: string;
      name: string;
    };
  };
  user: {
    cart_id: string;
    box_id: string;
    active_delivery: boolean;
  };
  fetchCart: () => void;
  handleCartMinus: (productId: string, price: number, volume: string) => void;
}

const CartItem = (props: CartItemProps) => {
  const router = useRouter();
  const pathname = usePathname();

  if (!props.data.product) return null;
  const isFreeProduct = props.data.is_free_product;
  const handleFreeCartMinus = async (id: string, p: number, v: string) => {
    const res = await fetch("/api/user/free-product", {
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
      trackEventFunction("Free Product Removed from Cart");
      toast.success(res.message);
      props.fetchCart();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <div className="my-4 mx-3 w-11/12 md:w-72 bg-tertiary rounded-lg relative py-2 px-3 flex justify-end">
        <div>
          <Image
            src={props.data.product?.image}
            width={100}
            height={100}
            alt="product"
            className="absolute -top-5 left-0 w-[100px] h-[100px] object-contain"
          />
          {isFreeProduct && (
            <div className="absolute -top-3 left-[100px] ml-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              NEMOKAMA
            </div>
          )}
        </div>
        <div className="w-2/3 pb-2 pl-2 space-y-2">
          <h1 className="font-bold text-base">{props.data.product?.name}</h1>
          <h3 className="text-sm">
            Kiekis: {props.data?.volume} - {props.data?.quantity}
          </h3>
          <h5 className="">
            <Link
              href={`/product/` + props.data?.product_id}
              className="bg-primary rounded-md text-white text-sm py-1 px-10"
            >
              Plačiau
            </Link>
          </h5>
        </div>

        <button
          className="absolute -top-[4%] -right-[4%] bg-minus p-2 rounded-full"
          onClick={() => {
            if (props.user.active_delivery) {
              toast.error(
                "Prieš atlikdami naujus pakeitimus, išjunkite savo dėžutę"
              );
            } else {
              isFreeProduct
                ? handleFreeCartMinus(
                    props.data.product_id,
                    props.data.price,
                    props.data.volume
                  )
                : props.handleCartMinus(
                    props.data.product_id,
                    props.data.price,
                    props.data.volume
                  );
            }
          }}
          data-umami-event="Cart Minus Button Clicked"
        >
          <RiSubtractLine className="text-xs text-white" />
        </button>
      </div>
    </>
  );
};

export default CartItem;
