import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Header from './components/nav/Header';
import RegisterComplete from './pages/auth/RegisterComplete';

import { auth } from './firebase';
import { useDispatch } from 'react-redux';


export default function App() {

  const dispatch = useDispatch();

  // to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged( async (user) => {
      console.log(user);
      if(user){
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type:'LOGGED_IN_USER',
          payload: {
            email:user.email,
            token:idTokenResult.token,
          }
        })
      }
    });
    // clean up
    return ()=> unsubscribe()
  },[]);


  return (
    <>
      <Header/>
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/register/complete" component={RegisterComplete}/>
      </Switch> 
    </>
  )
}
