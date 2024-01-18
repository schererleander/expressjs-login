const express = require("express")
const session = require("express-session")
const app = express()
const PORT = 4000;

app.use(session({
    secret: "never know best",
    resave: false,
    saveUninitialized: true,
    // disabled for development
    cookie: { secure: false }
}))

const mysql = require("mysql2")
const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "react-login"
})

app.get("/api/auth/signin", (req, res) => {
    const { username, password} = req.query
    
    if(!username || !password) {
        return res.status(500).send("Internal Server Error")
    }
    
    const query = "SELECT * FROM accounts WHERE username = ? AND password = ?"
    con.query(query, [ username, password], (error, result) => {
        if(error) res.status(500).send("Internal Server Error")

        if(result.length > 0) {
            req.session.username = result.username
            req.session.email = result.email
            req.profileImage = result.profileImage

            req.session.save(function (error) {
                if(error) {
                    return res.status(500).send("Internal Server Error")
                } else {
                    res.redirect("/")
                    return res.status(201).send("User signed in successfully")
                }
            })
        } else return res.status(401).send("No user found")
    })
})

app.post("api/auth/signup", (req, res) => {
    const { username, email, password} = req.body

    if(!username || !password || !email) {
        return res.status(401).send("Invalid credentials")
    }

    const query = "INSERT INTO accounts (username, email, password) VALUES (?,?,?)"
    con.query(query, [username, email, password], (error, result) => {
        if(error) return res.status(500).send("Internal Server Error")
        if(result > 0) {
            req.session.username = result.username
            req.session.email = result.email
            req.profileImage = result.profileImage
            req.session.save(function (error) {
                if(error) return res.status(500).send("Internal Server Error")
                res.redirect("/")
            })
        }
        return res.status(201).send("User registered successfully")
    }) 
})

app.get("/api/auth/signout", (req, res) => {
    //Clear the user from the session object and save
    // Regenerate the session to guard against session fixation
    req.session.username = null
    req.session.email = null
    req.session.profileImage = null
    req.session.regenerate(function (error) {
        if(error) {
            return res.status(500).send("Internal Server Error")
        }
        res.redirect("/")
        return res.status(201).send("User signed out successfully")
    })
})

app.listen(PORT, () => {
    console.debug("Server started at http://localhost:" + PORT)
})