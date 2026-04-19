const express = require("express");
const router = express.Router()

const {getUser,buyToken,addUser, getLastToken,getAllToken} = require("../controllers/meterController")

router.post("/check-meter", getUser)
router.post("/buy", buyToken)
router.post("/create", addUser);
router.post("/last-token", getLastToken);
router.post("/all-token", getAllToken);

module.exports = router