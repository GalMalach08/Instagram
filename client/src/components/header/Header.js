import React from 'react'
import { Link } from 'react-router-dom'
// Components
import Search from '../search/Search'
// material ui
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Grid, Avatar, Typography, Badge } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import NearMeIcon from '@material-ui/icons/NearMe';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// Cloudinary
import {Image} from 'cloudinary-react';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    marginBottom:'60px'
  },
  appbar: {
      backgroundColor:'white',
      color:'black'
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('xs')]: {
      display: 'flex'
    },
    marginRight:'35%'
  },
  search: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "whitesmoke",
    '&:hover': {
      backgroundColor: 'lightgrey',
    },
    marginRight: theme.spacing(2),
    marginLeft: '0',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  
}))

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const classes = useStyles()

  return (
    <Grid container>
    <div className={classes.grow}>

      <AppBar className={classes.appbar} position="fixed">
      <div className="container">
        <Toolbar style={{background:'white'}}>
          <Link to="/" style={{ textDecoration: 'none', marginRight:'30%'  }}>
            <Typography className={classes.title} variant="h6" noWrap>
            <img style={{height:'29px', width:'143px'}} src="https://i.imgur.com/zqpwkLQ.png" alt="logo" />
            </Typography>
            </Link>
            <Search/>
          
          <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Link to="/" style={{ textDecoration: 'none', color:'black', marginTop:'7px' }}>
              <IconButton color="inherit">
              <HomeIcon fontSize="medium"/>
              </IconButton>
              </Link>
              <Link to={`/chat/0`} style={{ textDecoration: 'none', color:'black', marginTop:'7px' }}>
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <NearMeIcon fontSize="medium" />
                  </Badge>
                </IconButton>
              </Link>
                <IconButton  color="inherit">
                  <Badge badgeContent={17} color="secondary">
                    <NotificationsIcon fontSize="medium"/>
                  </Badge>
                </IconButton>
                <Link to={`/profile/${user.id}`}>
                <IconButton color="inherit">
                <Avatar> <Image cloudName="malachcloud" publicId={user.profile} width="40" height="40" crop="scale" />  </Avatar>
                </IconButton>
                </Link>
                <Link to="/logout" style={{ textDecoration: 'none', color:'black', marginTop:'7px' }}>
                <IconButton color="inherit">
                    <ExitToAppIcon fontSize="medium"/>
                </IconButton>
                </Link>
             </div>
        </Toolbar>
      </div>
     </AppBar>
    </div>
  </Grid>
  )
}
export default Header