import React, { useState, useEffect } from 'react'
// material ui
import { Input, IconButton, Collapse, TextField, Button, InputAdornment  } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Alert from '@material-ui/lab/Alert';
// bootstrap 
import Modal from 'react-bootstrap/Modal'
// Formik
import { Formik } from 'formik';
import * as Yup from 'yup';

const EditProfile = ({ modal, setModal}) => {
   const { id } = JSON.parse(localStorage.getItem('user'))
    const closeModal = () => setModal(false)
    const [message, setMessage] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [fileName, setFileName] = useState('')
    const [previewSource, setPreviewSource] = useState('')
    const [isProfile, setIsProfile] = useState(false)
    const [userProfile, setUserProfile] = useState({username:'', password:'', description:''})
    const [showPassword, setShowPassword] = useState(false)
   
    // Formik
    const validationSchema = Yup.object().shape({
        username:Yup.string()
        .required('username is required'),
        password:Yup.string()
        .required('password is required'),
        description:Yup.string()
        .min(6, 'That it? write some more(min 6 characters)'),
      })

      const errorHelper = (formik,values) => ({
        error: formik.errors[values] && formik.touched[values] ? true : false,
        helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
    })

    // Get user's information
      const getUser = async () => {
        const res = await fetch(`/user/${id}`)
        const data = await res.json()
        const { username, password, profileFileName, profileDescription } = data.user
        setUserProfile({ username, password, description: profileDescription, photo:'' })
        setFileName(profileFileName)
        
      }

      // turn the image file to url
      const editProfile =  (values,resetForm) => {
        values.fileName = fileName
        if(typeof values.photo === 'object' ) {
         const reader = new FileReader()
         reader.readAsDataURL(values.photo)
         reader.onloadend = () => {
           values.photo = reader.result
           updateSettings(values,resetForm)
         }
        } else {
            updateSettings(values,resetForm)
        }
       }

       // update the user profile
      const updateSettings = async (values,resetForm) => {
        const response = await fetch('/user', { 
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({...values, id, fileName })
    })
        const data = await response.json()
        if(data.user) {
            localStorage.setItem('user', JSON.stringify(data.user))
            resetForm()
            setModal(false)
        } else {
            setMessage(data.error)
            setOpenAlert(true)
        }
      }

      // Handle password visiblity 
      const  handleClickShowPassword = () => {
        setShowPassword(!showPassword)
      }

      // Handle image change  
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

        useEffect(() => {
          getUser()
        }, [])

  
    return (
        <div>
            <Modal size="lg" centered show={modal} onHide={closeModal}>
                 <Modal.Header className=""> <Modal.Title style={{fontWeight:'700',margin:'auto'}}> Edit your profile </Modal.Title> </Modal.Header>
                 <Modal.Body>

                 <Formik
                    initialValues={userProfile}
                    onSubmit={(values,{resetForm}) => editProfile(values, resetForm)}
                    validationSchema={validationSchema}
                    enableReinitialize={true}>
                    {(props) => (
                        <form style={{textAlign:'center'}} onSubmit={props.handleSubmit} autoComplete="off">
                                <TextField name="username" label="User name" variant="outlined" fullWidth {...props.getFieldProps('username')} {...errorHelper(props,'username')}/>   
                                
                                <TextField InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword}> {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                                        </InputAdornment>
                                        )}}  
                                    type={showPassword ? "text": "password"} variant="outlined" margin="normal" fullWidth name="password" label="Password" {...props.getFieldProps('password')} {...errorHelper(props,'password')} />   
                           
                                <TextField  multiline rows={4} variant="outlined" margin="normal" fullWidth label="add profile description" name="description" {...props.getFieldProps('description')} {...errorHelper(props,'description')}/>
                         
                                <Input id="file"  className="inputfile" type="file" name="photo" onChange={(e) => handleChangeImage(e,props.setFieldValue )} hidden/> 
                                <Button style={{display:'block', margin:'5px 0px'}} color='primary'  variant="outlined"><ImageIcon className=""/><label htmlFor="file">{fileName ? `${fileName} UPLOADED` : 'IMAGE PROFILE'} </label></Button>
                                {props.errors.photo && props.touched.photo ?  <div className="error">{props.errors.photo}</div>  : null}

                                  {/* Alert error */}
                                    <Collapse in={openAlert}>
                                        <Alert
                                        severity="error"
                                        action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                                        {message}
                                        </Alert>
                                        </Collapse>
                                <Button className="my-3" variant="contained" color="primary" type="submit" size="large"> Update user </Button>
                         </form> )}
                    </Formik>  
                 </Modal.Body>
            </Modal>
        </div>
    )
}

export default EditProfile
