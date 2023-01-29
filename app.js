const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = require('./backend/util/database')
const User = require('./backend/models/user')
const Msg = require('./backend/models/message')


const userRoutes = require('./backend/routes/user')
const msgRoutes = require('./backend/routes/msg')

const app = express()
app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(bodyParser.json())

app.use("/user",userRoutes)
app.use("/msg",msgRoutes)

User.hasMany(Msg)
Msg.belongsTo(User)

sequelize.sync({alter:true})
.then((res)=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log('app started running')
    })
})