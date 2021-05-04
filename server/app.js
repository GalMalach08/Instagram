const express = require('express')
const app = express()
const db = require('./db/models')
const cors = require('cors')
const session = require('express-session')

// require files 
const authRouter = require('./routes/auth')
const vacationRouter = require('./routes/vacation')
const followRouter = require('./routes/follow')


app.use(cors())
app.use(express.json({limit: '10mb', extended: true}))
app.use(express.urlencoded({limit: '10mb', extended: true}))

app.use(session({
    name:'session-id',
    secret:  'mysecret',
    resave: false,
    saveUninitialized: false,
}))


app.use('/auth', authRouter)
app.use('/vacation', vacationRouter)
app.use('/follow', followRouter)

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3001, () => console.log(`app listening on port ${process.env.PORT}!`))
}).catch(error => console.log(error))



