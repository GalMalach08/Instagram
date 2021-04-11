import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import ChatMessages from './ChatMessages'
import ChatBlankMessages from './ChatBlankMessages'
import ChatUsers from './ChatUsers'


const Chat = (props) => {
    const { id } = props.match.params
    const { location } = props
  
    const [currentChatUser, setCurrentChatUser] = useState('')
    const [userChanged, setUserChanged] = useState(false)
    const getUser = async () => {
        const res = await fetch(`/user/${id}`)
        const { user } = await res.json()
        setCurrentChatUser(user)
    }

    useEffect(() => {
        getUser()
    }, [userChanged])



    
    return (

        <div className="container pt-4">
           <Grid container style={{backgroundColor:'whitesmoke', minHeight:'600px', border:'1px solid lightgrey'}}>
                <Grid item xs={6} style={{  border:'1px solid lightgrey' }} >
                    <ChatUsers userChanged={userChanged} setUserChanged={setUserChanged}/>
                </Grid>
                <Grid item xs={6}>
                   { currentChatUser && currentChatUser !== null ?  <ChatMessages user={currentChatUser} location={location}/> 
                   : <ChatBlankMessages />}
                </Grid>
           </Grid>
        </div>
      
            
       
    )
}

export default Chat
