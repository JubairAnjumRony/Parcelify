import React from 'react';
// import { useLocation } from 'react-router';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from "@tanstack/react-query";
import useAuth from './useAuth';
const useDeliveryMen = () => {
    // const location = useLocation();
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();

    const {data: isDeliveryMen,isPending: isDeliveryLoading} = useQuery({
        queryKey:[user?.email,"isDeliveryMen"],

        queryFn: async() =>{
            const res = await axiosSecure.get(`/users/deliveryMen/${user?.email}`);
            return res.data.deliveryMen;
        }
    });



    return [isDeliveryMen,isDeliveryLoading];
  
};

export default useDeliveryMen;