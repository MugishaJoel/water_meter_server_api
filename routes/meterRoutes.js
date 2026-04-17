const express = require("express");
const router = express.Router()

const {getUser,buyToken,addUser, getLastToken} = require("../controllers/meterController")

router.post("/check-meter", getUser)
router.post("/buy", buyToken)
router.post("/create", addUser);
router.post("/last-token", getLastToken);

module.exports = router