require("dotenv").config()
const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 3000

const SignupModel = require("./Models/Signup.js")
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
    const user = await SignupModel.findOne({ rollNo, password })
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

app.get("/getauctiondata/:id", async (req, res) => {
  try {
    const auction = await AuctionModel.findById(req.params.id)
    if (!auction) {
      return res.status(404).json({ error: "Item not found" })
    }
    res.status(200).json(auction)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

app.post("/placebid", async (req, res) => {
  try {
    const { auctionId, bidderRollNo, bidderName, amount } = req.body
    const bidAmount = Number(amount)

    if (!auctionId || !bidderRollNo || !bidderName || Number.isNaN(bidAmount)) {
      return res.status(400).json({ error: "auctionId, bidderRollNo, bidderName and amount are all required" })
    }

    const auction = await AuctionModel.findById(auctionId)
    if (!auction) {
      return res.status(404).json({ error: "Item not found" })
    }

    if (auction.status === "sold") {
      return res.status(400).json({ error: "This item has already been sold and is no longer accepting bids" })
    }

    const floor = Math.max(auction.currentBid, auction.startingBid)
    if (bidAmount <= floor) {
      return res.status(400).json({ error: `Bid must be higher than the current bid of ${floor}` })
    }

    auction.bids.push({ bidderRollNo, bidderName, amount: bidAmount })
    auction.currentBid = bidAmount
    auction.highestBidderName = bidderName
    auction.highestBidderRollNo = bidderRollNo
    await auction.save()

    res.status(200).json(auction)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

app.post("/closeauction", async (req, res) => {
  try {
    const { auctionId, sellerRollNo } = req.body

    if (!auctionId || !sellerRollNo) {
      return res.status(400).json({ error: "auctionId and sellerRollNo are required" })
    }

    const auction = await AuctionModel.findById(auctionId)
    if (!auction) {
      return res.status(404).json({ error: "Item not found" })
    }

    if (auction.sellerRollNo && auction.sellerRollNo !== sellerRollNo) {
      return res.status(403).json({ error: "Only the seller who listed this item can close it" })
    }

    if (auction.status === "sold") {
      return res.status(400).json({ error: "This item is already marked as sold" })
    }

    if (!auction.highestBidderName) {
      return res.status(400).json({ error: "This item has no bids yet, nothing to close" })
    }

    auction.status = "sold"
    auction.soldTo = auction.highestBidderName
    auction.soldAmount = auction.currentBid
    auction.soldAt = new Date()
    await auction.save()

    res.status(200).json(auction)
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
