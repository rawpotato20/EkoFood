import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewSwiper from "../review-swiper";
import { trackEventFunction } from "@/packages/utils/src/general";

//TODO: Nookies, toast to Sonner, Lucid Icons and react-dropdown-select to shadcn
import { setCookie } from "nookies";
import toast from "react-hot-toast";
import { RiCloseCircleLine } from "react-icons/ri";
import Select from "react-dropdown-select";

const DateSection = () => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return (
    <p className="text-sm">
      Jeigu aktyvuosite savo dėžę dabar, produktus gausite :{" "}
      <span className="font-bold">{formattedDate}</span>
    </p>
  );
};

interface DeliveryChoiceProps {
  data: {
    _id: string;
    name?: string;
    last_name?: string;
    phone?: string;
  };
  cart: {
    delivery_provider?: "venipak" | "omniva" | "dpd" | "lp";
    delivery_choice?: "mail" | "courier";
    pickup_address?: {
      name?: string;
      address?: string;
      city?: string;
      zipCode?: string;
    };
    delivery_address?: {
      full_name?: string;
      house_no?: string;
      street_name?: string;
      city?: string;
      postal_code?: string;
    };
  };
  settings: {
    shipping_fees: {
      [provider: string]: {
        [deliveryChoice: string]: number;
      };
    };
  };
  handleOpen5: (open: boolean) => void;
  handleFetchData: () => void;
}

