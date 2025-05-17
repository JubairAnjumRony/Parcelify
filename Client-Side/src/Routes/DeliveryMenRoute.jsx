import React from 'react';
import useAuth from '../hooks/useAuth';
import useDeliveryMen from '../hooks/useDeliveryMen';
import { Navigate, useLocation } from 'react-router';
import LoadingSpinner from '../Components/Shared/LoadingSpinner';

const DeliveryMenRoute = ({children}) => {
    const {user,loading} = useAuth();
    const [isDeliveryMen,isDeliveryMenLoading] = useDeliveryMen();
    const location = useLocation();

    if(loading || isDeliveryMenLoading){
        return <LoadingSpinner/>
    }
    if(user && isDeliveryMen){
        return children;
    }
    return <Navigate to="/login" state={location.pathname}></Navigate>
};

export default DeliveryMenRoute;