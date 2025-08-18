import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Main = () => {
    const ref = useRef();
    const passRef = useRef();
    const [form, setform] = useState({ password: '', url: '', username: '' });
    const [passwordArray, setpasswordArray] = useState([])

    const getPassword = async () => {
        let passwordData = fetch('http://localhost:3000/')
        let data = await passwordData.json();
        if (data) {
            setpasswordArray(data);
        } else {
            setpasswordArray([]);
        }
    };

    useEffect(() => {
        getPassword()

    }, [])

    // ✅ One clean copy-to-clipboard function

    // ✅ Toast popup on copy
    const copyClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success(`Copied to clipboard ✅`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "light",

                });
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };




    const handleShowPassword = () => {
        if (ref.current.src.includes("eye-open.svg")) {
            ref.current.src = "/eye-close.svg";
            passRef.current.type = "text"; // Show password
        } else {
            ref.current.src = "/eye-open.svg";
            passRef.current.type = "password"; // Hide password
        }
    };

    const handleInputChange = (e) => {

        setform({ ...form, [e.target.name]: e.target.value });
    };

    const addPassword = async () => {
        if (form.url && form.username && form.password) {
            const newPassword = { ...form, id: uuidv4() }; // single object
            const newPasswords = [...passwordArray, newPassword];

            setpasswordArray(newPasswords); // update local state

            let res = await fetch('http://localhost:3000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPassword), // ✅ send only one object
            });

            toast.info("Password Saved Successfully", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light",
            });

            setform({ password: '', url: '', username: '' }); // reset form
        } else {
            toast.error("Please Fill All Details", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light",
            });
        }
    };


    const deleteHandle = (id) => {
        setpasswordArray(passwordArray.filter(item => item.id !== id));
        let c = confirm("Are you sure you want to delete this password?");

        if (!c) return;

        localStorage.setItem('passwords', JSON.stringify(passwordArray.filter(item => item.id !== id))); // update localStorage
        toast.error("Password Deleted Successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "light",
        });
        setform({ password: '', url: '', username: '' }); // reset form
    };

    const UpdateHandle = (id) => {


        setform(passwordArray.filter(item => item.id === id)[0]); // set form to the item to update
        const updatedArray = passwordArray.filter(item => item.id !== id);
        setpasswordArray(updatedArray); // remove the item from the array

        toast.info("You can now update the password", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            theme: "light",
        });

    };


    return (
        <div className='flex min-h-[81vh] flex-col [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]  '>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"

            />
            <h1>hii</h1>


            <div className="container  mx-auto w-2/3 bg-gradient-to-br 0 bg-opacity-95 rounded-3xl shadow-2xl px-6 py-3 flex flex-col items-center  min-h-0">
                <h1 className="text-3xl font-extrabold text-red-600 mb-1 tracking-wide drop-shadow">(- PassOP -)</h1>
                <p className="text-lg text-amber-300 mb-3 font-medium">Your Favorite Password Manager</p>
                <div className="flex flex-col items-center gap-4 w-full">
                    <input
                        className="border-2 border-blue-400 rounded-xl px-1 py-3  focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow w-full bg-white placeholder-gray-400"
                        type="text"
                        placeholder="Enter URL"
                        name="url"
                        onChange={handleInputChange}
                        value={form.url} // bind value to state
                    />
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <input
                            className="border-1 border-blue-400 rounded-xl px-2 py-3  focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow w-full bg-white placeholder-gray-400 max-w-2/3"
                            type="text"
                            placeholder="Enter Username"
                            name="username"
                            onChange={handleInputChange}
                            value={form.username} // bind value to state
                        />
                        <div className="flex items-center w-full max-w-1/3 relative">
                            <input
                                className="border-1 border-blue-400 rounded-xl px-2 py-4 pr-10 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow w-full bg-white placeholder-gray-400"
                                type="text"
                                placeholder="Enter Password"
                                ref={passRef}

                                name="password" // fixed name attribute
                                onChange={handleInputChange} // added onChange handler
                                value={form.password} // bind value to state
                            />
                            <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={handleShowPassword} // fixed function name
                            >
                                <img ref={ref} src="/eye-open.svg" alt="" className="w-6 h-6" /> {/* fixed path */}
                            </span>
                        </div>

                    </div>
                    <button onClick={addPassword} className="mt-1 bg-gradient-to-r from-red-400 to-pink-500 flex items-center gap-2 justify-center font-bold text-white px-4 py-2 w-50 border-0 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 text-lg">
                        <span className="flex items-center">
                            <lord-icon
                                src="https://cdn.lordicon.com/efxgwrkc.json"
                                trigger="hover"
                                colors="primary:#1b1091">
                            </lord-icon>
                        </span>
                        Add Password
                    </button>
                </div>
            </div>

            <div className="passwords">




                <h2 className='text-2xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg rounded-xl py-9  mx-auto max-w-fit tracking-wide  '>
                    Your <span className="text-yellow-400">PassWords</span>
                </h2>


                {passwordArray.length === 0 && <div className=' mx-20 text-amber-300 text-2xl'>No Passwords are Saved</div>}

                {passwordArray.length != 0 && <div>
                    <table className="table-fixed border-2 text-amber-50 w-4/5 mx-auto text-center rounded-xl overflow-hidden my-5">
                        <thead className="bg-gradient-to-r border-yellow-300 from-red-400 to-pink-600 text-white border-2">
                            <tr>
                                <th className="w-1/3 py-3 px-4 text-center">Site</th>
                                <th className="w-1/3 py-3 px-4 text-center">UserName</th>
                                <th className="w-1/3 py-3 px-4 text-center">PassWord</th>
                                <th className="w-1/5 py-3 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gradient-to-r from-red-200 to-pink-300 border-amber-400 border-2">
                            {passwordArray.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-pink-100/40 transition-colors duration-200"
                                >
                                    {/* URL */}
                                    <td className="py-2 px-4">
                                        <div className="flex items-center">
                                            <span className="flex-1 truncate">{item.url}</span>
                                            <button
                                                className=" bg-yellow-200 hover:bg-yellow-400 transition-colors duration-200 rounded-full p-1 shadow cursor-pointer"
                                                title="Copy URL"
                                                onClick={() => copyClipboard(item.url)}
                                            >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/xuoapdes.json"
                                                    trigger="hover"
                                                    style={{ width: "20px", height: "20px" }}
                                                ></lord-icon>
                                            </button>
                                        </div>
                                    </td>

                                    {/* Username */}
                                    <td className="py-2 px-4">
                                        <div className="flex items-center">
                                            <span className="flex-1 truncate">{item.username}</span>
                                            <button
                                                className=" bg-yellow-200 hover:bg-yellow-400 transition-colors duration-200 rounded-full p-1 shadow cursor-pointer"
                                                title="Copy Username"
                                                onClick={() => copyClipboard(item.username)}
                                            >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/xuoapdes.json"
                                                    trigger="hover"
                                                    style={{ width: "20px", height: "20px" }}
                                                ></lord-icon>
                                            </button>
                                        </div>
                                    </td>

                                    {/* Password */}
                                    <td className="py-2 px-4">
                                        <div className="flex items-center">
                                            <span className="flex-1 truncate">{item.password}</span>
                                            <button
                                                className=" bg-yellow-200 hover:bg-yellow-400 transition-colors duration-200 rounded-full p-1 shadow cursor-pointer"
                                                title="Copy Password"
                                                onClick={() => copyClipboard(item.password)}
                                            >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/xuoapdes.json"
                                                    trigger="hover"
                                                    style={{ width: "20px", height: "20px" }}
                                                ></lord-icon>
                                            </button>
                                        </div>
                                    </td>

                                    <td className='flex justify-center items-center gap-2'>
                                        <div className="delete my-2">
                                            <button onClick={() => { deleteHandle(item.id) }}><img height="30" width="30" src="public/delete.png" alt="" /></button>
                                        </div>
                                        <div className="update my-2">
                                            <button onClick={() => UpdateHandle(item.id)}><img height="30" width="30" src="public/pencil.png" alt="" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>}


            </div>
        </div>


    )
}

export default Main
