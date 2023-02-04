const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = require('./backend/util/database')
const User = require('./backend/models/user')
const Msg = require('./backend/models/message')
const Group = require('./backend/models/group')
const userGroupData = require('./backend/models/usergroup')


const userRoutes = require('./backend/routes/user')
const msgRoutes = require('./backend/routes/msg')
const groupRoutes = require('./backend/routes/group')

const app = express()
app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(bodyParser.json())

app.use("/user",userRoutes)
app.use("/msg",msgRoutes)
app.use('/group',groupRoutes)


User.hasMany(Msg)
Msg.belongsTo(User)

Group.hasMany(Msg)
Msg.belongsTo(Group)

User.belongsToMany(Group,{through:userGroupData})
Group.belongsToMany(User,{through:userGroupData})



sequelize.sync({alter:true})
.then((res)=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log('app started running')
    })
})

