import React, { useState, useEffect } from 'react'
import { Avatar, Divider, IconButton  } from '@material-ui/core'
import Modal from 'react-bootstrap/Modal'
import { Container, Row, Col, Button} from 'react-bootstrap'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
// Cloudinary
import {Image} from 'cloudinary-react';
import './style.css'

const ProfileImageModal = ({ imageModal, setImageModal, modalImage}) => {

console.log(modalImage);
// useEffect(() => {
//     setModalImage
// })

    return (
        <>
  {modalImage &&
  <Modal
        show={imageModal}
        onHide={() => setImageModal(false)}
        dialogClassName="modal-90w"
        className="modal"
        aria-labelledby="example-custom-modal-styling-title"
      >
   
      <Modal.Body className="show-grid">
        {/* <Container> */}
          <Row>
            <Col xs={12} md={8}>
              <div className="modal_image_div"><img className="modal_image" alt="modal" src={modalImage.photo}/></div>
            </Col>
            <Col xs={4}>
                <div className="modal_post_details">
                    <div className="modal_post_user">
                        <Avatar style={{height:'42px', width:'42px'}}>  <Image cloudName="malachcloud" publicId={modalImage.owner_photo} width="42" height="42" crop="scale" />  </Avatar>
                        <h6 className="modal_post_user_header">{modalImage.owner_username} <span className="comment-date">{modalImage.date}</span></h6>
                        
                    </div>
                    <Divider />
                    <div className="modal_post_user">
                    <Avatar style={{height:'42px', width:'42px'}}>  <Image cloudName="malachcloud" publicId={modalImage.owner_photo} width="42" height="42" crop="scale" />  </Avatar>
                    <h6 className="modal_post_user_header">{modalImage.owner_username}</h6>
                    <p className="modal_post_content">{modalImage.content}</p>
                    </div>
                    {modalImage.comments.length !== 0 && modalImage.comments.map(comment => (
                        <div className="modal_post_user">
                        <Avatar style={{height:'42px', width:'42px'}}>  <Image cloudName="malachcloud" publicId={comment.User.profile} width="42" height="42" crop="scale" />  </Avatar>
                        <h6 className="modal_post_user_header">{comment.User.username} <span className="comment-date">{comment.time}</span></h6>
                        <p className="modal_post_content">{comment.content}</p>
                    </div>
                    )) }
                    <Divider />
                    <div>
                    <IconButton > <FavoriteIcon  />  </IconButton>
                    <IconButton> <ChatBubbleOutlineIcon/> </IconButton>
                    <IconButton > <ShareIcon/> </IconButton>
                    </div>
                    <p className="like_p">Liked by {modalImage.likes} pepole</p>
                    

                </div>
              
            </Col>
          </Row>

        {/* </Container> */}
      </Modal.Body>
      
    </Modal>
  }
        </>
    )
}

export default ProfileImageModal
