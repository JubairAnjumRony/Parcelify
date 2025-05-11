import React from 'react';
import useAuth from '../hooks/useAuth';
import { NavLink, Outlet } from 'react-router';
import { FaHome, FaShoppingCart, FaUsers, FaUtensils } from "react-icons/fa";

import { RxAvatar } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";
import { GoCodeReview } from "react-icons/go";

const Dashboard = () => {
    const{user} =useAuth();

    // get admin from database
    // const [isAdmin] = useAdmin();

    const isAdmin = false;
    const isDeliveryMen = false;
    console.log({user});
    return (
   
        <div className="flex">
        {/* dashboard side bar */}
        <div className="w-64 min-h-screen bg-blue-400 text-white ">
            <ul className="menu p-8 text-xl">
                {isAdmin ? (
                    <>
                        <li className='py-2'>
                            <NavLink to="/dashboard/statistics">
                                <FaHome></FaHome>
                                Statistics
                            </NavLink>
                        </li>
                        <li className='py-6'>
                            <NavLink to="/dashboard/allParcel">
                                <FaUsers></FaUsers>
                                All Parcel
                            </NavLink>
                        </li>
                        <li className='py-2'>
                            <NavLink to="/dashboard/allUser">
                                <FaUsers></FaUsers>
                                All Users
                            </NavLink>
                        </li>

                        <li className='py-2'>
                            <NavLink to="/dashboard/allDeliveryMen">
                            <FaUsers></FaUsers>
                                All DeliveryMen
                            </NavLink>
                        </li>
                    </>
                ) : isDeliveryMen ? (
                    <>
                        <li className='py-2'>
                            <NavLink to="/dashboard/myDelivery">
                            <TbTruckDelivery className="text-2xl"/>
                                My Delivery
                            </NavLink>
                        </li>
                        <li className='py-2'>
                            <NavLink to="/dashboard/myReviews">
                            <GoCodeReview className="text-2xl" />
                                My Reviews
                            </NavLink>
                        </li>
                    </>
                ) : user ? (
                    <>
                        <li className='py-2'>
                            <NavLink to="/dashboard/bookaParcel">
                                <FaUtensils className='mr-2'></FaUtensils>
                                Book A Parcel
                            </NavLink>
                        </li>
                        <li className='py-2'>
                            <NavLink to="/dashboard/myParcel">
                                <FaShoppingCart className='mr-2'></FaShoppingCart>
                                My Parcel
                            </NavLink>
                        </li>

                        <li className='py-2'>
                            <NavLink to="/dashboard/myProfile">
                            <RxAvatar className="text-2xl mr-2" />
                                My Profile
                            </NavLink>
                        </li>
                    </>
                ) : null}
                <div className="divider"></div>
                <li>
                    <NavLink to="/">
                        <FaHome className='mr-2'></FaHome>
                        Home
                    </NavLink>
                </li>
            </ul>
            
        </div>
        {/* dashboard content */}
        <div className="flex-1 p-8">
            <Outlet></Outlet>
        </div>
    </div>

    );
};

export default Dashboard;