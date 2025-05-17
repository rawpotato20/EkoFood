import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ModNav from "@/packages/ui/src/components/basic/mod-nav";

//TODO: Replace with Sonner
import toast from "react-hot-toast";

type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

interface OrderProduct {
  name: string;
  image: string;
  price: number;
  // quantity?: number;
}

interface OrderUser {
  name: string;
  email: string;
}

interface Order {
  _id: string;
  status: OrderStatus;
  created_at: string;
  delivery_date: string;
  user: OrderUser;
  products: OrderProduct[];
  original_price: number;
  discount: number;
  final_price: number;
  saved: number;
  payment_done: boolean;
}

async function getPageData(id: string) {
  const res = await fetch(`${process.env.WEB_URL}/api/order/single?id=${id}`, {
    cache: "no-store",
  });

  const json = await res.json();

  if (!json.success || !json.data) {
    throw new Error(json.message || "Order not found");
  }

  return { order: json.data };
}

const AdminOrderPage = async ({ params }: { params: { id: string } }) => {
  const { order } = await getPageData(params.id);

  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState(order.status);
  const [isCharging, setIsCharging] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    const res = await fetch(`/api/order/update-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: order._id,
        status: newStatus,
      }),
    });
    const result = await res.json();
    if (result.success) {
      setStatus(newStatus);
      toast.success("Užsakymo būsena sėkmingai atnaujinta.");
      router.refresh();
    } else {
      toast.error("Nepavyko atnaujinti užsakymo būsenos.");
    }
  };

  const handleChargeUser = async () => {
    setIsCharging(true);
    const res = await fetch(`/api/order/charge-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: order._id,
      }),
    });
    const result = await res.json();
    if (result.success) {
      toast.success("Naudotojas sėkmingai apmokestintas.");
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setIsCharging(false);
  };

  return (
    <>
      <div className="container mx-auto px-3 md:px-0 py-6">
        <ModNav />
        <div className="bg-white border border-primary shadow rounded-lg p-5">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
              <p className="text-gray-600">
                Current Status: {status.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                Placed on: {new Date(order.created_at).toDateString()}
              </p>
              <p className="text-gray-600">
                Delivery Date: {new Date(order.delivery_date).toDateString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">User Details</h3>
            <p className="text-gray-800">Name: {order.user.name}</p>
            <p className="text-gray-800">Email: {order.user.email}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Products</h3>
            <div className="w-full flex flex-wrap justify-around">
              {order.products.map((product: OrderProduct, index: number) => (
                <div key={index} className="flex items-center mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-lg mr-4"
                  />
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {product.name}
                    </p>
                    {/* <p className="text-gray-600">
                                            Quantity: {product.quantity}
                                        </p> */}
                    <p className="text-gray-600">Price: {product.price} €</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Pricing Details</h3>
            <p className="text-gray-800">
              Original Price: {Number(order.original_price).toFixed(3)} €
            </p>
            <p className="text-gray-800">Discount: {order.discount} %</p>
            <p className="text-gray-800">
              Final Price: {Number(order.final_price).toFixed(3)} €
            </p>
            <p className="text-gray-800">
              User Saved: {Number(order.saved).toFixed(3)} €
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Payment</h3>
            <p className="text-gray-800">
              Payment Done: {order.payment_done ? "Yes" : "No"}
            </p>
          </div>

          {order.status !== "cancelled" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Update Order Status
              </h3>
              <select
                value={status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as OrderStatus)
                }
                className="border border-primary rounded-lg p-2"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          )}

          {order.status !== "cancelled" && !order.payment_done && (
            <div className="flex justify-end">
              <button
                onClick={handleChargeUser}
                className="bg-primary text-white px-4 py-2 rounded-lg"
                disabled={isCharging}
              >
                {isCharging ? "Charging..." : "Charge User"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOrderPage;
