import React from 'react';
import useAdmin from '../hooks/useAdmin';
import useAuth from '../hooks/useAuth';
import { useLocation } from 'react-router';
import LoadingSpinner from '../Components/Shared/LoadingSpinner';

const AdminRoute = ({children}) => {
    const {user,loading} = useAuth();
    const [isAdmin,isAdminLoading] = useAdmin();
   const location = useLocation();
   if(loading || isAdminLoading) {
    return <LoadingSpinner/>
   }
   if(user && isAdmin){
    return children;
   }
   return <Navigate to ="/" state ={location.pathname}></Navigate>
};

export default AdminRoute;
