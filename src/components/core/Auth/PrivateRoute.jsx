/* to restrict the access of unauthorized routes */
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const {token} = useSelector((state) => state.auth);
    
    // token present
    if(token !== null){
        return children;
    }
    else {
        return <Navigate to='/login'></Navigate>
    }
}

export default PrivateRoute
