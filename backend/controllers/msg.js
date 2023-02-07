
const Msg = require('../models/message')
const User = require('../models/user')
const Group = require('../models/group')

exports.addMsg = async (req,res)=>{
    try{
        const userId = req.user.id
        const {msg} = req.body
        const groupId = Number(req.params.id)
        console.log(req.params.id,'group id here -->')
        console.log(msg,userId)
        
        const result = await Msg.create({
            message:msg,
            userId:userId,
            groupId:groupId
        })
        console.log(result)
        return res.status(201).json({succes:true,message:'msg stored in database successfully'})
    }
    catch(err){
        console.log(err)
        return res.status(400).json({succes:false,message:'unable to store msg in database'})
    }
}

exports.getMsg = async(req,res)=>{
    try{
        const allMsgs = await Msg.findAll(
            {attributes: ['message'],
            include:[{model:User,attributes:['name']}]})
        return res.status(200).json({message:allMsgs})
    }
    catch(err){
        console.log(err)
        return res.status(401).json({msg:'failed at get msg controller '})
    }
}

exports.getMsgOnLimit = async(req,res)=>{
    try{
        console.log('called called')
        const groupId = req.query.groupId
        const msgSkipNum = Number(req.query.id)
        console.log(msgSkipNum,'to skip')
        if(msgSkipNum >= 10){
            const skip = msgSkipNum-10
            let offset = skip
            const allMsgs = await Msg.findAll(
                {where:{groupId:groupId},attributes: ['id','message'],offset:offset,
                include:[{model:User,attributes:['name']}]})
            return res.status(200).json({message:allMsgs})

        }
        const allMsgs = await Msg.findAll(
            {where:{groupId:groupId},attributes: ['id','message'],
            include:[{model:User,attributes:['name']}]})
        return res.status(200).json({message:allMsgs})
    }
    catch(err){
        console.log(err)
        return res.status(401).json({message:'something went wrong'})
    }
}