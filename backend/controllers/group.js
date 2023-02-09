const User = require('../models/user')
const Group = require('../models/group')
const userGroup = require('../models/usergroup')

exports.groupCreation = async(req,res)=>{
    try{
        const data = req.body
        const userId = req.user.id
        console.log(data.groupName)

        const addCommonGroup = await Group.findOrCreate({
            where: { GroupName: 'common' }   
        }).then((result) => {
            return result;
          })
          console.log(addCommonGroup)

        const groupTable = await Group.create({
            GroupName:data.groupName,
            userId:userId
        })

        await req.user.addGroup(groupTable)

        return res.status(201).json({success:true,message:groupTable})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:'unable to create a group'})
    }
}

exports.allGroups = async(req,res)=>{
    try{
        console.log('entered in all groups')
        const userId = req.user.id
        const groupData = await userGroup.findAll({
            where:{userId:userId},
            attributes:['groupId']
          })
          const groupIds = groupData.map(group => group.groupId)
          const groups = await Group.findAll({
            where: { id: groupIds },
            attributes: ['id','GroupName']
          })
        res.status(200).json({message:groups})

    }
    catch(err){
        console.log(err)
    }
}


exports.groupCheckAndFetch = async(req,res)=>{
    try{
        const groupId = req.params.id
        const userId = req.user.id
        console.log(groupId,userId)
        return res.status(201).json({success:true})
    }
    catch(err){
        console.log(err)
    }
}

exports.addUserToGroup = async (req,res)=>{
    try{
        const groupId = req.query.groupId
        const email = req.query.userEmail
        const userId = req.user.id
        console.log(groupId,userId,email)
        if(email){
            console.log('entered in email block')
            const userId1 = await User.findOne({where:{email:email},attributes: ['id']})
            console.log(userId1.id,'user id inside blockk')
            const id = userId1.id
            const result = await userCheck(groupId,id)
            if(result == 'success'){
                 return res.status(201).json({success:true,message:'user created'})
            }else{
                return res.status(200).json({success:true,message:'user exists'})
            }
        }
        console.log('not entered in email block')
        const result = await userCheck(groupId,userId)
        if(result === 'success'){
            return res.status(201).json({success:true,message:'user created'})
       }else{
           return res.status(200).json({success:true,message:'user exists'})
       }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({success:false,message:'failed at userCheck function'})
    }
}

async function userCheck(groupId,userId){
    try{
        console.log('entered in user check')
        const userInGroupOrNot = await userGroup.findOne({where:{groupId:groupId,userId:userId}})
        if(!userInGroupOrNot){
            await userGroup.create({
                userId:userId,
                groupId:groupId
            })
            return 'success'
        }
        return true
    }
    catch(err){
        console.log(err)
        return false
    }
    
}