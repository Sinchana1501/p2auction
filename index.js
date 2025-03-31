const express = require('express')
const mongoose = require("mongoose")
const app = express()
app.use(express.json())
const port = 3000

const SignupModel = require("./Models/Signup.js")
const SigninModel = require("./Models/Signin.js")
const AuctionModel = require("./Models/Auction.js")

app.get('/sayhello', (req, res) => {
  res.send('Hello World !')
})

app.post("/signup", async(req,res) => {
    try {
        const Signup1 = await SignupModel.create(req.body)
        res.status(200).json(Signup1)
        console.log(req.body)
      } catch (error){
        res.sendStatus("Error")
}
})

app.post("/addauctiondata", async (req,res) => {
    try{
        const Auction1 = await AuctionModel.create(req.body)
        res.status(200).json(Auction1)
        console.log(req.body)
    }catch (error) {
        res.sendStatus(500)
    }
    })

app.get("/getauctiondata", async (req,res) => {
    try{
        const Auction1 = await AuctionModel.find()
        res.status(200).json(Auction1)
      } catch (error) {
        res.sendStatus(500)
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

mongoose.connect("mongodb+srv://Sinchana:lqi4mULMdbNHYTZM@p2auction.pzgncht.mongodb.net/").then(() => {
    console.log("Connected to MongoDB")
    }).catch((err) => {
        console.log("Mongo DB Not Connected")
    }
)

