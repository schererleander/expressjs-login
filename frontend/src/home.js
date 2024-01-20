import React from "react"
import { useState } from "react";
import { useEffect } from "react";
import Cookies from 'js-cookie';

function Home() {
    const [profileImage, setProfileImage] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const api = "http://localhost:4000/"

    useEffect(() => {
        const token = Cookies.get('token');
        console.debug(token)
        if (token) {
            fetch( api + "api/auth/session", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                setUsername(data.username);
                setEmail(data.email);
                setProfileImage(data.profileImage);
            }
        });
        }
    }, []);

    function onClickButton() {
        Cookies.remove("token")
        fetch(api + "api/auth/signout")
        window.location.href = "/"
    }

    return (
        <div>
            <img
            src={profileImage}
            alt="Profile"
            className="w-20 rounded-full"
            />
            <p className="text-xl mx-1 font-sans font-semibold text-gray-800">{username}</p>
            <p className="text-xl mx-1 text-sans text-gray-600">{email}</p>
            <input
            type="button"
            value="Logout"
            onClick={onClickButton}
            className="p-2 bg-blue-500 text-white border rounded-md"
            />
        </div>
    )
}

export default Home