import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import MoodIcon from '@material-ui/icons/Mood';
import { Avatar, IconButton, CardHeader, Divider, TextField, InputAdornment, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import queryString from 'query-string'
// Cloudinary
import {Image} from 'cloudinary-react';
// Css
import './style.css'
//Socket io
import io from 'socket.io-client'
let socket

// material ui style
const useStyles = makeStyles((theme) => ({
    likes: {
      color: "#262626",
      fontSize:'14px',
      fontWeight: '600',
    },
    AddCommenttextField: {
        flexBasis: 280,
        margin: '20px 2px',
        width:'99%',
        padding:'1% 0%',
     
      },
  }))

const ChatMessages = ({ user, location }) => {
    const [messages, setMessages] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef()
    const connectedUser = JSON.parse(localStorage.getItem('user'))
    const classes = useStyles()
    
    // Socket connection
    const ENDPOINT = 'localhost:3001'
    const connectionOptions =  {
        "force new connection" : true,
        "reconnectionAttempts": "Infinity", 
        "timeout" : 10000,                  
        "transports" : ["websocket"]
    }

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const sendMessage = async (e) => {
        e.preventDefault()
       
        if(message) {
            socket.emit('sendMessage', { name,message }, () => setMessage(''))    
            await fetch('/message', { method: 'POST', headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({ UserId: connectedUser.id, reciver_id:user.id, sender_id:connectedUser.id, content: message })
          })
            await fetch('/message', { method: 'POST', headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({ UserId: user.id, reciver_id:user.id, sender_id:connectedUser.id, content: message })
         })
        }
    }
    
    const sendLocation =  () => {
      if(!navigator.geolocation) {
          return alert('Your broswer not supported geolocation')
      }
      navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {latitude: position.coords.latitude, longitude: position.coords.longitude, name}, async () => {
          await fetch('/message', { method: 'POST', headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ UserId: connectedUser.id, reciver_id:user.id, sender_id:connectedUser.id, content: message })
        })
          await fetch('/message', { method: 'POST', headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ UserId: user.id, reciver_id:user.id, sender_id:connectedUser.id, content: message })
       })
      })
      })
    }

    useEffect(() => {
        socket = io(ENDPOINT, connectionOptions)
        socket.emit('join', { id:connectedUser.id } )
    }, [])

    // Handle messages
    useEffect(() => {
      socket.on('message', (message) => {
      setMessages([...messages, message])
      setTimeout(() => scrollToBottom(), 400)
      })
      socket.on('locationMessage', (message) => {
        setMessages([...messages,{...message,location:true} ])
        setMessage('')
        setTimeout(() => scrollToBottom(), 400)
    })
    }, [messages])


    const getConversation = async () => {
        const response = await fetch('/message/conversation', { 
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ UserId:connectedUser.id, partnerId: user.id})
          })
          const { messages } = await response.json()
          setMessages(messages)
    }

    useEffect(() => {
    
      setTimeout(() => scrollToBottom(), 400)
        if(user) {
          const { chatwith } = queryString.parse(location.search)
          setName(chatwith)
          getConversation()
        }
    }, [user])



    return (
        
           <div className="base-container">
           <div style={{position: 'sticky',  top: '0'}}>
          <CardHeader 
           
            avatar={ <Avatar style={{height:'56px',width:'56px'}}><Image cloudName="malachcloud" publicId={user.profile} width="56" height="56" crop="scale" /> </Avatar>}
            title={<Link to={`/profile`}><span className={classes.likes}>{user.username}</span></Link>}
            subheader="Active 2 hours ago"
          />
          <Divider />
         </div>
        <div className="messages_div">
           {messages && messages.map((message, i) => (
                <div key={i} className={message.sender_id === connectedUser.id ? 'my-text-div' : 'friend-text-div'}>
                    <div className={message.sender_id === connectedUser.id ? 'my-text-container' : 'friend-text-div'}>
                        <div className={message.sender_id === connectedUser.id ? 'my-text' : 'friend-text'}>
                        { message.location ?
                         <a target="_blank"  rel="noreferrer" href={message.content}>My location</a>
                        :
                        message.content
                        }
                       
                        </div>
                    </div>
                </div>
           ))}
           <div ref={messagesEndRef} />
        </div>
          
   
           <TextField onKeyPress={e => e.key ==='Enter' ? sendMessage(e): null} onChange={(e) => setMessage(e.target.value)} value={message} className={classes.AddCommenttextField} variant="outlined" type="text" label="Message"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton> <MoodIcon/></IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
               <Button onClick={ sendLocation }> <LocationOnIcon style={{padding:'0px'}}/> </Button>
                <Button  onClick={(e) => sendMessage(e) } color="primary">Send</Button>
              </InputAdornment>
            ),
          }}/>
   
        
        </div>
      
    )
}

export default ChatMessages
