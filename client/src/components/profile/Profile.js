import React, { useState, useEffect } from 'react'
// Components
import ProfileImageModal from '../profileImageModal/ProfileImageModal'
import EditProfile from '../editProfile/EditProfile'
import Loader from '../loader/Loader'
// Material ui
import { Grid } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleRoundedIcon from '@material-ui/icons/ChatBubbleRounded';
// Cloudinary
import {Image} from 'cloudinary-react';
// Css
import './style.css'


const Profile = (props) =>  {
    const id = props.match.params.id
    const [posts, setPosts] = useState([])
    const [imageModal, setImageModal] = useState(true)
    const [modal, setModal] = useState(false)
    const [modalImage, setModalImage] = useState('')
    const [isAllowEdit, setisAllowEdit] = useState(false)
    const [isFollowed, setIsFollowed] = useState(false)
    const [numberOfFollowers, setnumberOfFollowers] = useState('')
    const [numberOfFollowing, setnumberOfFollowing] = useState('')
    const user = JSON.parse(localStorage.getItem('user'))
    
    const getUserPosts = async () => {
        const res = await fetch(`/post/${id}`)
      
        const { postArr, numberOfFollowers,  numberOfFollowing} = await res.json()
        console.log(postArr);
        setnumberOfFollowers(numberOfFollowers)
        setnumberOfFollowing(numberOfFollowing)
        console.log(postArr);
        setPosts(postArr)
    }

    const setFollow = async () => {
        // make unfolow
        if(isFollowed) {
            const res = await fetch('/user/unfollow', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({userWhoWantstoUnfollow: user.id , userWhoGetsUnfollowed: id })
          })
          const data = await res.json()
          if(data.success) { 
            setIsFollowed(false)
            setnumberOfFollowers(numberOfFollowers - 1)
              user.Followings = user.Followings.filter(followed => Number(followed.followed_id) !== Number(id))
              localStorage.setItem('user', JSON.stringify(user))
             
          }
        } else {
            // make follow
                const res = await fetch('/user/follow', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({userWhoWantToFollow: user.id , userWhoGetsFollower: id })
              })
              const data = await res.json()
              if(data.success) {
                setnumberOfFollowers(numberOfFollowers + 1)
                  user.Followings.push({UserId:Number(user.id), followed_id: Number(id)})
                  localStorage.setItem('user', JSON.stringify(user))
                  setIsFollowed(true)
              }
        
    }
}

const handleImageModal = (post) => {
    setModalImage(post)
    setImageModal(true)
}

    useEffect(() => {
       getUserPosts() 
       if (Number(id) === Number(JSON.parse(localStorage.getItem('user')).id)) {
        setisAllowEdit(true)
       } else {
        setisAllowEdit(false)
       }
       if(user.Followings.find(followed => Number(followed.followed_id) === Number(id))) {
        setIsFollowed(true)
       } else {
        console.log(false)
        setIsFollowed(false)
       }
    }, [modal,id])

    return (
        <>
        {posts.length !== 0  ?
        <div className="profile-main">
           <header>
            <div className="container">
              <div className="profile" style={{margin:'0px'}}>
                  <div className="profile-image">
                  <Image cloudName="malachcloud" publicId={posts[0].owner_photo} width="200" crop="scale" />
                  </div>

                 <div className="profile-user-settings">
                    <h2 className="profile-user-name"> {posts[0].owner_username} </h2>
                    {isAllowEdit ? 
                    <button className="btn profile-edit-btn" onClick={() => setModal(true)}>Edit Profile</button>
                    :
                    <button className="btn profile-edit-btn" onClick={() => setFollow()}>{isFollowed ? 'Unfollow' : 'Follow' }</button>
                    }
                    <button className="btn profile-settings-btn"><SettingsIcon/></button>
                </div>

                <div className="profile-stats">
                    <ul style={{padding:'10px 2px 3px'}}>
                        <li><span className="profile-stat-count">{posts.length}</span> posts</li>
                        <li><span className="profile-stat-count">{numberOfFollowers}</span> followers</li>
                        <li><span className="profile-stat-count">{numberOfFollowing}</span> following</li>
                    </ul>
                </div>

                <div className="profile-bio">
                    <p><span className="profile-real-name">{posts[0].owner_username}</span> {posts[0].publisher_description} 📷✈️🏕️</p>
                </div>
            </div>
        </div>
    </header>

  <main>
    <div className="container">
        <div className="gallery">
        <Grid container>
        {posts ? posts.slice(0).reverse().map(post => (
            <Grid item xs={4} onClick={() => handleImageModal(post)}>
            <div className="gallery-item" tabIndex="0">
                <img src={post.photo} className="gallery-image" alt=""/>
                <div className="gallery-item-info">
                    <ul>
                        <li className="gallery-item-likes"><span className="visually-hidden">Likes:</span> <FavoriteIcon/> {post.likes}</li>
                        <li className="gallery-item-comments"><span className="visually-hidden">Comments:</span><ChatBubbleRoundedIcon/> {post.comments.length}</li>
                    </ul>
                </div>
            </div>
            </Grid>
        )):null}
        </Grid>
        </div>
    </div>
 </main> 
</div>
:<Loader/>}

<EditProfile modal={modal} setModal={setModal}/> 
<ProfileImageModal imageModal={imageModal} setImageModal={setImageModal} modalImage={modalImage}/>
        </>
    )
}

export default Profile




