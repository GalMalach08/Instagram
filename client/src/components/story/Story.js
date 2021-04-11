import React, { useState, useEffect } from 'react'
import StoryModal from './StoryModal'
// material ui
import { Avatar } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
// react-stories
import Stories from 'react-insta-stories';
// Cloudinary
import {Image} from 'cloudinary-react';
// css
import './style.css'

const Story = ({ storiesUsers }) => {
    const [storyUsers, setStoryUsers] = useState([])
    const [stories, setStories] = useState([])
    const [storyModal, setStoryModal] = useState(false)

    const openStory = (stories,username,profile) => {
       const storiesArr = []
       stories.forEach(story => {
           const photoArr = story.photo.split("upload/")
           const storyObj = {
                url:`${photoArr[0]}upload/w_432,h_500,c_scale/${photoArr[1]}`,
                header: {
                        heading: username,
                        profileImage: profile , 
                    }
                }
                storiesArr.push(storyObj)    
    })
    setStories(storiesArr)
}

    useEffect(() => {
        setStoryUsers(storiesUsers)
    }, [])
  
   
    return (
    <StylesProvider>
        {stories.length !== 0 && 
        <>
        <div className="overlays"></div>
        <div style={{position: 'fixed', top:'20%', left:'30%', zIndex:'2'}}>
          <Stories  width={432} height={500} stories={stories} onAllStoriesEnd={() => setStories([])}/>
        </div>
        </>
        }
        <div className="stories">
            <div className="story_users">
                {storyUsers && storyUsers.map(user => (
                    <div key={user.id} className="story-div"> <Avatar style={{height:'70px', width:'70px', border:'2px solid #D82B7D'}} onClick={() => openStory(user.Stories,user.username,user.profileUrl)}>
                    <Image cloudName="malachcloud" publicId={user.profile} width="70" height="70" crop="scale" />
                    </Avatar>
                    <span className="story_username">{user.username}</span>
                    </div>
                ))}
        </div>
        <div className="add_Story_btn" id="stepThree" title="Add story"> <AddCircleIcon onClick={() => setStoryModal(true)} style={{fill:'#ED4A4D'}} fontSize="large"/> </div>
    </div>
    <StoryModal storyModal={storyModal} setStoryModal={setStoryModal}/>
</StylesProvider>
    ) 
}

export default Story

 