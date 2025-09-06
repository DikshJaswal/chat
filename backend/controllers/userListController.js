//here we will try to fetch all of the users from the database into the user section
const User = require('../schema/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userList= async (req,res)=>{
    //get the token from the cookies
    const token=req.cookies?.token;
    if(!token){
        return res.status(401).json({
            success:false,
            message:'Authorization failed'
        });
    }
    //token validation
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
    try{
        const currentUsername=await decoded.username;
        //find() returns teh whole DB list
        const users=await User.find({
            //exclude the present username
            username: { $ne: currentUsername }}
            ,'username details follow').lean();  //lean provides faster , api based and read-only capabalities
        
        if(!users || users.length===0){
            return res.status(404).json(
                {success:false
                    ,message:'No user available'
                });
        }
        return res.json({
            success:true,
            message:'users found',
            users
        });

    }catch(err){
        console.log(err);
        return res.status(503).json({success:false,message:'Service is unavailable'});
    }
};
module.exports={userList};