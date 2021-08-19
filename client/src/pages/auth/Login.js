import React, { useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';


const createOrUpdateUser = async (authtoken) => {
    return await axios.post( `${process.env.REACT_APP_API}/create-or-update-user`, {} ,
        {
            headers:{
                authtoken: authtoken
            }
        }
    )
}


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();


    const { user } = useSelector( (state) => ({ ...state }));
    useEffect(() => {
        if( user && user.token ) {
            history.push('/');
        }
    },[user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();
            // token send to backend
            createOrUpdateUser(idTokenResult.token)
                .then(res => console.log("CREATE OR UPDATE RES", res))
                .catch();
                
            // Dispatch to redux
            // dispatch({
            //     type:'LOGGED_IN_USER',
            //     payload: {
            //       email:user.email,
            //       token:idTokenResult.token,
            //     }
            // })
            // toast.success('Logged in successfully');
            // history.push('/');
            // back later
        } catch(error){
            console.log(error);
            toast.error(error.message);   
            setLoading(false);
        }
    };
    

    const googleSubmit = async () => {
        try {
            const result = await auth.signInWithPopup(googleAuthProvider);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();
            dispatch({
                type:'LOGGED_IN_USER',
                payload: {
                  email:user.email,
                  token:idTokenResult.token,
                }
            })
            toast.success('Logged in successfully');
            history.push('/');
        } catch(error){
            console.log(error);
            toast.error(error.message);   
        }
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <input
                onChange={(e) => {setEmail(e.target.value)}}
                type="email"
                className="form-control mt-3"
                placeholder="Email"
                value={email}
                autoFocus
            />
            <input
                onChange={(e) => {setPassword(e.target.value)}}
                type="password"
                className="form-control mt-3"
                placeholder="Password"
                value={password}
            />
            <Button 
                onClick={handleSubmit}
                type="primary"
                className="mt-4"
                block
                shape='round'
                size="large"
                disabled={!email||password.length<6}
                icon={<MailOutlined/>}
            >Login
            </Button>
        </form>
    )

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading? <h4 className="text-danger">Loading...</h4> : <h4>Login</h4> }
                    {loginForm()}
                    <Button 
                        onClick={googleSubmit}
                        type="secondary"
                        className="mt-2"
                        block
                        shape='round'
                        size="large"
                        icon={<GoogleOutlined/>}
                    >Login with Gmail
                    </Button>
                    <Link to="/forgot/password" className="mt-3 text-danger float-right">Forgot Password</Link>
                </div>
            </div>
            
        </div>
    )
}

export default Login
