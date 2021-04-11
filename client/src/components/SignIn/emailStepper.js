import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Stepper, Step, StepLabel} from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
      margin:'auto',
      padding:'10px'
    },
    large: {
        width: theme.spacing(12),
        height: theme.spacing(12),
        margin:'auto'
      },
  }))

const EmailStepper = ({setEmailModal}) => {
const classes = useStyles();
const [activeStep, setActiveStep] = useState(0)
const [user, setUser] = useState()
const steps = ['Enter your Email', 'Verify account', 'Are You Sure ?','Done'];


const errorHelper = (formik,values) => ({
    error: formik.errors[values] && formik.touched[values] ? true : false,
    helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values]:null
})

const handleNext = () => {
    setActiveStep((prev) => prev + 1)
}

const handleBack = () => {
    setActiveStep((prev) => prev - 1)
}
const nextBtn = () => {
   
        
    
    return(
    <Button className="m-3" variant="contained" color="primary" onClick={() => {
        handleNext()
        if (activeStep === 0) {
            bringUser()}
    }}>
        next
    </Button>
    )
}
const prevBtn = () => (
    <Button className="m-3" variant="contained"  onClick={handleBack}>
        back
    </Button>
)

const bringUser = async () => {
    const response = await fetch(`/useremail/${JSON.stringify(formik.values.email)}`)
    const data = await response.json()
    if(data.success) setUser(data.user)
}

const sendEmail = async (values) => {
    const response = await fetch(`/email/${JSON.stringify(values.email)}`)
    const data = await response.json()
    if(data.success) console.log('email sent');
    else console.log('email does not sent')
}

const formik = useFormik({
    enableReinitialize:true,
    initialValues:{ email:''},
    validationSchema:Yup.object({
        email:Yup.string()
        .required('This is required field')
        .email('This is not a valid email'),
    }),
    onSubmit: (values,{resetForm}) => {
       
        sendEmail(values)
    }
})




    return (
        <>
            <Stepper activeStep={activeStep}>
            {steps.map(step => (
                <Step key={step}> <StepLabel>{step}</StepLabel></Step>
            ))}

            </Stepper>

            <form className="mt-3 stepper_form text-center" onSubmit={formik.handleSumbit}>
                { activeStep === 0 ?
                    <div className="form-group">
                    <TextField style={{width:'100%'}} name="email" label="Enter your email" variant="outlined" {...formik.getFieldProps('email')} {...errorHelper(formik,'email')}/>
                    {formik.values.email && !formik.errors.email ? 
                     nextBtn() 
                    :null}
                    </div>
                :null}

                { activeStep === 1 && user ?
                    <div style={{textAlign:'center'}}>
                   <Card className={classes.root}>
                    <CardActionArea>
                       <Avatar alt="Remy Sharp" src={user.image} className={classes.large}/>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {user.firstname} {user.lastname}
                            </Typography>
                            <Typography  color="textSecondary" component="p"> Is that you ? </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions style={{marginLeft:'110px'}}>
                    <Button className="m-3" variant="contained" size="large" color="primary" onClick={() => setActiveStep((prev) => prev + 1)}> Yes </Button>
                </CardActions>
                </Card>
                     {prevBtn()}

                    </div>
                :null}

                { activeStep === 2 ?
                    <div className="form-group">
                       <Button className="m-3" variant="contained" color="primary" onClick={() => {
                           formik.submitForm()
                           handleNext()
                       }}> Send me new password</Button> 
                       {prevBtn()}
                    </div>
                :null}

                { activeStep === 3 ?
                    <div className="form-group">
                    <h5>Email sent to {formik.values.email}</h5>
                       <Button className="m-3" variant="contained" color="primary" onClick={() => setEmailModal(false)}> Close </Button> 
                    </div>
                :null}
            </form>
        </>
    )
}
export default EmailStepper;