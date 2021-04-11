import React,{ useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import InstaPhoto from '../../images/insta.png'
import Slider1 from '../../images/slider1.jpg'
import Slider2 from '../../images/slider2.jpg'
import Slider3 from '../../images/slider3.jpg'
import Grid from '@material-ui/core/Grid';
import ReCaptcha from 'react-google-recaptcha'
import { Formik, Form} from 'formik';
import {Input } from '@material-ui/core'
import * as Yup from 'yup';
import {TextField, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Carousel from 'react-bootstrap/Carousel'
import ImageIcon from '@material-ui/icons/Image';
import { Hidden } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import './style.css'

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  

  const useStyles = makeStyles((theme) => ({
    root: {
      marginTop:'20px'
    },
    image: {
      position:'relative',
      backgroundImage: `url(${InstaPhoto})`,
      backgroundRepeat: 'no-repeat',
      alignSelf: 'center',
      backgroundPosition: '0 0',
      backgroundSize: '454px 618px',
      flexBasis: '454px',
      height: '618px',
    
    },
    slider: {
      width:'54%',
      margin: '99px 0 0 151px',
      position: 'relative',
      left:'-3px',
      bottom: '3px'
    },
    formGrid: {
      marginTop:'70px',
      margin:'auto'
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
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
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }))


const SignUp = ({ setIsAuth }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const reRef = useRef()
    const [isProfile, setIsProfile] = useState(false)
    const [message, setMessage] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [fileName, setFileName] = useState('')
    const history = useHistory()
  
    // Form validation
    const validationSchema = Yup.object().shape({
            username:Yup.string()
            .required('user name is required!'),
             password:Yup.string()
            .required('password is required!')
            .min(6, 'password have to be at least 6 characters long'),
            confirmPassword:Yup.string()
            .required('confirm your password!')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            photo:Yup.string()
            .required('profile image is required')
    })

    const errorHelper = (formik,values) => ({
      error: formik.errors[values] && formik.touched[values] ? true : false,
      helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
  })

    // Handle password visiblity 
    const  handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    }
    const handleClickConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword)
    }

    const handleChangeImage = (e, setFieldValue) => {
      setFieldValue("photo", e.target.files[0])
      if(e.target.files.length === 0) {
        setIsProfile(false)
        setFileName('')
      } 
      else {
        setIsProfile(true)
        setFileName(e.target.files[0].name)
      }
    }
    
  
    // Edit the profile image
    const editProfile =  (values) => {
     values.fileName = fileName
     if(typeof values.photo === 'object' ) {
      const reader = new FileReader()
      reader.readAsDataURL(values.photo)
      reader.onloadend = () => {
        values.photo = reader.result
        signUpUser(values)
      }
     } else {
      signUpUser(values)
     }
    }
        
      // Add new user
     const signUpUser = async (values) => {
      try {
            const token = await reRef.current.getValue()
            const response = await fetch('/auth/signup', { 
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({...values, token})
          })
          const data = await response.json()
          reRef.current.reset()
          if(data.user){
            localStorage.setItem('user', JSON.stringify(data.user))
            dispatch(({ type:'AUTH_USER', payload:data.user }))
            setIsAuth(true)
            history.push('/')
          } else {
         
            setMessage(data.error)
            setOpenAlert(true)
          }

        } catch (error) {
            console.error(error)
          }
    }
  
    return (
      <Grid container className={classes.root}>

      {/* Instagram image */}
        <Hidden mdDown>
            <Grid item xs={1} md={2}></Grid>
            <Grid item xs={2} lg={4} className={classes.image} >
              <Carousel fade className={classes.slider} interval={2000}>
                <Carousel.Item>
                  <img className="d-block w-100" src={Slider1} alt="First slide" />
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={Slider2} alt=" Second slide"/>
                </Carousel.Item>
                <Carousel.Item>
                <img className="d-block w-100" src={Slider3} alt="Third slide"/>
                </Carousel.Item>
              </Carousel>
            </Grid>
      </Hidden>
      
      {/* Sign up form */}
      <Grid item xs={12} md={4}  component={Paper} elevation={6} square className={classes.formGrid}>
          <div className={classes.paper}>
            <img src="https://i.imgur.com/zqpwkLQ.png" alt="logo" />



            <Formik
                    initialValues={{username:'',password:'', photo:''}}
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
                           
                           <TextField InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickConfirmPassword}> {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                                        </InputAdornment>
                                        )}}  
                                    type={showConfirmPassword ? "text": "password"} variant="outlined" margin="normal" fullWidth name="confirmPassword" label="Confirm Password" {...props.getFieldProps('confirmPassword')} {...errorHelper(props,'confirmPassword')} />
                         
                                <Input id="file"  className="inputfile" type="file" name="photo" onChange={(e) => handleChangeImage(e,props.setFieldValue )} hidden/> 
                                <Button style={{display:'flex', alignItems:'center', margin:'5px 0px'}} color='primary'  variant="outlined">
                                <div style={{marginRight:'7px'}}><ImageIcon/></div>
                                <label htmlFor="file">{fileName ? `${fileName} UPLOADED` : 'PROFILE IMAGE'} </label></Button>
                                {props.errors.photo && props.touched.photo ?  <div className="error">{props.errors.photo}</div>  : null}
                                <ReCaptcha style={{margin:'10px 0px'}} sitekey="6LfruZ4aAAAAAAFNEQG6lPJLbJVjEThKg2DJdjEi" ref={reRef}/> 
                                  {/* Alert error */}
                                    <Collapse in={openAlert}>
                                        <Alert
                                        severity="error"
                                        action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                                        {message}
                                        </Alert>
                                        </Collapse>
                                <Button className="my-3" variant="contained" color="primary" type="submit" size="large" fullWidth> Sign up </Button>
                                <Grid container>
                                  <Grid item>
                                    <Link href="/signin" variant="body2"> Already have an account? Sign In </Link>
                                  </Grid>
                                </Grid>
                                <Box mt={5}>
                                  <Copyright />
                                </Box>
                         </form> )}
                    </Formik>  
                </div>
              </Grid> 
              <Grid item xs={2}></Grid>
       
            </Grid>
          
    )
}
export default SignUp














