const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const app = express()
const PORT = 4000;

const blacklist = new Set()

app.use(cors())
app.use(express.json())

const mysql = require("mysql2/promise")
const con = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "react-login"
})

app.post("/api/auth/signin", async (req, res) => {
    try {
        const { username, password} = req.body
        if(!username || !password) {
            return res.status(401).send("Empty credentials")
        }
        const [existingUsers] = await con.query(
            "SELECT * FROM accounts WHERE username = ? AND password = ?" ,
            [username, password]
        )
        if(existingUsers.length > 0) {
            const token = jwt.sign({username}, "never knows best", {expiresIn: "1h"})
            return res.status(201).json({token})
        } else {
            return res.status(401).send("User not found")
        }
    } catch(error) {
        console.error("Error during login: " + error)
        res.status(500).send("Internal Server Error")
    }
})

app.post("/api/auth/signup", async (req, res) => {
    try {
        const { username, email, password} = req.body

        if(!username || !password || !email) {
            return res.status(401).send("Invalid credentials")
        }

        const [existingUsers] = await con.query(
            "SELECT * FROM accounts WHERE username = ? OR email = ?",
            [username, email]
        )

        if(existingUsers.length > 0) {
            return res.status(401).send("User already exists")
        }

        await con.query(
            "INSERT INTO accounts (username, email, password) VALUES(?,?,?)",
            [username, email, password]
        )
        
        return res.status(201).send("User registered successfully")
    } catch(error) {
        console.error("Error during singup: " + error)
        return res.status(500).send("Internal Server Error")
    }
})

app.post("/api/auth/signout", async (req, res) => {
    try {
        if(!req.headers.authorization) {
            return res.status(401).send("No authentication")
        }
        res.status(201).clearCookie("token").send("User signed out successfully")
    } catch(error) {
        console.error("Error during signout:" + error)
        return res.status(500).send("Internal Server Error")
    }
})

app.get("/api/auth/session", async (req, res) => { 

    try {
        if(!req.headers.authorization) {
            return res.status(401).send("No authentication")
        }

        const decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], "never knows best")

        if(!decodedToken) {
            return res.status(401).send("Invalid token")
        }

        const {username} = decodedToken
        const [userData] = await con.query(
            "SELECT username, email, profileImage FROM accounts WHERE username = ?",
            [username]
        )

        if(userData.length > 0) {
            const {username, email, profileImage} = userData[0]
            return res.json({username, email, profileImage})
        } else {
            return res.status(401).send("User not found")
        }
    } catch(error) {
        console.error("Error during session retrieval " + error)
        return res.status(500).send("Internal Server Error")
    }
})

app.post("/api/auth/changeProfileImage", async (req, res) => {
    try {
        if(!req.headers.authorization) {
            return res.status(401).send("No authentication")
        }

        const decodedToken = jwt.verify(req.headers.authorization.split(" ")[1], "never knows best")
        if (!decodedToken) {
            return res.status(401).send("Invalid token")
        }

        const {username} = decodedToken
        const url = req.body.imageUrl
        await con.query(
            "UPDATE accounts SET profileImage = ? WHERE username = ?",
            [url, username]
        )

        return res.status(201).send("Profile image changed")  
    } catch(error) {
        console.error("Erro during profile image change: " + error)
        return res.status(500).send("Internal Server Error")
    }
})

app.listen(PORT, () => {
    console.debug("Server started at http://localhost:" + PORT)
})