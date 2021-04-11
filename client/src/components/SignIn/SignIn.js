import React,{ useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { authUser } from '../../store/actions'
import InstaPhoto from '../../images/insta.png'
import Slider1 from '../../images/slider1.jpg'
import Slider2 from '../../images/slider2.jpg'
import Slider3 from '../../images/slider3.jpg'
import Grid from '@material-ui/core/Grid';
import { Hidden } from '@material-ui/core';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal'
import {TextField, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import EmailStepper from './emailStepper'
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Carousel from 'react-bootstrap/Carousel'
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOff from "@material-ui/icons/VisibilityOff";
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





const SignIn = ({ setIsAuth }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const [emailModal, setEmailModal] = useState(false)
    const [message, setMessage] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const history = useHistory()
  
    const closeModal = () => setEmailModal(false)
    const openModal = () => setEmailModal(true)
    const  handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    }
    const formik = useFormik({
        initialValues:{email:'',password:''},
        validationSchema:Yup.object({
            username:Yup.string()
            .required('sorry username is required'),
            password:Yup.string()
            .required('password is required')
            .min(6, 'password have to be at least 6 characters long')
        }),
        onSubmit:(values,{resetForm}) => {                               
          loginUser(values)
        }
    })
  
    const errorHelper = (formik,values) => ({
        error: formik.errors[values] && formik.touched[values] ? true : false,
        helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
    })

    const loginUser = async (values) =>{
      try {
        const response = await fetch('/auth/login', { method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(values)
        })
        const data = await response.json()
       if(data.success){
          localStorage.setItem('user',JSON.stringify(data.user))
         setIsAuth(true)
        history.push('/')
       } else {
        setMessage(data.error)
        setOpenAlert(true)
       }  
    } catch(error) {
       console.log(error)
    }
  }
    return (
        <Grid container className={classes.root}>
            <Grid item xs={2}></Grid>
            <Hidden mdDown>
              {/* Instagram image */}
              <Grid item md={4} className={classes.image}>
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

            {/* Sign in form */}
            <Grid item xs={12} sm={6} md={4}  component={Paper}  square className={classes.formGrid}>
              <div className={classes.paper}>
              <img src="https://i.imgur.com/zqpwkLQ.png" alt="insta" />
              <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                  <TextField  variant="outlined" margin="normal" fullWidth label="user name" name="email" autoFocus {...formik.getFieldProps('username')} {...errorHelper(formik,'username')}/>
                  <TextField 
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}> {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}  </IconButton>
                      </InputAdornment>
                    )}}  
                  variant="outlined" margin="normal" fullWidth name="password" label="Password" type={showPassword ? "text": "password"} {...formik.getFieldProps('password')} {...errorHelper(formik,'password')}/>
                  {/* Error Alert */}
                    <Collapse in={openAlert}>
                      <Alert
                      severity="error"
                      action={ <IconButton color="inherit" size="small" onClick={() => setOpenAlert(false) }> <CloseIcon fontSize="inherit" /> </IconButton>}>
                      {message}
                      </Alert>
                    </Collapse>

                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} > Sign In </Button>
                    <Grid container>
                      <Grid item xs>
                        <Link href="" variant="body2" onClick={() => openModal()}> Forgot password? </Link>
                      </Grid>
                      <Grid item>
                        <Link href="/signup" variant="body2"> Don't have an account? Sign Up </Link>
                      </Grid>
                    </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>

        <Grid item xs={2}></Grid>
        
        {/* Modal */}
          <Modal size="lg" centered show={emailModal} onHide={closeModal}>
            <Modal.Header> <Modal.Title> Update your Password </Modal.Title> </Modal.Header>
            <Modal.Body>
              <EmailStepper setEmailModal={setEmailModal}/>
            </Modal.Body>
        </Modal>
      </Grid>
    )
}
export default SignIn
























