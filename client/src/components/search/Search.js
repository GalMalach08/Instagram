import React, { useState, useEffect } from 'react'
import Poper from './poper/Poper'
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Popper from '@material-ui/core/Popper';

const useStyles = makeStyles((theme) => ({
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
   
    
  }))

function Search() {
  
    const [searchValue, setSearchValue] = useState('')
    const [users, setUsers] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)
    const classes = useStyles()
    const open = Boolean(anchorEl)

    const handleChange = (e) => {
        setSearchValue(e.target.value)
        if(users.users === undefined) {
            console.log('not');
            setAnchorEl(null)
        } else if(users.users.length === 0) {
            setAnchorEl(null)
        } else {
            setAnchorEl(e.currentTarget)
        }
    }

    const findUsers = async () => {
        const res = await fetch(`/user/users/${searchValue}`)
        const data = await res.json()
        setUsers(data)
    }
 
    useEffect(() => {
       findUsers()
    }, [searchValue])

    return (
        <>
           <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onChange={e => handleChange(e)}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            
            />
              <Poper users={users} open={open} anchorEl={anchorEl} setUsers={setUsers}/>
          </div>
        </>
    )
}

export default Search
