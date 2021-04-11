import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, IconButton, CardHeader, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
// Cloudinary
import {Image} from 'cloudinary-react';


// material ui style
const useStyles = makeStyles((theme) => ({
    likes: {
      color: "#262626",
      fontSize:'14px',
      fontWeight: '600',
    },
    users: {
        cursor:'pointer',
        '&:hover': {
            background: 'whitesmoke',
         },
      
    }
  }))

const ChatUsers = ({ setUserChanged, userChanged }) => {
    const connectedUser = JSON.parse(localStorage.getItem('user'))
    const classes = useStyles()
    const [users, setUsers] = useState('')


    const getUsers = async () => {
        const res = await fetch(`/user/follow/${connectedUser.id}`)
        const { users } = await res.json()
        setUsers(users)
    }


    useEffect(() => {
       getUsers()
    }, [])
    return (
        <>
        <div className="users_header">
        <h6>{connectedUser.username}</h6>
        </div>
        <Divider />
        <div className="base-container">
        {users && users.map((user,i) => (
            <Link to={`/chat/${user.id}?chatwith=${user.username}`} key={i}>    
            <CardHeader  
            onClick={() => setUserChanged(!userChanged)}
            avatar={ <Avatar style={{height:'56px',width:'56px'}}><Image cloudName="malachcloud" publicId={user.profile} width="56" height="56" crop="scale" /> </Avatar>}
            title={<span  className={classes.likes}>{user.username}</span>}
            subheader="Active 2 hours ago"
            className={classes.users}
          />
          </Link>
        ))}
        </div>
           </>
   
     
    )
}

export default ChatUsers
