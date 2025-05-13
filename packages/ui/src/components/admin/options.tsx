import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";

const Options = (props) => {
    const [options, setOptions] = useState(props.options);

    const [option, setOption] = useState("");
    const [value, setValue] = useState("");
    const [showForm, setShowForm] = useState(false);

    const handleAdd = () => {
        const newOption = { [option]: value };
        setOptions([...options, newOption]);
        setOption("");
        setValue("");
        setShowForm(false);
    };

    const handleMinus = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const showAdd = () => {
        setShowForm(true);
    };

    useEffect(() => {
        props.handleOptions(options);
    }, [options]);

    return (
        <>
            <div className="space-y-2">
                <div>
                    <h1>Details</h1>
                </div>
                <div className="space-y-3 border border-gray-400 rounded p-4">
                    {options.map((item, i) => {
                        const [key, value] = Object.entries(item)[0];
                        return (
                            <div
                                key={i}
                                className="flex flex-row justify-between"
                            >
                                <div>{key}</div>
                                <div>{value}</div>
                                <div className="space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(true);
                                            setOption(key);
                                            setValue(value);
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
                                    <label className="text-xs">Option</label>
                                    <input
                                        name="option"
                                        type="text"
                                        value={option}
                                        onChange={(e) =>
                                            setOption(e.target.value)
                                        }
                                        placeholder="Enter detail name here..."
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                                        required
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    <label className="text-xs">Value</label>
                                    <input
                                        name="value"
                                        type="text"
                                        value={value}
                                        onChange={(e) =>
                                            setValue(e.target.value)
                                        }
                                        placeholder="Enter detail value here..."
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                                        required
                                    />
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

export default Options;
