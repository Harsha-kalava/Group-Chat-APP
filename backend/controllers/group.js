const User = require('../models/user')
const Group = require('../models/group')
const userGroup = require('../models/usergroup')

exports.groupCreation = async(req,res)=>{
    try{
        const data = req.body
        const userId = req.user.id
        console.log(data.groupName)

        const addCommonGroup = await Group.findOrCreate({
            where: { GroupName: 'common',isAdmin:false }   
        }).then((result) => {
            return result;
          })
          console.log(addCommonGroup)

        const groupTable = await Group.create({
            GroupName:data.groupName,
            userId:userId,
            isAdmin:true
        })

        const groupId = groupTable.id;
        let isAdmin = groupTable.isAdmin
        console.log(isAdmin,'<----------- is admin')
        if(isAdmin === null){
            isAdmin = false
        }

        await userGroup.create({
        userId: userId,
        groupId: groupId,
        isAdmin: isAdmin
        });

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

exports.allMembersInGroup = async (req, res) => {
    try {
        const groupId = req.query.groupId
        console.log(groupId)
        const groupMembersId = await userGroup.findAll({ where: { groupId: groupId }, attributes: ['userId', 'isAdmin'] })

        const members = await Promise.all(groupMembersId.map(async data => {
            const membersName = await User.findAll({ where: { id: data.userId }, attributes: ['name'] })
            for (let user of membersName) {
                return { userId: data.userId, isAdmin: data.isAdmin, name: user.name }
            }
        }))
        return res.status(200).json({ success: true, members: members })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'unable to retrieve group members' })
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
        const isAdmin = req.query.admin
        const userId = req.user.id
        console.log(groupId,userId,email)
        if(email){
            console.log('entered in email block')
            const userId1 = await User.findOne({where:{email:email},attributes: ['id']})
            console.log(userId1.id,'user id inside blockk')
            const id = userId1.id
            const result = await userCheck(groupId,id,isAdmin)
            if(result == 'success'){
                 return res.status(201).json({success:true,message:'user created'})
            }else{
                return res.status(200).json({success:true,message:'user exists'})
            }
        }
        console.log('not entered in email block')
        const result = await userCheck(groupId,userId,isAdmin)
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

async function userCheck(groupId,userId,isAdmin){
    try{
        console.log('entered in user check')
        const userInGroupOrNot = await userGroup.findOne({where:{groupId:groupId,userId:userId}})
        if(!userInGroupOrNot){
            await userGroup.create({
                userId:userId,
                groupId:groupId,
                isAdmin:isAdmin
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

exports.makeAdmin = async(req,res)=>{
    try{
        const toMakeAdminId = req.query.userId
        const groupId = req.query.groupId
        const userId = req.user.id
        console.log(toMakeAdminId,userId)
        const userAdminOrNot = await userGroup.findOne({where:{groupId:groupId,userId:userId},attributes:['isAdmin']})
        console.log(userAdminOrNot.isAdmin)
        if(userAdminOrNot.isAdmin === false){
            return res.status(401).json({success:true,message:'user is not an admin'})
        }
        await userGroup.update({isAdmin:true},{
            where: { groupId:groupId,userId:toMakeAdminId },
          })
          return res.status(202).json({success:true,message:'updated successfully'})
    }
    catch(err){
        console.log(err)
    }
}

exports.deleteUser = async(req,res)=>{
    try{
        const todeleteUserId = req.query.userId
        const groupId = req.query.groupId
        const userId = req.user.id
        console.log(todeleteUserId,userId)
        const userAdminOrNot = await userGroup.findOne({where:{groupId:groupId,userId:userId},attributes:['isAdmin']})
        console.log(userAdminOrNot.isAdmin)
        if(userAdminOrNot.isAdmin === false){
            return res.status(401).json({success:true,message:'user is not an admin'})
        }
        await userGroup.destroy({
            where: { groupId:groupId,userId:todeleteUserId },
          })
          return res.status(202).json({success:true,message:'updated successfully'})
    }
    catch(err){
        console.log(err)
    }
}