import ProductNav from "@/packages/ui/src/components/basic/product-nav";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiAddFill } from "react-icons/ri";
import ReactHtmlParser from "html-react-parser";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";

//TODO: Are we still using nookies?
import { parseCookies } from "nookies";
//TODO: Replace with lucide-react
import { FaChevronDown } from "react-icons/fa";
//TOOD: Replace with embla-carousel
// @ts-ignore
import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";

interface User {
  cart_id: string;
  box_id: string;
  active_delivery: boolean;
  // optionally add more fields if needed
}

interface GalleryItem {
  original: string;
  thumbnail: string;
}

interface VolumeItem {
  volume: number;
  price: number;
  out_of_stock: boolean;
}

async function getPageData(id: string) {
  const res = await fetch(`${process.env.WEB_URL}/api/view/product?id=${id}`, {
    cache: "no-store", // forces server-side fetch every time (like getServerSideProps)
  });

  const json = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.message || "Product not found");
  }

  return { product: json.data };
}

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const { product } = await getPageData(params.id);

  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    const cookie = parseCookies().user;
    const user = cookie ? JSON.parse(cookie) : null;

    if (!user) {
      router.push("/");
    } else {
      setUser(user);
    }
  }, []);

  const handleCartAdd = async (
    id: string,
    p: number,
    v: number,
    oos: boolean
  ) => {
    if (!user) return console.log("No user found.");

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

  return (
    <>
      <div className="bg-christmas">
        <div className="container mx-auto min-h-screen px-3 md:px-0 flex flex-col space-y-7">
          <ProductNav />

          <div className="flex flex-col md:flex-row justify-between space-y-5 md:space-y-0 md:space-x-10">
            <div className="w-full md:w-1/3 border-2 border-primary rounded-xl p-3 flex flex-col justify-between items-center space-y-5">
              <div className="space-y-3">
                <Image
                  src={product.image}
                  width={270}
                  height={290}
                  alt="product"
                  className="w-[270px] h-[290px] object-contain cursor-pointer mx-auto"
                  onClick={() => {
                    let g = [];
                    for (let i = 0; i < product.gallery.length; i++) {
                      g.push({
                        original: product.gallery[i],
                        thumbnail: product.gallery[i],
                      });
                    }
                    setGallery(g);
                    setOpen(true);
                  }}
                />
                <h1 className="text-2xl font-bold text-center">
                  {product.name}
                </h1>
              </div>
              <div className="space-y-3 w-full">
                {product.options.map(
                  (item: Record<string, string>, i: number) => {
                    const entry = Object.entries(item)[0];
                    if (!entry) return console.log("No entry found.");

                    const [key, value]: [string, string] = entry;

                    return (
                      <div
                        key={i}
                        className="w-full flex flex-col justify-between items-start"
                      >
                        <div className="text-base mr-2 font-medium">
                          {`${key.charAt(0).toUpperCase()}${key
                            .slice(1)
                            .toLowerCase()}`}
                          :
                        </div>
                        <div className="text-base">{value}</div>
                      </div>
                    );
                  }
                )}
                <div className="w-full flex flex-col justify-between">
                  <div className="text-base font-medium mr-2">Kaina:</div>
                  <div className="text-base space-y-2">
                    {product.volumes.map((item: VolumeItem, i: number) => {
                      return (
                        <div key={i} className="flex flex-row justify-between">
                          <div className="text-left w-1/4">{item.volume}</div>
                          <div className="text-left w-1/4">{item.price} €</div>
                          <div className="text-left w-1/4 text-red-500 font-medium">
                            {item.out_of_stock ? "Išparduota" : ""}
                          </div>
                          <div className="w-1/4 flex justify-end items-end">
                            <button
                              className="bg-secondary text-white py-1 px-4 rounded-lg"
                              data-umami-event="Add to Cart Button Clicked"
                              onClick={() => {
                                if (item.out_of_stock) {
                                  toast.error("Prekė išparduota");
                                  return;
                                }
                                if (user && user.active_delivery) {
                                  toast.error(
                                    "Prieš atlikdami naujus pakeitimus, išjunkite savo dėžutę"
                                  );
                                } else {
                                  handleCartAdd(
                                    product._id,
                                    item.price,
                                    item.volume,
                                    item.out_of_stock
                                  );
                                }
                              }}
                            >
                              <RiAddFill className="text-xl text-white" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* <div>
                            <button
                                className="bg-secondary py-2 px-14 rounded-lg"
                                onClick={() => {
                                    if (user.active_delivery) {
                                        toast.error(
                                            "Prieš atlikdami naujus pakeitimus, išjunkite savo dėžutę"
                                        );
                                    } else {
                                        handleCartAdd(props.product._id);
                                    }
                                }}
                            >
                                <RiAddFill className="text-xl text-white" />
                            </button>
                        </div> */}
            </div>
            <div className="w-full md:w-2/3 space-y-5 h-[70vh] overflow-y-scroll flex flex-col">
              {product.heading1 && (
                <Disclosure
                  defaultOpen={true}
                  as="div"
                  className="flex flex-col space-y-5 border-b border-gray-400"
                >
                  <DisclosureButton className="flex flex-row justify-between items-center text-left px-3 text-3xl font-medium">
                    {product.heading1}
                    <FaChevronDown className="text-sm group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <Transition
                    enter="transition-all duration-300"
                    enterFrom="transform scale-95 opacity-0 max-h-0 no-scrollbar"
                    enterTo="transform scale-100 opacity-100 max-h-96 no-scrollbar"
                    leaveFrom="transform scale-100 opacity-100 max-h-96 no-scrollbar"
                    leaveTo="transform scale-95 opacity-0 max-h-0 no-scrollbar"
                  >
                    <DisclosurePanel className="overflow-auto no-scrollbar">
                      <div className="html-parser px-3 pb-4">
                        {/* <Markdown>{props.product.text}</Markdown> */}
                        {ReactHtmlParser(product.text1)}
                      </div>
                    </DisclosurePanel>
                  </Transition>
                </Disclosure>
              )}
              {product.heading2 && (
                <Disclosure
                  as="div"
                  className="flex flex-col space-y-5 border-b border-gray-400"
                >
                  <DisclosureButton className="flex flex-row justify-between items-center text-left px-3 text-3xl font-medium">
                    {product.heading2}
                    <FaChevronDown className="text-sm group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <Transition
                    enter="transition-all duration-300"
                    enterFrom="transform scale-95 opacity-0 max-h-0 no-scrollbar"
                    enterTo="transform scale-100 opacity-100 max-h-96 no-scrollbar"
                    leaveFrom="transform scale-100 opacity-100 max-h-96 no-scrollbar"
                    leaveTo="transform scale-95 opacity-0 max-h-0 no-scrollbar"
                  >
                    <DisclosurePanel className="overflow-auto no-scrollbar">
                      <div className="html-parser px-3 pb-4">
                        {/* <Markdown>{props.product.text}</Markdown> */}
                        {ReactHtmlParser(product.text2)}
                      </div>
                    </DisclosurePanel>
                  </Transition>
                </Disclosure>
              )}
              {product.heading3 && (
                <Disclosure
                  as="div"
                  className="flex flex-col space-y-5 border-b border-gray-400"
                >
                  <DisclosureButton className="flex flex-row justify-between items-center text-left px-3 text-3xl font-medium">
                    {product.heading3}
                    <FaChevronDown className="text-sm group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <Transition
                    enter="transition-all duration-300"
                    enterFrom="transform scale-95 opacity-0 max-h-0 no-scrollbar"
                    enterTo="transform scale-100 opacity-100 max-h-96 no-scrollbar"
                    leaveFrom="transform scale-100 opacity-100 max-h-96 no-scrollbar"
                    leaveTo="transform scale-95 opacity-0 max-h-0 no-scrollbar"
                  >
                    <DisclosurePanel className="overflow-auto no-scrollbar">
                      <div className="html-parser px-3 pb-4">
                        {/* <Markdown>{props.product.text}</Markdown> */}
                        {ReactHtmlParser(product.text3)}
                      </div>
                    </DisclosurePanel>
                  </Transition>
                </Disclosure>
              )}
              {product.heading4 && (
                <Disclosure
                  as="div"
                  className="flex flex-col space-y-5 border-b border-gray-400"
                >
                  <DisclosureButton className="flex flex-row justify-between items-center text-left px-3 text-3xl font-medium">
                    {product.heading4}
                    <FaChevronDown className="text-sm group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <Transition
                    enter="transition-all duration-300"
                    enterFrom="transform scale-95 opacity-0 max-h-0 no-scrollbar"
                    enterTo="transform scale-100 opacity-100 max-h-96 no-scrollbar"
                    leaveFrom="transform scale-100 opacity-100 max-h-96 no-scrollbar"
                    leaveTo="transform scale-95 opacity-0 max-h-0 no-scrollbar"
                  >
                    <DisclosurePanel className="overflow-auto no-scrollbar">
                      <div className="html-parser px-3 pb-4">
                        {/* <Markdown>{props.product.text}</Markdown> */}
                        {ReactHtmlParser(product.text4)}
                      </div>
                    </DisclosurePanel>
                  </Transition>
                </Disclosure>
              )}
            </div>
          </div>
        </div>
        {open && (
          <>
            <div className="fixed top-0 left-0 w-full bg-black/30 min-h-screen flex justify-center items-center">
              <div className="w-full md:w-4/5 p-5 bg-white rounded-lg flex flex-col space-y-5">
                <div className="flex justify-end items-end">
                  <button
                    data-umami-event="Close Gallery Button Clicked"
                    className=""
                    onClick={() => setOpen(!open)}
                  >
                    x
                  </button>
                </div>
                <div className="p-5">
                  <ImageGallery items={gallery} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductPage;
