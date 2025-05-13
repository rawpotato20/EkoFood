import Image from "next/image";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import ViewOrder from "./view-order";

const ViewUser = ({data}) => {
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(()=>{
        let totalAmount = 0;
        if(data.orders){
            data.orders.forEach((order) => {
                if(order.payment_done){
                    totalAmount+=order.final_price;
                }
            })
        }

        setTotalSpent(totalAmount);
    }, [])

    return (
        <>
            <div className="container mx-auto h-[80vh] overflow-y-scroll">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name">Name: </label>
                        {data.name ? data.name : ""}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="name">Last Name: </label>
                        {data.last_name ? data.last_name : ""}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="image">Date Created: </label>
                        {data.created_at ? new Date(data.created_at).toLocaleDateString() : ""}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="image">Total Spent: </label>
                        {totalSpent.toFixed(2)}$
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="image">Shipping Method: </label>
                        {data.cart.delivery_choice ? data.cart.delivery_choice : ""} - {data.cart.delivery_provider ? data.cart.delivery_provider : ""}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="image">Payment Connected: </label>
                        {data.payment_connected ? "Yes" : "No"}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="image">Orders: </label>
                        <div className="flex justify-between bg-black/70 text-white rounded-xl py-2 px-7">
                            <div className="w-1/6">Created At</div>
                            <div className="w-1/6">Original Price</div>
                            <div className="w-1/6">Final Price</div>
                            <div className="w-1/6">Payment Done</div>
                            <div className="w-1/6">Status</div>
                            <div className="w-1/6 text-right">Actions</div>
                        </div>
                    <div className="h-[60vh] overflow-y-scroll">
                        {data.orders?.length ? data.orders.map((order) => <div key={order._id} className="flex justify-between items-center py-2 px-7 border border-white rounded-xl">
                                        <div className="w-1/6">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}
                                        </div>
                                        <div className="w-1/6">
                                            {order.original_price ? order.original_price.toFixed(2) + "$" : ""}
                                        </div>
                                        <div className="w-1/6">
                                            {order.final_price ? order.final_price.toFixed(2)+ "$" : ""}
                                        </div>
                                        <div className="w-1/6">
                                            {order.payment_done ? "Yes" : "No"}
                                        </div>
                                        <div className="w-1/6">
                                            {order.status ? order.status : "None"}
                                        </div>
                                        <div className="w-1/6 text-right space-x-2">
                                            <button
                                                className="bg-secondary text-white rounded-xl px-4 py-1"
                                                onClick={() => {
                                                    setOpen(true);
                                                    setSelectedData(order.products);
                                                }}
                                            >
                                                <FiEdit2 />
                                            </button>
                                        </div>
                                    </div>
                                    ): "None"}
                                    </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name">Active Box: </label>
                        {data.box_id.current_box_status ? "Yes" : `No, last active ${new Date(data.box_id.updated_at).toLocaleDateString()}`}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name">Live Cart Items: </label>
                        <div className="flex justify-between bg-black/70 text-white rounded-xl py-2 px-7">
                            <div className="w-1/6">Image</div>
                            <div className="w-1/6">Name</div>
                            <div className="w-1/6">Price</div>
                            <div className="w-1/6">Quantity</div>
                        </div>
                    <div className="h-[60vh] overflow-y-scroll">
                        {data.cart.products.length ? data.cart.products.map((product) => <div key={product.product_id} className="flex justify-between items-center py-2 px-7 border border-white rounded-xl">
                                        <div className="w-1/6">
                                        <Image
                                                src={product.product.image}
                                                alt={product.product.name}
                                                width={100}
                                                height={100}
                                                className="w-[100px] h-[100px] object-contain"
                                            />                                        </div>
                                        <div className="w-1/6">
                                            {product.product.name ? product.product.name : ""}
                                        </div>
                                        <div className="w-1/6">
                                            {product.price ? Number(product.price).toFixed(2)+ "$" : ""}
                                        </div>
                                        <div className="w-1/6">
                                            {product.quantity ? product.quantity : "0"}
                                        </div>
                                    </div>) : "Empty Cart"}
                    </div>
                    </div>
                </div>
            </div>
            {open && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                    <div className="container mx-auto bg-white rounded-xl p-3">
                        <div className="flex justify-end">
                            <button onClick={() => setOpen(false)}>
                                <IoCloseCircleOutline className="text-2xl" />
                            </button>
                        </div>
                        <ViewOrder data={selectedData} />
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewUser;
