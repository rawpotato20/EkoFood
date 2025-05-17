import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

//TODO: Update these
import Select from "react-select";
import toast from "react-hot-toast";
import {
  RiCheckDoubleLine,
  RiFlashlightLine,
  RiLoader2Line,
} from "react-icons/ri";

interface User {
  _id: string;
  email: string;
  stripe_customer_id: string;
  first_order_discount_received: boolean;
}

interface Cart {
  final_price: number;
}

interface CheckoutButtonProps {
  user: User;
  cart: Cart;
}

interface Coupon {
  coupon: {
    _id: string;
    name: string;
    percentage: number;
  };
}

interface CouponOption {
  value: string;
  label: string;
  percentage: number;
}

const CheckoutButton = (props: CheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<CouponOption | null>(null);
  const [activationLoading, setActivationLoading] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const router = useRouter();

  const fetchCoupons = async () => {
    const res = await fetch(`/api/view/coupons/${props.user._id}`).then((res) =>
      res.json()
    );
    if (res.success) {
      const couponsSelected = res.data.map((coupon: Coupon) => ({
        value: coupon.coupon._id,
        label: coupon.coupon.name,
        percentage: coupon.coupon.percentage,
      }));
      setCoupons(couponsSelected);
    }
  };

  const handleActivateCoupon = async () => {
    setActivationLoading(true);
    if (!coupon) {
      setActivationLoading(false);
      toast.error("Pasirinkite kuponą");
      return;
    }
    const res = await fetch("/api/user/coupon/activate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        couponId: coupon.value,
        userId: props.user._id,
      }),
    }).then((res) => res.json());

    if (res.success) {
      setActivationSuccess(true);
      setActivationLoading(false);
      toast.success(res.message);
      router.refresh();
    } else {
      setActivationLoading(false);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    if (props.user._id) fetchCoupons();
  }, [props.user._id]);

  const handleClick = async () => {
    setLoading(true);

    // Call your backend to create the Checkout session
    const res = await fetch("/api/user/stripe/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.user.stripe_customer_id,
        email: props.user.email,
      }),
    });

    const { sessionId } = await res.json();

    // Redirect to Stripe
    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUB_KEY;

    if (!stripePublicKey) {
      throw new Error(
        "Stripe public key is not defined in environment variables"
      );
    }
    const stripe = await loadStripe(stripePublicKey);
    if (!stripe) return console.log("No stripe thing found");
    await stripe.redirectToCheckout({ sessionId });

    setLoading(false);
  };

  const discountedPrice = useMemo(() => {
    let price = props.cart?.final_price;

    if (!price || isNaN(price)) {
      return "";
    }

    if (!props.user.first_order_discount_received) {
      price = price - (price * 10) / 100;
    }

    if (coupon && coupon.percentage) {
      price = price - (price * coupon.percentage) / 100;
    }

    return price > 0 ? price.toFixed(2) + "€" : "";
  }, [
    coupon,
    props.cart?.final_price,
    props.user.first_order_discount_received,
  ]);

  return (
    <div className=" sm:h-auto ">
      <h1 className="text-center">
        Prašau pridėkite savo mokėjimo būdą ateities pirkiniams paspausdami
        žemiau esantį mygtuką.
      </h1>
      <br />
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        data-umami-event="Save the card information"
        className="bg-secondary text-white rounded-lg py-2 px-10"
      >
        {loading ? "Įkeliama..." : "Išsaugokite kortelės informaciją"}
      </button>
      <br />
      <h3 className="text-sm text-gray-400 mt-2">
        Galutinė suma bus nuskaityta tik 7 dienoms likus iki pristatymo datos,
        iki to laiko galite atšaukti siuntimą.
      </h3>

      <div className="w-full mx-auto md:space-y-4 ">
        <div className="space-y-2">
          <label
            htmlFor="coupon-select"
            className="block text-lg font-medium text-gray-700"
          >
            Kuponas
          </label>
          <div className="flex flex-col md:flex-row gap-2 max-w-full items-center justify-center">
            <div className="relative w-full md:w-auto">
              <Select<CouponOption>
                id="coupon-select"
                value={coupon}
                isDisabled={activationLoading || couponLoading}
                onChange={(selectedOption) => setCoupon(selectedOption)}
                options={coupons}
                className="w-full md:w-64 md:h-12 rounded-3xl"
                classNamePrefix="react-select"
                placeholder="Pasirinkite kuponą"
                isClearable
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    borderRadius: "0.375rem",
                    borderColor: "#d1d5db",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    borderRadius: "0.375rem",
                    overflow: "hidden",
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isSelected
                      ? "#4ade80"
                      : state.isFocused
                        ? "#d1fae5"
                        : "white",
                    color: state.isSelected ? "white" : "black",
                    "&:hover": {
                      backgroundColor: "#d1fae5",
                    },
                  }),
                }}
              />
            </div>

            <div className="flex flex-col md:flex-col gap-2 md:w-auto">
              <button
                onClick={handleActivateCoupon}
                disabled={activationLoading || activationSuccess}
                className=" bg-secondary hover:bg-green-700 text-white 
                  font-medium rounded-lg sm:py-3 sm:px-5 py-1 px-2 whitespace-nowrap
                  transition-all duration-200 flex items-center justify-center gap-2
                  disabled:bg-green-400 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-4 focus:ring-green-300/30"
                data-umami-event="Clicked coupon"
              >
                {activationLoading ? (
                  <>
                    <RiLoader2Line className="w-5 h-5 animate-spin" />
                    <span>Aktyvuojama...</span>
                  </>
                ) : activationSuccess ? (
                  <>
                    <RiCheckDoubleLine className="w-5 h-5" />
                    <span>Sėkmingai aktyvuota!</span>
                  </>
                ) : (
                  <>
                    <RiFlashlightLine className="w-5 h-5" />
                    <span>Aktyvuoti kuponą</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <p>
              Pradinė kaina:{" "}
              {props.cart?.final_price
                ? props.cart?.final_price?.toFixed(2) + "€"
                : "0€"}
            </p>
            <p>10% nuolaidą pirmam užsakymui!</p>
            <p>Po nuolaidos : {discountedPrice ? discountedPrice : "0€"}</p>
          </div>
        </div>
      </div>

      <div className="w-full relative h-5 flex justify-center mt-6 pt-10 md:pt-24 px-4 aspect-[13545/209]">
        <Image
          src="/auth/stripething.png"
          fill
          alt="stripe"
          className="object-cover"
        />
      </div>

      <div className="w-full relative h-10 flex justify-center mt-2 bg-[#415946]">
        <Image
          src="/auth/cards.png"
          fill
          alt="cards"
          className="object-contain left-0"
        />
      </div>
    </div>
  );
};

export default CheckoutButton;
