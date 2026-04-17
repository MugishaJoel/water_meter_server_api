const express = require("express")
const cors = require("cors")
const app = express()
app.use(express.json())
require("dotenv").config()

app.use(cors({
  origin: "*"
}))

const meterRoutes = require("./routes/meterRoutes")

app.use("/api", meterRoutes)
app.use("/", (req,res)=>{
    res.json({messege:`Server running on port ${process.env.PORT}`})
})

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));
app.listen(process.env.PORT, () => {
  console.log("Server running on port 3500")
})

