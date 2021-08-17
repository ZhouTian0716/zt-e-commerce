import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';



function RegisterComplete( {history} ) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(()=>{
        setEmail(window.localStorage.getItem('emailForRegistration'))
  
    },[])


    const handleSubmit = async (e) => {
        e.preventDefault();
        // validation
        if(!email || !password) {
            toast.error('Email and password is required');
            return;
        }

        if(password.length < 6) {
            toast.error('Password should be longer than 6');
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            // console.log(result);
            // This is checking whether the secure email link had been clicked
            if (result.user.emailVerified) {
                window.localStorage.removeItem('emailForRegistration');
                let user = auth.currentUser;
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult();
                // redux store
                // redirect
                console.log(user);
                console.log(idTokenResult);
                toast.success('Password Set, Register Complete!');
                history.push('/')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
        
    };

    const completeRegisterForm = () => (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                className="form-control"
                value={email}
                disabled
            />
            <input
                onChange={(e) => {setPassword(e.target.value)}}
                type="password"
                placeholder="Password"
                className="form-control mt-3"
                value={password}
                autoFocus
            />
            <button type="submit" className="btn btn-raised mt-3">
                COMPLETE
            </button>
        </form>
    )

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Set your password</h4>
                    {completeRegisterForm()}
                </div>
            </div>
            
        </div>
    )
}

export default RegisterComplete
