import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import LoadingSpinner from '../Components/Shared/LoadingSpinner';

const PrivateRoute = ({children}) => {
    const {user,loading} = useAuth();
    const location = useLocation();

    if(loading)
        return <LoadingSpinner/>

    if(user){
        return children;
    }
    return (
        <Navigate to ="/login" state={location.pathname}></Navigate>    
    );
};

export default PrivateRoute;