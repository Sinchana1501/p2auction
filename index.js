require("dotenv").config()
const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 3000

const SignupModel = require("./Models/Signup.js")
const SigninModel = require("./Models/Signin.js")
const AuctionModel = require("./Models/Auction.js")

app.get('/sayhello', (req, res) => {
  res.send('Hello World !')
})

app.post("/signup", async (req, res) => {
  try {
    const signup1 = await SignupModel.create(req.body)
    res.status(200).json(signup1)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

app.post("/signin", async (req, res) => {
  try {
    const { rollNo, password } = req.body
    const user = await SigninModel.findOne({ rollNo, password })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }
    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

app.post("/addauctiondata", async (req, res) => {
  try {
    const auction1 = await AuctionModel.create(req.body)
    res.status(200).json(auction1)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

app.get("/getauctiondata", async (req, res) => {
  try {
    const auctions = await AuctionModel.find()
    res.status(200).json(auctions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI environment variable. Set it in a .env file or your host's environment settings.")
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err.message))

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
