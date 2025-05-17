import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: Nookies and Toast
import { parseCookies } from "nookies";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [loading2, setLoading2] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    let aPass = parseCookies().adminPassword;
    if (aPass) {
      setAdminPassword(aPass);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/view/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Orders Fetch Response:", data);

      if (data.success) {
        setOrders(data.data);
      } else {
      }
    } catch (error) {
      console.error("Orders Fetch Error:", error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    console.log("daaaaaa");
    fetchOrders();
  }, [adminPassword]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto bg-slate-200 p-5 rounded-xl mt-5 space-y-5 h-[80vh]">
        <div className="flex justify-between">
          <input
            type="text"
            placeholder="Type here to search..."
            className="w-1/3 bg-white rounded-xl py-2 px-4"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div>
          <div className="flex justify-between bg-black/70 text-white rounded-xl py-2 px-7">
            <div className="w-1/6">Order ID</div>
            <div className="w-1/6">User</div>
            <div className="w-1/6">Total Price</div>
            <div className="w-1/6">Status</div>
            <div className="w-1/6">Delivery</div>
            <div className="w-1/6 text-right">Actions</div>
          </div>
          <div className="h-[60vh] overflow-y-scroll">
            {/* {filteredUsers.map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center py-2 px-7 border border-white rounded-xl"
              >
                <div className="w-1/6">{order.order_id || 'N/A'}</div>
                <div className="w-1/6">
                  {order.user?.name ? `${order.user.name} ${order.user.last_name || ''}` : 'N/A'}
                </div>
                <div className="w-1/6">
                  {order.final_price ? `${order.final_price.toFixed(2)} €` : 'N/A'}
                </div>
                <div className="w-1/6">
                  <span 
                    className={`px-2 rounded-lg ${
                      order.status === 'delivered' ? 'bg-green-300' :
                      order.status === 'shipped' ? 'bg-blue-300' :
                      order.status === 'pending' ? 'bg-yellow-300' :
                      order.status === 'cancelled' ? 'bg-red-300' : 
                      'bg-gray-300'
                    }`}
                  >
                    {order.status || 'N/A'}
                  </span>
                </div>
                <div className="w-1/6">
                  {order.delivery_choice || 'N/A'}
                </div>
                <div className="w-1/6 text-right space-x-2">
                  <button
                    className="bg-secondary text-white rounded-xl px-4 py-1"
                    onClick={() => {
                      setOpen2(true);
                      setSelectedData(order);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="bg-danger text-white rounded-xl px-4 py-1"
                    onClick={() => {
                      setOpen3(true);
                      setSelectedData(order);
                    }}
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* {open2 && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="container mx-auto bg-white rounded-xl p-3">
            <div className="flex justify-end">
              <button onClick={() => setOpen2(false)}>
                <IoCloseCircleOutline className="text-2xl" />
              </button>
            </div>
            <ViewUser data={selectedData} />
          </div>
        </div>
      )}

      {open3 && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="container mx-auto bg-white rounded-xl p-3">
            <div className="flex justify-end">
              <button onClick={() => setOpen3(false)}>
                <IoCloseCircleOutline className="text-2xl" />
              </button>
            </div>

            <div className="container mx-auto">
              <div className="text-xl font-medium">
                Ar tikrai norite ištrinti šį užsakymą?
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setOpen3(false)}
                  className="bg-gray-200 rounded-xl px-4 py-2"
                >
                  Atšaukti
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-danger text-white rounded-xl px-4 py-2"
                >
                  {loading2 ? "Kraunasi..." : "Ištrinti"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Orders;
