import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Popper, Divider } from '@material-ui/core';
// Cloudinary
import {Image} from 'cloudinary-react';
import './style.css'
const useStyles = makeStyles((theme) => ({
  paper: {
    margin:'16px',
    border: '1px solid lightgrey',
    padding: theme.spacing(1),
    backgroundColor: 'white',
  },
  divider: {
    background:'black'
  }
}));

export default function SimplePopper({ users, anchorEl, open, setUsers }) {
  const classes = useStyles();
  return (
    <div>
    {users.users ? 
    users.users.length !== 0 ? 
        <Popper  open={open} anchorEl={anchorEl} style={{width:'300px'}}>
        <div className={classes.paper}>{users.users && users.users.map(user => (
           <Link to={`/profile/${user.id}`} style={{textDecoration:'none'}} onClick={() => setUsers([])}>
            <div className="userDiv">
                <div > <Image className="userimage" cloudName="malachcloud" publicId={user.profile} width="60" height="60" crop="scale" />  </div>
                <div className="username">{user.username}</div>
            </div>
         </Link>
        
        ))}
   
        </div>
      </Popper>
    :null : null}
     
    </div>
  );
}