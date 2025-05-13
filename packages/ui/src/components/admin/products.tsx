import Image from "next/image";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";
import AddProducts from "./add-products";
import { IoCloseCircleOutline } from "react-icons/io5";
import EditProducts from "./edit-products";
import DeleteProduct from "./delete-product";
import { Reorder } from "framer-motion"; // Correct import for Reorder
import { parseCookies } from "nookies";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [selectedData, setSelectedData] = useState({});

    const [adminPassword, setAdminPassword] = useState("");

    useEffect(() => {
        let adminPassword = parseCookies().adminPassword;
        if (adminPassword) {
            setAdminPassword(adminPassword);
        }
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/view/products");
            const data = await res.json();
            if (data.success) {
                setProducts(
                    data.data.sort((a, b) => a.display_order - b.display_order)
                );
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const updateReorderedProducts = async (newProducts) => {
        try {
            // Assume there's an API endpoint for updating the order
            await fetch("/api/admin/product-order", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": adminPassword },
                body: JSON.stringify({ products: newProducts }),
            });
            setProducts(newProducts);
        } catch (err) {
            console.error("Error updating product order:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="container mx-auto bg-slate-200 p-5 rounded-xl mt-5 space-y-5 h-[80vh]">
                <div className="flex justify-between">
                    <button
                        className="bg-primary text-white rounded-xl py-2 px-7"
                        onClick={() => setOpen(true)}
                    >
                        Add
                    </button>
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
                        <div className="w-1/6">Image</div>
                        <div className="w-1/6">Name</div>
                        <div className="w-1/6">Volumes</div>
                        <div className="w-1/6 text-right">Actions</div>
                    </div>
                    <div className="h-[60vh] overflow-y-scroll">
                        <Reorder.Group
                            axis="y"
                            values={products}
                            onReorder={(newOrder) => {
                                // Reorder the list and update both state and database
                                const reorderedProducts = newOrder.map(
                                    (product, index) => ({
                                        ...product,
                                        display_order: index, // Update the display_order based on new index
                                    })
                                );
                                setProducts(reorderedProducts);
                                updateReorderedProducts(reorderedProducts);
                            }}
                            layoutScroll
                        >
                            {filteredProducts.map((product) => (
                                <Reorder.Item
                                    key={product._id} // Use a unique identifier like `id`
                                    value={product}
                                >
                                    <div className="flex justify-between items-center py-2 px-7 border border-white rounded-xl">
                                        <div className="w-1/6">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={100}
                                                height={100}
                                                className="w-[100px] h-[100px] object-contain"
                                            />
                                        </div>
                                        <div className="w-1/6">
                                            {product.name}
                                        </div>
                                        <div className="w-1/3 flex flex-col space-y-1">
                                            {product.volumes.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex justify-between"
                                                >
                                                    <span>{item.volume}</span>
                                                    <span>{item.price}</span>
                                                    <span>
                                                        {item.out_of_stock
                                                            ? "Out of stock"
                                                            : "In stock"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="w-1/6 text-right space-x-2">
                                            <button
                                                className="bg-secondary text-white rounded-xl px-4 py-1"
                                                onClick={() => {
                                                    setOpen2(true);
                                                    setSelectedData(product);
                                                }}
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="bg-danger text-white rounded-xl px-4 py-1"
                                                onClick={() => {
                                                    setOpen3(true);
                                                    setSelectedData(product);
                                                }}
                                            >
                                                <FiTrash />
                                            </button>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
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
                        <AddProducts />
                    </div>
                </div>
            )}
            {open2 && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                    <div className="container mx-auto bg-white rounded-xl p-3">
                        <div className="flex justify-end">
                            <button onClick={() => setOpen2(false)}>
                                <IoCloseCircleOutline className="text-2xl" />
                            </button>
                        </div>
                        <EditProducts data={selectedData} />
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
                        <DeleteProduct
                            data={selectedData}
                            handleClose={() => setOpen3(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Products;
