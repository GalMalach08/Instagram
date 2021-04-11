import React from 'react'
import NearMeIcon from '@material-ui/icons/NearMe';
import './style.css'
const ChatBlankMessages = () => {
    return (
        <div className="blank_div">
            <span class="dot">
                <div className="blank_image"> 
                    <NearMeIcon style={{ fontSize: 120 }}/>
                </div>
           </span>
           
           <h4>Your Messages</h4>
           <p className="blank_p"> Click on the user you want to chat with! <br />Send private photos and messages to a friend or group. </p>
        </div>
    )
}

export default ChatBlankMessages
