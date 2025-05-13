import { useEffect, useState } from "react";
import StatusPill from "./status-pill";
import Link from "next/link";

const RecentOrders = (props) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("/api/order/recent")
            .then((res) => res.json())
            .then((data) => {
                setOrders(data.data);
            });
    }, []);

    return (
        <>
            <div className="container mx-auto space-y-2">
                {orders.map((order, index) => (
                    <div key={index} className="flex flex-wrap md:flex-row justify-between">
                        <div className="w-1/5 text-left">{order.user.name}</div>
                        <div className="w-1/5 text-center">
                            <StatusPill status={order.status} />
                        </div>
                        <div className="w-1/5 text-center">
                            {Number(order.final_price).toFixed(3)} €
                        </div>
                        <div className="w-1/5 text-right">
                            {order.payment_done ? "Paid" : "Not Paid"}
                        </div>
                        <div className="w-1/5 text-right">
                            <Link href={`/mod/order/${order._id}`} className="text-primary">View</Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default RecentOrders;
