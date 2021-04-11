import React, { useState, useEffect } from 'react';
// Formik
import { Formik, Form} from 'formik';
import * as Yup from 'yup';
// Cloudinary
import {Image} from 'cloudinary-react';

// material ui icons
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ImageIcon from '@material-ui/icons/Image';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
// Bootstrap
import Modal from 'react-bootstrap/Modal'
import { makeStyles } from '@material-ui/core/styles';
import { Input, IconButton, Card, CardActions, CardHeader, CardMedia, Collapse, Avatar,TextField, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
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
    modalHeader: {
     display: 'flex',
     justifyContent: 'center',
     fontWeight:'bold',
    },
    imageIcon: {
        marginBottom:'8px',
        marginRight:'5px'
      },
   
  }))
  

const StoryModal = ({storyModal, setStoryModal}) => {
    const classes = useStyles()
    const [fileName, setFileName] = useState('')
    const [previewSource, setPreviewSource] = useState('')
    const [isProfile, setIsProfile] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [isBedAlert, setIsBedAlert] = useState(false)
    const [message, setMessage] = useState('')
    const user = JSON.parse(localStorage.getItem('user'))

    const closeModal = () => setStoryModal(false)
     // formik validation
    const validationSchema = Yup.object().shape({
        photo:Yup.string()
        .required('photo is required')
    })

    // Edit the profile image
    const editImage =  (values) => {
        values.fileName = fileName
        if(typeof values.photo === 'object' ) {
        const reader = new FileReader()
        reader.readAsDataURL(values.photo)
        reader.onloadend = () => {
        setPreviewSource(reader.result)
        values.photo = reader.result
        addNewStory(values)
        }
        } else {
            addNewStory(values)
        }
    }

      // Add new Post
  const addNewStory = async (values) => {
    const newStory = {
      photo: values.photo,
      UserId : JSON.parse(localStorage.getItem('user')).id,
      fileName: values.fileName,
    }
      try {
        const response = await fetch('/story', { 
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(newStory)
      })

      const data = await response.json()
      if(data.story){
        setIsBedAlert(false)
        setMessage('Story Added')
        setOpenAlert(true)
        setTimeout(() =>  {
            closeModal()
            setOpenAlert(false)
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

    return (
        <>
               <Modal size="lg" centered show={storyModal} onHide={closeModal}>
                 <Modal.Header className={classes.modalHeader}> <Modal.Title style={{fontWeight:'700'}}> Add new story </Modal.Title> </Modal.Header>
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
                        <Collapse in={openAlert}>
                            <Alert 
                            style={{margin:'10px'}}
                            severity={isBedAlert ? "error": "success"}
                            action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                            {message}
                            </Alert>
                          </Collapse>
                        <Button style={{margin:'10px'}} variant="outlined" color="primary" type="Submit">Submit</Button>
                      </Form>
                    )}
                  </Formik>
                 </Modal.Body>
            </Modal>
        </>
    )
}

export default StoryModal
