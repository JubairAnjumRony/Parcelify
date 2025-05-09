import { createBrowserRouter } from "react-router";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import MainLayout from "../Layouts/MainLayouts";
import Home from "../Pages/ErrorPage/Home/Home";
import Login from "../Pages/ErrorPage/login/Login";
import SignUp from "../Pages/ErrorPage/signUp/SingUp";


export const router = createBrowserRouter([
    { path: "/",
     element:<MainLayout/> ,
     errorElement:<ErrorPage/>,
     children:[
     {   path:'/',
        element:<Home/> ,},
        
     ],

   
        
        },

        {
            path:'/login',
            element:<Login/>,
        },
        {
            path:'/signUp',
            element:<SignUp/>,
        },
  ]);