const DeliveryChoice = (props: DeliveryChoiceProps) => {
  const router = useRouter();

  // const [address, setAddress] = useState(props.cart.delivery_address);
  const [fullName, setFullName] = useState(
    props.cart?.delivery_address?.full_name ||
      props.data.name + " " + props.data.last_name ||
      ""
  );
  const [houseNo, setHouseNo] = useState(
    props.cart?.delivery_address?.house_no
  );
  const [phoneNo, setPhoneNo] = useState(
    props.data?.phone?.replace("+370", "") || ""
  );

  const [city, setCity] = useState(props.cart?.delivery_address?.city);
  const [streetName, setStreetName] = useState(
    props.cart?.delivery_address?.street_name
  );
  const [postalCode, setPostalCode] = useState(
    props.cart?.delivery_address?.postal_code
  );
  const [provider, setProvider] = useState(props.cart?.delivery_provider);
  const [postOffices, setPostOffices] = useState([]);
  const [postOffice, setPostOffice] = useState(props.cart?.pickup_address);
  const [deliveryChoice, setDeliveryChoice] = useState(
    props.cart.delivery_choice
  );
  const [shippingFee, setShippingFee] = useState(0);

  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([
    {
      label: props.cart?.pickup_address?.name,
      value: props.cart?.pickup_address?.name,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  useEffect(() => {
    if (props.cart) {
      setProvider(props.cart.delivery_provider);
      setDeliveryChoice(props.cart.delivery_choice);
      setFullName(
        props.cart?.delivery_address?.full_name ||
          props.data.name + " " + props.data.last_name ||
          ""
      );
      setCity(props.cart?.delivery_address?.city);
      setStreetName(props.cart?.delivery_address?.street_name);
      setPostalCode(props.cart?.delivery_address?.postal_code);
      if (props.cart.delivery_provider === "venipak") {
        fetchVenipakPostOffices();
      } else if (props.cart.delivery_provider === "omniva") {
        fetchOmnivaPostOffices();
      } else if (props.cart.delivery_provider === "dpd") {
        fetchDPDPostOffices();
      } else if (props.cart.delivery_provider === "lp") {
        fetchLPPostOffices();
      }
    }
  }, [props.cart]);

  useEffect(() => {
    if (props.settings.shipping_fees && provider && deliveryChoice) {
      setShippingFee(
        props.settings.shipping_fees[provider]?.[deliveryChoice] ?? 9999
      );
    }
  }, [props.settings, provider, deliveryChoice]);

  const fetchVenipakPostOffices = async () => {
    setLoading3(true);
    const res = await fetch("/api/view/venipak-post-offices")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setPostOffices(res.data);
          let names = [];
          res.data.map((office) => {
            names.push({
              label: office.display_name,
              value: office.display_name,
            });
          });
          setOptions(names);
          setLoading3(false);
        } else {
          setPostOffices([]);
          toast.error("Biuras nerastas");
          setLoading3(false);
        }
      });
  };

  const fetchOmnivaPostOffices = async () => {
    setLoading3(true);
    const res = await fetch("/api/view/omniva-post-offices")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          // console.log(res.data);
          setPostOffices(res.data);
          let names = [];
          res.data.map((office) => {
            names.push({
              label: office.NAME,
              value: office.NAME,
            });
          });
          setOptions(names);
          setLoading3(false);
        } else {
          setPostOffices([]);
          toast.error("Biuras nerastas");
          setLoading3(false);
        }
      });
  };

  const fetchDPDPostOffices = async () => {
    setLoading3(true);
    const res = await fetch("/api/view/dpd-post-offices")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          // console.log(res.data);
          const data = sortDPDPostOffices(res.data);
          setPostOffices(data);
          let names = [];
          res.data.map((office) => {
            names.push({
              label: office.name,
              value: office.name,
            });
          });
          setOptions(names);
          setLoading3(false);
        } else {
          setPostOffices([]);
          toast.error("Biuras nerastas");
          setLoading3(false);
        }
      });
  };

  const fetchLPPostOffices = async () => {
    setLoading3(true);
    const res = await fetch("/api/view/lp-post-offices")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          // console.log(res.data);
          const data = sortLPPostOffices(res.data);
          setPostOffices(data);
          let names = [];
          res.data.map((office) => {
            names.push({
              label: office.city + ", " + office.name + ", " + office.address,
              value: office.city + ", " + office.name + ", " + office.address,
            });
          });
          setOptions(names);
          setLoading3(false);
        } else {
          setPostOffices([]);
          toast.error("Biuras nerastas");
          setLoading3(false);
        }
      });
  };

  const updateCartDelivery = async (
    choice,
    full_name,
    house_no,
    street_name,
    city,
    postal_code,
    phone_No
  ) => {
    if (
      !full_name ||
      !house_no ||
      !street_name ||
      !city ||
      !postal_code ||
      !phone_No
    ) {
      toast.error("Turite užpildyti visus laukelius!");
      return;
    }
    const fullPhone = `+370${phone_No}`;
    const add1 = {
      full_name,
      house_no,
      street_name,
      city,
      postal_code,
    };
    const res = await fetch("/api/user/cart-delivery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: props.data._id,
        shipping_fee: shippingFee,
        delivery_provider: provider,
        delivery_choice: choice,
        delivery_address: add1,
        user_phone: fullPhone,
      }),
    }).then((res) => res.json());
    if (res.success) {
      trackEventFunction("Delivery Choice Updated");
      toast.success(res.message);
      setLoading(false);
      props.handleOpen5(false);
      props.handleFetchData();
      // router.refresh();
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  const updateCartPickup = async (choice, add1) => {
    if (!phoneNo) {
      toast.error("Turite įvesti Telefono numeris");
      return;
    }
    if (!add1) {
      toast.error("Pamiršote pasirinkti paštomatą!");
      return;
    }
    const fullPhone = `+370${phoneNo}`;

    const res = await fetch("/api/user/cart-delivery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: props.data._id,
        shipping_fee: shippingFee,
        delivery_provider: provider,
        delivery_choice: choice,
        pickup_address: add1,
        user_phone: fullPhone,
      }),
    }).then((res) => res.json());
    if (res.success) {
      trackEventFunction("Delivery Choice Updated");
      toast.success(res.message);
      setLoading(false);
      props.handleOpen5(false);
      props.handleFetchData();
      // router.refresh();
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  const calculateShippingFees = (provider, delivery_choice) => {
    return props.settings.shipping_fees[provider][delivery_choice];
  };

  const handleLogo = (s) => {
    if (s == "venipak") return "/logos/venipak.png";
    else if (s == "lp") return "/logos/lpexpress.png";
    else if (s == "omniva") return "/logos/omniva.png";
    else if (s == "dpd") return "/logos/dpd.png";
  };

  function sortLPPostOffices(postOffices) {
    return postOffices.sort((a, b) => {
      const cityComparison = a.city.localeCompare(b.city);
      if (cityComparison !== 0) {
        return cityComparison;
      }
      return a.name.localeCompare(b.name);
    });
  }

  function sortDPDPostOffices(postOffices) {
    return postOffices.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <>
      <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center z-10 ">
        <div className=" relative size-[5.7rem] md:size-28 mb-1">
          <Image
            src="/auth/sustainable packaging.png"
            width={150}
            height={150}
            alt="gradient"
            className="rounded-3xl"
          />
        </div>
        <div className="relative w-full md:w-1/2 bg-white rounded-3xl p-3 md:p-5 flex flex-col  h-[53vh] md:h-[60vh] ">
          <div className="overflow-y-auto">
            <div className="flex flex-row justify-end items-center">
              <button
                onClick={() => {
                  props.handleOpen5(false);
                  document.body.style.overflow = "";
                }}
                className="text-2xl font-bold"
                data-umami-event="Close Delivery Choice Button Clicked"
              >
                <RiCloseCircleLine />
              </button>
            </div>
            <div className="my-1 md:my-5 space-y-4 z-10">
              <div className="space-y-2">
                <h1 className="text-xl md:text-4xl text-center text-primary font-medium">
                  PRISTATYMO BŪDAS
                </h1>
                <h3 className="text-sm md:text-lg text-center text-primary">
                  Pasirinkite, kaip norite gauti prekes:
                </h3>
              </div>
              <div className="flex flex-col">
                <label>Pasirinkti tiekėją:</label>
                <div className="flex flex-row justify-between space-x-2">
                  {provider && (
                    <div className="w-[5%] flex justify-center items-center">
                      <Image
                        src={handleLogo(provider)}
                        alt={provider}
                        width={30}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="w-[95%]">
                    <select
                      className="w-full border-2 border-primary rounded-lg py-2 px-10"
                      value={provider}
                      onChange={(e) => {
                        setProvider(e.target.value);
                        trackEventFunction(
                          `Provider ${e.target.value} Selected`
                        );
                        setDeliveryChoice("");
                        setSelected([]);
                        setPostOffice("");
                        setPostOffices([]);
                        if (e.target.value === "venipak") {
                          fetchVenipakPostOffices();
                        } else if (e.target.value === "omniva") {
                          fetchOmnivaPostOffices();
                        } else if (e.target.value === "dpd") {
                          fetchDPDPostOffices();
                        } else if (e.target.value === "lp") {
                          fetchLPPostOffices();
                        }
                      }}
                    >
                      <option value="">Pasirinkti tiekėją</option>
                      <option value="venipak">Venipak</option>
                      <option value="omniva">Omniva</option>
                      <option value="dpd">DPD</option>
                      <option value="lp">LP</option>
                    </select>
                  </div>
                </div>
              </div>
              {provider && (
                <div className="flex flex-col w-full">
                  <label>Pasirinkite pristatymo pasirinkimą</label>
                  <div className="flex flex-row justify-around items-center">
                    <div
                      className={`space-y-2 ${
                        deliveryChoice === "mail"
                          ? "border-2 border-primary rounded-lg p-2"
                          : ""
                      }`}
                    >
                      <div
                        className="flex justify-center items-center cursor-pointer"
                        onClick={() => {
                          setDeliveryChoice("mail");
                          trackEventFunction("Mail Delivery Button Clicked");
                        }}
                      >
                        <Image
                          src="/post-office.png"
                          width={100}
                          height={100}
                          alt="mail"
                        />
                      </div>
                      <button
                        className="w-full bg-primary text-white py-1 px-7 rounded-full"
                        onClick={() => {
                          setDeliveryChoice("mail");
                        }}
                        data-umami-event="Mail Delivery Button Clicked"
                      >
                        Paštomatu
                      </button>
                    </div>
                    <div
                      className={`space-y-2 cursor-pointer ${
                        deliveryChoice === "courier"
                          ? "border-2 border-primary rounded-lg p-2"
                          : ""
                      }`}
                      onClick={() => {
                        setDeliveryChoice("courier");
                        trackEventFunction("Courier Delivery Button Clicked");
                      }}
                    >
                      <div className="flex justify-center items-center">
                        <Image
                          src="/courier.png"
                          width={100}
                          height={100}
                          alt="courier"
                        />
                      </div>
                      <button
                        className="w-full bg-primary text-white py-1 px-7 rounded-full"
                        onClick={() => setDeliveryChoice("courier")}
                        data-umami-event="Courier Delivery Button Clicked"
                      >
                        Kurjeriu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {provider && deliveryChoice && (
                <>
                  <div>
                    Siuntimas: {calculateShippingFees(provider, deliveryChoice)}{" "}
                    €
                    <br />
                    <span className="text-xs text-gray-600">
                      Prašome įsitikinti, kad suvedėte teisingą informaciją,
                      kitaip jūsų siunta gali būti nepriststyta.
                    </span>
                  </div>
                  <div className="flex gap-3 items-center mt-2">
                    <p className="text-sm">Jūsų informacija saugi su mumis</p>
                    <Image
                      src="/auth/encrypted.png"
                      alt="ssl"
                      width={25}
                      height={25}
                      className="object-contain"
                    />
                  </div>
                </>
              )}

              {/* VENIPAK */}
              {loading3 &&
              deliveryChoice === "mail" &&
              provider === "venipak" ? (
                <div className="text-center animate-pulse">atsinešimas...</div>
              ) : (
                deliveryChoice === "mail" &&
                provider === "venipak" && (
                  <>
                    <div>
                      <div className="flex flex-col">
                        <label htmlFor="post-office">
                          Pasirinkite paštomatą:
                        </label>
                        <Select
                          searchable={true}
                          options={options}
                          values={selected}
                          noDataLabel="Paštomatas nerastas."
                          onChange={(value) => {
                            setSelected(value);
                            trackEventFunction("Venipak Post Office Selected");
                            if (value.length > 0 && value[0].value) {
                              const selectedOffice = postOffices.find(
                                (office) =>
                                  office.display_name === value[0].value
                              );

                              if (
                                selectedOffice &&
                                selectedOffice !== undefined &&
                                selectedOffice !== null &&
                                selectedOffice !== ""
                              ) {
                                const data = {
                                  id: selectedOffice.id,
                                  name: selectedOffice.display_name,
                                  address: selectedOffice.address,
                                  city: selectedOffice.city,
                                  zipCode: selectedOffice.zip,
                                };
                                setPostOffice(data);
                              }
                            }
                          }}
                        />
                      </div>

                      {/* <div className="my-2 text-center font-bold">
                                            ARBA
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row justify-center items-center">
                                                <button
                                                    className="bg-secondary rounded-lg py-1 px-4 font-medium"
                                                    type="button"
                                                    onClick={() => getNearby()}
                                                >
                                                    {loading2
                                                        ? "Įkeliama..."
                                                        : "Surasti man artimiausią paštomatą"}
                                                </button>
                                            </div>
                                            <textarea
                                                type="text"
                                                value={address2}
                                                onChange={(e) =>
                                                    setAddress2(e.target.value)
                                                }
                                                className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                                required
                                            />
                                        </div> */}
                    </div>
                    <div className="p-2 rounded-lg border border-primary">
                      <h5 className="text-sm">Pasirinktas paštas</h5>
                      <br />
                      {postOffice ? (
                        <>
                          <b>{postOffice.name}</b>
                          <br />
                          Adresas: {postOffice.address}
                          <br />
                          Miestas: {postOffice.city}
                          {/* <br />
                                                    Zip Code:{" "}
                                                    {postOffice.zipCode}
                                                    <br />
                                                    Contact:{" "}
                                                    {postOffice.contact}
                                                    <br />
                                                    <a
                                                        href={postOffice.mapUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-primary"
                                                    >
                                                        View on Map
                                                    </a> */}
                        </>
                      ) : (
                        <div className="text-xs">
                          <i>pasirinkite paštą iš viršaus</i>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col ">
                      <label>Telefono numeris:</label>
                      <div className="flex">
                        <span className="bg-gray-200 py-2 px-4 rounded-l-lg border-2 border-r-0 select-none  border-primary">
                          +370
                        </span>
                        <input
                          type="tel"
                          value={phoneNo}
                          onChange={(e) => {
                            setPhoneNo(e.target.value);
                          }}
                          className="w-full border-2 border-l-0 rounded-l-0 border-primary rounded-r-lg py-2 px-4"
                          required
                          data-umami-event="Phone Number Entered"
                        />
                      </div>
                    </div>
                    <DateSection />

                    <div className="flex justify-center">
                      <button
                        onClick={() => updateCartPickup("mail", postOffice)}
                        className="w-full bg-primary rounded-lg py-2 text-white"
                        data-umami-event="Venipak Update Cart Delivery Button Clicked"
                      >
                        {loading ? "Įkeliama..." : "Atnaujinti"}
                      </button>
                    </div>
                  </>
                )
              )}

              {deliveryChoice === "courier" && provider === "venipak" && (
                <>
                  {/* <div className="flex flex-col">
                                            <div className="flex flex-row justify-between items-center">
                                                <label>
                                                    Įveskite savo adresą
                                                </label>
                                                <button
                                                    className="bg-primary text-white py-1 px-4 rounded"
                                                    type="button"
                                                    onClick={() =>
                                                        getLocation()
                                                    }
                                                >
                                                    Gauti mano vietą
                                                </button>
                                            </div>
                                            <textarea
                                                type="text"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                                className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                                required
                                            />
                                        </div> */}
                  <div className="flex flex-col">
                    <label>Pilnas vardas:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      data-event-umami="Full Name Entered Venipak Courier"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>Miestas:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      data-umami-event="City Entered Venipak Courier"
                      required
                    />
                  </div>
                  <div className="flex flex-row justify-between space-x-2">
                    <div className="flex flex-col w-3/4">
                      <label>Gatvės pavadinimas:</label>
                      <input
                        type="text"
                        value={streetName}
                        onChange={(e) => setStreetName(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        data-umami-event="Street Name Entered Venipak Courier"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/4">
                      <label>Nr:</label>
                      <input
                        type="text"
                        value={houseNo}
                        onChange={(e) => setHouseNo(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        data-umami-event="House Number Entered Venipak Courier"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label>Pašto kodas:</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      data-umami-event="Postal Code Entered Venipak Courier"
                      required
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label>Telefono numeris:</label>
                    <div className="flex">
                      <span className="bg-gray-200 py-2 px-4 rounded-l-lg border-2 border-r-0 select-none  border-primary">
                        +370
                      </span>
                      <input
                        type="tel"
                        value={phoneNo}
                        onChange={(e) => {
                          setPhoneNo(e.target.value);
                        }}
                        className="w-full border-2 border-l-0 rounded-l-0 border-primary rounded-r-lg py-2 px-4"
                        data-umami-event="Phone Number Entered Venipak Courier"
                        required
                      />
                    </div>
                  </div>
                  <DateSection />

                  <div className="flex justify-center">
                    <button
                      onClick={() =>
                        updateCartDelivery(
                          "courier",
                          fullName,
                          houseNo,
                          streetName,
                          city,
                          postalCode,
                          phoneNo
                        )
                      }
                      className="w-full bg-primary rounded-lg py-2 text-white"
                      data-umami-event="Venipak Update Cart Delivery Button Clicked"
                    >
                      {loading ? "Įkeliama..." : "Atnaujinti"}
                    </button>
                  </div>
                </>
              )}

              {/* OMNIVA */}
              {loading3 &&
              deliveryChoice === "mail" &&
              provider === "omniva" ? (
                <div className="text-center animate-pulse">atsinešimas...</div>
              ) : (
                deliveryChoice === "mail" &&
                provider === "omniva" && (
                  <>
                    <div>
                      <div className="flex flex-col">
                        <label htmlFor="post-office">
                          Pasirinkite paštomatą:
                        </label>
                        <Select
                          searchable={true}
                          options={options}
                          values={selected}
                          noDataLabel="Paštomatas nerastas."
                          onChange={(value) => {
                            setSelected(value);
                            trackEventFunction("Omniva Post Office Selected");
                            if (value.length > 0 && value[0].value) {
                              const selectedOffice = postOffices.find(
                                (office) => office.NAME === value[0].value
                              );

                              if (
                                selectedOffice &&
                                selectedOffice !== undefined &&
                                selectedOffice !== null &&
                                selectedOffice !== ""
                              ) {
                                const data = {
                                  // id: selectedOffice.id,
                                  name: selectedOffice.NAME,
                                  address:
                                    selectedOffice.A7_NAME +
                                    " " +
                                    selectedOffice.A5_NAME,
                                  city: selectedOffice.A3_NAME,
                                  zipCode: selectedOffice.ZIP,
                                };
                                setPostOffice(data);
                              }
                            }
                          }}
                        />
                      </div>

                      {/* <div className="my-2 text-center font-bold">
                                        ARBA
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-center items-center">
                                            <button
                                                className="bg-secondary rounded-lg py-1 px-4 font-medium"
                                                type="button"
                                                onClick={() => getNearby()}
                                            >
                                                {loading2
                                                    ? "Įkeliama..."
                                                    : "Surasti man artimiausią paštomatą"}
                                            </button>
                                        </div>
                                        <textarea
                                                type="text"
                                                value={address2}
                                                onChange={(e) =>
                                                    setAddress2(e.target.value)
                                                }
                                                className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                                required
                                            />
                                    </div> */}
                    </div>
                    <div className="p-2 rounded-lg border border-primary">
                      <h5 className="text-sm">Pasirinktas paštas</h5>
                      <br />
                      {postOffice ? (
                        <>
                          <b>{postOffice.name}</b>
                          <br />
                          Adresas: {postOffice.address}
                          <br />
                          Miestas: {postOffice.city}
                          {/* <br />
                                                    Zip Code:{" "}
                                                    {postOffice.zipCode}
                                                    <br />
                                                    Contact:{" "}
                                                    {postOffice.contact}
                                                    <br />
                                                    <a
                                                        href={postOffice.mapUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-primary"
                                                    >
                                                        View on Map
                                                    </a> */}
                        </>
                      ) : (
                        <div className="text-xs">
                          <i>pasirinkite paštą iš viršaus</i>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col ">
                      <label>Telefono numeris:</label>
                      <div className="flex">
                        <span className="bg-gray-200 py-2 px-4 rounded-l-lg border-2 border-r-0 select-none  border-primary">
                          +370
                        </span>
                        <input
                          type="tel"
                          value={phoneNo}
                          onChange={(e) => {
                            setPhoneNo(e.target.value);
                          }}
                          data-umami-event="Phone Number Entered Omniva Mail"
                          className="w-full border-2 border-l-0 rounded-l-0 border-primary rounded-r-lg py-2 px-4"
                          required
                        />
                      </div>
                    </div>
                    <DateSection />
                    <div className="flex justify-center">
                      <button
                        onClick={() => updateCartPickup("mail", postOffice)}
                        className="w-full bg-primary rounded-lg py-2 text-white"
                        data-umami-event="Omniva Update Cart Delivery Button Clicked"
                      >
                        {loading ? "Įkeliama..." : "Atnaujinti"}
                      </button>
                    </div>
                  </>
                )
              )}

              {deliveryChoice === "courier" && provider === "omniva" && (
                <>
                  {/* <div className="flex flex-col">
                                            <div className="flex flex-row justify-between items-center">
                                                <label>
                                                    Įveskite savo adresą
                                                </label>
                                                <button
                                                    className="bg-primary text-white py-1 px-4 rounded"
                                                    type="button"
                                                    onClick={() =>
                                                        getLocation()
                                                    }
                                                >
                                                    Gauti mano vietą
                                                </button>
                                            </div>
                                            <textarea
                                                type="text"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                                className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                                required
                                            />
                                        </div> */}
                  <div className="flex flex-col">
                    <label>Pilnas vardas:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="Full Name Entered Omniva Courier"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>Miestas:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="City Entered Omniva Courier"
                    />
                  </div>
                  <div className="flex flex-row justify-between space-x-2">
                    <div className="flex flex-col w-3/4">
                      <label>Gatvės pavadinimas:</label>
                      <input
                        type="text"
                        value={streetName}
                        onChange={(e) => setStreetName(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        required
                        data-umami-event="Street Name Entered Omniva Courier"
                      />
                    </div>
                    <div className="flex flex-col w-1/4">
                      <label>Nr:</label>
                      <input
                        type="text"
                        value={houseNo}
                        onChange={(e) => setHouseNo(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        required
                        data-umami-event="House Number Entered Omniva Courier"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label>Pašto kodas:</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="Postal Code Entered Omniva Courier"
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label>Telefono numeris:</label>
                    <div className="flex">
                      <span className="bg-gray-200 py-2 px-4 rounded-l-lg border-2 border-r-0 select-none  border-primary">
                        +370
                      </span>
                      <input
                        type="tel"
                        value={phoneNo}
                        onChange={(e) => {
                          setPhoneNo(e.target.value);
                        }}
                        className="w-full border-2 border-l-0 rounded-l-0 border-primary rounded-r-lg py-2 px-4"
                        required
                        data-umami-event="Phone Number Entered Omniva Courier"
                      />
                    </div>
                  </div>
                  <DateSection />

                  <div className="flex justify-center">
                    <button
                      onClick={() =>
                        updateCartDelivery(
                          "courier",
                          fullName,
                          houseNo,
                          streetName,
                          city,
                          postalCode,
                          phoneNo
                        )
                      }
                      className="w-full bg-primary rounded-lg py-2 text-white"
                      data-umami-event="Omniva Update Cart Delivery Button Clicked"
                    >
                      {loading ? "Įkeliama..." : "Atnaujinti"}
                    </button>
                  </div>
                </>
              )}

              {/* DPD */}
              {loading3 && deliveryChoice === "mail" && provider === "dpd" ? (
                <div className="text-center animate-pulse">atsinešimas...</div>
              ) : (
                deliveryChoice === "mail" &&
                provider === "dpd" && (
                  <>
                    <div>
                      <div className="flex flex-col">
                        <label htmlFor="post-office">
                          Pasirinkite paštomatą:
                        </label>
                        <Select
                          searchable={true}
                          options={options}
                          values={selected}
                          noDataLabel="Paštomatas nerastas."
                          onChange={(value) => {
                            setSelected(value);
                            trackEventFunction("DPD Post Office Selected");
                            if (value.length > 0 && value[0].value) {
                              const selectedOffice = postOffices.find(
                                (office) => office.name === value[0].value
                              );

                              if (
                                selectedOffice &&
                                selectedOffice !== undefined &&
                                selectedOffice !== null &&
                                selectedOffice !== ""
                              ) {
                                const data = {
                                  id: selectedOffice.id,
                                  name: selectedOffice.name,
                                  address: selectedOffice.address.street,
                                  city: selectedOffice.address.city,
                                  zipCode: selectedOffice.address.postalCode,
                                };
                                setPostOffice(data);
                              }
                            }
                          }}
                        />
                      </div>

                      {/* <div className="my-2 text-center font-bold">
                                        ARBA
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-center items-center">
                                            <button
                                                className="bg-secondary rounded-lg py-1 px-4 font-medium"
                                                type="button"
                                                onClick={() => getNearby()}
                                            >
                                                {loading2
                                                    ? "Įkeliama..."
                                                    : "Surasti man artimiausią paštomatą"}
                                            </button>
                                        </div>
                                        <textarea
                                                type="text"
                                                value={address2}
                                                onChange={(e) =>
                                                    setAddress2(e.target.value)
                                                }
                                                className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                                required
                                            />
                                    </div> */}
                    </div>
                    <div className="p-2 rounded-lg border border-primary">
                      <h5 className="text-sm">Pasirinktas paštas</h5>
                      <br />
                      {postOffice ? (
                        <>
                          <b>{postOffice.name}</b>
                          <br />
                          Adresas: {postOffice.address}
                          <br />
                          Miestas: {postOffice.city}
                          {/* <br />
                                                    Zip Code:{" "}
                                                    {postOffice.zipCode}
                                                    <br />
                                                    Contact:{" "}
                                                    {postOffice.contact}
                                                    <br />
                                                    <a
                                                        href={postOffice.mapUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-primary"
                                                    >
                                                        View on Map
                                                    </a> */}
                        </>
                      ) : (
                        <div className="text-xs">
                          <i>pasirinkite paštą iš viršaus</i>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col ">
                      <label>Telefono numeris:</label>
                      <div className="flex">
                        <span className="bg-gray-200 py-2 px-4 rounded-l-lg border-2 border-r-0 select-none  border-primary">
                          +370
                        </span>
                        <input
                          type="tel"
                          value={phoneNo}
                          onChange={(e) => {
                            setPhoneNo(e.target.value);
                          }}
                          className="w-full border-2 border-l-0 rounded-l-0 border-primary rounded-r-lg py-2 px-4"
                          required
                          data-umami-event="Phone Number Entered DPD Mail"
                        />
                      </div>
                    </div>
                    <DateSection />
                    <div className="flex justify-center">
                      <button
                        onClick={() => updateCartPickup("mail", postOffice)}
                        className="w-full bg-primary rounded-lg py-2 text-white"
                        data-umami-event="DPD Update Cart Delivery Button Clicked"
                      >
                        {loading ? "Įkeliama..." : "Atnaujinti"}
                      </button>
                    </div>
                  </>
                )
              )}

              {deliveryChoice === "courier" && provider === "dpd" && (
                <>
                  {/* <div className="flex flex-col">
                                            <div className="flex flex-row justify-between items-center">
                                                <label>
                                                    Įveskite savo adresą
                                                </label>
                                                <button
                                                    className="bg-primary text-white py-1 px-4 rounded"
                                                    type="button"
                                                    onClick={() =>
                                                        getLocation()
                                                    }
                                                >
                                                    Gauti mano vietą
                                                </button>
                                            </div>
                                            <textarea
                                                type="text"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                                className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                                required
                                            />
                                        </div> */}
                  <div className="flex flex-col">
                    <label>Pilnas vardas:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="Full Name Entered DPD Courier"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>Miestas:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="City Entered DPD Courier"
                    />
                  </div>
                  <div className="flex flex-row justify-between space-x-2">
                    <div className="flex flex-col w-3/4">
                      <label>Gatvės pavadinimas:</label>
                      <input
                        type="text"
                        value={streetName}
                        onChange={(e) => setStreetName(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        required
                        data-umami-event="Street Name Entered DPD Courier"
                      />
                    </div>
                    <div className="flex flex-col w-1/4">
                      <label>Nr:</label>
                      <input
                        type="text"
                        value={houseNo}
                        onChange={(e) => setHouseNo(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        required
                        data-umami-event="House Number Entered DPD Courier"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label>Pašto kodas:</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="Postal Code Entered DPD Courier"
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label>Telefono numeris:</label>
                    <div className="flex">
                      <span className="bg-gray-200 py-2 px-4 rounded-l-lg border-2 border-r-0 select-none  border-primary">
                        +370
                      </span>
                      <input
                        type="tel"
                        value={phoneNo}
                        onChange={(e) => {
                          setPhoneNo(e.target.value);
                        }}
                        className="w-full border-2 border-l-0 rounded-l-0 border-primary rounded-r-lg py-2 px-4"
                        required
                        data-umami-event="Phone Number Entered DPD Courier"
                      />
                    </div>
                  </div>
                  <DateSection />

                  <div className="flex justify-center">
                    <button
                      onClick={() =>
                        updateCartDelivery(
                          "courier",
                          fullName,
                          houseNo,
                          streetName,
                          city,
                          postalCode,
                          phoneNo
                        )
                      }
                      className="w-full bg-primary rounded-lg py-2 text-white"
                      data-umami-event="DPD Update Cart Delivery Button Clicked"
                    >
                      {loading ? "Įkeliama..." : "Atnaujinti"}
                    </button>
                  </div>
                </>
              )}

              {/* LP */}
              {loading3 && deliveryChoice === "mail" && provider === "lp" ? (
                <div className="text-center animate-pulse">atsinešimas...</div>
              ) : (
                deliveryChoice === "mail" &&
                provider === "lp" && (
                  <>
                    <div>
                      <div className="flex flex-col">
                        <label htmlFor="post-office">
                          Pasirinkite paštomatą:
                        </label>
                        <Select
                          searchable={true}
                          options={options}
                          values={selected}
                          noDataLabel="Paštomatas nerastas."
                          onChange={(value) => {
                            setSelected(value);
                            trackEventFunction("LP Post Office Selected");
                            if (value.length > 0 && value[0].value) {
                              const selectedOffice = postOffices.find(
                                (office) => office.name === value[0].value
                              );

                              if (
                                selectedOffice &&
                                selectedOffice !== undefined &&
                                selectedOffice !== null &&
                                selectedOffice !== ""
                              ) {
                                const data = {
                                  id: selectedOffice.id,
                                  name: selectedOffice.name,
                                  address: selectedOffice.address,
                                  city: selectedOffice.city,
                                  zipCode: selectedOffice.postalCode,
                                };
                                setPostOffice(data);
                              }
                            }
                          }}
                        />
                      </div>

                      {/* <div className="my-2 text-center font-bold">
                                        ARBA
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-center items-center">
                                            <button
                                                className="bg-secondary rounded-lg py-1 px-4 font-medium"
                                                type="button"
                                                onClick={() => getNearby()}
                                            >
                                                {loading2
                                                    ? "Įkeliama..."
                                                    : "Surasti man artimiausią paštomatą"}
                                            </button>
                                        </div>
                                        <textarea
                                                type="text"
                                                value={address2}
                                                onChange={(e) =>
                                                    setAddress2(e.target.value)
                                                }
                                                className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                                required
                                            />
                                    </div> */}
                    </div>
                    <div className="p-2 rounded-lg border border-primary">
                      <h5 className="text-sm">Pasirinktas paštas</h5>
                      <br />
                      {postOffice ? (
                        <>
                          <b>{postOffice.name}</b>
                          <br />
                          Adresas: {postOffice.address}
                          <br />
                          Miestas: {postOffice.city}
                          {/* <br />
                                                    Zip Code:{" "}
                                                    {postOffice.zipCode}
                                                    <br />
                                                    Contact:{" "}
                                                    {postOffice.contact}
                                                    <br />
                                                    <a
                                                        href={postOffice.mapUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-primary"
                                                    >
                                                        View on Map
                                                    </a> */}
                        </>
                      ) : (
                        <div className="text-xs">
                          <i>pasirinkite paštą iš viršaus</i>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col ">
                      <label>Telefono numeris:</label>
                      <div className="flex">
                        <span className="bg-gray-200 py-2 px-4 rounded-l-lg border-2 border-r-0 select-none  border-primary">
                          +370
                        </span>
                        <input
                          type="tel"
                          value={phoneNo}
                          onChange={(e) => {
                            setPhoneNo(e.target.value);
                          }}
                          className="w-full border-2 border-l-0 rounded-l-0 border-primary rounded-r-lg py-2 px-4"
                          required
                          data-umami-event="Phone Number Entered LP Mail"
                        />
                      </div>
                    </div>
                    <DateSection />
                    <div className="flex justify-center">
                      <button
                        onClick={() => updateCartPickup("mail", postOffice)}
                        className="w-full bg-primary rounded-lg py-2 text-white"
                        data-umami-event="LP Update Cart Delivery Button Clicked"
                      >
                        {loading ? "Įkeliama..." : "Atnaujinti"}
                      </button>
                    </div>
                  </>
                )
              )}

              {deliveryChoice === "courier" && provider === "lp" && (
                <>
                  {/* <div className="flex flex-col">
                                            <div className="flex flex-row justify-between items-center">
                                                <label>
                                                    Įveskite savo adresą
                                                </label>
                                                <button
                                                    className="bg-primary text-white py-1 px-4 rounded"
                                                    type="button"
                                                    onClick={() =>
                                                        getLocation()
                                                    }
                                                >
                                                    Gauti mano vietą
                                                </button>
                                            </div>
                                            <textarea
                                                type="text"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                                className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                                required
                                            />
                                        </div> */}
                  <div className="flex flex-col">
                    <label>Pilnas vardas:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="Full Name Entered LP Courier"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label>Miestas:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="City Entered LP Courier"
                    />
                  </div>
                  <div className="flex flex-row justify-between space-x-2">
                    <div className="flex flex-col w-3/4">
                      <label>Gatvės pavadinimas:</label>
                      <input
                        type="text"
                        value={streetName}
                        onChange={(e) => setStreetName(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        required
                        data-umami-event="Street Name Entered LP Courier"
                      />
                    </div>
                    <div className="flex flex-col w-1/4">
                      <label>Nr:</label>
                      <input
                        type="text"
                        value={houseNo}
                        onChange={(e) => setHouseNo(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        required
                        data-umami-event="House Number Entered LP Courier"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label>Pašto kodas:</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="Postal Code Entered LP Courier"
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label>Telefono numeris:</label>
                    <div className="flex">
                      <span className="bg-gray-200 py-2 px-4 rounded-l-lg border-2 border-r-0 select-none  border-primary">
                        +370
                      </span>
                      <input
                        type="tel"
                        value={phoneNo}
                        onChange={(e) => {
                          setPhoneNo(e.target.value);
                        }}
                        className="w-full border-2 border-l-0 rounded-l-0 border-primary rounded-r-lg py-2 px-4"
                        required
                        data-umami-event="Phone Number Entered LP Courier"
                      />
                    </div>
                  </div>
                  <DateSection />

                  <div className="flex justify-center">
                    <button
                      onClick={() =>
                        updateCartDelivery(
                          "courier",
                          fullName,
                          houseNo,
                          streetName,
                          city,
                          postalCode,
                          phoneNo
                        )
                      }
                      className="w-full bg-primary rounded-lg py-2 text-white"
                      data-umami-event="LP Update Cart Delivery Button Clicked"
                    >
                      {loading ? "Įkeliama..." : "Atnaujinti"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* <div className="absolute bottom-0 left-0">
                                <Image
                                    src="/register-grad.png"
                                    width={300}
                                    height={300}
                                    alt="gradient"
                                    className="rounded-3xl"
                                />
                            </div> */}
          </div>
        </div>
        <ReviewSwiper />
        <div></div>
      </div>
    </>
  );
};

export default DeliveryChoice;
