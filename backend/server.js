const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const app = express()
const PORT = 4000;

app.use(cors())
app.use(express.json())

const mysql = require("mysql2")
const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "react-login"
})

app.post("/api/auth/signin", (req, res) => {
    const { username, password} = req.body
    if(!username || !password) {
        console.debug("Login received empty")
        return res.status(500).send("Internal Server Error")
    }
    
    const query = "SELECT * FROM accounts WHERE username = ? AND password = ?"
    con.query(query, [ username, password], (error, result) => {
        if(error) {
            console.error("Error during login: " + error)
            return res.status(500).send("Internal Server Error")
        }

        if(result.length > 0) {
            const token = jwt.sign({username}, "never knows best", {expiresIn: "1h"})
            return res.status(201).json({token})
        } else return res.status(401).send("No user found")
    })
})

app.post("/api/auth/signup", (req, res) => {
    const { username, email, password} = req.body

    if(!username || !password || !email) {
        return res.status(401).send("Invalid credentials")
    }

    const query = "INSERT INTO accounts (username, email, password) VALUES (?,?,?)"
    con.query(query, [username, email, password], (error, result) => {
        if(error) {
            console.error("Error during singup: " + error)
            return res.status(500).send("Internal Server Error")
        } return res.status(201).send("User registered successfully")
    }) 
})

app.post("/api/auth/signout", (req, res) => {
    // Add the token to the blacklist
    const token = req.headers.authorization.split(" ")[1]
    blacklist.add(token)

    return res.status(200).clearCookie("token").send("User signed out successfully")
})


app.get("/api/auth/session", (req, res) => { 
    if(!req.headers.authorization) {
        return res.status(401).send("Not logged in or login expired")
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "never knows best")
    if(decodedToken) {
        const {username} = decodedToken
        const query = "SELECT username, email, profileImage FROM accounts WHERE username = ?"
        con.query(query, [username], (error, result) => {
            if(error) {
                console.error("Erro during session. retrieval: "  + error)
                return res.status(500).send("Internal Server erro")
            }

            if(result.length > 0) {
                const { username, email, profileImage } = result[0]
                const userData = { username, email, profileImage}
                return res.json(userData)
            } else return res.status(401).send("User not found")
        })
    } else {
        return res.status(401).send("Invalid token")
    }
});

app.listen(PORT, () => {
    console.debug("Server started at http://localhost:" + PORT)
})