import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Loader from '../loader/Loader'
import Story from '../story/Story'
import NewUserModal from './newUserModal/NewUserModal'
import ShareModal from './shareModal/ShareModal'
// material ui components
import { Divider, Grid, Input, IconButton, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Avatar, Typography, TextField, Button, InputAdornment, Hidden, Tooltip  } from '@material-ui/core';
import { makeStyles, StylesProvider } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
// material ui icons
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ImageIcon from '@material-ui/icons/Image';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import CloseIcon from '@material-ui/icons/Close';
import MoodIcon from '@material-ui/icons/Mood';
import FavoriteIcon from '@material-ui/icons/Favorite';
// Formik
import { Formik, Form} from 'formik';
import * as Yup from 'yup';
// Cloudinary
import {Image} from 'cloudinary-react';
// Bootstrap
import Modal from 'react-bootstrap/Modal'
// intro js
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
// Css
import './style.css'

// moment.js
const moment = require('moment')

// material ui style
const useStyles = makeStyles((theme) => ({
  root: {
    display:'flex',
    justifyContent:'center',
    marginTop:'30px'
  },
  previewcard:{
    width:'300px',
    height:'340px',
    margin:'auto'
  },
  media: {
    height: '550px',
    width:'550px',
    paddingTop: '56.25%', // 16:9
  },
  previewmedia: {
    width:'300px',
    height:'200px'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  modalHeader: {
   display: 'flex',
   justifyContent: 'center',
   fontWeight:'bold',
  },
  fab: {
    position:'fixed',
    bottom: '10px',
    left: '75%',
    whiteSpace: 'nowrap',
    zIndex: '50px',
    borderRadius:'20px',
    backgroundColor:'lightblue'
  },
  profileBtn: {
    paddingTop:'10px',
    marginTop:'10px',
    marginBottom:'10px'
  },
  imageIcon: {
    marginBottom:'8px',
    marginRight:'5px'
  },
  extendedIcon: { 
    marginRight: theme.spacing(1),
  },
  likes: {
    color: "#262626",
    fontSize:'14px',
    fontWeight: '600',
  },
  comment: {
    display:'flex',
    alignItems:'center',
    marginTop:'18px',
    color: "#262626",
    fontSize:'14px',
    fontWeight: '600',
  },
  AddCommenttextField: {
    flexBasis: 280,
    margin: '20px 2px',
    width:'100%',
    padding:'1% 0%',
    
  },
  divider: {
    margin:'15px 0px'
  },
  iconButton: {
    '&:hover': {
      color:'red'
    },
    '&:click': {
      outline: 'none'
    },
  },
  suggestion: {
    position: 'fixed',
    right: '100px',
    top: '100px',
    display:'flex',
    flexDirection: 'column',
    width: '100%',
    overflowY:'auto',
    height:'100%',
    paddingRight:'20px',
    scrollbarWidth: 'none'
  },
  story: {
    height:'118px',
    width:'614px',
    display:'flex',
    marginLeft:'360px'
  }
}))

 const Home = () => {
  const classes = useStyles()
  const user = JSON.parse(localStorage.getItem('user'))
  const [posts, setPosts] = useState([])
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [isBedAlert, setIsBedAlert] = useState(false)
  const [commentValue, setCommentValue] = useState('')
  const [previewSource, setPreviewSource] = useState('')
  const [suggestionUsers, setSuggestionUsers] = useState([])
  const [isFollowed, setIsFollowed] = useState(false)
  const [isLike, setIsLike] = useState(false)
  const [storiesList, setStoriesList] = useState([])
  const [storiesUsers, setStoriesUsers] = useState([])
  const [isProfile, setIsProfile] = useState(false)
  const [message, setMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(false)
  const [fileName, setFileName] = useState('')
  const [emailModal, setEmailModal] = useState(false)
  // intro js states
  const [firstEntry, setFirstEntry] = useState(false)
  const [stepsEnabled, setStepsEnabled] = useState(false)
  const [initialStep, setInitialStep] = useState(0)
  const [steps, setSteps] = useState([
      { element:"#stepOne", intro: "Start following users to see their special moments and experiences 😎", position: 'left', tooltipClass: 'myTooltipClass' },
      { element:"#stepTwo", intro: "Add your own photo's and video's and start share your feelings with the world! 📷", position: 'left', tooltipClass: 'myTooltipClass' },
      { element:"#stepThree", intro: "Upload a story daily to update your followers on how you are doing today 🥳. The story is completely gone after 24 hours", position: 'left', tooltipClass: 'myTooltipClass' },
  ])

  // Modal functions
  const closeModal = () => setEmailModal(false)
  const openModal = () => setEmailModal(true)

  // formik validation
  const validationSchema = Yup.object().shape({
    photo:Yup.string()
    .required('photo is required'),
    content:Yup.string()
    .required('content is required')
  })

// Post functions

// Edit the profile image
  const editImage =  (values) => {
    values.fileName = fileName
    if(typeof values.photo === 'object' ) {
    const reader = new FileReader()
    reader.readAsDataURL(values.photo)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
      values.photo = reader.result
      addNewPost(values)
    }
    } else {
      addNewPost(values)
    }
  }

  // Add new Post
  const addNewPost = async (values) => {
      const newPost = {
        photo: values.photo,
        likes: 0,
        content: values.content,
        UserId : JSON.parse(localStorage.getItem('user')).id,
        fileName: values.fileName,
        date: moment().format('MMMM Do, h:mm a').toString()
      }
        try {
          const response = await fetch('/post', { 
          method: 'POST',
          headers: {
              'Content-Type':'application/json'
          },
          body: JSON.stringify(newPost)
        })
        const data = await response.json()
        if(data.post){
          console.log(data.post);
          const newPostArray = [...posts]
          const postObj = {
            index: posts.length,
            publisher_id: user.id,
            publisher_username: user.username,
            publisher_profile: user.profile,
            post_id: data.post.id,
            post_content: data.post.content,
            post_likes: [],
            post_likes_old: [],
            post_likeby: [],
            post_photo: data.post.photo,
            post_date: data.post.date,
            post_comments: []
          }
          newPostArray.push(postObj)
          console.log(newPostArray)
          setPosts([...newPostArray])
          setIsBedAlert(false)
          setMessage('Post Added!')
          setOpenAlert(true)
          setTimeout(() => {
            setOpenAlert(false)
            closeModal()
          },1000)
        } else {
          setIsBedAlert(true)
          setMessage(data.error)
          setOpenAlert(true)
        }

      } catch (error) {
          console.error(error)
        }
  }

  // Makes the preview image
  const handleChangeImage = (e,setFieldValue) => {
      const reader = new FileReader()
      setFieldValue("photo", e.target.files[0])
      if(e.target.files.length === 0) {
        setIsProfile(false)
        setFileName('')
        setPreviewSource('')
      } 
      else {
        reader.readAsDataURL(e.target.files[0])
        reader.onloadend = () => {
          setPreviewSource(reader.result)
        }
        setIsProfile(true)
        setFileName(e.target.files[0].name)
      }
  }

  // Add comment 
  const sendComment = async (PostId, index) => {
    const newArr = posts
    const renderComment = {
      time: moment().startOf('hour').fromNow().toString(),
      content: commentValue,
      commenter:JSON.parse(localStorage.getItem('user')).username,
      commenter_profile:JSON.parse(localStorage.getItem('user')).profile,
    }
    console.log(newArr[index].post_comments);
    newArr[index].post_comments.push(renderComment)
    console.log(newArr[index].post_comments);
    setPosts([...newArr])

    const comment = {
      time: moment().startOf('hour').fromNow().toString(),
      content: commentValue,
      PostId,
      UserId: JSON.parse(localStorage.getItem('user')).id,
    }
    try {
      const response = await fetch('/comment', { 
      method: 'POST',
      headers: {
          'Content-Type':'application/json'
      },
      body: JSON.stringify(comment)
    })
    const data = await response.json()
    if(data.comment){
      // console.log(data.comment)
    } else {
      console.log('error')
    }
  } catch (error) {
      console.error(error)
    }
  }
  // Add Like
  const addLike = async (id,index, isLike) => {
    try {
      const newArr = posts
      let add
      if(!isLike) { 
        newArr[index].post_likeby.push(user.username)
        newArr[index].like = true
        setPosts([...newArr])
        add = true
      } else {
        console.log('remove');
        newArr[index].post_likeby =  newArr[index].post_likeby.filter(like => like !== user.username)
       
        newArr[index].like = false
        setPosts([...newArr])
        add = false
      }
      await fetch('/post/like', { 
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ add, PostId:id, UserId:user.id })
      })
    } catch (error) {
      console.log(error)
    }
 
  }
  // Get all the posts
  const getPosts = async () => {
    const postsArr = []
    let index = 0
    const res = await fetch('/post')
    const data = await res.json()
    data.forEach((item) => {
      if(user.Followings.find(followed => followed.followed_id === item.publisher_id) || user.id === item.publisher_id || item.publisher_username === "instagram"){
        item.posts.forEach((post) => {
          const post_likeby = []
          post.post_likes.forEach(like => post_likeby.push(like.like_username))
          const isLike = Boolean(post.post_likes.find(likedUser => Number(likedUser.like_userid) === Number(user.id)))
          const postObj = {
            index,
            publisher_id: item.publisher_id,
            publisher_username: item.publisher_username,
            publisher_profile: item.publisher_profile,
            post_id: post.post_id,
            post_content: post.post_content,
            post_likes: post.post_likes.length,
            post_likes_old: post.post_likes.length,
            post_likeby,
            post_photo: post.post_photo,
            post_date: post.post_date,
            like:isLike,
            post_comments: post.post_comments
          }
          index ++
          postsArr.push(postObj)
         
        })
      }
    })
    console.log(postsArr);
    setPosts(postsArr)
}

