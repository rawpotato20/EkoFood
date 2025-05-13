import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import ModNav from "@/components/basic/mod-nav";
import { parseCookies } from "nookies";
import AllOrders from "@/components/sales/all-orders";
import LatestEarnings from "@/components/sales/latest-earnings";
import RecentOrders from "@/components/sales/recent-orders";

const Sales = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let admin = Boolean(parseCookies().admin);
        if (!admin) {
            router.push("/mod/login");
        }
    }, []);

    const [stats, setStats] = useState({});

    useEffect(() => {
        fetch("/api/order/total")
            .then((res) => res.json())
            .then((data) => {
                setStats(data.data);
            });
    }, []);

    return (
        <>
            <div className="container mx-auto px-3 md:px-0 my-5 space-y-4">
                <ModNav />
                <div className="space-y-5">
                    <div className="flex flex-col md:flex-row justify-between items-start space-y-5 md:space-y-0 md:space-x-5">
                        <div className="w-full md:w-1/3 grid grid-cols-2 gap-4">
                            <div className="bg-black text-white rounded-lg p-5">
                                <div className="text-2xl font-black">
                                    {stats?.totalOrders}
                                </div>
                                <div className="">Total Orders</div>
                            </div>
                            <div className="bg-black text-white rounded-lg p-5">
                                <div className="text-2xl font-black">
                                    {stats?.totalAmount}
                                </div>
                                <div className="">Total Earnings</div>
                            </div>
                            <div className="bg-black text-white rounded-lg p-5">
                                <div className="text-2xl font-black">
                                    {stats?.totalPendingOrders}
                                </div>
                                <div className="">Pending Orders</div>
                            </div>
                            <div className="bg-black text-white rounded-lg p-5">
                                <div className="text-2xl font-black">
                                    {stats?.totalDeliveredOrders}
                                </div>
                                <div className="">Delivered Orders</div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 border border-primary rounded-xl px-5 py-2 space-y-2">
                            <h1 className="font-bold">Latest Earnings</h1>
                            <div>
                                <LatestEarnings />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="border border-primary rounded-xl px-2 md:px-5 py-2 space-y-2">
                            <h1 className="font-bold">Recent Orders</h1>
                            <RecentOrders />
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="font-bold">All Orders</h1>
                    <div>
                        <AllOrders />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sales;
