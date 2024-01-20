import React from "react";
import { useState } from "react";
import Cookies from "js-cookie";

function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState("")

    function onButtonClick() {
        fetch("http://localhost:4000/api/auth/signup", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password})
        }).then((response) => {
            Cookies.remove("token")
            if(response.ok) {
                window.location.href = "/"
            } else setStatus("Registration failed")
        })
    }

    return (
        <>
            <h1 className="text-xl font-sans font-semibold">Login</h1>
            <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="p-1 my-1 rounded-md"
            />
            <input
            type="password"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-1 my-1 rounded-md"
            />
            <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-1 my-1 rounded-md"
            />
            {status ? <p className="text-sm text-red-500 font-sans font-semibold m-y1">{status}</p> : null}
            <button
            onClick={onButtonClick}
            className="p-1 my-1 block rounded-md bg-blue-600 text-white"
            >Login</button>
            <button className="ftno-sans hover:font-semibold hover:underline" onClick={() => { window.location.href = "/" }}>Back</button>
        </>
    )
}

export default Register