//     <Grid container spacing={3}>
//         <Grid item xs={6}>
//             <img src={TweetImage} alt="tweet" className="tweet-image"/>
//         </Grid>
        
//         <Grid item xs={6}>
//             <div className="auth-div" style={{dispaly: 'auto',flexWrap:'wrap', justifyContent:'center'}}>
//                 <div> 
//                     <h1 className="register-title">{message}</h1>
//                 </div>
//             <Formik
//             initialValues={{firstname:'', lastname:'',username:'',password:'', isregister:false}}
//             onSubmit={(values,{resetForm}) => addUser(values)}
//             validationSchema={validationSchema}
//             >
//             {(props) => (
//                 <form className={classes.root} onSubmit={props.handleSubmit} autoComplete="off">
//                 {register ? 
//                 <>
//                 <FormControl variant="outlined" className="mb-3">
//                     <TextField name="firstname" label="enter your first name" variant="outlined" {...props.getFieldProps('firstname')} {...errorHelper(props,'firstname')}/>   
//                 </FormControl>

//                 <FormControl variant="outlined" className="mb-3">
//                     <TextField  name="lastname" label="enter your last name" variant="outlined" {...props.getFieldProps('lastname')} {...errorHelper(props,'lastname')}/>   
//                 </FormControl>

//                 <FormControl variant="outlined" className="mb-3">
//                     <TextField name="password" label="upload your profile image" variant="outlined" {...props.getFieldProps('image')} {...errorHelper(props,'image')}/>   
//                 </FormControl>
//                 </>
//                 :null}
//                 <FormControl variant="outlined" className="mb-3">
//                     <TextField name="username" label="enter your email" variant="outlined" {...props.getFieldProps('username')} {...errorHelper(props,'username')}/>   
//                 </FormControl>

//                 <FormControl variant="outlined" className="mb-3">
//                     <TextField type="password" name="password" label="enter your password" variant="outlined" {...props.getFieldProps('password')} {...errorHelper(props,'password')}/>   
//                 </FormControl>

                
//                 <Button className="my-3" variant="contained" color="primary" type="submit" size="large"> {register ? 'Register' : 'Login'} <TwitterIcon style={{margin:'5px'}}/> </Button>
//                 <Button onClick={() => handleRegisterState(props.setFieldValue)} variant="outlined" color="default" size="small">Want to {!register ? 'Register' : 'Login'}?</Button>
//                 <Button onClick={() => openModal()} variant="outlined" color="secondary" size="small" className="mt-3">Forgot your password?</Button>
//                 <h6 className="mt-3">Lets do it faster!</h6>
//                 <button type="button" className="btn btn-primary gplus mt-2" onClick={() => registerWithGoogle()}><i className="fa fa-google"></i> Google</button> 
//             </form>
//             )}
//             </Formik>  
//         </div>
//      </Grid>
//      <Modal size="lg" centered show={emailModal} onHide={closeModal}>
//                 <Modal.Header > <Modal.Title> Update your Password </Modal.Title> </Modal.Header>
//                 <Modal.Body>
//                    <EmailStepper setEmailModal={setEmailModal}/>
//                 </Modal.Body>
//             </Modal>
//    </Grid>

      // const handleRegisterState = (setFieldValue) => {
        //     setFieldValue('isregister',!register)
        //     setRegister(!register)
            
        // }

// const validationSchema = Yup.object({
    //     isregister:Yup.boolean(),
    //     firstname:Yup.string()
    //     .when('isregister',{
    //         is: true,
    //         then:Yup.string().required('first name is required')
    //     }),
    //     lastname:Yup.string()
    //     .when('isregister',{
    //         is: true,
    //         then:Yup.string().required('last name is required')
    //     }),
    //     image:Yup.string()
    //     .when('isregister',{
    //         is: true,
    //         then:Yup.string().required('profile image is required')
    //     }),
    //     username:Yup.string()
    //     .required('email is required'),
    //     password:Yup.string()
    //     .required('password is required'),
    // })