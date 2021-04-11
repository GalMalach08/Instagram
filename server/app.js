const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const db = require('./db/models')
const cors = require('cors')
const session = require('express-session')
const socketio = require('socket.io')
const fetch = require('node-fetch')
const io = socketio(server)
const moment = require('moment');



// require files 
const authRouter = require('./routes/auth')
const userRouter = require('./routes/users')
const postRouter = require('./routes/posts')
const storyRouter = require('./routes/stories')
const commentRouter = require('./routes/comments')
const messageRouter = require('./routes/messages')
require('dotenv').config({path: `${__dirname}/../.env`})

app.use(cors())
app.use(express.json({limit: '10mb', extended: true}))
app.use(express.urlencoded({limit: '10mb', extended: true}))

app.use(session({
    name:'session-id',
    secret:  process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)
app.use('/comment', commentRouter)
app.use('/story', storyRouter)
app.use('/message', messageRouter)


io.on('connection', (socket) => {
    console.log('socket io is connected')
  
    socket.on('join', async ({ id }) => {
      try{
        console.log(socket.id)
        const user = await db.User.findOne({ where: { id } })
        user.socketIdConnection = socket.id
        await user.save()
  
      } catch (err) {
        console.log(err)
      } 
    })

    socket.on('sendMessage',async ({ message, name }, callback) => {
      const user = await db.User.findOne({ where: { socketIdConnection: socket.id } })
      const chatWithUser = await db.User.findOne({ where: { username: name } })
      console.log(`${user.username} is chating with ${chatWithUser.username}`)
      socket.emit('message', {sender_id:user.id , content: message})
      io.to(chatWithUser.socketIdConnection).emit('message', {sender_id:user.id , content: message})
      })

      
    socket.on('sendLocation',async ({ latitude, longitude, name}, callback) => {
     
      const user = await db.User.findOne({ where: { socketIdConnection: socket.id } })
      const chatWithUser = await db.User.findOne({ where: { username: name } })
      io.to(chatWithUser.socketIdConnection).emit('locationMessage',{ sender_id:user.id, content: `https://google.com/maps?q=${latitude},${longitude}`})
      socket.emit('locationMessage',{ sender_id:user.id , content: `https://google.com/maps?q=${latitude},${longitude}`})
      callback()
  })


      socket.on('disconnect', () => {
          // console.log(socket.id);
        socket.broadcast.emit('message', {active: false, time:moment().calendar()})
      })
})


db.sequelize.sync().then(() => {
    server.listen(3001, () => console.log('server listening on port 3001!'))
})

// db.authenticate()
// .then(() => console.log('Database connected'))
// .catch(err => console.log(err))
    



