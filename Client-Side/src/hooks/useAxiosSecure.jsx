import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router';
import useAuth from './useAuth';


const axiosSecure =axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true,
})

const useAxiosSecure = () => {
    const navigate= useNavigate();
    const {logOut} =useAuth();
    axiosSecure.interceptors.request.use(
        function(config){
            const token = localStorage.getItem("access-token");
            config.headers.authorization =`Bearer ${token}`
            return config;
        }
    )

    // interceptor 401 and 403 status 
    axiosSecure.interceptors.response.use(
        function(response){
            return response;
        },
        async(error)=>{
            const status = error.response.status;
            if(status ===401 || status === 403){
                await logOut();
                navigate("/login");
            }
            return Promise.reject(error);
        }
    )
    return axiosSecure;
   
};

export default useAxiosSecure;