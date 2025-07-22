require('dotenv').config()            //dev dependency
const mongoose=require('mongoose')
const express = require('express')

//Route
const jiraApiCallRoute = require('./route/jiraApiCallRoute');
const authRoute = require("./route/authRoute");
const jiraRoute = require('./route/jiraRoute');

const app = express()
const PORT = process.env.PORT || 3500
const cors = require('cors');
const { jiraAuthMiddleware } = require('./middleware/authVerify');


app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
res.status(200).send("Api connected Successfully!")
})

app.use('/api/v1',jiraAuthMiddleware,jiraApiCallRoute);
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/jira',jiraRoute);

mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error', (errorMessage) => console.log(errorMessage))
db.once('open', () => console.log('Connected to db successfully'))

app.listen(PORT,console.log(`Server started running on http://localhost:${PORT}`))