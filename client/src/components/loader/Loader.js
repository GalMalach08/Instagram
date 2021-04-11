import React from 'react'
import InstagramIcon from '@material-ui/icons/Instagram';
import './style.css'
const Loader = () => {
    return (
        <div>
            <div className="overlay"></div>
            <div className="loaders"> <InstagramIcon fontSize="large" style={{fill:"grey"}}/> </div>
        </div>
    )
}

export default Loader
