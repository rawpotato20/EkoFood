import DashboardNav from "@/packages/ui/src/components/basic/dashboard-nav";
import DashBox from "@/packages/ui/src/components/dashboard/dash-box";
import DashCart from "@/packages/ui/src/components/dashboard/dash-cart";
import DashProducts from "@/packages/ui/src/components/dashboard/dash-products";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactHtmlParser from "html-react-parser";

//TODO: Replace this with lucide-react
import { RiCloseCircleLine } from "react-icons/ri";
import { FaPlay } from "react-icons/fa";
//TODO: Find out if we're still using nookies, if not, replace
import { parseCookies, setCookie } from "nookies";
//TODO: Update the toast to Sonner for toast notifications
import toast from "react-hot-toast";

interface User {
  _id: string;
  cart_id: string;
  box_id: string;
  first_order_discount_received: boolean;
  // ...other user attributes
}

interface Settings {
  login_text: string;
  // ...other settings fields (e.g. contact info, titles, etc.)
}

interface Product {
  display_order: number;
  // ...other product fields (e.g., name, price, id, image, etc.)
}

interface Cart {
  products: [];
  /// ...other properties
}

const Dashboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);

  const [settings, setSettings] = useState<Settings>({ login_text: "" });
  const [videoModal, setVideoModal] = useState<boolean>(false);

  const handleVideoModal = () => {
    setVideoModal(!videoModal);
  };

  const fetchUser = async (id: string) => {
    const res = await fetch("/api/view/user?id=" + id).then((res) =>
      res.json()
    );
    if (res.success) {
      setUser(res.data);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    let userCookie = parseCookies().user;
    let user = userCookie ? JSON.parse(userCookie) : null;

    if (!user) {
      router.push("/");
    } else {
      fetchUser(user._id);
    }
  }, []);

  const fetchSettings = async () => {
    const res = await fetch("/api/view/settings").then((res) => res.json());
    if (res.success) {
      setSettings(res.data);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings.login_text) {
      let showModal = parseCookies().showModal || "true";
      if (showModal === "true") {
        document.body.style.overflow = "hidden";
        setOpen(true);
      }
    }
  }, [settings]);

  // const cart = {
  //     quantity: 1,
  //     last_delivery: "2021-10-10",
  //     next_delivery: "2021-11-10",
  //     original_price: 10,
  //     discount: 1,
  //     final_price: 9,
  //     saved: 1,
  //     products: [
  //         {
  //             id: 1,
  //             name: "Product 1",
  //             image: "/product.png",
  //             price: 10,
  //             volume: "500mL",
  //             strength: "+5",
  //             power: "+5",
  //             intelligence: "+5",
  //             hunger: "+5",
  //         }
  //     ],
  // };

  // const products = [
  //     {
  //         id: 1,
  //         name: "Product 1",
  //         image: "/product.png",
  //         price: 10,
  //         volume: "500mL",
  //         strength: "+5",
  //         power: "+5",
  //         intelligence: "+5",
  //         hunger: "+5",
  //     },
  //     {
  //         id: 2,
  //         name: "Product 2",
  //         image: "/product.png",
  //         price: 10,
  //         volume: "500mL",
  //         strength: "+5",
  //         power: "+5",
  //         intelligence: "+5",
  //         hunger: "+5",
  //     },
  //     {
  //         id: 3,
  //         name: "Product 3",
  //         image: "/product.png",
  //         price: 10,
  //         volume: "500mL",
  //         strength: "+5",
  //         power: "+5",
  //         intelligence: "+5",
  //         hunger: "+5",
  //     },
  // ];

  //TODO: see the actual interface of cart
  const [cart, setCart] = useState<any>();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await fetch("/api/view/products").then((res) => res.json());
    if (res.success) {
      setProducts(
        (res.data as Product[]).sort(
          (a, b) => a.display_order - b.display_order
        )
      );
    } else {
      toast.error(res.message);
    }
  };

  const fetchCart = async () => {
    if (!user) return console.log("No user.");
    const res = await fetch(`/api/view/cart?id=${user.cart_id}`).then((res) =>
      res.json()
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

  const handleFetchData = () => {
    fetchProducts();
    fetchCart();
    fetchSettings();
    if (!user) return console.log("No user.");
    fetchUser(user._id);
  };

  const customTrack = async (label: string, value: number) => {
    const res = await fetch("/api/view/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link: "dashboard",
        label: label,
        value: value,
      }),
    }).then((res) => res.json());
    if (res.success) {
      return;
    } else {
      console.log(res.message);
    }
  };

  return (
    <>
      <div className="bg-christmas">
        {!user ||
          (!user.first_order_discount_received && (
            <div className="bg-secondary overflow-hidden relative">
              <div className="w-full flex items-center justify-center whitespace-nowrap py-1 px-4">
                <span className="text-sm md:text-base  text-white  text-center">
                  10% nuolaida <span className="font-extrabold">Jums</span> nuo
                  pirmo užsakymo!
                </span>
              </div>
            </div>
          ))}

        <div></div>
        <div className="container mx-auto min-h-screen px-3 md:px-0 flex flex-col space-y-7 mb-10">
          <DashboardNav user={user} customTrack={customTrack} />

          <div className="flex flex-col md:flex-row justify-between items-center my-10 space-y-10 md:space-y-0 md:space-x-10">
            <div className="md:w-2/5 h-full">
              <DashBox
                user={user}
                data={cart}
                settings={settings}
                customTrack={customTrack}
                handleFetchData={handleFetchData}
              />
            </div>
            <div className="md:w-3/5 h-full flex flex-col justify-between space-y-10 md:space-y-0">
              <div>
                <DashCart
                  user={user}
                  data={cart.products}
                  products={products}
                  fetchCart={fetchCart}
                  handleFetchData={handleFetchData}
                />
              </div>
              <br />
              <div>
                <DashProducts
                  user={user}
                  data={products}
                  cart={cart}
                  fetchCart={fetchCart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <>
          <div className="fixed top-0 left-0 w-full h-screen bg-black/50 z-10 flex justify-center md:items-center  ">
            {settings.login_text && (
              <div className="flex relative max-sm:h-5/6 mt-[6%] md:mt-0 w-5/6 md:w-2/3 bg-white p-5 rounded-3xl shadow-lg space-y-5 ">
                <div
                  className="relative w-full hidden  h-[70vh] mx-auto sm:flex flex-col items-center justify-center my-12 rounded-lg"
                  onClick={handleVideoModal}
                >
                  <h3 className="text-black md:text-2xl mb-5 z-0">
                    Kaip tai veikia:
                  </h3>
                  <div className="relative w-full h-full">
                    <div className="absolute bg-black/50 p-4 rounded flex items-center justify-center w-full h-full">
                      <FaPlay className="h-16 w-16 text-white" />
                    </div>
                    <video
                      className=" w-full h-full rounded-lg"
                      autoPlay
                      muted
                      loop
                      poster="/poster.jpg"
                    >
                      <source src="/Main_1.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>{" "}
                <div className="">
                  <div className="z-10 space-y-5 ">
                    <div className="flex flex-col justify-center mt-aut">
                      <h1 className="text-lg md:text-2xl font-medium text-primary text-center">
                        SVEIKI ATVYKĘ Į
                      </h1>
                      <Image
                        src="/logo_summer.svg"
                        alt="Login"
                        width={250}
                        height={140}
                        className="object-contain mx-auto mt-4"
                      />
                    </div>{" "}
                    <div className="html-parser px-3 pb-4 h-[45vh] sm:h-[50vh] overflow-y-auto scroll-smooth">
                      <div
                        className="w-full mx-auto flex sm:hidden flex-col items-center justify-center my-12"
                        onClick={handleVideoModal}
                      >
                        <h3 className="text-black md:text-2xl ">
                          Kaip tai veikia:
                        </h3>
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="absolute w-1/2 bg-black/50 p-4 rounded flex items-center justify-center  h-full">
                            <FaPlay className="h-16 w-16 text-white" />
                          </div>
                          <video
                            className="w-full h-64 rounded-lg shadow-lg"
                            autoPlay
                            muted
                            loop
                            poster="/poster.jpg"
                          >
                            <source src="/Main_1.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>{" "}
                        </div>
                      </div>
                      {ReactHtmlParser(settings.login_text)}
                    </div>
                    <div className="flex justify-center ">
                      <button
                        className="bg-primary text-white px-7 py-2 rounded-full z-10"
                        data-umami-event="Welcome Modal Button Clicked"
                        onClick={() => {
                          setCookie(null, "showModal", "false", {
                            maxAge: 30 * 24 * 60 * 60,
                            path: "/",
                          });
                          setOpen(false);
                          document.body.style.overflow = "";
                        }}
                      >
                        Einu užsakinėti!
                      </button>
                    </div>
                  </div>
                  {/* <div className="absolute bottom-0 left-0">
                    <Image
                      src="/register-grad.png"
                      width={200}
                      height={400}
                      alt="gradient"
                      className="rounded-3xl"
                    />
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {videoModal && (
        <>
          <div className="fixed top-0 left-0 w-full h-screen bg-black/50 z-10 flex justify-center md:items-center  ">
            <div className="relative max-sm:h-5/6 mt-[6%] md:mt-0 w-5/6 md:w-fit bg-white p-5 rounded-3xl shadow-lg space-y-5 ">
              <div className="z-10  ">
                <div className="flex justify-between">
                  <h3 className="md:text-3xl text-center sm:text-xl w-11/12">
                    Veikimo principas
                  </h3>

                  <button
                    onClick={handleVideoModal}
                    className="text-2xl font-bold"
                    data-umami-event="Close Video Button Clicked"
                  >
                    <RiCloseCircleLine />
                  </button>
                </div>

                <video
                  className="w-full h-[75vh] sm:h-[87vh] rounded-3xl"
                  autoPlay
                  controls
                  muted
                  loop
                  poster="/poster.jpg"
                >
                  <source src="/Main_1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </>
      )}
      {/* <Footer /> */}
    </>
  );
};

export default Dashboard;
