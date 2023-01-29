const Msg = require('../models/message')

exports.addMsg = async (req,res)=>{
    try{
        const userId = req.user.id
        const {msg} = req.body
        console.log(msg,userId)
        await Msg.create({
            message:msg,
            userId:userId
        })
        return res.status(201).json({succes:true,message:'msg stored in database successfully'})
    }
    catch(err){
        console.log(err)
        return res.status(400).json({succes:false,message:'unable to store msg in database'})
    }
}