const getStories = async () => {
  const res = await fetch('/story')
  const { stories } = await res.json()
  const storyArr = []
  stories.forEach(story => {
    if(story.User.Followers.find(follower => Number(follower.follower_id) === Number(user.id)) || Number(story.User.id) === Number(user.id) || story.User.username === "instagram") {
      if(!(storyArr.find(user => user.username === story.User.username))) {
        storyArr.push(story.User)
      }
    }
  })
  
  setStoriesUsers(storyArr)
}

// Get all suggestion users
const getSuggestionUsers = async () => {
  try {
    const res = await fetch('/user')
    const { users } = await res.json()
    
    const suggestionArr = []
   
    users.forEach(suggestionUser => {
      if(!(suggestionUser.Followers.find(follower => Number(follower.follower_id) === Number(user.id))) && (Number(suggestionUser.id) !== Number(user.id)) && (suggestionUser.username !== 'instagram')){
        suggestionArr.push(suggestionUser)
      }
    })
 

    setSuggestionUsers(suggestionArr)
 
} catch (error) {
    console.error(error)
  }
}

const setFollow = async (id) => {
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
            const newSuggestedUserArr = suggestionUsers.filter(user => user.id !== id)
            setSuggestionUsers([...newSuggestedUserArr])
            user.Followings.push({UserId:Number(user.id), followed_id: Number(id)})
            localStorage.setItem('user', JSON.stringify(user))
        }
}

