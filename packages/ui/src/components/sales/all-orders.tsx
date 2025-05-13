import { useEffect, useState, useMemo } from "react";
import StatusPill from "./status-pill";
import Link from "next/link";

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/order/all");
                const data = await res.json();
                setOrders(data.data);
            } catch (error) {
                console.log("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    // Use useMemo to filter orders based on search and filter criteria
    const filteredOrders = useMemo(() => {
        if (!search && filter === "all") {
            return orders; // Return all orders when search is empty and filter is "all"
        }

        return orders.filter((order) => {
            const searchTerm = search.toLowerCase();
            const userName = order.user.name.toLowerCase();
            const orderId = order._id.toLowerCase();

            // Filter by status
            const matchesStatus =
                filter === "all" || order.status === filter.toLowerCase();

            // Filter by search term
            const matchesSearch =
                userName.includes(searchTerm) || orderId.includes(searchTerm);

            return matchesStatus && matchesSearch;
        });
    }, [orders, search, filter]);

    return (
        <>
            <div className="container mx-auto space-y-2 my-2">
                <div className="flex flex-col md:flex-row justify-between items-center md:space-x-5">
                    <div className="w-full md:w-3/4">
                        <div className="flex flex-col">
                            <label>Search By User&apos;s Name / Order ID</label>
                            <input
                                type="text"
                                className="w-full border border-primary rounded-lg p-1"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                data-umami-event="Inserted Search Value"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/4">
                        <div className="flex flex-col">
                            <label>Filter By Status:</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full border border-primary rounded-lg p-1"
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="hidden md:flex flex-row justify-between font-bold">
                        <div className="w-1/6 text-left">User</div>
                        <div className="w-1/6 text-right">Price</div>
                        <div className="w-1/5 text-center">Status</div>
                        <div className="w-1/6 text-right">Payment</div>
                        <div className="w-1/6 text-right">Delivery Date</div>
                        <div className="w-1/6 text-right">Actions</div>
                    </div>

                    {/* mobile */}
                    <div className="md:hidden flex flex-row justify-between font-bold">
                        <div>
                            <div className="text-left">User</div>
                            <div className="text-left">Price</div>
                            <div className="text-left">Status</div>
                        </div>
                        <div>
                            <div className="text-right">Payment</div>
                            <div className="text-right">Delivery Date</div>
                            <div className="text-right">Actions</div>
                        </div>
                    </div>
                </div>
                {filteredOrders.map((order, index) => (
                    <div
                        key={index}
                        className="hidden md:flex flex-row justify-between"
                    >
                        <div className="w-1/6 text-left">{order.user.name}</div>
                        <div className="w-1/6 text-right">
                            {Number(order.final_price).toFixed(3)} €
                        </div>
                        <div className="w-1/5 text-center">
                            <StatusPill status={order.status} />
                        </div>
                        <div className="w-1/6 text-right">
                            {order.payment_done ? "Paid" : "Not Paid"}
                        </div>
                        <div className="w-1/6 text-right">
                            {new Date(order.delivery_date).toDateString()}
                        </div>
                        <div className="w-1/6 text-right">
                            <Link
                                href={`/mod/order/${order._id}`}
                                className="text-primary"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                ))}

                {filteredOrders.map((order, index) => (
                    <div
                        key={index}
                        className="md:hidden flex flex-row justify-between border border-secondary my-2 p-2 rounded "
                    >
                        <div>
                            <div className="text-left">{order.user.name}</div>
                            <div className="text-left">
                                {Number(order.final_price).toFixed(3)} €
                            </div>
                            <div className="text-left">
                                <StatusPill status={order.status} />
                            </div>
                        </div>
                        <div>
                            <div className="text-right">
                                {order.payment_done ? "Paid" : "Not Paid"}
                            </div>
                            <div className="text-right">
                                {new Date(order.delivery_date).toDateString()}
                            </div>
                            <div className="text-right">
                                <Link
                                    href={`/mod/order/${order._id}`}
                                    className="text-primary"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AllOrders;
