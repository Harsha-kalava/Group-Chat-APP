const User = require('../models/user')
const Group = require('../models/group')

exports.groupCreation = async(req,res)=>{
    try{
        const data = req.body
        console.log(data.groupName)

        const groupTable = await Group.create({
            GroupName:data.groupName
        })

        return res.status(201).json({success:true,message:groupTable})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:'unable to create a group'})
    }
}