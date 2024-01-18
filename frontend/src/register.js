import React from "react";
import { useState } from "react";

function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function onButtonClick() {
        fetch("/api/auth/register", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password})
        }) 
    }

    return (
        <div className="w-full h-full">
            <div className="w-1/2 h-1/2">
            <h1 className="text-gray-600 text-sm font-mono">
                Username
            </h1>
            <input
                type="text"
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 bg-gray-400 border border-gray-500 text-gray-500"
            />
            <h1 className="text-gray-600 text-sm font-mono">
                Email
            </h1>
            <input
                type="text"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 bg-gray-400 border border-gray-500 text-gray-500"
            />
            <h1 className="text-gray-600 text-sm font-mono">
                Password
            </h1>
            <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 bg-gray-400 border border-gray-500 text-gray-500"
            />
            <input 
                type="submit"
                value="Register"
                onClick={onButtonClick}
                className="p-2 bg-blue-600 hover:bg-blue-400 text-white font-sans"
            />
            </div>
        </div>
    )
}