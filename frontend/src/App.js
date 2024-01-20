import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import Home from "./home"
import Login from "./login"
import Register from "./register"
import Settings from './settings';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [registrationMode, setRegistrationMode] = useState(false)
  const [settingsMode, setSettingsMode] = useState(false)

  function displayComponent() {
    if(registrationMode) {
      return <Register />
    }
    if(settingsMode) {
      return <Settings />
    }
    if(loggedIn) {
      return <Home />
    }
    return <Login />
  }

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetch("http://localhost:4000/api/auth/session", {
        headers: {
            Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        if(!response.ok) {
          return
        }
        return response.json()
      })
      .then((data) => {
        if (data) {
          setLoggedIn(true)
        }
      })
    }
  }, [])

  return (
    <>
      <nav className="bg-gray-800 p-4 text-white">
        <div className="container mx-auto">
          <span className="text-lg font-bold">react-login</span>
          {loggedIn ? (null) : (<button
            onClick={() => setRegistrationMode(true)}
            className="ml-4 text-white hover:font-semibold hover:underline"
          >Register</button>)}
          {loggedIn ? (<button
            onClick={() => setSettingsMode(true)}
            className="ml-4 text-white hover:font-semibold hover:underline"
          >Settings</button>): null}
        </div>
      </nav>
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-1/2 max-w-60 h-1/2 p-4 bg-gray-200 rounded-md">
        {displayComponent()}
        </div>
      </div>
    </>
  )
}

export default App;
