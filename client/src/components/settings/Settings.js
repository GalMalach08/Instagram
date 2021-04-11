import React,{ useState, useEffect} from 'react'
import './styles.css'
import TwitterIcon from '@material-ui/icons/Twitter';
import Grid from '@material-ui/core/Grid';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {TextField, Button, FormControl} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
        display:'flex', 
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width: 500,
    },
  }))

const Settings = ({setIsAuth}) => {
    const [initialValues, setinitialValues] = useState({firstname:'',lastname:'',password:'',image:'',email:''})
    const classes = useStyles();
    const [message, setMessage] = useState('Update your profile')


    const validationSchema = Yup.object({
        firstname:Yup.string()
        .required('first name is required'),
        lastname:Yup.string()
        .required('last name is required'),
        image:Yup.string()
       .required('profile image is required'),
        username:Yup.string()
        .required('email is required')
    })

    const errorHelper = (formik,values) => ({
        error: formik.errors[values] && formik.touched[values] ? true : false,
        helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
    })

    const updateUser = async (values) => {
        const id = JSON.parse(localStorage.getItem('user')).id
        const response = await fetch('/user', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({newuser:values,id})
                    }) 
                    const data = await response.json()
                    if (data.success) {
                        setMessage(data.message)
                        getInitialValues()
                       setTimeout(() => setMessage('Update your profile'),1000)
                    } else {
                        setMessage('Error!')
                    }

                }

        
        
        const getInitialValues = async () => {
            const id = JSON.parse(localStorage.getItem('user')).id
            const res = await fetch(`/user/${JSON.stringify(id)}`)
            const data = await res.json()
            delete data.user['password']
            console.log(data.user);
            setinitialValues(data.user) 
        }
        useEffect(() => {
            getInitialValues()
        }, [])
      

    return (
    <Grid container spacing={3} className="main">
        <Grid item xs={4} >
            <TwitterIcon style={{position:'absolute', top:'120px', left:'150px'}}/>
            <TwitterIcon style={{position:'absolute', top:'250px', left:'250px'}}/>
            <TwitterIcon style={{position:'absolute', top:'350px', left:'400px'}}/>
        </Grid>
        
        <Grid item xs={4}>
            <div className="auth-div" style={{dispaly: 'auto',flexWrap:'wrap', justifyContent:'center'}}>
                <div> 
                    <h1 className="register-title">{message}</h1>
                </div>
            <Formik
            initialValues={initialValues}
            onSubmit={(values,{resetForm}) => updateUser(values)}
            validationSchema={validationSchema}
            enableReinitialize={true} 
            >
            {(props) => (
                <form className={classes.root} onSubmit={props.handleSubmit} autoComplete="off">
       
                <FormControl variant="outlined" className="mb-3">
                    <TextField name="firstname" label="First name" variant="outlined" {...props.getFieldProps('firstname')} {...errorHelper(props,'firstname')}/>   
                </FormControl>

                <FormControl variant="outlined" className="mb-3">
                    <TextField  name="lastname" label="Last name" variant="outlined" {...props.getFieldProps('lastname')} {...errorHelper(props,'lastname')}/>   
                </FormControl>

                <FormControl variant="outlined" className="mb-3">
                    <TextField name="password" label="Profile image" variant="outlined" {...props.getFieldProps('image')} {...errorHelper(props,'image')}/>   
                </FormControl>
               
                <FormControl variant="outlined" className="mb-3">
                    <TextField name="username" label="Email" variant="outlined" {...props.getFieldProps('username')} {...errorHelper(props,'username')}/>   
                </FormControl>

                <Button className="my-3" variant="contained" color="primary" type="submit" size="large"> Update user <TwitterIcon style={{margin:'5px'}}/> </Button>
              
            </form>
            )}
            </Formik>  
        </div>
     </Grid>
     <Grid item xs={4}>
            <TwitterIcon style={{position:'absolute', top:'120px', right:'150px'}}/>
            <TwitterIcon style={{position:'absolute', top:'250px', right:'250px'}}/>
            <TwitterIcon style={{position:'absolute', top:'350px', right:'400px'}}/>
        </Grid>
   </Grid>
    )
}
export default Settings
