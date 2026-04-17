const express = require("express");
const router = express.Router()

const {getUser,buyToken,addUser} = require("../controllers/meterController")

router.post("/check-meter", getUser)
router.post("/buy", buyToken)
router.post("/create", addUser);

module.exports = router