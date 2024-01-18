import React from "react"
import { useState } from "react";

function Home() {
    const [loggedIn, setLoggedIn] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [username, setUsername] = useState("")

    function onClickButton() {
        
    }

    return (
        <div className="">
            (loggedIn ? (
                <img
                    src={profileImage}
                    alt="Profile"
                    className="w-20 rounded-full"
                />
            ) : null)
            <h1 className="text-xl font-mono font-semibold text-gray-800">
                Willkommen (loggedIn ? {username} : "")
            </h1>
            <input
                type="button"
                value={loggedIn ? "Logout" : "Login"}
                onClick={onClickButton}
                className="p-2 bg-blue-500 hover:bg-blue-300 hover:font-semibold text-white border rounded-md"
            />
        </div>
    )
}