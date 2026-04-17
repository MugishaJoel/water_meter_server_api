const {final} = require('../utils/getToken');
const Reading = require('../models/Reading');

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

        if (!token || token.length !== 32) {
          return res.status(400).json({ message: "Token generation failed" });
        }

         meter.lastTokenId = lastTokenId;
         await meter.save();
       
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

module.exports={getUser,buyToken,addUser}