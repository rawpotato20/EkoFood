import { useEffect, useState } from "react";
import ViewUser from "./view-user";
import { useRouter } from "next/navigation";

//TODO: Sonner, Lucid Icons and Nookies
import toast from "react-hot-toast";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { parseCookies } from "nookies";

export interface User {
  _id: string;
  name?: string;
  last_name?: string;
  email?: string;
  connected_with_listmonk?: boolean;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [selectedData, setSelectedData] = useState<User | null>(null);
  const [loading2, setLoading2] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const handleSync = async (id: string) => {
    setSyncing(true);
    const res = await fetch("/api/user/sync-listmonk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: adminPassword,
      },
      body: JSON.stringify({
        userId: id,
      }),
    }).then((res) => res.json());
    if (res.success) {
      toast.success(res.message);
      setSyncing(false);
      router.refresh();
    } else {
      toast.error(res.message);
      setSyncing(false);
    }
  };

  const router = useRouter();

  useEffect(() => {
    let aPass = parseCookies().adminPassword;
    if (aPass) {
      setAdminPassword(aPass);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/view/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
      }
    } catch (err) {
      console.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [adminPassword]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(search.toLowerCase())
  );
  const handleSubmit = async () => {
    setLoading2(true);
    if (!selectedData) return console.log("No selected Data.");
    const res = await fetch("/api/user/general", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: adminPassword,
      },
      body: JSON.stringify({
        id: selectedData._id,
      }),
    }).then((res) => res.json());
    if (res.success) {
      toast.success(res.message);
      setLoading2(false);
      router.refresh();
    } else {
      toast.error(res.message);
      setLoading2(false);
    }
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
            <div className="w-1/6">Name</div>
            <div className="w-1/6">Last Name</div>
            <div className="w-1/6">Email</div>
            <div className="w-1/6">List Monk Connected</div>
            <div className="w-1/6 text-right">Actions</div>
          </div>
          <div className="h-[60vh] overflow-y-scroll">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center py-2 px-7 border border-white rounded-xl"
              >
                <div className="w-1/6">{user.name ? user.name : ""}</div>
                <div className="w-1/6">
                  {user.last_name ? user.last_name : ""}
                </div>
                <div className="w-1/3 flex flex-col space-y-1">
                  {user.email ? user.email : ""}
                </div>
                <div className="w-1/6 flex items-center justify-center gap-1">
                  {user.connected_with_listmonk ? (
                    <span className="bg-green-300 px-2 rounded-lg">Yes </span>
                  ) : (
                    <span className="px-2 rounded-lg bg-red-400">No</span>
                  )}
                  {!user.connected_with_listmonk && (
                    <button
                      disabled={syncing}
                      onClick={() => handleSync(user._id)}
                      className="px-4 py-1 bg-blue-300 rounded-lg"
                    >
                      Sync
                    </button>
                  )}
                </div>
                <div className="w-1/6 text-right space-x-2">
                  <button
                    className="bg-secondary text-white rounded-xl px-4 py-1"
                    onClick={() => {
                      setOpen2(true);
                      setSelectedData(user);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="bg-danger text-white rounded-xl px-4 py-1"
                    onClick={() => {
                      setOpen3(true);
                      setSelectedData(user);
                    }}
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {open2 && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="container mx-auto bg-white rounded-xl p-3">
            <div className="flex justify-end">
              <button onClick={() => setOpen2(false)}>
                <IoCloseCircleOutline className="text-2xl" />
              </button>
            </div>
            {/* TODO: Make this work with proper types */}
            {/* {selectedData && <ViewUser data={selectedData} />} */}
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
                Are you sure you want to delete?
              </div>
              <br />
              <div className="flex flex-row justify-between items-center">
                <button
                  className="bg-indigo-500 text-white py-2 px-7 rounded"
                  type="button"
                  onClick={() => setOpen3(false)}
                >
                  CANCEL
                </button>
                <button
                  className="bg-danger text-white py-2 px-7 rounded"
                  type="button"
                  onClick={handleSubmit}
                >
                  {loading2 ? "DELETING..." : "DELETE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
