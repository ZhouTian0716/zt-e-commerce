import React, { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';

export default function LoadingToRedirect() {
    const [count, setCount] =useState(5);
    let history = useHistory();
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);
        }, 1000)
        count === 0 && history.push('/');
        return () => clearInterval(interval);
    },[count, history]);

    return (
        <div className="container p-5 text-center">Checking user role, redirecting to home in {count} seconds if not the right user.</div>
    )
}
