// pages/test.js
"use client"; // Enable React Client Components

import { useState } from "react";
import { signIn } from "next-auth/react"; // Import signIn from NextAuth
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const SignInPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setError(""); // Clear any existing errors

        const response = await signIn("credentials", {
            email,
            name,
            gender,
            age,
            redirect: false, // Prevent automatic redirection
        });

        if (response?.error) {
            setError(response.error); // Display error message
        } else {
            router.push("/api/spin"); // Redirect on successful login
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-gray-700">Gender</label>
                        <input
                            type="text"
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="age" className="block text-gray-700">Age</label>
                        <input
                            type="number"
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
                {error && <div className="text-red-500 text-center mt-2">{error}</div>}
            </div>
        </div>
    );
};

export default SignInPage;
