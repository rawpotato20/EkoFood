import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";

const Volumes = (props) => {
    const [volumes, setVolumes] = useState(props.volumes);

    const [price, setPrice] = useState("");
    const [volume, setVolume] = useState("");
    const [outOfStock, setOutOfStock] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const handleAdd = () => {
        const newVolume = { price, volume, out_of_stock: outOfStock };
        setVolumes([...volumes, newVolume]);
        setPrice("");
        setVolume("");
        setOutOfStock(false);
        setShowForm(false);
    };

    const handleMinus = (index) => {
        const newVolume = volumes.filter((_, i) => i !== index);
        setVolumes(newVolume);
    };

    const showAdd = () => {
        setShowForm(true);
    };

    useEffect(() => {
        props.handleVolumes(volumes);
    }, [volumes]);

    return (
        <>
            <div className="space-y-2">
                <div>
                    <h1>Volumes</h1>
                </div>
                <div className="space-y-3 border border-gray-400 rounded p-4">
                    {volumes.map((item, i) => {
                        return (
                            <div
                                key={i}
                                className="flex flex-row justify-between"
                            >
                                <div>{item.price}</div>
                                <div>{item.volume}</div>
                                <div>
                                    {item.out_of_stock
                                        ? "Out of stock"
                                        : "In stock"}
                                </div>
                                <div className="space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(true);
                                            setPrice(item.price);
                                            setVolume(item.volume);
                                            setOutOfStock(item.out_of_stock);
                                            handleMinus(i);
                                        }}
                                        className="bg-indigo-500 text-white py-1 px-4 rounded"
                                    >
                                        <FiEdit2 className="text-xl" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleMinus(i);
                                        }}
                                        className="bg-danger text-white py-1 px-4 rounded"
                                    >
                                        <IoMdRemoveCircleOutline className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {showForm && (
                    <>
                        <form className="flex flex-col md:flex-row justify-between items-end">
                            <div className="md:w-3/4 flex flex-col md:flex-row justify-between items-center space-x-4">
                                <div className="md:w-1/2">
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                        placeholder="Price"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <input
                                        type="text"
                                        value={volume}
                                        onChange={(e) =>
                                            setVolume(e.target.value)
                                        }
                                        placeholder="Volume"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                                <div className="md:w-1/4">
                                    <input
                                        type="checkbox"
                                        checked={outOfStock}
                                        onChange={(e) =>
                                            setOutOfStock(e.target.checked)
                                        }
                                        className="w-4 h-4"
                                    />
                                    <label>Out of stock</label>
                                </div>
                            </div>
                            <div className="md:w-1/4 flex justify-end items-center">
                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className="bg-black rounded py-2 px-7 text-white"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </>
                )}
                <div>
                    <button
                        type="button"
                        onClick={showAdd}
                        className="rounded bg-green-500 text-white py-1 px-4"
                    >
                        <IoMdAddCircleOutline className="text-xl" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Volumes;