// intro js functions
const onExit = () => {
  setStepsEnabled(false)
  setFirstEntry(false)
}
  useEffect(() => {
    user.Followings.length === 0 && user.Followers.length === 0 ? setFirstEntry(true) : setFirstEntry(false)
    getPosts()
    getStories()
    getSuggestionUsers()
  
  }, [])


  return (
    <>
    {firstEntry ? 
    <>
    <NewUserModal stepsEnabled={stepsEnabled} setStepsEnabled={setStepsEnabled}/>
    <Steps enabled={stepsEnabled} steps={steps} initialStep={initialStep} onExit={onExit}/>
    </>
     : null}
   <StylesProvider injectFirst>
   <Grid container>
   <Grid item className={classes.story} sm={4} md={4}>
    {storiesUsers.length !== 0  &&  <Story storiesUsers={storiesUsers} />}
   </Grid>

       {posts ?  posts.slice(0).reverse().map(post => (
         <Grid item sm={12} md={10} className={classes.root} >
         <Card className={classes.card}>
          <CardHeader
            avatar={ <Avatar><Image cloudName="malachcloud" publicId={post.publisher_profile} width="70" height="40" crop="scale" /> </Avatar>}
            action={ <IconButton> <MoreVertIcon /> </IconButton> }
            title={<Link to={`/profile/${post.publisher_id}`}><span className={classes.likes}>{post.publisher_username}</span></Link>}
          />

          <CardMedia className={classes.media} image={post.post_photo}></CardMedia>

          <CardActions disableSpacing>
            <IconButton className={classes.iconButton} onClick={() => addLike(post.post_id, post.index, post.like)}>{post.like ? <FavoriteIcon style={{fill: "red"}}/> : <FavoriteBorderOutlinedIcon /> } </IconButton>
            <IconButton> <ChatBubbleOutlineIcon/> </IconButton>
            <IconButton > <ShareIcon onClick={() => setShareModalOpen(true)}/> </IconButton>
            <ShareModal shareModalOpen={shareModalOpen} setShareModalOpen={setShareModalOpen} /> 
          </CardActions>

          <CardContent>
          <Typography className={classes.likes}> 
          {post.post_likeby.length === 0 && 'be the first one to like this post!'}
          {post.post_likeby.length === 1 && `liked by ${post.post_likeby[0] === user.username ? 'you' : post.post_likeby[0] }`}
          {post.post_likeby.length === 2 && `liked by ${post.post_likeby[0] === user.username ? 'you' : post.post_likeby[0] }, ${post.post_likeby[1] === user.username ? 'you' : post.post_likeby[1] }`}
          {post.post_likeby.length > 2 && `liked by ${post.post_likeby[0] === user.username ? 'you' : post.post_likeby[0] }, ${post.post_likeby[1] === user.username ? 'you' : post.post_likeby[1] } and ${post.post_likeby.length - 2} others`}
          </Typography>
          <Typography className={classes.likes}><Link to={`/profile/${post.publisher_id}`} style={{color:'black'}}> {post.publisher_username} </Link> <span className="post-content"> {post.post_content} </span></Typography> 
          <Divider className={classes.divider}/>
          {post.post_comments.map(comment => (
            <Typography  className={classes.comment}> 
            <Avatar><Image cloudName="malachcloud" publicId={comment.commenter_profile} width="80" /> </Avatar>
            <Link to={`/profile/${comment.commenter_id}`} style={{color:'black'}}> <span className='commeter'>{comment.commenter} </span> </Link>
            <span className="post-content">{comment.content}</span>
            </Typography>
          ))}
          <div className="post-date">{post.post_date}</div>
          <Divider className={classes.divider}/>
          <TextField className={classes.AddCommenttextField} variant="outlined" type="text" label="Add a comment..."
          onChange={ e => setCommentValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton> <MoodIcon/></IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={() => sendComment(post.post_id, post.index)} color="primary">Post</Button>
              </InputAdornment>
            ),
          }}/>
          </CardContent>
        </Card>
      </Grid>   
       )):  <Loader /> }
        <Hidden smDown>
       <Grid item className={classes.suggestion} md={3}>
       <div id="stepOne"> <h6 className="user-suggested-headline">Suggestions For You</h6> </div>
         
       {suggestionUsers && suggestionUsers.map(user => (
        <div>
        <CardHeader 
            avatar={ <Avatar><Image cloudName="malachcloud" publicId={user.profile} width="70" height="40" crop="scale" /> </Avatar>}
            action={ <IconButton style={{marginRight:'10px'}} onClick={() => setFollow(user.id)}> <h6 className="user-suggested-follow">Follow</h6> </IconButton> }
            title={<Link to={`/profile/${user.id}`}><span className={classes.likes}>{user.username}</span></Link>}
            subheader="New to Instagram"
            style={{width:'110%'}}
          />
           </div>
       ))}
       </Grid>
       </Hidden>

      {/* Fab */}
      <Fab id="stepTwo" color="primary"  className={classes.fab} onClick={() => openModal()} title="Add new post"> 
        <AddIcon />
      </Fab>
      {/* Share Modal */}
   
    
       {/* Modal */}
       <Modal size="lg" centered show={emailModal} onHide={closeModal} style={{margin:'70px auto 30px' , maxHeight:'90%', overflowY:'auto'}}>
                 <Modal.Header className={classes.modalHeader}> <Modal.Title style={{fontWeight:'700'}}> Add new post </Modal.Title> </Modal.Header>
                 <Modal.Body>
                 <Formik 
                   initialValues={{photo:'',content:''}}
                   validationSchema={validationSchema}
                   onSubmit={ editImage }>
                    {({ errors, touched, setFieldValue }) => (
                      <Form style={{textAlign:'center'}}>
                      <Input id="file" className="inputfile" type="file" name="photo" onChange={(e) => handleChangeImage(e,setFieldValue )} hidden/> 
                    <Button className={classes.profileBtn} color='primary'  variant="outlined"><ImageIcon className={classes.imageIcon}/><label htmlFor="file">{fileName ? `${fileName} UPLOADED` : 'UPLPOAD IMAGE'} </label></Button>
                      {errors.photo && touched.photo ?  <div className="error">{errors.photo}</div>  : null}
                      {previewSource ? 
                        <Card className={classes.previewcard}>
                          <CardHeader avatar={ <Avatar><Image cloudName="malachcloud" publicId={user.profile} width="80" crop="scale" /> </Avatar>} action={ <IconButton> <MoreVertIcon /> </IconButton> } title={<span className={classes.likes}>{user.username}</span>}/>
                          <CardMedia className={classes.previewmedia} image={previewSource}></CardMedia>
                          <CardActions disableSpacing>
                            <IconButton className={classes.iconButton}> <FavoriteIcon style={{fill: "red"}}/> </IconButton>
                            <IconButton> <ChatBubbleOutlineIcon/> </IconButton>
                            <IconButton > <ShareIcon/> </IconButton>
                          </CardActions>
                       </Card>
                      : null}
                        <TextField  multiline rows={4} variant="outlined" margin="normal" fullWidth label="add description" name="content" onChange={(event) => setFieldValue("content", event.target.value)}/>
                        {errors.content && touched.content ?  <div className="error">{errors.content}</div>  : null}
                          {/* Alert error */}
                        <Collapse in={openAlert}>
                            <Alert 
                            style={{margin:'10px'}}
                            severity={isBedAlert ? "error": "success"}
                            action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                            {message}
                            </Alert>
                          </Collapse>
                        <Button  variant="outlined" color="primary" type="Submit">Submit</Button>
                      </Form>
                    )}
                  </Formik>
                 </Modal.Body>
            </Modal>
      </Grid>
       </StylesProvider>
   
    </>
  )
}

export default Home
