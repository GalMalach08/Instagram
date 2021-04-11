import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel';
import { FacebookShareButton, FacebookIcon, FacebookMessengerShareButton, FacebookMessengerIcon, 
        EmailIcon, TwitterIcon, TwitterShareButton, TelegramShareButton, TelegramIcon,
        WhatsappShareButton, WhatsappIcon, EmailShareButton } from 'react-share' 
import './style.css'

const NewUserModal = ({ shareModalOpen ,setShareModalOpen })  =>  {
  
    // Close the modal
    const handleClose = () => setShareModalOpen(false)
   
    return (
      <>
        <Modal show={shareModalOpen} onHide={handleClose} backdrop="static" keyboard={false} style={{textAlign:'center',width:'30%'}}>
          <Modal.Header closeButton>
            <Modal.Title style={{fontWeight:'600'}}>Share Post </Modal.Title>
          </Modal.Header>
          <Modal.Body className="world">

          <FacebookShareButton className="icon" url='https://www.instagram.com/' quote="Come and visit insragram!">
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <FacebookMessengerShareButton className="icon" url='https://www.instagram.com/' appId="521270401588372">
            <FacebookMessengerIcon size={32} round />
          </FacebookMessengerShareButton>

          <TwitterShareButton className="icon" url='https://www.instagram.com/' title="come alone man">
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <TelegramShareButton className="icon" url='https://www.instagram.com/' title='he man'>
            <TelegramIcon size={32} round />
          </TelegramShareButton>

          <WhatsappShareButton className="icon" url='https://www.instagram.com/' title='come and visit instagram!' separator=":">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <EmailShareButton  className="icon" url='https://www.instagram.com/' subject='come and visit instagram' body="body" >
            <EmailIcon size={32} round />
          </EmailShareButton>

        </Modal.Body>
          <Modal.Footer>
            <Button variant="outlined" color="secondary" onClick={() => handleClose() } style={{margin:'auto'}}>
             Close <CancelIcon style={{margin:'10px 10px 12'}}/>
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
export default NewUserModal;