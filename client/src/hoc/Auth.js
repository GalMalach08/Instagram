import React, { useState, useEffect } from 'react' // imrse
import { useHistory } from "react-router-dom"
        
export default function authgaurd(ComposedComponent, setIsAuthenticate) {
    const AuthenticationCheck = (props) => {
        const history = useHistory()
        const [isAuth, setIsAuth] = useState(false)

        const isUserAuthenticate = async () => {
          const response = await fetch('/auth/isauth')
          const { success } = await response.json()
          if (success) {
            setIsAuthenticate(true)
            console.log('auth');
            setIsAuth(true) 
          }
          else {
            setIsAuthenticate(false)
            setIsAuth(false)
            console.log('not auth');
            history.push('/signin')
          } 
        }     

        useEffect(() => {
           isUserAuthenticate()
        }, [])
        
          return(
            <>
            { isAuth ?
             <ComposedComponent {...props} /> 
            : null}
            </>
            )
        }
    return AuthenticationCheck
}
    
        