const {final} = require('../utils/getToken');
const {Reading,TokenT} = require('../models/Reading');

const getUser = async(req,res)=>{
    try{
        const {meterNumber} = req.body;
        const meter = await Reading.findOne({meter:meterNumber});
        if (!meter) {
          return res.status(404).json({ message: "Meter not found" });
        }
        const user_name = meter.user;
        console.log(user_name);
        return res.json({user:user_name});
    }
    catch(err){
        console.error("Error occured!");
        return res.status(500).json({ message: "Server error" });
    }
}

const buyToken = async(req,res) =>{
    try{
        const{meterNumber,amount} = req.body;
        const meter = await Reading.findOne({meter:meterNumber});
        if (!meter) {
           return res.status(404).json({ message: "Meter not found" });
        }
        let lastTokenId = meter.lastTokenId +1;
        let token = final(meterNumber,amount,lastTokenId);

        if (!token || token.length !== 24) {
          return res.status(400).json({ message: "Token generation failed" });
        }

         meter.lastTokenId = lastTokenId;
         meter.lastToken = token;
         await meter.save();

         const saveToken = await TokenT.create({
            meter:meterNumber,
            amount,
            token
         });

         if(saveToken){
          console.log("Token saved!");
         }
         else{
          console.log("Error while saving token");
         }

         return res.json({
            token:token
         });
    }
    catch(error){
        console.error("Failed to buy token");
        return res.status(500).json({ message: "Failed to buy token" });
    }
}

const addUser = async(req,res)=>{
    try{
        const{meterNumber,user_name} = req.body;

        const existing = await Reading.findOne({ meter: meterNumber });
        if (existing) {
        return res.status(400).json({ message: "Meter already exists" });
        }

        const result = await Reading.create({
            meter:meterNumber,
            user:user_name
        });
        if(result){
            console.log("User registered!");
        }
        return res.json({result});
    }
    catch(error){
        console.log("Error occured!");
        return res.status(500).json({ message: "Failed to add user" });
    }
}

const getLastToken = async (req, res) => {
  try {
    const { meterNumber } = req.body;

    const meter = await Reading.findOne({ meter: meterNumber });

    if (!meter) {
      return res.status(404).json({ message: "Meter not found" });
    }

    if (!meter.lastToken) {
      return res.status(404).json({ message: "No token found" });
    }

    return res.json({ token: meter.lastToken });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllToken = async (req, res) => {
  try {
    const { meterNumber } = req.body;

    const meterHistory = await TokenT.find({ meter: meterNumber }).sort({Timestamp:-1});

    if (!meterHistory) {
      return res.status(404).json({ message: "Meter not found" });
    }

    return res.json({meterHistory});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports= {
  getUser,
  buyToken,
  addUser,
  getLastToken,
  getAllToken
}