import React from "react"
import { useState } from "react"
import Cookies from "js-cookie"

function Settings() {
    const [imageUrl, setImageUrl] = useState("")
    const [status, setStatus] = useState("")

    function onButtonClick() {
        const token = Cookies.get("token")
        console.debug(token)
        if(!token) {
            return
        }
        fetch("http://localhost:4000/api/auth/changeProfileImage", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({imageUrl})
        }).then((response) => {
            if(!response.ok) {
                setStatus("Change failed")
            } else if(response.ok) {
                setStatus("Change successful")
            }
        })
    }

    return(
        <>
            <input
            type="text"
            placeholder="URL"
            onChange={(e) => setImageUrl(e.target.value)}
            className="p-1 my-1 block rounded-md"
            />
            {status ? <p className="text-sm text-red-500 font-sans font-semibold m-y1">{status}</p> : null}
            <button
            onClick={onButtonClick}
            className="p-1 my-1 block rounded-md bg-blue-600 text-white"
            >Change
            </button>
            <button className="ftno-sans hover:font-semibold hover:underline" onClick={() => { window.location.href = "/" }}>Back</button>
        </>
    )
}

export default Settings