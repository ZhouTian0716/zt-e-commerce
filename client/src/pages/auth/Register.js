import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';


function Register() {
    const [email, setEmail] = useState('');
    const history = useHistory();
    const { user } = useSelector( (state) => ({ ...state }));
    useEffect(() => {
        if( user && user.token ) {
            history.push('/');
        }
    },[user])


    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            url:process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp:true
        }

        await auth.sendSignInLinkToEmail(email, config);
        toast.success(`Email is sent to ${email}. Please check to complete your registration.`)
        window.localStorage.setItem('emailForRegistration', email);
        setEmail('');
    };

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <input
                onChange={(e) => {setEmail(e.target.value)}}
                type="email"
                className="form-control"
                value={email}
                autoFocus
            />
            <button type="submit" className="btn btn-raised mt-3">
                REGISTER
            </button>
        </form>
    )

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    
                    {registerForm()}
                </div>
            </div>
            
        </div>
    )
}

export default Register
