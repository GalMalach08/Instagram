import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from '@material-ui/core'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';

const NewUserModal = ({ stepsEnabled ,setStepsEnabled })  =>  {
    const user = JSON.parse(localStorage.getItem('user'))
    const [show, setShow] = useState(true)

    // Close the modal
    const handleClose = () => setShow(false)
 
    // Start the introduction
    const hanleIntro = () => {
        handleClose() 
        toggleSteps()
      
    }
    
     const toggleSteps = () => {
        setStepsEnabled(true)
      }

    return (
      <>
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} style={{textAlign:'center'}}>
          <Modal.Header closeButton>
    
            <Modal.Title style={{margin:'auto',fontWeight:'600'}}>Hello {user.username} </Modal.Title>
     
          </Modal.Header>
          <Modal.Body  className="world" >
            Welcome to instagram! the most popular social media in the world with more than 100 million users!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color="primary" onClick={() => hanleIntro() } style={{margin:'auto'}}>
              Let's get started! <DoneOutlineIcon style={{margin:'10px 10px 12'}}/>
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
export default NewUserModal;