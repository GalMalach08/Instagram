import React, { useState, useEffect } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom'; // imrr
import AuthGaurd from './hoc/Auth'
import Home from './components/home/Home'
import Header from './components/header/Header'
import LogOut from './components/logout/LogOut'
import SignIn from './components/SignIn/SignIn'
import SignUp from './components/signup/SignUp'
import Profile from './components/profile/Profile'
import Chat from './components/chat/Chat'

// import Footer from './components/Footer'
let socket;

const Router = () => {
    const [isAuth, setIsAuth] = useState(false)



    return (
        <> 
        <BrowserRouter>
        {isAuth && <Header/>}
            <Switch>
            <Route path='/chat/:id' component={Chat}/>
                {/* <Route path='/chat/:id' component={AuthGaurd(Chat, setIsAuth)}/> */}
                <Route path='/profile/:id' component={AuthGaurd(Profile, setIsAuth)}/>
                <Route path='/logout' render={() => <LogOut setIsAuth={setIsAuth} /> } />  
                <Route path='/signin' render={() => <SignIn  setIsAuth={setIsAuth}/> } />
                <Route path='/signup' render={() => <SignUp  setIsAuth={setIsAuth}/> } />
                {/* <Route path='/apartment/:id' component={AuthGaurd(Apartment)} /> */}
                {/* <Route path='/' component={Home}/> */}
                <Route path='/' component={AuthGaurd(Home, setIsAuth)}/>
            </Switch>
        </BrowserRouter>
    </>   
  )
}

export default Router;