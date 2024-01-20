import React from "react";
import { useState } from "react";
import Cookies from 'js-cookie';

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState("")

    function onButtonClick() {
        fetch("http://localhost:4000/api/auth/signin", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password })
        }).then((response) => {
            if(!response.ok) {
                setStatus("Login failed")
            }
            return response.json()
        })
        .then((data) => {
            Cookies.set('token', data.token);    
            window.location.reload()
        })
        .catch(error => console.error(error.message))
    }
    

    return(
        <>
            <h1 className="text-xl font-sans font-semibold">Login</h1>
            <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="p-1 my-1 block rounded-md"
            />
            <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-1 my-1 block rounded-md"
            />
            {status ? <p className="text-sm text-red-500 font-sans font-semibold m-y1">{status}</p> : null}
            <button
            onClick={onButtonClick}
            className="p-1 my-1 block rounded-md bg-blue-600 text-white"
            >Login</button>
        </>
    )
}

export default Login