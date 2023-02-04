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