"use client";

import Footer from "@/components/basic/footer";
import SettingsNav from "@/components/basic/settings-nav";
import SettingsAccount from "@/components/user/settings-account";
import SettingsBox from "@/components/user/settings-box";
import SettingsContact from "@/components/user/settings-contact";
import SettingsCoupon from "@/components/user/settings-coupon";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Setting = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState("");
    const [cart, setCart] = useState({});

    // const boxData = {
    //     current_box_price: 36.99,
    //     current_box_discount: 20,
    //     current_box_status: "active",
    //     current_box_final_price: 29.59,
    // };

    const [settings, setSettings] = useState([]);
    const [boxData, setBoxData] = useState({});

    const fetchUser = async (id) => {
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
        let user = JSON.parse(parseCookies().user || null);
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

    const fetchBox = async () => {
        const res = await fetch("/api/view/box?id=" + user.box_id).then((res) =>
            res.json()
        );
        if (res.success) {
            setBoxData(res.data);
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
        fetchSettings();
    }, []);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    useEffect(() => {
        if (user.box_id) {
            fetchBox();
        }
    }, [user]);

    const data = [
        "/settings-1.jpg",
        "/settings-2.jpg",
        "/settings-3.jpg",
        "/settings-4.jpg",
        // "/settings-5.jpg",
        // "/settings-6.jpg",

    ]

    return (
        <>
            <div className="container mx-auto px-3 md:px-0 flex flex-col space-y-10 mb-7">
                <SettingsNav />

                <div className="w-full flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                    <div className="md:w-1/2">
                        <SettingsAccount data={user} cart={cart} />
                        <br />
                        <br />
                        <SettingsBox data={boxData} cart={cart} />
                        <br />
                        <br />
                        <SettingsCoupon data={user} />
                        <br />
                        <SettingsContact data={settings} />
                        <br />
                        <br />
                        <h1 className="text-primary font-bold">
                            Visi skambučiai ir el. laiškai yra atsakomi per 1
                            d.d. nuo jų gavimo.
                        </h1>
                    </div>

                    {/* <div className="md:w-2/5 text-base md:text-xl font-light grid grid-cols-2 gap-2">
                        {data.map((item, index) => (
                            <Image
                                key={index}
                                src={item}
                                alt="settings"
                                className="w-full"
                                width={300}
                                height={300}
                            />
                        ))}
                    </div> */}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Setting;
