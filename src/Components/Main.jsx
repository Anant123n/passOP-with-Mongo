import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

// ✅ API base URL (Vite env or fallback to localhost)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Main = () => {
    const ref = useRef();
    const passRef = useRef();
    const [form, setform] = useState({ password: '', url: '', username: '' });
    const [passwordArray, setpasswordArray] = useState([])

    // ✅ Fetch all saved passwords
    const getPassword = async () => {
        try {
            let response = await fetch(`${API_URL}/`);
            let data = await response.json();
            if (data) {
                setpasswordArray(data);
            } else {
                setpasswordArray([]);
            }
        } catch (error) {
            console.error("Error fetching password data:", error);
            setpasswordArray([]);
        }
    };

    useEffect(() => {
        getPassword()
    }, [])

    // ✅ Copy text to clipboard with toast
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

    // ✅ Toggle password visibility
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

    // ✅ Add or update password
    const addPassword = async () => {
        if (form.url && form.username && form.password) {
            // delete old entry if exists
            await fetch(`${API_URL}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: form.id }),
            });

            const newPassword = { ...form, id: uuidv4() };
            const newPasswords = [...passwordArray, newPassword];
            setpasswordArray(newPasswords);

            await fetch(`${API_URL}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPassword),
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

            setform({ password: '', url: '', username: '' });
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

    // ✅ Delete password
    const deleteHandle = async (id) => {
        let c = confirm("Are you sure you want to delete this password?");
        if (!c) return;

        try {
            let res = await fetch(`${API_URL}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                setpasswordArray(passwordArray.filter(item => item.id !== id));
                toast.error("Password Deleted Successfully", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "light",
                });
                setform({ password: '', url: '', username: '' });
            } else {
                toast.error("Failed to delete password");
            }
        } catch (err) {
            toast.error("Server error while deleting password");
        }
    };

    // ✅ Load password into form for editing
    const UpdateHandle = (id) => {
        const toUpdate = passwordArray.find(item => item.id === id);
        if (!toUpdate) return;
        setform({ ...toUpdate, id });
        setpasswordArray(passwordArray.filter(item => item.id !== id));
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
            <ToastContainer />

            <div className="container mx-auto w-2/3 bg-gradient-to-br 0 bg-opacity-95 rounded-3xl shadow-2xl px-6 py-3 flex flex-col items-center">
                <h1 className="text-3xl font-extrabold text-red-600 mb-1 tracking-wide drop-shadow">(- PassOP -)</h1>
                <p className="text-lg text-amber-300 mb-3 font-medium">Your Favorite Password Manager</p>

                <div className="flex flex-col items-center gap-4 w-full">
                    {/* URL */}
                    <input
                        className="border-2 border-blue-400 rounded-xl px-1 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow w-full bg-white placeholder-gray-400"
                        type="text"
                        placeholder="Enter URL"
                        name="url"
                        onChange={handleInputChange}
                        value={form.url}
                    />

                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        {/* Username */}
                        <input
                            className="border-1 border-blue-400 rounded-xl px-2 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow w-full bg-white placeholder-gray-400"
                            type="text"
                            placeholder="Enter Username"
                            name="username"
                            onChange={handleInputChange}
                            value={form.username}
                        />

                        {/* Password */}
                        <div className="flex items-center w-full relative">
                            <input
                                className="border-1 border-blue-400 rounded-xl px-2 py-4 pr-10 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow w-full bg-white placeholder-gray-400"
                                type="password"
                                placeholder="Enter Password"
                                ref={passRef}
                                name="password"
                                onChange={handleInputChange}
                                value={form.password}
                            />
                            <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={handleShowPassword}
                            >
                                <img ref={ref} src="/eye-open.svg" alt="toggle" className="w-6 h-6" />
                            </span>
                        </div>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={addPassword}
                        className="mt-1 bg-gradient-to-r from-red-400 to-pink-500 flex items-center gap-2 justify-center font-bold text-white px-4 py-2 rounded-2xl shadow-lg hover:scale-105 transition-all duration-200 text-lg"
                    >
                        Add Password
                    </button>
                </div>
            </div>

            {/* Password List */}
            <div className="passwords mt-6">
                <h2 className='text-2xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg text-center py-4'>
                    Your <span className="text-yellow-400">PassWords</span>
                </h2>

                {passwordArray.length === 0 && (
                    <div className='text-center text-amber-300 text-xl'>No Passwords Saved</div>
                )}

                {passwordArray.length > 0 && (
                    <table className="table-fixed border-2 text-amber-50 w-4/5 mx-auto text-center rounded-xl overflow-hidden my-5">
                        <thead className="bg-gradient-to-r from-red-400 to-pink-600 text-white border-2">
                            <tr>
                                <th className="w-1/3 py-3 px-4">Site</th>
                                <th className="w-1/3 py-3 px-4">UserName</th>
                                <th className="w-1/3 py-3 px-4">PassWord</th>
                                <th className="w-1/5 py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gradient-to-r from-red-200 to-pink-300 border-amber-400 border-2">
                            {passwordArray.map((item) => (
                                <tr key={item.id} className="hover:bg-pink-100/40 transition-colors duration-200">
                                    <td className="py-2 px-4 flex justify-between items-center">
                                        <span className="truncate">{item.url}</span>
                                        <button onClick={() => copyClipboard(item.url)}>📋</button>
                                    </td>
                                    <td className="py-2 px-4 flex justify-between items-center">
                                        <span className="truncate">{item.username}</span>
                                        <button onClick={() => copyClipboard(item.username)}>📋</button>
                                    </td>
                                    <td className="py-2 px-4 flex justify-between items-center">
                                        <span className="truncate">{item.password}</span>
                                        <button onClick={() => copyClipboard(item.password)}>📋</button>
                                    </td>
                                    <td className="flex justify-center items-center gap-2">
                                        <button onClick={() => deleteHandle(item.id)}>🗑️</button>
                                        <button onClick={() => UpdateHandle(item.id)}>✏️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Main;
